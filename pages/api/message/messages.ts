import { Message } from "../../../models/message";
import { databaseSetup } from "../../../lib/server/database";

export default async function handler(req: any, res: any) {
    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {
        await Message.find()
            .exec()
            .then((message: any) => res.json(message))
            .catch(() => res.json({ msg: 'Messagges not found!' }));
    }
}