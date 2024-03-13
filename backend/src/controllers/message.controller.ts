import { Request, Response } from 'express';

import MessageService from '../services/message.service';

export default class MessageController {
	constructor(private messageService: MessageService) {}

	create(req: Request, res: Response) {
		const { members } = req.body;
		if (members.length < 2) {
			return res.status(400).json({ message: 'Member is less than 2' });
		}
		return this.messageService.createConversation(req, res);
	}

	send(req: Request, res: Response) {
		const { id, message, senderId, receiverId, messageId } = req.body;

		if (!id || !message || !senderId || !receiverId || !messageId) {
			return res
				.status(400)
				.json({ message: 'Please provide all required value' });
		}

		return this.messageService.sendMessage(req, res);
	}

	allConverstation(req: Request, res: Response) {
		return this.messageService.getAllConversation(req, res);
	}

	chat(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'Id is required', error: true });
		}

		return this.messageService.getChat(req, res);
	}

	unReadChat(req: Request, res: Response) {
		const { receiverId } = req.query;
		if (!receiverId) {
			return res
				.status(400)
				.json({ message: 'ReceiverId is required', error: true });
		}
		return this.messageService.getUnreadChat(req, res);
	}

	updateIsRead(req: Request, res: Response) {
		const { messageId, senderId } = req.body;
		if (!messageId || !senderId) {
			return res
				.status(400)
				.json({
					message: 'Sender ID and Message ID are required',
					error: true,
				});
		}
		return this.messageService.updateIsRead(req, res);
	}
}
