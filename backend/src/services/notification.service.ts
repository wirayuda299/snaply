import { Request, Response } from 'express';

import { userModelType } from '../models/user.model';
import { notificationModelType } from '../models/notification.model';
import { createError } from '../utils/createError';
import { RedisService } from './redis.service';

export default class NotificationService {
	constructor(
		private notificationModel: notificationModelType,
		private userModel: userModelType
	) {}

	async createNotification(req: Request, res: Response) {
		const { to, from, message, type, postId, model, comments } = req.body;

		try {
			const user = await this.userModel.findById(to);
			if (!user) {
				return res.status(404).json({ message: 'User not found', error: true });
			}

			await this.notificationModel.create({
				to,
				from,
				notificationType: type,
				message,
				postId,
				modelPath: model,
				comments,
			});

			return res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'create-notification');
		}
	}

	async deleteNotification(req: Request, res: Response) {
		const { type, postId, userId } = req.body;
		try {
			const user = await this.userModel.findById(userId);
			if (!user) {
				return res.status(404).json({ message: 'User not found' }).end();
			}

			const notification = await this.notificationModel.find({
				notificationType: type,
				postId,
			});
			if (!notification) {
				return res
					.status(404)
					.json({ message: 'Notification not found' })
					.end();
			}

			await this.notificationModel.deleteOne({
				from: userId,
				notificationType: type,
			});
			return res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'delete-notification');
		}
	}

	async getAllNotification(req: Request, res: Response) {
		try {
			const { userId } = req.query;

			const allNotif = await new RedisService().getOrCacheData(
				'notifications',
				async () => {
					return await this.notificationModel
						.find({ to: userId })
						.populate('from', '_id username profileImage')
						.populate({
							path: 'postId',
						});
				}
			);
			return res.status(200).json({ data: allNotif, error: false });
		} catch (error) {
			createError(error, req, res, 'get-all-notification');
		}
	}
}
