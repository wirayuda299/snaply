import { Schema, model } from 'mongoose';

const messagesSchema = new Schema(
	{
		to: {
			type: String,
			ref: 'User',
		},
		from: {
			type: String,
			ref: 'User',
		},
		message: String,
		media: {
			image: {
				type: String,
				required: false,
			},
			audio: {
				type: String,
				required: false,
			},
			video: {
				type: String,
				required: false,
			},
		},
	},
	{
		timestamps: true,
	}
);

messagesSchema.index({ message: 'text', to: 'text', from: 'text' });

const messageModel = model('Message', messagesSchema);

export type messageModelType = typeof messageModel;
export default messageModel;
