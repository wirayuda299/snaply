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
const user_controller_1 = __importDefault(require("./user.controller"));
// TODO: add validation to user session
let Group = class Group {
    groupModel;
    tagModel;
    userController;
    constructor(groupModel, tagModel, userController) {
        this.groupModel = groupModel;
        this.tagModel = tagModel;
        this.userController = userController;
    }
    isAdmin(admins, members) {
        return admins.findIndex((admin) => members.includes(admin));
    }
    async createTagsForGroup(tags, groupId) {
        await new tag_controller_1.default(this.groupModel, this.tagModel).createTagIfExists(tags, groupId);
    }
    async populateGroupFieldWithUsers(users, field, groupId) {
        for (const user of users) {
            await this.groupModel.findByIdAndUpdate(groupId, {
                $push: { [field]: user },
            });
            if (field === 'members') {
                await this.userController.updateGroupFields(user, 'groupMembers', groupId);
            }
            else {
                await this.userController.updateGroupFields(user, 'groups', groupId);
            }
        }
    }
    async createGroup(req, res) {
        try {
            const { admins, tags, members, banner, description, logo, name } = req.body;
            if (this.isAdmin(admins, members) !== -1) {
                return res.status(400).json({
                    message: 'The user cannot be both a regular member and an admin simultaneously.',
                });
            }
            const group = await this.groupModel.create({
                banner,
                description,
                logo,
                name,
            });
            if (tags && tags.length >= 1) {
                await this.createTagsForGroup(tags, group.id);
            }
            await Promise.all([
                this.populateGroupFieldWithUsers(admins, 'admins', group._id),
                this.populateGroupFieldWithUsers(members, 'members', group._id),
            ]);
            res.status(201).json({ message: 'Group has been created' }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async getGroup(req, res) {
        try {
            const foundGroup = await this.groupModel
                .findById(req.query.id)
                .populate('admins')
                .populate('members');
            if (!foundGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }
            return res.status(200).json({ data: foundGroup });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllGroups(res) {
        try {
            const foundGroup = await this.groupModel
                .find({})
                .populate('admins')
                .populate('members');
            return res.status(200).json({ data: foundGroup });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async joinOrLeaveGroup(req, res) {
        try {
            if (!req.query.userId || !req.query.groupId) {
                return res
                    .status(400)
                    .json({ message: 'Group ID and User ID are required' });
            }
            const group = await this.groupModel.findById(req.query.groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' }).end();
            }
            const memberIndex = group.members.indexOf(req.query.userId);
            if (memberIndex !== -1) {
                group.members.splice(memberIndex, 1);
            }
            else {
                group.members.push(req.query.userId);
            }
            await group.save();
            res.status(200).json({ data: group }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
};
Group = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('GroupModel')),
    __param(1, (0, typedi_1.Inject)('TagModel')),
    __param(2, (0, typedi_1.Inject)(() => user_controller_1.default)),
    __metadata("design:paramtypes", [Object, Object, user_controller_1.default])
], Group);
exports.default = Group;
//# sourceMappingURL=group.controller.js.map