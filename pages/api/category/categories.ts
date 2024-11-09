import { Category } from "../../../models/category";
import { databaseSetup } from "../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {

        await Category.find()
            .then((category: any) => res.json(category))
            .catch(() => res.json({ msg: 'Categories not found!' }));
    }
}