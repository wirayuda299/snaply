import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';

import TagController from './tag.controller';
import { userModelType } from '../models/user.model';
import { postModelType } from '../models/post.model';
import { TagModel } from '../models/tag.model';
import { groupModelType } from './../models/group.model';
import UserCountry from '../utils/userCountry';

@Service()
export default class PostController {
	constructor(
		@Inject('PostModel') private PostModel: postModelType,
		@Inject('TagModel') private tagModel: TagModel,
		@Inject('UserModel') private userModel: userModelType,
		@Inject('GroupModel') private groupModel: groupModelType
	) {}

	async createPost(req: Request, res: Response) {
		try {
			const { title, body, image, author, tags, group } = req.body;
			const user = await this.userModel.findById(author);
			if (!user)
				return res
					.status(404)
					.json({ message: 'User not found', error: true })
					.end();

			const country = await UserCountry.getUserCountry();

			const post = await this.PostModel.create({
				title,
				body,
				image,
				author: user,
				// @ts-ignore
				country: country.country_name,
				...(group ? { group: group } : { group: null }),
			});
			user?.posts.push(post.id);
			await user?.save();

			if (tags && tags.length >= 1) {
				await new TagController<typeof this.PostModel>(
					this.PostModel,
					this.tagModel
				).createTagIfExists(tags, post.id);
			}

			if (group) {
				const foundGroup = await this.groupModel.findById(group);
				if (!foundGroup)
					return res
						.status(404)
						.json({ message: 'Group not found', error: true });

				foundGroup.posts.push(post.id);
				await foundGroup.save();
			}

			res
				.status(201)
				.json({ message: 'Post has been created', error: false })
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getPost(req: Request, res: Response) {
		try {
			const post = await this.PostModel.find({ _id: req.query.id })
				.populate('author', 'username profileImage createdAt')
				.populate('tags')
				.populate({
					path: 'comments',
					match: {
						// to match where parentId field doesn't exist
						parentId: {
							$exists: false,
						},
					},
					populate: {
						path: 'author',
						select: {
							_id: 1,
							username: 1,
							profileImage: 1,
						},
					},
				});

			if (!post)
				return res.status(404).json({ message: 'Post not found', error: true });

			res.json({ data: post, error: false }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, error: true }).end();
			}
		}
	}

	async getAllPosts(req: Request, res: Response) {
		try {
			const { sort = 'popular', page = 1, limit = 10 } = req.query;

			let sortOptions = {};

			if (sort === 'newest') {
				sortOptions = { createdAt: -1 };
			} else {
				sortOptions = { createdAt: 1 };
			}

			const [totalPosts, allPosts] = await Promise.all([
				this.PostModel.countDocuments(),
				this.PostModel.find({
					group: null,
				})
					.populate('author', 'username profileImage createdAt')
					.populate('tags')
					.skip(((page ? +page : 1) - 1) * +limit)
					.limit(+limit)
					.sort(sortOptions),
			]);
			res.status(200).json({ error: false, data: allPosts, totalPosts }).end();
		} catch (e) {
			if (e instanceof Error) {
				res.status(500).json({ message: e.message, error: true }).end();
			}
		}
	}

	async incremementView(req: Request, res: Response) {
		try {
			const { postId } = req.body;
			if (!postId) {
				return res.status(400).json({ message: 'Post Id is required' });
			}

			const post = this.PostModel.findById(postId);
			if (!post)
				return res.status(404).json({ message: 'Post not found', error: true });

			await this.PostModel.findByIdAndUpdate(postId, {
				$inc: {
					views: 1,
				},
			});
			res.status(200).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
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
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getRelatedPosts(req: Request, res: Response) {
		const { id, authorId } = req.query;

		try {
			if (!id || !authorId) {
				return res
					.status(400)
					.json({ message: 'id and author id are required', error: true });
			}

			const posts = await this.PostModel.find({
				author: authorId,
			}).populate('tags');

			res
				.status(200)
				.json(posts.filter((post) => post._id.toString() !== id))
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
	// TODO: fix share field not increment by 1
	async sharePost(req: Request, res: Response) {
		try {
			const { postId } = req.query;
			if (!postId) {
				return res.status(400).json({ message: 'Post Id is required' });
			}
			const post = this.PostModel.findById(postId);
			if (!post) {
				return res.status(404).json({ message: 'Post not found', error: true });
			}

			await this.PostModel.findByIdAndUpdate(postId, {
				$inc: {
					share: 1,
				},
			});
			res.status(200).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
