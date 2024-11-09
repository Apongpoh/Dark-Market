import { databaseSetup } from "../../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from "next";
import { requireSigninAndAuth } from "../../../../../lib/server/auth";
import { User } from "../../../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    if (method === 'PUT') {

        let { pgp } = req.body;

        await User.findOne({ _id: userId })
            .then(async (user: any) => {

                if (!pgp) {
                    return res.json({ msg: 'Invalid public pgp key!' });
                } else {
                    user.pgp = pgp;
                }

                await user.save()
                    .then((newPGP: any) => {
                        newPGP.salt = undefined;
                        return res.json(newPGP);
                    })
                    .catch(() => res.json({ msg: "Fail to add pgp public key!" }));

            })
            .catch(() => res.json({ msg: "User not found. Please create an account to continue.!" }));
    }
}