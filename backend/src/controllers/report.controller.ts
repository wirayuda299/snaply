import { Request, Response } from 'express';

import ReportService from '../services/report.service';

export default class ReportController {
	constructor(private reportService: ReportService) {}

	reportPost(req: Request, res: Response) {
		return this.reportService.reportPost(req, res);
	}
}
