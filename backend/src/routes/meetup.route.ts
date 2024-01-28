import { Router } from "express";

import MeetupController from "../controllers/meetup.controller";
import userModel from "../models/user.model";
import tagModel from "../models/tag.model";
import meetupModel from "../models/meetup.model";
import MeetupService from "../services/meetup.service";

const router = Router();

const service = new MeetupService(meetupModel, tagModel, userModel);
const meetup = new MeetupController(service);

router.get("/", (req, res) => meetup.getMeetupById(req, res));
router.get("/all", (_, res) => meetup.allMeetups(res));
router.post("/create", (req, res) => meetup.create(req, res));

export default router;
