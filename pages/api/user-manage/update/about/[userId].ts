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

        let { about } = req.body;

        await User.findOne({ _id: userId })
            .then(async user => {

                if (about) {
                    if (about.length < 10) {
                        return res.json({ msg: 'About me too short!' });
                    } else if (about.length > 150) {
                        return res.json({ msg: 'About me too long!' });
                    } else {
                        user.about = about;
                    }
                }

                await user.save()
                    .then((newAbout: any) => {
                        newAbout.salt = undefined;
                        return res.json(newAbout);
                    })
                    .catch(() => res.json({ msg: "About me update failed!" }));

            })
            .catch(() => res.json({ msg: "User not found. Please create an account to continue!" }));
    }
}