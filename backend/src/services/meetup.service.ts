import { Service } from 'typedi';
import { Request, Response } from 'express';

import Meetup from '../controllers/meetup.controller';

@Service()
export default class MeetupService {
	constructor(private meetup: Meetup) {}

	create(req: Request, res: Response) {
		return this.meetup.createMeetup(req, res);
	}

	allMeetups(res: Response) {
		return this.meetup.getAllMeetups(res);
	}

	getMeetupById(req: Request, res: Response) {
		return this.meetup.getMeetup(req, res);
	}
}
