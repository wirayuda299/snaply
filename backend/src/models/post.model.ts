import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		title: String,
		body: String,
		category: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		assetId: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		share: {
			type: Number,
			default: 0,
		},
		country: {
			type: String,
			required: false,
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: false,
		},
		likes: [
			{
				type: String,
				ref: 'User',
			},
		],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		author: {
			type: String,
			ref: 'User',
		},
		report: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Report',
			},
		],
	},
	{
		timestamps: true,
	}
);
postSchema.index({ title: 'text', body: 'text' });
const postModel = model('Post', postSchema);
export type postModelType = typeof postModel;

export default postModel;
