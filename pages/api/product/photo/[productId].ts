import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from "../../../../models/product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { productId } = query;

    await databaseSetup();

    if (method === 'GET') {
        
        await Product.findById(productId)
            .select('photo')
            .exec()
            .then((product: any) => res.end(product.photo.data))
            .catch(() => res.json({ msg: "Fail to load image" }));
    }
}