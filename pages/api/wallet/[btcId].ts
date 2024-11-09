import axios, { AxiosResponse } from "axios";
import { databaseSetup } from "../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { Wallet } from "../../../models/wallet";
require('events').EventEmitter.prototype._maxListeners = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { btcId } = query;

    await databaseSetup();

    if (method === 'GET') {
        await Wallet.findById(btcId)
            .exec()
            .then(async (btc: any) => {
                const rawaddr = await axios.get(
                    // 'https://api.blockcypher.com/v1/btc/test3/addrs/' + btc.address // testnet
                    'https://api.blockcypher.com/v1/btc/main/addrs/' + btc.address  // mainet
                )
                    .then(res => res.data)
                    .catch(() => res.json({ msg: 'Limit reached' }));

                res.json(rawaddr);

            })
            .catch(() => res.json({ msg: "Wallet account not found" }));
    }
}