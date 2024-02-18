import { Request, Response } from 'express';

import { postModelType } from '../models/post.model';
import { reportModelType } from '../models/report.model';
import console from 'console';

export default class ReportService {
	constructor(
		private reportModel: reportModelType,
		private postModel: postModelType
	) {}

	async reportPost(req: Request, res: Response) {
		try {
			const { postId, reasons, userId } = req.body;

			const post = await this.postModel.findById(postId);
			if (!post)
				return res
					.status(404)
					.json({ message: 'Post not found', error: false });

			const report = await this.reportModel.create({
				postId: post._id,
				reportBy: userId,
			});
			report.reasons.push(reasons);
			post.report.push(report._id);
			await report.save();
			await post.save();
			res
				.status(201)
				.json({ message: 'This post has been reported', error: false })
				.end();
		} catch (error) {
			console.log(error);

			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
