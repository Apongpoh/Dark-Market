import { databaseSetup } from "../../../lib/server/database";
import { Product } from "../../../models/product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {
        
        await Product.distinct('category', {})
            .then((categories: any) => res.json(categories))
            .catch(() => res.json({ msg: 'Categories not found'}));
    }
}