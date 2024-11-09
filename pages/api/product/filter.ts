import { databaseSetup } from "../../../lib/server/database";
import { Product } from "../../../models/product";

export default async function handler(req: any, res: any) {

    const { method } = req;

    await databaseSetup();

    if (method === 'POST') {

        /**
        * list products by search
        * we will implement product search in react frontend
        * we will show categories in checkbox and price range in radio buttons
        * as the user clicks on those checkbox and radio buttons
        * we will make api request and show the products to users based on what he wants
        */
        let order = req.body.order ? req.body.order : 'desc';
        let sortBy = req.body.sortBy ? req.body.sortBy : 'viewCount';
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs: any = {};

        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === 'price') {
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }

        
        await Product.find(findArgs)
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec()
            .then((data: any) => res.json({ size: data.length, data }))
            .catch(() => res.json({ msg: 'Listings not found' }));
        
        /* await Product.aggregate([ { $sample: { size: 22 } } ])
            .save(); */
    }
}