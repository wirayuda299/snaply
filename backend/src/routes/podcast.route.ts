import { Router } from 'express';

import PodcastController from '../controllers/podcasts.controller';
import postModel from '../models/post.model';
import tagModel from '../models/tag.model';
import podcastModel from '../models/podcast.model';
import userModel from '../models/user.model';
import PodcastServices from '../services/podcast.service';

const router = Router();

const service = new PodcastServices(podcastModel, userModel, tagModel);
const podcast = new PodcastController(service);

router.get('/all', (req, res) => podcast.getAll(req, res));
router.post('/create', (req, res) => podcast.createPodcast(req, res));
router.get('/', (req, res) => podcast.getPodcast(req, res));
router.patch('/delete', (req, res) => podcast.delete(req, res));
export default router;
