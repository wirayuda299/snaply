import { Router } from 'express';

import SearchService from '../services/search.service';
import postModel from '../models/post.model';
import groupModel from '../models/group.model';
import podcastModel from '../models/podcast.model';
import SearchController from '../controllers/search.controller';
import meetupModel from '../models/meetup.model';

const router = Router();
const service = new SearchService(
	meetupModel,
	postModel,
	groupModel,
	podcastModel
);
const controller = new SearchController(service);
router.get('/all', (req, res) => controller.searchAll(req, res));

export default router;
