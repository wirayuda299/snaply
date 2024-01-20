"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const post_service_1 = __importDefault(require("../services/post.service"));
const post_model_1 = __importDefault(require("../models/post.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
typedi_1.default.set('PostModel', post_model_1.default);
typedi_1.default.set('TagModel', tag_model_1.default);
typedi_1.default.set('UserModel', user_model_1.default);
const posts = typedi_1.default.get(post_service_1.default);
router.get('/share', (req, res) => posts.share(req, res));
router.get('/related-posts', (req, res) => posts.relatedPosts(req, res));
router.post('/like', (req, res) => posts.like(req, res));
router.post('/increment-view', (req, res) => posts.updateView(req, res));
router.get('/all', (req, res) => posts.allPosts(req, res));
router.get('/', (req, res) => posts.getPostById(req, res));
router.post('/create', (req, res) => posts.create(req, res));
exports.default = router;
//# sourceMappingURL=post.route.js.map