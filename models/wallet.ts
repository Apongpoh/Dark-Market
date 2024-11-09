import { model, models, Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

const walletSchema = new Schema(
    {
        label: {
            type: String,
            require: true,
            trim: true,
            minLength: 3,
            maxLength: 10
        },

        user: {
            type: ObjectId,
            ref: 'User'
        },

        passphrase: {
            type: String,
            require: true,
            trim: true,
            minLength: 8
        },

        address: {
            type: String
        },

        pri: {
            type: Array,
        },

        salt: String

    },
    
    { timestamps: true }
);

export const Wallet: any = models.Wallet || model('Wallet', walletSchema);