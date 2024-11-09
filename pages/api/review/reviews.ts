import { Reviews } from "../../../models/review";
import { databaseSetup } from "../../../lib/server/database";


export default async function handler(req: any, res: any) {
    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {
        await Reviews.find()
            .exec()
            .then((review: any) => res.json(review))
            .catch(() => res.json({ msg: 'Reviews not found!' }));
    }
}