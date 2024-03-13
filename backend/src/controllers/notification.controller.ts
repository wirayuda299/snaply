import NotificationService from '../services/notification.service';
import { Request, Response } from 'express';

export default class NotificationController {
	constructor(private notificationService: NotificationService) {}

	create(req: Request, res: Response) {
		return this.notificationService.createNotification(req, res);
	}

	deleteNotification(req: Request, res: Response) {
		const { type, postId, userId } = req.body;
		if (!type || !postId || !userId) {
			return res
				.status(400)
				.json({ message: 'Type, Post ID and User ID are required' });
		}
		return this.notificationService.deleteNotification(req, res);
	}

	getAllNotifications(req: Request, res: Response) {
		return this.notificationService.getAllNotification(req, res);
	}
}
