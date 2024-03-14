import { Router } from 'express';

import tagModel from '../models/tag.model';
import userModel from '../models/user.model';
import meetupModel from '../models/meetup.model';
import MeetupService from '../services/meetup.service';
import MeetupController from '../controllers/meetup.controller';

const router = Router();

const service = new MeetupService(meetupModel, tagModel, userModel);
const meetup = new MeetupController(service);

router.get('/', (req, res) => meetup.getMeetupById(req, res));
router.get('/all', (req, res) => meetup.allMeetups(req, res));
router.get('/related-meetups', (req, res) =>
	meetup.getRelatedMeetups(req, res)
);
router.post('/create', (req, res) => meetup.create(req, res));
router.patch('/delete', (req, res) => meetup.delete(req, res));
router.post('/update', (req, res) => meetup.update(req, res));

export default router;
