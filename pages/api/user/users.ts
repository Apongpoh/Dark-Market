import { databaseSetup } from '../../../lib/server/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {
        await User.find()
            .select('-profilePicture.data -coverPhoto.data -password')
            .exec()
            .then((user: any) => res.json(user))
            .catch(() => res.json({ msg: "User not found!" }));
    }
}