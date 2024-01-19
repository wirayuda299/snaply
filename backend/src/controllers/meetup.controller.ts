import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';

import { meetupType } from '../models/meetup.model';
import Tag from './tag.controller';
import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';

@Service()
export default class Meetup {
	constructor(
		@Inject('MeetupModel') private meetupModel: meetupType,
		@Inject('TagModel') private tagModel: TagModel,
		@Inject('UserModel') private userModel: userModelType
	) {}

	async createMeetup(req: Request, res: Response) {
		try {
			const { address, companyName, date, image, title, tags, body, author } =
				req.body;

			const user = await this.userModel.findById(author);
			if (!user)
				return res.status(404).json({ message: 'User not found', error: true });

			const meetup = await this.meetupModel.create({
				address,
				companyName,
				date,
				image,
				title,
				body,
				author,
			});

			await new Tag(this.meetupModel, this.tagModel).createTagIfExists(
				tags,
				meetup.id
			);
			user.meetups.push(meetup.id);
			await user.save();
			res.status(201).json({ data: meetup }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
			}
		}
	}

	async getAllMeetups(res: Response) {
		try {
			const meetups = await this.meetupModel
				.find({})
				.populate('author', '_id username profileImage createdAt');
			return res.status(200).json({ data: meetups });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
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

			return res.status(200).json({ data: meetup, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
