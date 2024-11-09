import { databaseSetup } from "../../../lib/server/database";
import { Wallet } from "../../../models/wallet";

export default async function handler(req: any, res: any) {
    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {

        await Wallet.find()
            .exec()
            .then((wallets: any) => res.json(wallets))
            .catch(() => res.json({ msg: 'Wallet account not found' }));
    }
}