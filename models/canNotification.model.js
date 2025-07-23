import mongoose from 'mongoose';

const canNotificationSchema = new mongoose.Schema({
    canId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Can',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const canNotification = mongoose.model('CanNotification', canNotificationSchema);
export default canNotification;
