import { Request, Response } from 'express';

import MeetupService from '../services/meetup.service';

export default class Meetup {
	constructor(private meetup: MeetupService) {}

	create(req: Request, res: Response) {
		const {
			address,
			companyName,
			date,
			image,
			title,
			body,
			author,
			assetId,
			category,
		} = req.body;

		if (
			!address ||
			!companyName ||
			!date ||
			!title ||
			!body ||
			!author ||
			!image ||
			!assetId ||
			!category
		) {
			return res.status(400).json({
				message: 'Please provide values for all required fields.',
				error: true,
			});
		}
		return this.meetup.createMeetup(req, res);
	}

	allMeetups(req: Request, res: Response) {
		return this.meetup.getAllMeetups(req, res);
	}

	getMeetupById(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'Id is required', error: true });
		}

		return this.meetup.getMeetup(req, res);
	}

	delete(req: Request, res: Response) {
		return this.meetup.deleteMeetup(req, res);
	}

	update(req: Request, res: Response) {
		return this.meetup.updateMeetup(req, res);
	}
}
