import { model, Schema, models, Types, AnyArray, AnyObject } from "mongoose";


const ObjectId = Types.ObjectId;

const messageSchema = new Schema(
    {
        senderId: {
            type: ObjectId,
            ref: 'User'
        },

        receiverId: {
            type: ObjectId,
            ref: 'User'
        },

        subject: {
            type: String,
            required: true,
            maxlength: 50
        },

        text: {
            type: String,
            trim: true,
            required: true,
            maxlength: 10000
        },
    },
    { timestamps: true }
);

export const Message: any = models.Message || model('Message', messageSchema);