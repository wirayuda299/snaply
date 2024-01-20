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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const meetup_controller_1 = __importDefault(require("../controllers/meetup.controller"));
let MeetupService = class MeetupService {
    meetup;
    constructor(meetup) {
        this.meetup = meetup;
    }
    create(req, res) {
        return this.meetup.createMeetup(req, res);
    }
    allMeetups(res) {
        return this.meetup.getAllMeetups(res);
    }
    getMeetupById(req, res) {
        return this.meetup.getMeetup(req, res);
    }
};
MeetupService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [meetup_controller_1.default])
], MeetupService);
exports.default = MeetupService;
//# sourceMappingURL=meetup.service.js.map