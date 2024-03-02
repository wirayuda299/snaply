import { Request, Response } from 'express';

import Post from '../services/post.service';

export default class PostController {
	constructor(private postService: Post) {}

	create(req: Request, res: Response) {
		const { title, body, image, assetId, category } = req.body;
		if (!title || !body || !image || !assetId || !category) {
			return res
				.status(400)
				.json({ message: 'Please fill all required fields', error: true });
		}
		return this.postService.createPost(req, res);
	}

	getPostById(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({
				message: 'Id is required',
				error: true,
			});
		}

		return this.postService.getPost(req, res);
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

		return this.postService.getAllPosts(req, res);
	}

	updateView(req: Request, res: Response) {
		const { postId } = req.body;
		if (!postId) {
			return res.status(400).json({ message: 'Post Id is required' });
		}

		return this.postService.incremementView(req, res);
	}

	like(req: Request, res: Response) {
		const { postId, userId } = req.body;
		if (!postId || !userId) {
			return res
				.status(400)
				.json({ message: 'post id and user id are required', error: true });
		}
		return this.postService.likePost(req, res);
	}

	relatedPosts(req: Request, res: Response) {
		const { id, authorId } = req.query;

		if (!id || !authorId) {
			return res
				.status(400)
				.json({ message: 'id and author id are required', error: true });
		}

		return this.postService.getRelatedPosts(req, res);
	}

	share(req: Request, res: Response) {
		const { postId } = req.body;

		if (!postId) {
			return res
				.status(400)
				.json({ message: 'Post Id is required', error: true });
		}
		return this.postService.sharePost(req, res);
	}

	deleteAPost(req: Request, res: Response) {
		const { postId } = req.body;

		if (!postId) {
			return res
				.status(400)
				.json({ message: 'Post Id is required', error: true });
		}
		return this.postService.deletePost(req, res);
	}

	update(req: Request, res: Response) {
		return this.postService.updatePost(req, res);
	}
}
