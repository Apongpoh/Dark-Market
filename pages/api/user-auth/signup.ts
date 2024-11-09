import bcryptjs from 'bcryptjs'; // to hashed password
import { databaseSetup } from "../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "../../../models/user";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req;

    await databaseSetup();

    if (method === 'POST') {

        let { username, password, confirmPassword } = req.body;

        // validate user
        try {

            if (!username) {
                return res.json({ msg: 'Enter user name!' });
            }

            if (username.length < 3) {
                return res.json({ msg: 'User name is too short!' });
            }

            if (username.length > 20) {
                return res.json({ msg: 'User name is too long!' });
            }

            if (!password) {
                return res.json({ msg: 'Enter password!' });
            }

            if (password === username || !password.match(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~!@#$%&.:;?]).{8,}$'))) {
                return res.json({ msg: '*Please use 8-50 characters. The password cannot be the same as the username. *It has to contain atleast one letter (A-Z), one letter (a-z), one number (0-9) and one special character.!' });
            }

            if (!confirmPassword) {
                return res.json({ msg: 'Verify password!' });
            }

            if (password !== confirmPassword) {
                return res.json({ msg: 'Password for verification does not match!' });
            }

            const existingName = await User.findOne({ username });

            if (existingName) {
                return res.json({ msg: "User with name already exist.!" });
            }

        } catch (err) {
            return res.json({ msg: 'Fail to create an account!' });
        }

        // hashed password
        const salt = await bcryptjs.genSalt();

        const hashedPassword = await bcryptjs.hash(password, salt);

        const pP = { data: Buffer.from(''), ContentType: 'my profile photo' };
        const Cp = { data: Buffer.from(''), ContentType: 'my cover photo' };


        // create user
        let user = await new User({
            username,
            password: hashedPassword,
            profilePicture: pP,
            coverPhoto: Cp
        });

        await user.save()
            .then((user: any) => res.json(user))
            .catch(() => res.json({ msg: 'Fail to create an account!' }));
    }
}