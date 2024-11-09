import axios, { AxiosResponse } from "axios";
import multiparty from 'multiparty';
import { validate } from 'bitcoin-address-validation';
import { databaseSetup } from "../../../../../../lib/server/database";
import { requireSigninAndAuth } from "../../../../../../lib/server/auth";
import { Wallet } from "../../../../../../models/wallet";
import { NextApiRequest, NextApiResponse } from 'next';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import { networks, payments, Psbt } from "bitcoinjs-lib";


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

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {

                var { sendToAddress, amount, buyerPassKey, mediatorPassKey } = fields;

                sendToAddress = sendToAddress[0];
                amount = amount[0];
                buyerPassKey = buyerPassKey[0];
                mediatorPassKey = mediatorPassKey[0];

                if (err || !sendToAddress || !validate(sendToAddress)) {
                    return res.json({ msg: 'Invalid bitcoin address!' });
                }

                if (err || Math.sign(amount) === -1) {
                    return res.json({ msg: 'Negative account balance not supported' });
                }

                if (err || buyerPassKey) {
                    var buyerPrivateKey = await Wallet.findById(btcId)
                        .then(wallet => {

                            if (!buyerPassKey || buyerPassKey !== wallet.pri[0]) {
                                return res.json({ msg: 'Invalid wallet account or buyer passkey!' });
                            }

                            return wallet.pri[0];
                        })
                        .catch(() => res.json({ msg: 'Wallet account not found!' }));
                }

                if (err || mediatorPassKey) {
                    var mediatorPrivateKey = await Wallet.findById(btcId)
                        .then(wallet => {

                            if (!mediatorPassKey || mediatorPassKey !== wallet.pri[1]) {
                                return res.json({ msg: 'Invalid wallet account or mediator passkey!' });
                            }

                            return wallet.pri[1];
                        })
                        .catch(() => res.json({ msg: 'Wallet account not found!' }));
                }


                const vendorPrivateKey = await Wallet.findById(btcId)
                    .then(wallet => wallet.pri[2])
                    .catch(() => res.json({ msg: 'Wallet account not found!' }));

                const keyPairBuyer = ECPair.fromWIF(buyerPrivateKey, MAINNET);
                const keyPairMediator = ECPair.fromWIF(mediatorPrivateKey, MAINNET);
                const keyPairVendor = ECPair.fromWIF(vendorPrivateKey, MAINNET);

                const pubkeys = [
                    keyPairBuyer.publicKey,
                    keyPairMediator.publicKey,
                    keyPairVendor.publicKey,
                ];

                pubkeys.map((hex: any) => Buffer.from(hex, 'hex'));

                const p2ms = payments.p2ms({ m: 2, pubkeys, network: MAINNET });

                const p2wsh = payments.p2wsh({ redeem: p2ms });

                const address = p2wsh.address;

                waitUntilUTXO(address)
                    .then(async data => {

                        const psbt = new Psbt({ network: MAINNET });

                        // calculate transaction fee
                        //const feeRate = 19; // where feeRate is satoshi / byte
                        //const fee = feeRate * (tx.virtualSize() + (2 * 1)) = 3439;

                        const fee = 179;

                        // convert amount to send to satoshi
                        const amountToSend = Number((amount * 100000000).toFixed(8));

                        // calculate change
                        const changeValue = data[0].value - amountToSend - fee;
                        
                        const dataValue = data.map(d => (Number(d.value / 100000000).toFixed(8)) + ' BTC');
                        
                        if (changeValue < 0 && dataValue.length > 1) {
                            return res.json({ msg: `Not enough available coins. you're missing ${Math.abs(changeValue / 100000000)}BTC from ${(data[0].value / 100000000).toFixed(8)}BTC. Your bitcoin address has received multiple deposits (or from change balance). That is ${dataValue}. Thus funds withdrawal is done independently. Transaction fee is ${(fee/100000000).toFixed(8)}.` })
                        }

                        if (changeValue < 0 && dataValue.length === 1) {
                            return res.json({ msg: `Not enough available coins. you're missing ${Math.abs(changeValue / 100000000)}BTC from ${(data[0].value / 100000000).toFixed(8)}BTC. Transaction fee is ${(fee/100000000).toFixed(8)}BTC.` })
                        }

                        psbt.addInput({
                            hash: data[0].txid,
                            index: data[0].vout,
                            witnessUtxo: {
                                script: p2wsh.output!,
                                value: data[0].value,
                            },
                            witnessScript: p2wsh.redeem.output
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

                        psbt.signInput(0, keyPairBuyer);
                        psbt.signInput(0, keyPairMediator);

                        psbt.finalizeAllInputs();

                        const tx = psbt.extractTransaction();
                        const txid = await broadcast(tx.toHex());

                        console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`);

                        return res.json({ msg: `Success! Transaction ID: ${txid}` });

                    })
                    .catch(() => {
                        res.json({ msg: 'Network error. Try again later' });
                    });

            } catch (error) {
                res.json({ msg: 'All fields are required!' })
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};