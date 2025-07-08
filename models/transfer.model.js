import mongoose, {Mongoose} from "mongoose";


const transferSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The id of the user sending the can transfer is required"]
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The id of the user receiving the can transfer is required"]
    },
    cans: {
        type: Map,
        of: Mongoose.Schema.Types.Mixed,
        required: [true, "Must provide cans to be transferred"]
    }
})

const Transfer = mongoose.model("Transfer", transferSchema)

export default Transfer