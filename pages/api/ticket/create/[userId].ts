import multiparty from 'multiparty';
import { Ticket } from "../../../../models/ticket";
import { databaseSetup } from "../../../../lib/server/database";
import { requireSigninAndAuth } from "../../../../lib/server/auth";


export default async function handler(req: any, res: any) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {

                let { subject, reason, message } = fields;

                subject = subject[0];
                reason = reason[0];
                message = message[0]

                if (err || !subject) {
                    return res.json({ msg: 'Subject is required!' });
                }

                if (err || subject.length > 50) {
                    return res.json({ msg: 'Subject is too long!' });
                }

                if (err || !reason) {
                    return res.json({ msg: 'Reason is required!' });
                }

                if (err || reason.length > 20) {
                    return res.json({ msg: 'Reason is too long!' });
                }

                if (err || !message) {
                    return res.json({ msg: 'Message is required!' });
                }

                if (err || message.length > 500) {
                    return res.json({msg: 'Message is too long!'});
                }

                fields = { subject, reason, message };
                fields.user = userId;

                let ticket: any = new Ticket(fields);

                await ticket.save()
                    .then(() => res.json({ msg: 'Greetings from DarkTerre Support Team! Your message is taken into consideration thanks!' }))
                    .catch(() => res.json({ msg: 'Fail to create ticket!' }));
                
            } catch (error) {
                return res.json({ msg: 'All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};