import { model, Schema, models, Types } from "mongoose";


const ObjectId = Types.ObjectId;

const reviewsSchema = new Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User'
        },

        productId: {
            type: ObjectId,
            ref: 'Product'
        },

        rating: {
            type: Number,
            minlength: 0,
            maxlength: 5,
            default: 0
        },

        reviewText: {
            type: String,
            maxlength: 500
        },
    },
    { timestamps: true }
);

export const Reviews: any = models.Reviews || model('Reviews', reviewsSchema);