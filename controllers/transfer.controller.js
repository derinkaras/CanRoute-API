import User from "../models/user.model.js";
import Transfer from "../models/transfer.model.js";
import mongoose from "mongoose";
import Can from "../models/can.model.js";


export const addTransfer = async (req, res, next) => {
    try {
        const {fromName, toName, fromId, toId, cans} = req.body
        const fromUserExists = await User.findById(fromId)
        const toUserExists = await User.findById(toId)
        if (!fromUserExists || !toUserExists) {
            return res.status(400).json({
                success: false,
                message: "From userId or toUser Id does not exist",
            })
        }
        const transferObj = await Transfer.create([{fromName, toName, fromId, toId, cans}])
        return res.status(201).json({
            success: true,
            data: transferObj
        })
    } catch (error) {
        console.error("The error happened in add transfer");
        next(error)
    }
}

export const getTransfer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "The id of the user is not valid",
            })
        }
        const transferRequests = await Transfer.find({toId: id})

        return res.status(200).json({
            success: true,
            data: transferRequests
        })

    } catch (error) {
        console.error("Error in the get transfer: ", error);
        next(error)
    }
}

export const deleteTransfer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "The id of the transfer is not valid",
            })
        }
        await Transfer.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })

    } catch (error) {
        console.error("The error happened in deleteTransfer");
        next(error)
    }
}

export const acceptTransfer = async (req, res, next) => {
    try {
        // Make sure the transfer exists
        const { id } = req.params;
        const transfer = await Transfer.findById(id)

        console.log("DEBUG1 This is the transfer sent: ", JSON.stringify(transfer, null, 2));
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `The id of the transfer is not valid: ${id}`,
            })
        }
        if (!transfer) {
            return res.status(400).json({
                success: false,
                message: "The transfer does not exist"
            })
        }
        for (const canId of Object.keys(transfer.cans)) {
            if (!mongoose.Types.ObjectId.isValid(canId)) {
                console.warn("Skipping invalid key in cans:", canId);
                continue;
            }
            console.log("DEBUG2 This is the can id before finding it and updating it: ", canId)
            const can = await Can.findByIdAndUpdate(canId, {
                crewId: transfer.toId
            }, {
                new: true,
                runValidators: true,
            })
            console.log("DEBUG3 This is the can after the update: ", JSON.stringify(can, null, 2));

        }
        await Transfer.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Successfully accepted the transfer"
        })

    } catch (error) {
        console.error("The error happened in acceptTransfer");
        //next(error)
        console.error(error)
        next(error)
    }

}