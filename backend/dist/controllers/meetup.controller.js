"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const tag_controller_1 = __importDefault(require("./tag.controller"));
let Meetup = class Meetup {
    meetupModel;
    tagModel;
    userModel;
    constructor(meetupModel, tagModel, userModel) {
        this.meetupModel = meetupModel;
        this.tagModel = tagModel;
        this.userModel = userModel;
    }
    async createMeetup(req, res) {
        try {
            const { address, companyName, date, image, title, tags, body, author } = req.body;
            const user = await this.userModel.findById(author);
            if (!user)
                return res.status(404).json({ message: 'User not found', error: true });
            const meetup = await this.meetupModel.create({
                address,
                companyName,
                date,
                image,
                title,
                body,
                author,
            });
            await new tag_controller_1.default(this.meetupModel, this.tagModel).createTagIfExists(tags, meetup.id);
            user.meetups.push(meetup.id);
            await user.save();
            res.status(201).json({ data: meetup }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async getAllMeetups(res) {
        try {
            const meetups = await this.meetupModel
                .find({})
                .populate('author', '_id username profileImage createdAt');
            return res.status(200).json({ data: meetups });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async getMeetup(req, res) {
        try {
            const meetup = await this.meetupModel
                .findById(req.query.id)
                .populate('author');
            if (!meetup)
                return res
                    .status(404)
                    .json({ message: 'Meetup not found', error: true });
            return res.status(200).json({ data: meetup, error: false });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message, error: true }).end();
            }
        }
    }
};
Meetup = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('MeetupModel')),
    __param(1, (0, typedi_1.Inject)('TagModel')),
    __param(2, (0, typedi_1.Inject)('UserModel')),
    __metadata("design:paramtypes", [Object, Object, Object])
], Meetup);
exports.default = Meetup;
//# sourceMappingURL=meetup.controller.js.map