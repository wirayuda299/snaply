import { Service } from 'typedi';
import { Request, Response } from 'express';

import MeetupService from '../services/meetup.service';

@Service()
export default class Meetup {
	constructor(private meetup: MeetupService) {}

	create(req: Request, res: Response) {
		const { address, companyName, date, image, title, body, author, assetId } =
			req.body;
		if (
			!address ||
			!companyName ||
			!date ||
			!title ||
			!body ||
			!author ||
			!image ||
			!assetId
		) {
			return res.status(400).json({
				message: 'Please provide values for all required fields.',
				error: true,
			});
		}
		return this.meetup.createMeetup(req, res);
	}

	allMeetups(res: Response) {
		return this.meetup.getAllMeetups(res);
	}

	getMeetupById(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'Id is required', error: true });
		}

		return this.meetup.getMeetup(req, res);
	}
}
