import { Router } from "express";

import CommentController from "../controllers/comment.controller";
import commentModel from "../models/comment.model";
import postModel from "../models/post.model";
import CommentService from "../services/comment.service";

const router = Router();

const commentService = new CommentService(commentModel, postModel);
const commentController = new CommentController(commentService);

router.get("/:id", (req, res) => commentController.getReplies(req, res));
router.post("/create", (req, res) => commentController.createComment(req, res));
router.post("/like", (req, res) => commentController.like(req, res));

export default router;
