import bcryptjs from 'bcryptjs';
import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "../../../../models/user";
import { requireSigninAndAuth } from "../../../../lib/server/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    if (method === 'DELETE') {

        await User.findByIdAndDelete({ _id: userId })
            .then(() => res.json({ msg: 'Account has been deleted. We are sorry you are leaving us. Hope to see you next time!' }))
            .catch(() => res.json({ msg: 'Fail to delete account!' }));
    }
}