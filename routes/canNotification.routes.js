// routes/canNotification.routes.js
import express from 'express';
import { createCanNotification } from '../controllers/canNotification.controller.js';
import notificationUpload from '../middlewares/notificationUpload.middleware.js';

const canNotificationRouter = express.Router();

canNotificationRouter.post('/', notificationUpload.single('photo'), createCanNotification);

export default canNotificationRouter;
