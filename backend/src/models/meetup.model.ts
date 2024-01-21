import { Schema, model } from 'mongoose';

const meetupSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		companyName: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: String,
				ref: 'Tag',
			},
		],
		author: {
			type: String,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const meetupModel = model('Meetup', meetupSchema);

export type meetupType = typeof meetupModel;

export default meetupModel;
