import { Request, Response } from 'express';
// import { Queue } from 'bull';

import Tag from './tag.service';
import FileUploadService from './fileUpload.service';
import TagService from '../services/tag.service';

import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';
import { podcastModelType } from '../models/podcast.model';
import { createError } from '../utils/createError';
import { podcastQueue } from '../queue/podcast.queue';
import { RedisService } from './redis.service';

const redis = new RedisService();

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
			req.setTimeout(500000);
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

			await Promise.all([
				user.save(),
				podcastQueue.add(podcast._id),
				await redis.clearCache('podcasts'),
			]);

			return res
				.status(201)
				.json({ message: 'Podcast has been published', error: false });
		} catch (error) {
			createError(error, req, res, 'create-podcast');
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
			const pageKey = `podcasts:${sort}:${page}:${limit}`;
			const allPodcasts = await new RedisService().getOrCacheData(
				pageKey,
				async () => {
					const podcasts = await this.podcastModel
						.find()
						.populate('author', '_id username profileImage')
						.populate('tags')
						.skip(((page ? +page : 1) - 1) * +limit)
						.limit(+limit)
						.sort(sortOptions);
					return podcasts;
				},
				res
			);

			const totalPodcasts = await this.podcastModel.countDocuments();

			const totalPages = Math.ceil(totalPodcasts / +limit);
			res
				.status(200)
				.json({
					error: false,
					data: {
						allPodcasts,
						totalPages,
					},
				})
				.end();
		} catch (error) {
			createError(error, req, res, 'get-all-podcast');
		}
	}

	async getPodcastById(req: Request, res: Response) {
		try {
			const data = await new RedisService().getOrCacheData(
				`podcast:${req.query.id}`,
				async () => {
					return await this.podcastModel
						.findById(req.query.id)
						.populate('author');
				},
				res
			);
			if (!data)
				return res
					.status(404)
					.json({ message: 'Podcast not found', error: true });

			return res.status(200).json({ data, error: false });
		} catch (error) {
			createError(error, req, res, 'get-podcast');
		}
	}

	async deletePodcast(req: Request, res: Response) {
		try {
			const foundPodcast = await this.podcastModel.findById(req.body.podcastId);

			if (!foundPodcast) {
				return res
					.status(404)
					.json({ message: 'Podcast not found', error: true });
			}
			await redis.clearCache('podcasts');

			if (foundPodcast.author) {
				const author = await this.userModel.findById(foundPodcast.author);
				if (!author) {
					return res
						.status(404)
						.json({ message: 'Author not found', error: true });
				}

				const updatedPodcast = author?.podcasts.filter(
					(podcast) => podcast !== foundPodcast._id
				);

				const fileUploadService = new FileUploadService();

				await Promise.all([
					this.userModel.updateOne(
						{ _id: author._id },
						{ $set: { podcasts: updatedPodcast } }
					),
					author.save(),
					fileUploadService.deleteAsset(foundPodcast.audioAssetId, res),
					fileUploadService.deleteAsset(foundPodcast.postImageAssetId, res),
					new TagService<typeof this.podcastModel>(
						this.podcastModel,
						this.tagModel
					).deleteTag(foundPodcast.tags, foundPodcast._id),
					this.podcastModel.deleteOne({ _id: foundPodcast._id }),
				]);
			}

			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'delete-podcast');
		}
	}
}
