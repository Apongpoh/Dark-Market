import bcryptjs from 'bcryptjs'; // to hashed password
import jwt from 'jsonwebtoken'; // To generate signed token
import { databaseSetup } from "../../../lib/server/database";
import { User } from "../../../models/user";
import { NextApiRequest, NextApiResponse } from 'next';
import svgCaptcha from 'svg-captcha';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req;

    await databaseSetup();

    if (method === 'POST') {

        const { username, password } = req.body;

        await User.findOne({ username })
            .then(async (user: any) => {
                // if user is found make sure the username and password match
                const isMatch = await bcryptjs.compare(password, user.password);

                if (!isMatch) {
                    return res.json({ msg: 'Invalid user or password!' });
                }

                // generate a signed token with user id and secret
                const jwtsecret: any = process.env.JWT_SECRET;
                const token = jwt.sign({ _id: user.id }, jwtsecret, { expiresIn: '30m' });

                // return response with user and token to frontend client
                const { _id, username, about, profilePicture, coverPhoto, role, pgp, btc, createdAt } = user;
                return res.json({ token, user: { _id, username, about, profilePicture, coverPhoto, role, pgp, btc, createdAt } });
            })
            .catch(() => res.json({ msg: 'User does not exist. Sign up!' }));
    }
}