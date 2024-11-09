import { databaseSetup } from "../../../lib/server/database";
import { Product } from "../../../models/product";

export default async function handler(req: any, res: any) {
    const { method, query } = req;

    await databaseSetup();

    if (method === 'GET') {

        /**
        * sell / arrival
        * by sell = /products?sortBy=sold&order=desc&limit=4
        * by arrival = /products?sortBy=createdAt&order=desc&limit=4
        * if no params are sent, then all products are returned
        */

        let order = query.order ? req.query.order : 'asc';
        let sortBy = query.sortBy ? req.query.sortBy : '_id';
        let limit = query.limit ? parseInt(req.query.limit) : 20;

        await Product.find()
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec()
            .then((products: any) => res.json(products))
            .catch(() => res.json({ msg: 'Listings not found' }));
    }
}