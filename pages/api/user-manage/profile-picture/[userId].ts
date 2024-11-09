import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query

    await databaseSetup();

    if (method === 'GET') {
        
        await User.findById(userId)
            .exec()
            .then((user: any) => res.end(user.profilePicture.data))
            .catch(() => res.json({ msg: "Fail to load profile image" }));
    }
}