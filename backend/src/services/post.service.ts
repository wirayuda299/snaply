import type { Request, Response } from 'express';
import { Service } from 'typedi';

import Post from '../controllers/post.controller';

@Service()
export default class PostService {
	constructor(private postController: Post) {}

	create(req: Request, res: Response) {
		return this.postController.createPost(req, res);
	}

	getPostById(req: Request, res: Response) {
		return this.postController.getPost(req, res);
	}

	allPosts(req: Request, res: Response) {
		return this.postController.getAllPosts(req, res);
	}

	updateView(req: Request, res: Response) {
		return this.postController.incremementView(req, res);
	}

	like(req: Request, res: Response) {
		return this.postController.likePost(req, res);
	}

	relatedPosts(req: Request, res: Response) {
		return this.postController.getRelatedPosts(req, res);
	}

	share(req: Request, res: Response) {
		return this.postController.sharePost(req, res);
	}
}
