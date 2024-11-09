import { Category } from "../../../../models/category";
import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from "next";
import { requireSigninAndAuth, isAdmin } from "../../../../lib/server/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;

    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);
    await isAdmin(req, res, userId);

    if (method === 'POST') {

        let { title } = req.body;

        try {

            if (!title) {
                return res.json({ msg: 'Enter category name!' });
            }

            const existingCategory = await Category.findOne({ title: title });

            if (existingCategory) {
                return res.json({ msg: "Category already exist!" });
            }

        } catch (err) {
            return res.json({ msg: 'Enter required fields!' });
        }

        let category = await new Category({ title });

        await category.save()
            .then((category: any) => res.json(category))
            .catch(() => res.json({ msg: 'Fail to create category!' }));
    }
}