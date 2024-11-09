import { model, models, Schema } from "mongoose";

const categorySchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        }
    },
    { timestamps: true }
);

export const Category: any = models.Category || model('Category', categorySchema);