import { Router } from 'express';

import ReportService from '../services/report.service';
import reportModel from '../models/report.model';
import postModel from '../models/post.model';
import ReportController from '../controllers/report.controller';

const router = Router();
const service = new ReportService(reportModel, postModel);
const controller = new ReportController(service);

router.post('/report-post', (req, res) => controller.reportPost(req, res));

export default router;
