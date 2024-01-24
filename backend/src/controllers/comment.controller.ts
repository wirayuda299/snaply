import { Request, Response } from 'express';
import { Service } from 'typedi';

import CommentService from '../services/comment.service';

@Service()
export default class CommentController {
	constructor(private commentService: CommentService) {}

	createComment(req: Request, res: Response) {
		const { author, comment, postId } = req.body;

		if (!author || !postId || !comment) {
			return res
				.status(400)
				.json({ message: 'Author, Post ID and comment are required' });
		}
		return this.commentService.uploadComment(req, res);
	}

	getReplies(req: Request, res: Response) {
		if (!req.params.id) {
			return res.status(400).json({ message: 'Id is required', error: true });
		}

		return this.commentService.getCommentReplies(req, res);
	}

	like(req: Request, res: Response) {
		const { userId, commentId } = req.body;
		if (!userId || !commentId) {
			return res
				.status(400)
				.json({ message: 'user id and comment id are required', error: true });
		}

		return this.commentService.likeComment(req, res);
	}
}
