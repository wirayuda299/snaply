import { Request, Response } from 'express';

import MessageService from '../services/message.service';

export default class MessageController {
	constructor(private messageService: MessageService) {}

	create(req: Request, res: Response) {
		return this.messageService.createConversation(req, res);
	}

	send(req: Request, res: Response) {
		return this.messageService.sendMessage(req, res);
	}

	allConverstation(req: Request, res: Response) {
		return this.messageService.getAllConversation(req, res);
	}

	chat(req: Request, res: Response) {
		return this.messageService.getChat(req, res);
	}

	unReadChat(req: Request, res: Response) {
		return this.messageService.getUnreadChat(req, res);
	}

	updateIsRead(req: Request, res: Response) {
		return this.messageService.updateIsRead(req, res);
	}
}
