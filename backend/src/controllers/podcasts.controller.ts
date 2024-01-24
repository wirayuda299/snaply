import { Service } from 'typedi';
import { Response, Request } from 'express';

import PodcastServices from '../services/podcast.service';

@Service()
export default class InterviewController {
	constructor(private podcastService: PodcastServices) {}

	createPodcast(req: Request, res: Response) {
		return this.podcastService.create(req, res);
	}

	getAll(req: Request, res: Response) {
		return this.podcastService.getAllPodcasts(req, res);
	}
}
