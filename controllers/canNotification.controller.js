import canNotification from '../models/canNotification.model.js';
import mongoose from 'mongoose';
import Can from '../models/can.model.js'; // Adjust path if needed

export const createCanNotification = async (req, res, next) => {
    try {
        const { canId, message } = req.body;
        const photo = req.file; // Comes from multer middleware

        if (!mongoose.Types.ObjectId.isValid(canId)) {
            return res.status(400).json({ success: false, message: "Invalid canId" });
        }

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }

        // Fetch the can to get the crewId (userId)
        const can = await Can.findById(canId);
        if (!can) {
            return res.status(404).json({ success: false, message: "Can not found" });
        }

        const userId = can.crewId; // Assuming your Can model uses `crewId` to reference users
        const photoUrl = photo ? `/uploads/${photo.filename}` : null;

        const newNotification = await canNotification.create({
            canId,
            userId,
            message,
            photoUrl
        });

        return res.status(201).json({ success: true, data: newNotification });
    } catch (err) {
        next(err);
    }
};

export const getCrewIdsNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid crewId" });
        }

        const notifications = await canNotification.find({
            userId
        });

        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error("Error happened in getCrewIdsNotifications", error);
        next(error);
    }
};
