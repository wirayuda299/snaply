import { Request, Response } from 'express';
import { Service } from 'typedi';

import Post from '../services/post.service';

@Service()
export default class PostController {
	constructor(private postController: Post) {}

	create(req: Request, res: Response) {
		const { title, body, image, assetId } = req.body;
		console.log({ title, body, image, assetId });

		if (!title || !body || !image || !assetId) {
			return res
				.status(400)
				.json({ message: 'Please fill all required fields', error: true });
		}
		return this.postController.createPost(req, res);
	}

	getPostById(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({
				message: 'Id is required',
				error: true,
			});
		}

		return this.postController.getPost(req, res);
	}

	allPosts(req: Request, res: Response) {
		const allowedSortOptions = ['newest', 'popular'];

		const { sort = 'popular', page = 1 } = req.query;
		if (!allowedSortOptions.includes(sort as string)) {
			return res.status(400).json({ message: 'Invalid sort options' });
		}

		if (page && +page < 1) {
			req.query.page = 1 as unknown as string;
		}

		return this.postController.getAllPosts(req, res);
	}

	updateView(req: Request, res: Response) {
		const { postId } = req.body;
		if (!postId) {
			return res.status(400).json({ message: 'Post Id is required' });
		}

		return this.postController.incremementView(req, res);
	}

	like(req: Request, res: Response) {
		const { postId, userId } = req.body;
		if (!postId || !userId) {
			return res
				.status(400)
				.json({ message: 'post id and user id are required', error: true });
		}
		return this.postController.likePost(req, res);
	}

	relatedPosts(req: Request, res: Response) {
		const { id, authorId } = req.query;

		if (!id || !authorId) {
			return res
				.status(400)
				.json({ message: 'id and author id are required', error: true });
		}

		return this.postController.getRelatedPosts(req, res);
	}

	share(req: Request, res: Response) {
		const { postId } = req.body;

		if (!postId) {
			return res
				.status(400)
				.json({ message: 'Post Id is required', error: true });
		}
		return this.postController.sharePost(req, res);
	}
}
