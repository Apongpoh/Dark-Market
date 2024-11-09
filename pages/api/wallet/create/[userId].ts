import multiparty from 'multiparty';
//import bcryptjs from 'bcryptjs';
import { networks, script, opcodes, payments, crypto } from 'bitcoinjs-lib';
import { Wallet } from "../../../../models/wallet";
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { requireSigninAndAuth } from "../../../../lib/server/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
    const ECPair: ECPairAPI = ECPairFactory(tinysecp);

    // const TESTNET = networks.testnet;
    const MAINNET = networks.bitcoin;

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {
            try {

                let { label, passphrase, confirmPassphrase } = fields;

                label = label[0];
                passphrase = passphrase[0];
                confirmPassphrase = confirmPassphrase[0];

                if (err || !label) {
                    return res.json({ msg: 'Enter label name!' });
                }

                if (err || label.length < 3) {
                    return res.json({ msg: 'Label name too short!' });
                }

                if (err || label.length > 15) {
                    return res.json({ msg: 'Label name too long!' });
                }

                if (err || !passphrase) {
                    return res.json({ msg: 'Enter passphrase!' });
                }

                if (err || passphrase === label || !passphrase.match(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~!@#$%&.:;?]).{8,}$'))) {
                    return res.json({ msg: '*Please use 8-50 characters. The passphrase cannot be the same as the label. *It has to contain atleast one letter (A-Z), one letter (a-z), one number (0-9) and one special character.!' });
                }

                if (err || !confirmPassphrase) {
                    return res.json({ msg: 'Verify passphrase!' });
                }

                if (err || passphrase !== confirmPassphrase) {
                    return res.json({ msg: 'Passphrase for verification does not match!' });
                }

                //const salt = await bcryptjs.genSalt();

                //const hashedPassphrase = await bcryptjs.hash(passphrase, salt);

                const keyPair = ECPair.makeRandom({ network: MAINNET });

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

                const utxoType = payments.p2wsh({ redeem: { output: locking_script, network: MAINNET }, network: MAINNET });
                const address = utxoType.address ?? '';

                fields = {
                    label,
                    //passphrase: hashedPassphrase,
                    passphrase,
                    address: address,
                    pri: keyPair.toWIF(),
                    user: userId
                }

                let newbtc: any = new Wallet(fields);

                await newbtc.save()
                    .then((wallet: any) => res.json(wallet))
                    .catch(() => res.json({ msg: 'Fail to create account wallet!' }));

            } catch (error) {
                return res.json({ msg: 'Fail to create wallet account. All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};