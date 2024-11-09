import multiparty from 'multiparty';
import { networks, payments } from 'bitcoinjs-lib';
import { Wallet } from "../../../../../models/wallet";
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import { databaseSetup } from "../../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { requireSigninAndAuth } from "../../../../../lib/server/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    // const TESTNET = networks.testnet;
    const MAINNET = networks.bitcoin;

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {
            try {

                let { label } = fields;

                label = label[0];

                if (err || label.length < 3) {
                    return res.json({ msg: 'Label name is too short!' });
                }

                if (err || label.length > 10) {
                    return res.json({ msg: 'Label name is too long!' });
                }

                const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
                const ECPair: ECPairAPI = ECPairFactory(tinysecp);

                const keyPairBuyer = ECPair.makeRandom({ network: MAINNET });
                const keyPairMediator = ECPair.makeRandom({ network: MAINNET });
                const keyPairVendor = ECPair.makeRandom({ network: MAINNET });

                const pubkeys = [
                    keyPairBuyer.publicKey,
                    keyPairMediator.publicKey,
                    keyPairVendor.publicKey,
                ];

                pubkeys.map((hex: any) => Buffer.from(hex, 'hex'));

                const { address } = payments.p2wsh({
                    redeem: payments.p2ms({ m: 2, pubkeys, network: MAINNET })
                });

                fields = {
                    label,
                    address: address,
                    pri: [keyPairBuyer.toWIF(), keyPairMediator.toWIF(), keyPairVendor.toWIF()],
                    user: userId
                }

                let newbtc: any = new Wallet(fields);

                await newbtc.save()
                    .then((wallet: any) => res.json(wallet))
                    .catch(() => res.json({ msg: 'Fail to create account wallet!' }));

            } catch (error) {
                return res.json({ msg: 'Label is required' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};