import { databaseSetup } from "../../../lib/server/database";
import { Product } from "../../../models/product";

export default async function handler(req: any, res: any) {
    const { method } = req;

    await databaseSetup();

    if (method === 'GET') {
        // create query object to hold search value
        const query: any = {};
        // assign search value to query.name
        if (req.query.search) {
            query.title = { $regex: new RegExp(req.query.search), $options: 'i' };

            // find the product based on query object with 1 property search
            Product.find(query)
                .select('-photo')
                .then((products: any) => res.json(products))
                .catch(() => res.json({ msg: 'Listings not found' }));
        }
    }
}