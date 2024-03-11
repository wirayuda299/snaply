import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
	{
		content: String,
		media: {
			image: {
				type: String,
				required: false,
			},
			imageAssetId: {
				type: String,
				required: false,
			},
			audio: {
				type: String,
				required: false,
			},
			audioAssetId: {
				type: String,
				required: false,
			},
			video: {
				type: String,
				required: false,
			},
			videoAssetId: {
				type: String,
				required: false,
			},
		},
		is_read: {
			type: Boolean,
			default: false,
		},
		senderId: {
			type: String,
			ref: 'User',
		},
		receiverId: {
			type: String,
			ref: 'User',
		},
		messageId: {
			type: String,
			ref: 'message',
		},
	},
	{
		timestamps: true,
	}
);

export const chatModel = model('Chat', chatSchema);

const messagesSchema = new Schema(
	{
		members: [
			{
				type: String,
				ref: 'User',
			},
		],
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Chat',
			},
		],
	},
	{
		timestamps: true,
	}
);

const messageModel = model('Message', messagesSchema);

export type messageModelType = typeof messageModel;
export type chatModelType = typeof chatModel;
export default messageModel;
