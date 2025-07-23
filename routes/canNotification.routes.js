import express from 'express';
import { createCanNotification } from '../controllers/canNotification.controller.js';

const canNotificationRouter = express.Router();

canNotificationRouter.post('/', createCanNotification);

export default canNotificationRouter;
