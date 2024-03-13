import { Request, Response } from 'express';

import ReportService from '../services/report.service';

export default class ReportController {
	constructor(private reportService: ReportService) {}

	reportPost(req: Request, res: Response) {
		const { postId, reasons, userId } = req.body;

		if (!postId || reasons.length < 1 || !userId) {
			return res.status(400).json({ message: 'All value is required' });
		}
		return this.reportService.reportPost(req, res);
	}
}
