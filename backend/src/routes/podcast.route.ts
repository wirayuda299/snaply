import { Router } from 'express';
import Container from 'typedi';

import PodcastController from '../controllers/podcasts.controller';
import postModel from '../models/post.model';
import tagModel from '../models/tag.model';
import podcastModel from '../models/podcast.model';
import userModel from '../models/user.model';

const router = Router();

Container.set('UserModel', userModel);
Container.set('PodcastModel', podcastModel);
Container.set('TagModel', tagModel);

const podcast = Container.get(PodcastController);

router.get('/all', (req, res) => podcast.getAll(req, res));
router.post('/create', (req, res) => podcast.createPodcast(req, res));
export default router;
