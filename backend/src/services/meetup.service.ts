import { Request, Response } from 'express';

import Tag from '../services/tag.service';
import { TagModel } from '../models/tag.model';
import { meetupType } from '../models/meetup.model';
import { userModelType } from '../models/user.model';

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

			res.status(201).json({ data: meetup, error: false }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
			}
		}
	}

	async getAllMeetups(req: Request, res: Response) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const meetups = await this.meetupModel
				.find({})
				.populate('author', '_id username profileImage createdAt')
				.populate('tags')
				.skip(((page ? +page : 1) - 1) * +limit)
				.limit(+limit);
			return res.status(200).json({ data: meetups, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getMeetup(req: Request, res: Response) {
		try {
			const meetup = await this.meetupModel
				.findById(req.query.id)
				.populate('author');

			if (!meetup)
				return res
					.status(404)
					.json({ message: 'Meetup not found', error: true });
			res.setHeader('Cache-Control', 'public, max-age=3600');
			return res.status(200).json({ data: meetup, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
