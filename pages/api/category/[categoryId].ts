import { NextApiRequest, NextApiResponse } from "next";
import { Category } from "../../../models/category";
import { databaseSetup } from "../../../lib/server/database";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { categoryId } = query;

    await databaseSetup();

    if (method === 'GET') {

        await Category.findById(categoryId)
            .then((category: any) => res.json(category))
            .catch(() => res.json({ msg: 'Category not found!' }));
    }
}