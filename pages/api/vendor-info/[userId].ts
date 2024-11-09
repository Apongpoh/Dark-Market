import { databaseSetup } from '../../../lib/server/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();

    if (method === 'GET') {
        await User.findById(userId)
            .select('-profilePicture.data -coverPhoto -password -pgp -role -about')
            .exec()
            .then((user: any) => res.json(user))
            .catch(() => res.json({ msg: "Vendor not found" }));
    }
}