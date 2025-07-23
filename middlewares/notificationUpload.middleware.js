// middlewares/notificationUpload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/notifications';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const notificationUpload = multer({ storage });

export default notificationUpload;
