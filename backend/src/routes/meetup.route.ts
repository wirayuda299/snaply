import { Router } from 'express';
import Container from 'typedi';

import MeetupService from '../services/meetup.service';
import userModel from '../models/user.model';
import tagModel from '../models/tag.model';
import meetupModel from '../models/meetup.model';

const router = Router();
Container.set('UserModel', userModel);
Container.set('TagModel', tagModel);
Container.set('MeetupModel', meetupModel);

const meetup = Container.get(MeetupService);

router.get('/', (req, res) => meetup.getMeetupById(req, res));
router.get('/all', (_, res) => meetup.allMeetups(res));
router.post('/create', (req, res) => meetup.create(req, res));

export default router;
