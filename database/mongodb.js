import {DB_URI} from "../config/env.js";
import mongoose from 'mongoose';

if(!DB_URI) {
    throw new Error("Missing DB_URI");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Error connecting to Database: ", error);
        process.exit(1)
    }
}

export default connectToDatabase;
