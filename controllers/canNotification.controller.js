import canNotification from '../models/canNotification.model.js';
import mongoose from 'mongoose';

export const createCanNotification = async (req, res, next) => {
    try {
        const { canId, message } = req.body;
        const photo = req.file; // comes from multer middleware

        if (!mongoose.Types.ObjectId.isValid(canId)) {
            return res.status(400).json({ success: false, message: "Invalid canId" });
        }

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }

        const photoUrl = photo ? `/uploads/${photo.filename}` : null;

        const newNotification = await canNotification.create({
            canId,
            message,
            photoUrl
        });

        return res.status(201).json({ success: true, data: newNotification });
    } catch (err) {
        next(err);
    }
};
