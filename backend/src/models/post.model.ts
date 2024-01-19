import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		title: String,
		body: String,
		views: {
			type: Number,
			default: 0,
		},
		image: String,
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
		groupId: {
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
const postModel = model('Post', postSchema);
export type postModelType = typeof postModel;

export default postModel;
