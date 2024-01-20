"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const meetup_service_1 = __importDefault(require("../services/meetup.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const meetup_model_1 = __importDefault(require("../models/meetup.model"));
const router = (0, express_1.Router)();
typedi_1.default.set('UserModel', user_model_1.default);
typedi_1.default.set('TagModel', tag_model_1.default);
typedi_1.default.set('MeetupModel', meetup_model_1.default);
const meetup = typedi_1.default.get(meetup_service_1.default);
router.get('/', (req, res) => meetup.getMeetupById(req, res));
router.get('/all', (_, res) => meetup.allMeetups(res));
router.post('/create', (req, res) => meetup.create(req, res));
exports.default = router;
//# sourceMappingURL=meetup.route.js.map