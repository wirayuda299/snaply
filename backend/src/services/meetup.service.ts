import { Request, Response } from 'express';

import Tag from '../services/tag.service';
import FileUploadService from '../services/fileUpload.service';
import TagService from '../services/tag.service';

import { TagModel } from '../models/tag.model';
import { meetupType } from '../models/meetup.model';
import { userModelType } from '../models/user.model';
import { createError } from '../utils/createError';
import { RedisService } from './redis.service';

const redis = new RedisService();

export default class MeetupService {
	constructor(
		private meetupModel: meetupType,
		private tagModel: TagModel,
		private userModel: userModelType
	) {}

	async createMeetup(req: Request, res: Response) {
		try {
			const {
				address,
				companyName,
				date,
				image,
				title,
				tags,
				body,
				author,
				assetId,
				category,
			} = req.body;

			const user = await this.userModel.findById(author);
			if (!user) {
				return res.status(404).json({ message: 'User not found', error: true });
			}

			const meetup = await this.meetupModel.create({
				address,
				companyName,
				date,
				image,
				title,
				body,
				author,
				assetId,
				category,
			});

			await new Tag(this.meetupModel, this.tagModel).createTagIfExists(
				tags,
				meetup.id
			);
			user.meetups.push(meetup.id);
			user.points += 5;
			await user.save();
			await redis.clearCache('meetups');
			res.status(201).json({ data: meetup, error: false }).end();
		} catch (error) {
			createError(error, req, res, 'create-meetup');
		}
	}

	async getAllMeetups(req: Request, res: Response) {
		try {
			const { page = 1, limit = 10 } = req.query;

			const pageKey = `meetups:${page}:limit`;

			const meetups = await new RedisService().getOrCacheData(
				pageKey,
				async () => {
					const data = await this.meetupModel
						.find({})
						.populate('author', '_id username profileImage createdAt')
						.populate('tags')
						.skip(((page ? +page : 1) - 1) * +limit)
						.limit(+limit);
					return data;
				},
				res
			);
			const totalMeetups = await this.meetupModel.countDocuments();

			const totalPages = Math.ceil(totalMeetups / +limit);

			return res.status(200).json({
				data: {
					totalPages,
					meetups,
				},
				error: false,
			});
		} catch (error) {
			createError(error, req, res, 'get-all-meetup');
		}
	}

	async getMeetup(req: Request, res: Response) {
		try {
			const meetup = await new RedisService().getOrCacheData(
				`meetup:${req.query.id}`,
				async () => {
					return await this.meetupModel
						.findById(req.query.id)
						.populate('author', '_id username profileImage createdAt')
						.populate('tags');
				},
				res
			);

			if (!meetup)
				return res
					.status(404)
					.json({ message: 'Meetup not found', error: true });

			return res.status(200).json({ data: meetup, error: false });
		} catch (error) {
			createError(error, req, res, 'get-meetup');
		}
	}

	async deleteMeetup(req: Request, res: Response) {
		try {
			const foundMeetup = await this.meetupModel
				.findById(req.body.meetupId)
				.populate('author', '_id, username profileImage createdAt');

			if (!foundMeetup) {
				return res
					.status(404)
					.json({ message: 'Meetup not found', error: true });
			}

			if (foundMeetup.author) {
				const author = await this.userModel.findById(foundMeetup.author);
				if (!author) {
					return res
						.status(404)
						.json({ message: 'User not found', error: true });
				}
				const updatedMeetups = author.meetups.filter(
					(meetup) => meetup !== req.body.meetupId
				);
				await this.userModel.updateOne(
					{ _id: author._id },
					{
						$set: {
							meetups: updatedMeetups,
						},
					}
				);
				await author.save();
			}

			const fileUploadService = new FileUploadService();
			await fileUploadService.deleteAsset(foundMeetup.assetId, res);

			await new TagService<typeof this.meetupModel>(
				this.meetupModel,
				this.tagModel
			).deleteTag(foundMeetup.tags, foundMeetup._id);

			await this.meetupModel.deleteOne({ _id: foundMeetup._id });
			await redis.clearCache('meetups');
			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'delete-meetup');
		}
	}

	async updateMeetup(req: Request, res: Response) {
		try {
			const {
				meetupId,
				address,
				companyName,
				date,
				image,
				title,
				tags,
				body,
				assetId,
				category,
			} = req.body;

			const meetup = await this.meetupModel.findById(meetupId);
			if (!meetup) {
				return res
					.status(404)
					.json({ message: 'Meetup not found', error: true });
			}

			if (tags && tags.length >= 1) {
				await new TagService<typeof this.meetupModel>(
					this.meetupModel,
					this.tagModel
				).createTagIfExists(tags, meetup.id);
			}

			if (assetId !== meetup.assetId) {
				const fileUploadService = new FileUploadService();
				await fileUploadService.deleteAsset(meetup.assetId, res);
			}

			await this.meetupModel.updateOne(
				{ _id: meetup._id },
				{
					address,
					body,
					category,
					companyName,
					image,
					title,
					assetId,
					date,
				}
			);
			await redis.clearCache('meetups');
			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'update-meetup');
		}
	}

	async getRelatedMeetups(req: Request, res: Response) {
		try {
			const { author, id } = req.query;
			const meetups = await this.meetupModel
				.find({ author, _id: { $ne: id } })
				.populate('tags');
			return res.status(200).json({ data: meetups, error: false });
		} catch (error) {
			createError(error, req, res, 'related-meetup');
		}
	}
}
