import { model, models, Schema, Types } from "mongoose";


const ObjectId = Types.ObjectId;

const ticketSchema = new Schema(
    {
        subject: {
            type: String,
            trim: true,
            required: true,
            maxlength: 50
        },

        reason: {
            type: String,
            trim: true,
            required: true,
            maxlength: 20,
        },

        message: {
            type: String,
            trim: true,
            required: true,
            maxlength: 500
        },

        user: {
            type: ObjectId,
            ref: 'User'
        },

    },
    { timestamps: true }
);

export const Ticket: any = models.Ticket || model('Ticket', ticketSchema);