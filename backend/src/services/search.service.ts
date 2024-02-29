import { Request, Response } from 'express';

import { postModelType } from '../models/post.model';
import { groupModelType } from '../models/group.model';
import { podcastModelType } from '../models/podcast.model';
import { meetupType } from '../models/meetup.model';
import { createError } from '../utils/createError';

export default class SearchService {
	constructor(
		private meetupModel: meetupType,
		private postModel: postModelType,
		private groupModel: groupModelType,
		private podcastModel: podcastModelType
	) {}

	async search(req: Request, res: Response) {
		try {
			const { searchTerm } = req.query;
			const searchQuery = new RegExp(`^${searchTerm}`, 'i');
			const results = await Promise.all([
				this.meetupModel.find({
					$text: {
						$search: searchQuery as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.groupModel.find({
					$text: {
						$search: searchQuery as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.postModel.find({
					$text: {
						$search: searchQuery as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.podcastModel.find({
					$text: {
						$search: searchQuery as unknown as string,
						$caseSensitive: false,
					},
				}),
			]);

			res
				.status(200)
				.json({
					data: {
						meetups: results[0],
						groups: results[1],
						post: results[2],
						podcasts: results[3],
					},
				})
				.end();
		} catch (error) {
			createError(error, res);
		}
	}
}
