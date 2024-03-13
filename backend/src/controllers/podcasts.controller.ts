import { Response, Request } from 'express';

import PodcastServices from '../services/podcast.service';

export default class InterviewController {
	constructor(private podcastService: PodcastServices) {}

	createPodcast(req: Request, res: Response) {
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

		if (
			!audio ||
			!audioAssetId ||
			!body ||
			tags.length < 1 ||
			!postImage ||
			!title ||
			!author ||
			!postImageAssetId ||
			!category ||
			!category
		) {
			return res.status(400).json({
				message: 'Please provide all value for all required fields',
				error: true,
			});
		}

		return this.podcastService.create(req, res);
	}

	getAll(req: Request, res: Response) {
		return this.podcastService.getAllPodcasts(req, res);
	}

	getPodcast(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'id not provided', error: true });
		}
		return this.podcastService.getPodcastById(req, res);
	}

	delete(req: Request, res: Response) {
		if (!req.body.podcastId) {
			return res.status(400).json({ message: 'id not provided', error: true });
		}

		return this.podcastService.deletePodcast(req, res);
	}
}
