import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
	{
		author: {
			type: String,
			ref: 'User',
		},
		comment: String,
		likes: [
			{
				type: String,
				ref: 'User',
			},
		],
		postId: {
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
		parentId: {
			type: Schema.Types.ObjectId,
			ref: 'Comment',
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

const commentModel = model('Comment', commentSchema);
export type commentModelType = typeof commentModel;

export default commentModel;
