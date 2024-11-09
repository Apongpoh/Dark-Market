import { model, models, Schema, Types } from "mongoose";


const ObjectId = Types.ObjectId;

const productSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 19
        },

        description: {
            type: String,
            required: true,
            maxlength: 500
        },

        price: {
            type: Number,
            trim: true,
            required: true
        },

        category: {
            type: ObjectId,
            ref: 'Category'
        },

        user: {
            type: ObjectId,
            ref: 'User'
        },

        quantity: {
            type: Number
        },

        photo: {
            data: Buffer,
            ContentType: String
        },

        shipping: {
            required: false,
            type: Boolean
        },
        viewCount: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

export const Product: any = models.Product || model('Product', productSchema);