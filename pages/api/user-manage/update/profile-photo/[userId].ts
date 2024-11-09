import _ from 'lodash';
import fs from 'fs';
import mime from 'mime-types';
import multiparty from 'multiparty';
import { databaseSetup } from "../../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { requireSigninAndAuth } from "../../../../../lib/server/auth";
import { User } from "../../../../../models/user";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    if (method === 'PUT') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {
                
                if (err) {
                    return res.json({ msg: 'Upload an image!' });
                }

                let user: any = await User.findById(userId)
                    .then((u: any) => u)
                    .catch(() => res.json({ msg: 'User not found!' }));

                user = _.extend(user, fields);

                /* if (!files.profilePicture) {
                    return res.json({ msg: 'Upload an image' });
                } */
                
                if (files.profilePicture) {

                    if (files.profilePicture[0].size > 1000000) {
                        return res.json({ msg: 'Image should be less than 1mb in size!' });
                    }

                    user.profilePicture.data = fs.readFileSync(files.profilePicture[0].path);
                    user.profilePicture.ContentType = mime.lookup(files.profilePicture[0].path);
                }

                await User.findByIdAndUpdate(userId, user)
                    .then(() => res.json({ msg: 'Profile image updated!' }))
                    .catch(() => res.json({ msg: 'Fail to update image!' }));

            } catch (error) {
                res.json({ msg: "User not found. Please create an account to continue.!" });
            }
        });
    }
}

export const config = {
    api: { bodyParser: false },
};