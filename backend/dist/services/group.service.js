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
const group_controller_1 = __importDefault(require("../controllers/group.controller"));
let GroupService = class GroupService {
    groupModel;
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    create(req, res) {
        return this.groupModel.createGroup(req, res);
    }
    getGroupById(req, res) {
        return this.groupModel.getGroup(req, res);
    }
    allGroups(res) {
        return this.groupModel.getAllGroups(res);
    }
    joinOrLeave(req, res) {
        return this.groupModel.joinOrLeaveGroup(req, res);
    }
};
GroupService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [group_controller_1.default])
], GroupService);
exports.default = GroupService;
//# sourceMappingURL=group.service.js.map