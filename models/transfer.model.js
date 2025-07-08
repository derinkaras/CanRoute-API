import mongoose from "mongoose";


const transferSchema = new mongoose.Schema({
    fromName: {
        type: String,
        required: [true, "Name of the person sending is required"],
    },
    toName: {
        type: String,
        required: [true, "Name of the person sending is required"],
    },
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The id of the user sending the can transfer is required"]
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The id of the user receiving the can transfer is required"]
    },
    cans: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: [true, "Must provide cans to be transferred"]
    }
}, {timestamps: true});

const Transfer = mongoose.model("Transfer", transferSchema)

export default Transfer