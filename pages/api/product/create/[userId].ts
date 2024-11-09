import fs from 'fs';
import mime from 'mime-types';
import multiparty from 'multiparty';
import { databaseSetup } from "../../../../lib/server/database";
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from "../../../../models/product";
import { requireSigninAndAuth, isVendor } from "../../../../lib/server/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, query } = req;
    const { userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);
    await isVendor(req, res, userId);

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {
            try {

                let { title, description, price, category, quantity, shipping } = fields;

                title = title[0];
                price = price[0];
                quantity = quantity[0];
                category = category[0];
                shipping = shipping[0];
                description = description[0];

                if (err || price > 1000000) {
                    return res.json({ msg: 'Price limit reached!' });
                }

                if (err || price < 1) {
                    return res.json({ msg: 'Price is too low!' });
                }

                if (err || quantity > 1000000) {
                    return res.json({ msg: 'Quantity limit reached!' });
                }

                if (err || quantity < 1) {
                    return res.json({ msg: 'Quantity is too low!' });
                }

                if (err || title.length > 19) {
                    return res.json({ msg: 'Title is too long. Should be between 3-19 characters!' });
                }

                if (err || title.length < 3) {
                    return res.json({ msg: 'Title is too short. Should be between 3-19 characters!' });
                }

                if (err || description.length < 100) {
                    return res.json({ msg: 'Description is too short. Should be between 100-500 characters!' });
                }

                if (err || description.length > 500) {
                    return res.json({ msg: 'Description is too long. Should be between 100-500 characters!' });
                }

                if (err || !shipping) {
                    return res.json({ msg: 'Select shipping!' });
                }

                if (err || !category) {
                    return res.json({ msg: 'Select category!' });
                }

                fields = { title, description, price, category, quantity, shipping };
                fields.user = userId;

                let product: any = new Product(fields);

                if (!files.photo) {
                    return res.json({ msg: 'Upload an image!' });
                }

                if (files.photo) {
                    if (files.photo[0].size > 1000000) {
                        return res.json({ msg: 'Image should be less than 1mb in size!' });
                    }

                    product.photo.data = fs.readFileSync(files.photo[0].path);
                    product.photo.ContentType = mime.lookup(files.photo[0].path);
                }

                await product.save()
                    .then((product: any) => res.json(product))
                    .catch(() => res.json({ msg: 'Fail to add listing' }));

            } catch (error) {
                return res.json({ msg: 'All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};