import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
	name: {
		type: String,
		unique: true,
	},
	postIds: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
});

const tagModel = model('Tag', tagSchema);

export type TagModel = typeof tagModel;

export default tagModel;
