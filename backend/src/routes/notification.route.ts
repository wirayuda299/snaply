import { Router } from 'express';
import notificationModel from '../models/notification.model';
import userModel from '../models/user.model';
import NotificationController from '../controllers/notification.controller';
import NotificationService from '../services/notification.service';

const router = Router();

const controller = new NotificationController(
	new NotificationService(notificationModel, userModel)
);

router.post('/create', (req, res) => controller.create(req, res));
router.post('/delete', (req, res) => controller.deleteNotification(req, res));
router.post('/mark-as-read', (req, res) => controller.markAllAsRead(req, res));
router.get('/all-notifications', (req, res) =>
	controller.getAllNotifications(req, res)
);
export default router;
