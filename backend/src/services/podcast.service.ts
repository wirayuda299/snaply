import { Request, Response } from 'express';

import Tag from './tag.service';
import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';
import { podcastModelType } from '../models/podcast.model';
import { createError } from '../utils/createError';

export default class PodcastServices {
	constructor(
		private podcastModel: podcastModelType,
		private userModel: userModelType,
		private tagModel: TagModel
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
			user.points += 5;
			await user.save();
			return res
				.status(201)
				.json({ message: 'Podcast has been published', error: false });
		} catch (error) {
			createError(error, res);
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
			res.setHeader('Cache-Control', 'public, max-age=3600');
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
			createError(error, res);
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
			res.setHeader('Cache-Control', 'public, max-age=3600');
			return res.status(200).json({ data: podcast, error: false });
		} catch (error) {
			createError(error, res);
		}
	}
}
