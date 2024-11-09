import { databaseSetup } from "../../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from "../../../../../models/product";
import { requireSigninAndAuth, isVendor } from "../../../../../lib/server/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { productId, userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);
    await isVendor(req, res, userId);

    if (method === 'DELETE') {
        
        await Product.findByIdAndDelete(productId)
            .then(() => res.json({ msg: 'Listing deleted' }))
            .catch(() => res.json({ msg: 'Fail to delete listing' }));
    }
}