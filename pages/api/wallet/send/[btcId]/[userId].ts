import axios, { AxiosResponse } from "axios";
//import bcryptjs from 'bcryptjs';
import varuint from "varuint-bitcoin";
import multiparty from 'multiparty';
import { databaseSetup } from "../../../../../lib/server/database";
import { requireSigninAndAuth } from "../../../../../lib/server/auth";
import { Wallet } from "../../../../../models/wallet";
import { User } from "../../../../../models/user";
import { NextApiRequest, NextApiResponse } from 'next';
import { validate } from 'bitcoin-address-validation';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import { networks, script, opcodes, payments, crypto, Psbt } from "bitcoinjs-lib";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { btcId, userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
    const ECPair: ECPairAPI = ECPairFactory(tinysecp);

    // const TESTNET = networks.testnet;
    const MAINNET = networks.bitcoin;

    const blockstream = new axios.Axios({
        // baseURL: `https://blockstream.info/testnet/api` // testnet
        baseURL: `https://blockstream.info/api`  // mainnet
    });

    const waitUntilUTXO = async (address: string) => {
        return new Promise<IUTXO[]>((resolve, reject) => {
            const checkForUtxo = async () => {
                try {
                    const response: AxiosResponse<string> = await blockstream.get(`/address/${address}/utxo`);
                    const data: IUTXO[] = response.data ? JSON.parse(response.data) : undefined;

                    if (data.length > 0) {
                        resolve(data);
                    }

                } catch (error) {
                    reject(error);
                }
            };
            checkForUtxo();
        });
    }

    const broadcast = async (txHex: string) => {
        const response: AxiosResponse<string> = await blockstream.post('/tx', txHex);
        return response.data;
    }

    interface IUTXO {
        txid: string;
        vout: number;
        status: {
            confirmed: boolean;
            block_height: number;
            block_hash: string;
            block_time: number;
        };
        value: number;
    }

    const witnessStackToScriptWitness = (witness: Buffer[]) => {
        let buffer = Buffer.allocUnsafe(0);

        function writeSlice(slice: Buffer) {
            buffer = Buffer.concat([buffer, Buffer.from(slice)]);
        }

        function writeVarInt(i: number) {
            const currentLen = buffer.length;
            const varintLen = varuint.encodingLength(i);

            buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
            varuint.encode(i, buffer, currentLen);
        }

        function writeVarSlice(slice: Buffer) {
            writeVarInt(slice.length);
            writeSlice(slice);
        }

        function writeVector(vector: Buffer[]) {
            writeVarInt(vector.length);
            vector.forEach(writeVarSlice);
        }

        writeVector(witness);

        return buffer;
    }

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {
                var { sendToAddress, amount, passphrase } = fields;

                sendToAddress = sendToAddress[0];
                amount = amount[0];
                passphrase = passphrase[0];

                if (err || !sendToAddress || !validate(sendToAddress)) {
                    return res.json({ msg: 'Invalid bitcoin address!' });
                }

                if (err || Math.sign(amount) === -1) {
                    return res.json({ msg: 'Negative account balance not supported!' });
                }

                if (err || passphrase) {
                    var privateKey = await Wallet.findById(btcId)
                        .then(async (wallet: any) => {
                            //const isMatch = await bcryptjs.compare(passphrase, wallet.passphrase);
                            const isMatch = passphrase === wallet.passphrase;

                            if (!isMatch) {
                                return res.json({ msg: 'Invalid wallet account or passphrase!' });
                            }

                            if (wallet.user.toString() !== userId) {
                                return res.json({ msg: 'Action not authorized!' });
                            }

                            return wallet.pri[0];
                        })
                        .catch(() => res.json({ msg: 'Wallet account not found!' }));
                }

                const keyPair = ECPair.fromWIF(privateKey, MAINNET);
                const preimage = Buffer.from(passphrase);
                const hash = crypto.hash160(preimage);
                const publicKey = keyPair.publicKey;
                const accountAddr = crypto.hash160(publicKey);

                // lock script
                const locking_script = script.compile([
                    opcodes.OP_HASH160,
                    hash,
                    opcodes.OP_EQUALVERIFY,
                    opcodes.OP_DUP,
                    opcodes.OP_HASH160,
                    accountAddr,
                    opcodes.OP_EQUALVERIFY,
                    opcodes.OP_CHECKSIG,
                ]);

                // get address
                const p2wsh = payments.p2wsh({ redeem: { output: locking_script, network: MAINNET }, network: MAINNET });
                const address = p2wsh.address ?? '';

                waitUntilUTXO(address)
                    .then(async data => {

                        const psbt = new Psbt({ network: MAINNET });

                        // calculate transaction fee
                        //const feeRate = 19; // where feeRate is satoshi / byte
                        //const fee = feeRate * (tx.virtualSize() + (1 * 1)) = 3249;

                        const fee = 12000; // tx.virtualSize() after 5 blocks

                        // convert amount to send to satoshi
                        const amountToSend = Number((amount * 100000000).toFixed(8));

                        // calculate change
                        const changeValue = data[0].value - amountToSend - fee;

                        const dataValue = data.map(d => (Number(d.value / 100000000).toFixed(8)) + ' BTC');

                        if (changeValue < 0 && dataValue.length > 1) {
                            return res.json({ msg: `Not enough available coins. you're missing ${Math.abs(changeValue / 100000000)}BTC from ${(data[0].value / 100000000).toFixed(8)}BTC. Your bitcoin address has received multiple deposits (or from change balance). That is ${dataValue}. Thus funds withdrawal is done independently. Transaction fee is ${(fee / 100000000).toFixed(8)}BTC.` })
                        }

                        if (changeValue < 0 && dataValue.length === 1) {
                            return res.json({ msg: `Not enough available coins. you're missing ${Math.abs(changeValue / 100000000)}BTC from ${(data[0].value / 100000000).toFixed(8)}BTC. Transaction fee is ${(fee / 100000000).toFixed(8)}BTC.` })
                        }

                        psbt.addInput({
                            hash: data[0].txid,
                            index: data[0].vout,
                            witnessUtxo: {
                                script: p2wsh.output!,
                                value: data[0].value
                            },
                            witnessScript: locking_script
                        });

                        psbt.addOutput({
                            address: sendToAddress,
                            value: amountToSend
                        });

                        // send change back to address
                        psbt.addOutput({
                            address: address,
                            value: changeValue
                        });

                        psbt.signInput(0, keyPair);

                        const finalizeInput = (_inputIndex: number, input: any) => {
                            const redeemPayment = payments.p2wsh({
                                redeem: {
                                    input: script.compile([
                                        input.partialSig[0].signature,
                                        publicKey,
                                        preimage
                                    ]),
                                    output: input.witnessScript
                                }
                            });

                            const finalScriptWitness = witnessStackToScriptWitness(
                                redeemPayment.witness ?? []
                            );

                            return {
                                finalScriptSig: Buffer.from(""),
                                finalScriptWitness
                            }
                        };

                        psbt.finalizeInput(0, finalizeInput);

                        // terre market username:terrema, btc addresss: bc1qs3ss3sk4we64ap5cqlvvqn87ureyu0lpyaekx2
                        if (sendToAddress === 'bc1qs3ss3sk4we64ap5cqlvvqn87ureyu0lpyaekx2') {

                            if (amountToSend < Number((0.0073 * 100000000).toFixed(8))) {
                                return res.json({ msg: 'Vendor bond fee not met! not enough funds in your wallet account. This may also be due to network fee.' });
                            }

                            const tx = psbt.extractTransaction();

                            await broadcast(tx.toHex());

                            console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`);

                            await User.findByIdAndUpdate({ _id: userId })
                                .then(async (user: any) => {

                                    user.role = 1;

                                    await user.save()
                                        .then((nowVendor: any) => {
                                            nowVendor.salt = undefined;
                                            return res.json({ msg: 'Success! now a vendor. Sign in for the changes to apply.' });
                                        })
                                        .catch(() => res.json({ msg: "Fail to become a vendor" }));
                                })
                                .catch(() => res.json({ msg: 'User not found. Please create an account to continue!' }));

                        }

                        const tx = psbt.extractTransaction();

                        const txid = await broadcast(tx.toHex());

                        return res.json({ msg: `Success! Transaction ID: ${txid}` });

                    })
                    .catch(() => res.json({ msg: 'Network error. Try again later' }));

            } catch (msg) {
                return res.json({ msg: 'All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};