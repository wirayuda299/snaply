import type { Request, Response } from 'express';

import TagService from '../services/tag.service';
import FileUploadService from './fileUpload.service';

import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';
import { postModelType } from '../models/post.model';
import { groupModelType } from './../models/group.model';
import { createError } from '../utils/createError';

import { RedisService } from './redis.service';

export default class PostService {
	constructor(
		private PostModel: postModelType,
		private tagModel: TagModel,
		private userModel: userModelType,
		private groupModel: groupModelType
	) {}

	async createPost(req: Request, res: Response) {
		const { title, body, image, author, tags, group, assetId, category } =
			req.body;

		try {
			const user = await this.userModel.findById(author);
			if (!user) {
				return res
					.status(404)
					.json({ message: 'User not found', error: true })
					.end();
			}

			const post = await this.PostModel.create({
				title,
				body,
				image,
				author: user,
				assetId,
				category,
				country: '',
				...(group ? { group } : { group: null }),
			});
			user?.posts.push(post.id);
			user.points += 5;
			await user?.save();

			if (tags && tags.length >= 1) {
				await new TagService<typeof this.PostModel>(
					this.PostModel,
					this.tagModel
				).createTagIfExists(tags, post.id);
			}

			if (group) {
				const foundGroup = await this.groupModel.findById(group);
				if (!foundGroup) {
					return res
						.status(404)
						.json({ message: 'Group not found', error: true });
				}
				foundGroup.posts.push(post.id);
				await foundGroup.save();
			}

			res
				.status(201)
				.json({ message: 'Post has been created', error: false })
				.end();
		} catch (error) {
			createError(error, req, res, 'create-post');
		}
	}

	async getPost(req: Request, res: Response) {
		try {
			const data = await new RedisService().getOrCacheData(
				`post:${req.query.id}`,
				async () => {
					const post = await this.PostModel.findById(req.query.id)
						.populate('author', '_id, username profileImage createdAt')
						.populate({
							path: 'comments',
							match: {
								parentId: {
									$exists: false,
								},
							},
							options: {
								sort: { createdAt: -1 },
							},
							populate: {
								path: 'author',
								select: {
									_id: 1,
									username: 1,
									profileImage: 1,
								},
							},
						})
						.populate('tags');
					return post;
				}
			);

			if (!data) {
				return res.status(404).json({ message: 'Post not found', error: true });
			}

			res.json({ data: data, error: false }).end();
		} catch (error) {
			createError(error, req, res, 'get-post-by-id');
		}
	}

	async getAllPosts(req: Request, res: Response) {
		try {
			const { sort = 'popular', page = 1, limit = 10 } = req.query;

			let sortOptions = {};

			if (sort === 'newest') {
				sortOptions = { createdAt: -1 };
			} else {
				sortOptions = { views: -1 };
			}
			const data = await new RedisService().getOrCacheData(
				'posts',
				async () => {
					return await this.PostModel.find({ group: null })
						.populate('author', 'username profileImage createdAt')
						.populate('tags')
						.skip(((page ? +page : 1) - 1) * +limit)
						.limit(+limit)
						.sort(sortOptions);
				}
			);

			const totalPosts = await this.PostModel.countDocuments();
			const totalPages = Math.ceil(totalPosts / +limit);

			return res.json({
				data: {
					allPosts: data,
					totalPages,
				},
			});
		} catch (e) {
			createError(e, req, res, 'get-all-posts');
		}
	}

	async incremementView(req: Request, res: Response) {
		const { postId } = req.body;

		try {
			const post = this.PostModel.findById(postId);
			if (!post) {
				return res.status(404).json({ message: 'Post not found', error: true });
			}

			await this.PostModel.findByIdAndUpdate(postId, {
				$inc: {
					views: 1,
				},
			});

			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'increment-post');
		}
	}

	async likePost(req: Request, res: Response) {
		const { postId, userId } = req.body;

		try {
			const [post, user] = await Promise.all([
				this.PostModel.findById(postId),
				this.userModel.findById(userId),
			]);

			if (!user || !post) {
				return res
					.status(404)
					.json({ message: 'User or Post not found', error: true });
			}

			const index = post.likes.indexOf(user.id);

			if (index !== -1) {
				post.likes.splice(index, 1);
			} else {
				post.likes.push(user.id);
			}

			await post.save();

			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'like-post');
		}
	}

	async getRelatedPosts(req: Request, res: Response) {
		const { id, authorId } = req.query;

		try {
			const data = await new RedisService().getOrCacheData(
				'related-posts',
				async () => {
					const posts = await this.PostModel.find({
						author: authorId,
						group: null,
					})
						.limit(4)
						.populate('tags');
					return posts;
				}
			);

			res
				.status(200)
				// @ts-ignore
				.json({ data: data.filter((post) => post._id.toString() !== id) })
				.end();
		} catch (error) {
			createError(error, req, res, 'related-post');
		}
	}

	async sharePost(req: Request, res: Response) {
		try {
			const { postId } = req.body;

			const post = await this.PostModel.findById(postId);
			if (!post) {
				return res.status(404).json({ message: 'Post not found', error: true });
			}

			await this.PostModel.findByIdAndUpdate(post._id, {
				$inc: {
					share: 1,
				},
			});

			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'share-post');
		}
	}

	async deletePost(req: Request, res: Response) {
		try {
			const post = await this.PostModel.findById(req.body.postId)
				.populate('tags')
				.populate('author', '_id, username profileImage createdAt');

			if (!post) {
				return res.status(404).json({ error: true, message: 'Post not found' });
			}
			if (post.author) {
				let postAuthor = await this.userModel.findById(post?.author);
				if (!postAuthor) {
					return res.status(404).json({ message: 'User not found' });
				}

				// @ts-ignore
				const updatedPosts = postAuthor.posts.filter(
					(postId) => postId.toString() !== post._id.toString()
				);

				await this.userModel.updateOne(
					{ _id: postAuthor._id },
					{ $set: { posts: updatedPosts } }
				);
				await postAuthor?.save();
			}
			const fileUploadService = new FileUploadService();
			await fileUploadService.deleteAsset(post.assetId, res);

			await new TagService<typeof this.PostModel>(
				this.PostModel,
				this.tagModel
			).deleteTag(post.tags, post._id);

			await this.PostModel.deleteOne({ _id: post._id });

			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'delete-post');
		}
	}

	async updatePost(req: Request, res: Response) {
		const { postId, title, image, assetId, body, category, tags } = req.body;

		try {
			const post = await this.PostModel.findById(postId);
			if (!post) {
				return res.status(404).json({ message: 'Post not found', error: true });
			}

			if (tags && tags.length >= 1) {
				await new TagService<typeof this.PostModel>(
					this.PostModel,
					this.tagModel
				).createTagIfExists(tags, post.id);
			}

			if (assetId !== post.assetId) {
				const fileUploadService = new FileUploadService();
				await fileUploadService.deleteAsset(post.assetId, res);
			}

			await this.PostModel.updateOne(
				{ _id: post._id },
				{
					title,
					body,
					category,
					image,
					assetId,
				}
			);

			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'update-post');
		}
	}
}
