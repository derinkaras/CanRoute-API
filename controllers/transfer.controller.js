import User from "../models/user.model.js";
import Transfer from "../models/transfer.model.js";


export const addTransfer = async (req, res, next) => {
    try {
        const {from, to, cans} = req.body
        const fromUserExists = await User.findById(from)
        const toUserExists = await User.findById(to)
        if (!fromUserExists || !toUserExists) {
            return res.status(400).json({
                success: false,
                message: "From userId or toUser Id does not exist",
            })
        }
        const transferObj = await Transfer.create([{from, to, cans}])
        return res.status(201).json({
            success: true,
            data: transferObj
        })
    } catch (error) {
        console.error("The error happend in add transfer");
        next(error)
    }

}