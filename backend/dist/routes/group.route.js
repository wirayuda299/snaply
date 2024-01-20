"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __importDefault(require("typedi"));
const express_1 = require("express");
const post_model_1 = __importDefault(require("../models/post.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const group_model_1 = __importDefault(require("../models/group.model"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const group_service_1 = __importDefault(require("../services/group.service"));
const router = (0, express_1.Router)();
typedi_1.default.set('PostModel', post_model_1.default);
typedi_1.default.set('Model', tag_model_1.default);
typedi_1.default.set('GroupModel', group_model_1.default);
typedi_1.default.set('UserController', user_controller_1.default);
const group = typedi_1.default.get(group_service_1.default);
router.post('/join', (req, res) => group.joinOrLeave(req, res));
router.get('/all', (_, res) => group.allGroups(res));
router.get('/', (req, res) => group.getGroupById(req, res));
router.post('/create', (req, res) => group.create(req, res));
exports.default = router;
//# sourceMappingURL=group.route.js.map