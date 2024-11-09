import _ from 'lodash';
import fs from 'fs';
import mime from 'mime-types';
import multiparty from 'multiparty';
import { databaseSetup } from '../../../../../lib/server/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../../../models/product';
import { requireSigninAndAuth, isVendor } from '../../../../../lib/server/auth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { productId, userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);
    await isVendor(req, res, userId);

    if (method === 'PUT') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {
            try {

                let { title, description, price, quantity } = fields;

                if (price && price[0] > 1000000) {
                    return res.json({ msg: 'Price limit reached' });
                }

                if (price && price[0] < 1) {
                    return res.json({ msg: 'Price is too low' });
                }

                if (quantity && quantity[0] > 1000000) {
                    return res.json({ msg: 'Quantity is limit reached' });
                }

                if (quantity && quantity[0] < 1) {
                    return res.json({ msg: 'Quantity is too low' });
                }

                if (title && title[0].length > 19) {
                    return res.json({ msg: 'Title is too long. Should be between 3-19 characters' });
                }

                if (title && title[0].length < 3) {
                    return res.json({ msg: 'Title is too short. Should be between 3-19 characters' });
                }

                if (description && description[0].length < 100) {
                    return res.json({ msg: 'Description is too short. Should be between 100-500 characters' });
                }

                if (description && description[0].length > 500) {
                    return res.json({ msg: 'Description is too long. Should be between 100-500 characters' });
                }

                if (title) {
                    fields.title = title.toString();
                }

                if (description) {
                    fields.description = description.toString();
                }

                if (price) {
                    fields.price = price.toString();
                }

                if (quantity) {
                    fields.quantity = quantity.toString();
                }

                fields.user = userId;

                let product: any = await Product.findById(productId)
                    .then((p: any) => p)
                    .catch(() => res.json({ msg: 'Listing not found!' }));

                product = _.extend(product, fields);

                if (files.photo) {
                    if (files.photo[0].size > 1000000) {
                        return res.json({ msg: 'Image should be less than 1mb in size!' });
                    }

                    product.photo.data = fs.readFileSync(files.photo[0].path);
                    product.photo.ContentType = mime.lookup(files.photo[0].path);
                }

                await Product.findByIdAndUpdate(productId, product)
                    .then((product: any) => res.json(product))
                    .catch(() => res.json({ msg: 'Fail to update Listing!' }));

            } catch (error) {
                return res.json({ msg: 'Fail to update Listing!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};