import { Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		region: {
			type: String,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
		points: {
			type: Number,
			default: 0,
		},
		profileImage: {
			type: String,
			required: false,
		},
		role: {
			type: String,
			required: false,
			default: '',
		},
		bio: {
			type: String,
			required: false,
			default: '',
		},
		website: {
			type: String,
			required: false,
			default: '',
		},
		followers: [
			{
				type: String,
				ref: 'User',
			},
		],
		followings: [
			{
				type: String,
				ref: 'User',
			},
		],
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Group',
			},
		],
		groupMembers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Group',
			},
		],
		meetups: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Meetup',
			},
		],
		podcasts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Podcasts',
			},
		],
		notifications: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Notification',
			},
		],
	},
	{
		timestamps: true,
	}
);
const userModel = model('User', userSchema);
export type userSchemaType = typeof userSchema;
export type userModelType = typeof userModel;

export default userModel;
