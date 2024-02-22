import { Request, Response } from 'express';

import { postModelType } from '../models/post.model';
import { groupModelType } from '../models/group.model';
import { podcastModelType } from '../models/podcast.model';
import { meetupType } from '../models/meetup.model';

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
			const datas = await Promise.all([
				this.meetupModel.find({
					$text: {
						$search: new RegExp(searchTerm as string, 'i') as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.groupModel.find({
					$text: {
						$search: new RegExp(searchTerm as string, 'i') as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.postModel.find({
					$text: {
						$search: new RegExp(searchTerm as string, 'i') as unknown as string,
						$caseSensitive: false,
					},
				}),
				this.podcastModel.find({
					$text: {
						$search: new RegExp(searchTerm as string, 'i') as unknown as string,
						$caseSensitive: false,
					},
				}),
			]);

			res
				.status(200)
				.json({
					data: {
						meetups: datas[0],
						groups: datas[1],
						post: datas[2],
						podcasts: datas[3],
					},
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
