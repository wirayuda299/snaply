import { Request, Response } from 'express';

import SearchService from '../services/search.service';

export default class SearchController {
	constructor(private _searchService: SearchService) {}

	searchAll(req: Request, res: Response) {
		return this._searchService.search(req, res);
	}
}
