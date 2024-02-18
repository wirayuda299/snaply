import { Schema, model } from 'mongoose';

const schema = new Schema(
	{
		postId: Schema.Types.ObjectId,
		reasons: [String],
		reportBy: {
			type: String,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);
const reportModel = model('Report', schema);
export type reportModelType = typeof reportModel;

export default reportModel;
