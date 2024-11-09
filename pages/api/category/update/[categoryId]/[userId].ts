import { Category } from "../../../../../models/category";
import { databaseSetup } from "../../../../../lib/server/database";
import { requireSigninAndAuth, isAdmin } from "../../../../../lib/server/auth";


export default async function handler(req: any, res: any) {

    const { method, query } = req;

    const { categoryId, userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);
    await isAdmin(req, res, userId);

    if (method === 'PUT') {
        let category: any = await Category.findById(categoryId)
            .then((category: any) => category)
            .catch(() => res.json({ msg: 'Category not found!' }));

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

        category.title;

        await Category.findByIdAndUpdate(categoryId, category)
            .then(() => res.json({ msg: 'Category updated!' }))
            .catch(() => res.json({ msg: 'Fail to update category!' }));
    }
}