import { databaseSetup } from "../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from "../../../models/product";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { productId } = query;

    await databaseSetup();

    if (method === 'GET') {
        await Product.findById(productId)
            .select('-photo')
            .exec()
            .then(async (product: any) => {
                ++product.viewCount;
                await product.save()
                    .then(() => res.json(product))
                    .catch(() => res.json({ msg: 'Listing not found' }));
            })
            .catch(() => res.json({ msg: "Listing not found" }));
    }
}