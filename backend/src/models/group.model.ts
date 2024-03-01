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
		bannerAssetId: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			required: true,
		},
		logoAssetId: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		members: [
			{
				type: String,
				ref: 'User',
			},
		],
		admins: [
			{
				type: String,
				ref: 'User',
			},
		],
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
	},
	{
		timestamps: true,
	}
);

groupSchema.index({ name: 'text', category: 'text' });

const groupModel = model('Group', groupSchema);

export type groupModelType = typeof groupModel;

export default groupModel;
