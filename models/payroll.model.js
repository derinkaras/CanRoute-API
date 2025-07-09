import mongoose from "mongoose";


const payrollSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    payrollNumber: {
        type: Number,
        required: [true, "Payroll number is required"],
        unique: [true, "Payroll number is unique"],
    }
})

const Payroll = mongoose.model("Payroll", payrollSchema)

export default Payroll;