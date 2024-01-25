import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';

import { podcastModelType } from '../models/podcast.model';
import Tag from './tag.service';
import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';

@Service()
export default class PodcastServices {
	constructor(
		@Inject('PodcastModel') private podcastModel: podcastModelType,
		@Inject('UserModel') private userModel: userModelType,
		@Inject('TagModel') private tagModel: TagModel
	) {}

	async create(req: Request, res: Response) {
		try {
			const {
				audio,
				audioAssetId,
				body,
				tags,
				postImage,
				title,
				author,
				postImageAssetId,
				category,
			} = req.body;

			const user = await this.userModel.findById(author);

			if (!user)
				return res.status(404).json({ message: 'User not found', error: true });

			const podcast = await this.podcastModel.create({
				audio,
				audioAssetId,
				body,
				postImage,
				title,
				author,
				postImageAssetId,
				category,
			});

			if (tags && tags.length >= 1) {
				await new Tag<typeof this.podcastModel>(
					this.podcastModel,
					this.tagModel
				).createTagIfExists(tags, podcast.id);
			}

			user.podcasts.push(podcast.id);
			await user.save();
			return res
				.status(201)
				.json({ message: 'Podcast has been published', error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getAllPodcasts(req: Request, res: Response) {
		try {
			const { sort = 'popular', page = 1, limit = 10 } = req.query;

			let sortOptions = {};

			if (sort === 'newest') {
				sortOptions = { createdAt: -1 };
			} else {
				sortOptions = { createdAt: 1 };
			}

			const [totalPodcasts, allPodcasts] = await Promise.all([
				this.podcastModel.countDocuments(),
				this.podcastModel
					.find()
					.populate('author', '_id username profileImage region country')
					.populate('tags')
					.skip(((page ? +page : 1) - 1) * +limit)
					.limit(+limit)
					.sort(sortOptions),
			]);
			res
				.status(200)
				.json({
					error: false,
					data: {
						totalPodcasts,
						allPodcasts,
					},
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, error: true }).end();
			}
			res
				.status(500)
				.json({ message: 'Internal server error', error: true })
				.end();
		}
	}

	async getPodcastById(req: Request, res: Response) {
		try {
			const podcast = await this.podcastModel
				.findById(req.query.id)
				.populate('author');

			if (!podcast)
				return res
					.status(404)
					.json({ message: 'Podcast not found', error: true });

			return res.status(200).json({ data: podcast, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, error: true }).end();
			}
			res
				.status(500)
				.json({ message: 'Internal server error', error: true })
				.end();
		}
	}
}
