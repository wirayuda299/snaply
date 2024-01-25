import exp from 'constants';
import { Schema, Types, model } from 'mongoose';

const interviewSchema = new Schema(
	{
		audio: {
			type: String,
			required: true,
		},
		audioAssetId: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
			ref: 'User',
		},
		category: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		postImage: {
			type: String,
			required: true,
		},
		postImageAssetId: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{
		timestamps: true,
	}
);

const podcastModel = model('Podcasts', interviewSchema);
export type podcastModelType = typeof podcastModel;
export default podcastModel;
