import multiparty from 'multiparty';
import { Reviews } from "../../../../../models/review";
import { databaseSetup } from "../../../../../lib/server/database";
import { requireSigninAndAuth } from "../../../../../lib/server/auth";

export default async function handler(req: any, res: any) {
    const { method, query } = req;
    const { productId, userId } = query;

    await databaseSetup();
    await requireSigninAndAuth(req, res, userId);

    if (method === 'POST') {

        const form = new multiparty.Form();

        form.parse(req, async function (err: any, fields: any, files: any) {

            try {
                let { rating, reviewText } = fields;

                rating = rating[0];
                reviewText = reviewText[0];

                if (err || rating > 5) {
                    return res.json({ msg: 'Rating is too long!' });
                }

                if (err || rating < 1) {
                    return res.json({ msg: 'Rating is too short!' });
                }

                if (err || reviewText.length > 500) {
                    return res.json({msg: 'Review text is too long!'});
                }

                fields = {
                    userId,
                    productId,
                    rating,
                    reviewText
                }

                const review: any = new Reviews(fields);

                await review.save()
                    .then((review: any) => res.json(review))
                    .catch(() => res.json({ msg: 'Fail to post a review!' }));

            } catch (err) {
                return res.json({ msg: 'Fail to post a review! All fields are required!' });
            }

        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};