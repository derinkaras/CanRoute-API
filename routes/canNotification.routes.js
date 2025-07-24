// routes/canNotification.routes.js
import express from 'express';
import { createCanNotification, getCrewIdsNotifications, deleteNotification } from '../controllers/canNotification.controller.js';
import notificationUpload from '../middlewares/notificationUpload.middleware.js';

const canNotificationRouter = express.Router();

canNotificationRouter.post('/', notificationUpload.single('photo'), createCanNotification);
canNotificationRouter.get('/:userId', getCrewIdsNotifications);
canNotificationRouter.delete('/:id', deleteNotification);

export default canNotificationRouter;
