import mongoose from "mongoose";

const serviceLogSchema = new mongoose.Schema({
    canId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Can',
        required: [true, "The can id is required to log servicing"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "The user id is required to log servicing"]
    },
    weekOf: {
        type: Date,
        required: [true, "The week of the service is required"]
    },
    status: {
        type: String,
        enum: ["pending", "serviced", "not_needed", "missed"],
        default: 'pending'
    },
    servicedAt: {
        type: Date,
        default: null
    },
    illegalDumping: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

serviceLogSchema.index({ canId: 1, weekOf: 1}, {unique: true});

const ServiceLog = mongoose.model("ServiceLog", serviceLogSchema);

export default ServiceLog;