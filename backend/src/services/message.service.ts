import { Request, Response } from 'express';

import { chatModelType, messageModelType } from '../models/message.model';
import { createError } from '../utils/createError';

export default class MessageService {
	constructor(
		private messageModel: messageModelType,
		private chatModel: chatModelType
	) {}

	async createConversation(req: Request, res: Response) {
		try {
			const { members } = req.body;

			const conversation = new this.messageModel({ members });
			await conversation.save();
			res.status(201).end();
		} catch (error) {
			createError(error, res);
		}
	}

	async sendMessage(req: Request, res: Response) {
		try {
			const { id, message, senderId, receiverId, media, messageId } = req.body;

			const newChatMessage = new this.chatModel({
				content: message,
				senderId,
				receiverId,
				messageId,
				...(media && {
					media: {
						...(media.image && {
							image: media.image?.secure_url,
							imageAssetId: media?.image?.public_id,
						}),
					},
				}),
			});

			const savedChatMessage = await newChatMessage.save();

			await this.messageModel.findOneAndUpdate(
				{ _id: id },
				{ $push: { messages: savedChatMessage._id } },
				{ new: true }
			);

			res.status(201).end();
		} catch (error) {
			createError(error, res);
		}
	}

	async getAllConversation(req: Request, res: Response) {
		try {
			const conversations = await this.messageModel
				.find({
					members: { $in: [req.query.members] },
				})
				.populate('members', '_id, username profileImage')
				.populate('messages');

			return res.json({ data: conversations, error: false });
		} catch (error) {
			createError(error, res);
		}
	}

	async getChat(req: Request, res: Response) {
		try {
			const messages = await this.messageModel
				.find({
					_id: req.query.id,
				})
				.populate('members', '_id, username profileImage')
				.populate('messages');

			return res.json({ data: messages, error: false });
		} catch (error) {
			createError(error, res);
		}
	}

	async getUnreadChat(req: Request, res: Response) {
		try {
			const { receiverId } = req.query;

			const chats = await this.chatModel
				.find({
					is_read: false,
					receiverId,
				})
				.populate('senderId', '_id username profileImage');

			res.json({ data: chats, error: false }).end();
		} catch (error) {
			createError(error, res);
		}
	}

	async updateIsRead(req: Request, res: Response) {
		try {
			const { messageId, senderId } = req.body;

			const chats = await this.chatModel.find({
				messageId,
				senderId,
			});

			chats.forEach(async (chat) => {
				await this.chatModel.findByIdAndUpdate(chat._id, {
					is_read: true,
				});
			});

			res.status(201).end();
		} catch (error) {
			createError(error, res);
		}
	}
}
