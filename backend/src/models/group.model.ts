import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		banner: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		admins: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		tags: [String],
	},
	{
		timestamps: true,
	}
);

const groupModel = model('Group', groupSchema);

export type groupModelType = typeof groupModel;

export default groupModel;
