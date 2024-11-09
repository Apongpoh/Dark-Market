import bcryptjs from 'bcryptjs'; // to hashed password
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

        let { oldPassword, newPassword, confirmNewPassword } = req.body;

        await User.findOne({ _id: userId })
            .then(async (user: any) => {

                if (!oldPassword) {
                    return res.json({ msg: 'Enter current password!' });
                }

                const isMatch = await bcryptjs.compare(oldPassword, user.password);

                if (!isMatch) {
                    return res.json({ msg: 'Invalid current password!' });
                }

                if (!newPassword) {
                    return res.json({ msg: 'Enter new password!' });
                }

                if (newPassword === user.username || !newPassword.match(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~!@#$%&.:;?]).{8,}$'))) {
                    return res.json({ msg: '*Please use 8-50 characters. The password cannot be the same as the username. *It has to contain atleast one letter (A-Z), one letter (a-z), one number (0-9) and one special character.!' });
                }

                if (!confirmNewPassword) {
                    return res.json({ msg: 'Verify password!' });
                }

                if (newPassword !== confirmNewPassword) {
                    return res.json({ msg: 'Password for verification does not match!' });
                }

                const salt = await bcryptjs.genSalt();

                let hashedNewPassword = await bcryptjs.hash(newPassword, salt);
                newPassword = hashedNewPassword;
                user.password = newPassword;

                await user.save()
                    .then((newPassword: any) => {
                        newPassword.salt = undefined;
                        return res.json(newPassword);
                    })
                    .catch(() => res.json({ msg: "Fail to change password!" }));
            })
            .catch(() => res.json({ msg: "User not found. Please create an account to continue.!" }));
    }
}