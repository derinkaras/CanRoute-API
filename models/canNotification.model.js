import mongoose from 'mongoose';

const canNotificationSchema = new mongoose.Schema({
    canId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Can',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    photoUrl: {
        type: String, // Or Buffer if you prefer
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const canNotification = mongoose.model('CanNotification', canNotificationSchema);
export default canNotification;
