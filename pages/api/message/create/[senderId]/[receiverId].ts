import multiparty from 'multiparty';
import { Message } from "../../../../../models/message";
import { databaseSetup } from "../../../../../lib/server/database";
import { requireSigninAndAuth } from "../../../../../lib/server/auth";


export default async function handler(req: any, res: any) {
    const { method, query } = req;
    const { senderId, receiverId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, senderId);

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {
                let { subject, text } = fields;

                subject = subject[0];
                text = text[0];

                if (err || !subject) {
                    return res.json({ msg: 'Subject is required!' });
                }

                if (err || subject.length > 50) {
                    return res.json({ msg: 'Subject is too long!' });
                }

                if (err || !text) {
                    return res.json({ msg: 'Message is required!' });
                }

                if (err || text.length > 5000) {
                    return res.json({msg: 'Message is too long!'});
                }

                if (err || senderId === receiverId) {
                    return res.json({msg: "Not allowed, can't send message to yourself!"});
                }

                fields = { senderId, receiverId, subject, text }

                const message: any = new Message(fields);

                await message.save()
                    .then((message: any) => res.json(message))
                    .catch(() => res.json({ msg: 'Fail to send message!' }));

            } catch (err) {
                console.log(err)
                return res.json({ msg: 'Fail to send message. All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};