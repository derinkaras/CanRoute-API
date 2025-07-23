import mongoose from 'mongoose';

const canSchema = new mongoose.Schema({
    crewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Can must be assigned to a userID"]
    },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta: { type: Number, required: false, default: 0.1 },
        longitudeDelta: { type: Number, required: false, default: 0.1 },
    },
    label: {
        type: String,
        required: [true, "Can label is required"],
        trim: true,
        maxlength: 100
    },
    assignedDay: {
        type: String,
        required: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    qrCode: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const Can = mongoose.model('Can', canSchema);

export default Can;
