import mongoose from "mongoose";


/**
 * Database set up function with mongoose
 */
export const databaseSetup = async () => {

    const uri: string = process.env.DATABASE;

    const MongooseOptions: object = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    mongoose.set('strictQuery', false);

    await mongoose.connect(uri, MongooseOptions)
        .then(() => console.log('Connected to database'))
        .catch(() => console.log('Conection to database failed'));

    const db = mongoose.connection;

    db.on('reconnected', () => console.log('Reconnected to database'));
    db.on('error', () => console.log('Error payload larger than 16MB'));
};