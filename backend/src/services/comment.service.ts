import { Request, Response } from 'express';
import { Service } from 'typedi';

import Comment from '../controllers/comment.controller';

@Service()
export default class CommentService {
	constructor(private commentController: Comment) {}

	createComment(req: Request, res: Response) {
		return this.commentController.uploadComment(req, res);
	}

	getReplies(req: Request, res: Response) {
		return this.commentController.getCommentReplies(req, res);
	}

	like(req: Request, res: Response) {
		return this.commentController.likeComment(req, res);
	}
}
