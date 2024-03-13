import { Request, Response } from 'express';

import SearchService from '../services/search.service';

export default class SearchController {
	constructor(private _searchService: SearchService) {}

	searchAll(req: Request, res: Response) {
		const { searchTerm } = req.query;
		if (!searchTerm) {
			return res
				.status(400)
				.json({ message: 'Please add search term', error: true });
		}
		return this._searchService.search(req, res);
	}
}
