"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const comment_service_1 = __importDefault(require("../services/comment.service"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const router = (0, express_1.Router)();
typedi_1.Container.set('CommentModel', comment_model_1.default);
typedi_1.Container.set('PostModel', post_model_1.default);
const commentService = typedi_1.Container.get(comment_service_1.default);
router.get('/:id', (req, res) => commentService.getReplies(req, res));
router.post('/create', (req, res) => commentService.createComment(req, res));
router.post('/like', (req, res) => commentService.like(req, res));
exports.default = router;
//# sourceMappingURL=comment.route.js.map