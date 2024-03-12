import { Request, Response } from 'express';

import { commentModelType } from '../models/comment.model';
import { postModelType } from '../models/post.model';
import { createError } from '../utils/createError';
import Logger from './logger.service';

export default class CommentService {
	private commentModel;
	private postModel;

	constructor(commentModel: commentModelType, postModel: postModelType) {
		this.commentModel = commentModel;
		this.postModel = postModel;
	}

	async uploadComment(req: Request, res: Response) {
		try {
			const { author, comment, postId, parentId } = req.body;

			const post = await this.postModel.findById(postId);
			if (!post) {
				return res
					.status(404)
					.json({ message: 'Post not found', error: true })
					.end();
			}

			const c = await this.commentModel.create({
				author,
				comment,
				postId: post.id,
				...(parentId && { parentId }),
			});
			post.comments.push(c.id);
			await post.save();

			return res.json({ message: 'Comment uploaded', error: false });
		} catch (error) {
			createError(error, req, res, 'upload-comment');
		}
	}

	async getCommentReplies(req: Request, res: Response) {
		try {
			const comments = await this.commentModel
				.find({ parentId: req.params.id })
				.populate('author', 'username profileImage createdAt updateAt');

			if (comments?.length < 1) {
				return res.status(404).json({ message: 'No replies yet', error: true });
			}

			return res.status(200).json({ data: comments, error: false }).end();
		} catch (error) {
			createError(error, req, res, 'get-comment-replies');
		}
	}

	async likeComment(req: Request, res: Response) {
		try {
			const { userId, commentId } = req.body;

			const comment = await this.commentModel.findById(commentId);

			if (!comment) {
				return res
					.status(404)
					.json({ message: 'Comment not found', error: true });
			}

			const hasLikedIndex = comment.likes.indexOf(userId);

			if (hasLikedIndex !== -1) {
				comment.likes.splice(hasLikedIndex, 1);
			} else {
				comment.likes.push(userId);
			}
			await comment.save();

			return res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'like-comment');
		}
	}
}
