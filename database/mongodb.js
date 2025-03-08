import mongoose from "mongoose";
import { DATABASE_URI, NODE_ENV } from "../config/env.js";

if(!DATABASE_URI) {
    throw new Error("DATABASE_URI is not provided!");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URI);

        console.log(`Database connected: ${NODE_ENV} Mode`);
    } catch (error) {
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
}

export default connectToDatabase;