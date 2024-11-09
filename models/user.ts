import { model, Schema, models } from "mongoose";


const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            trim: true,
            minLength: 3,
            maxLength: 20
        },

        profilePicture: {
            data: Buffer,
            ContentType: String
        },

        coverPhoto: {
            data: Buffer,
            ContentType: String
        },

        password: {
            type: String,
            require: true,
            trim: true,
            minLength: 8
        },

        about: {
            type: String,
            trim: true,
            maxLength: 140,
            default: 'Contact me through in-app message'
        },

        pgp: {
            type: String,
            trim: true,
            default: 'No Public PGP key yet'
        },

        role: {
            type: Number,
            default: 0
        },

        salt: String

    },

    { timestamps: true }
);

export const User: any = models.User || model('User', userSchema);