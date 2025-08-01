import multer from 'multer';

const storage = multer.memoryStorage(); // Stores file in memory buffer
const upload = multer({ storage });

export default upload;
