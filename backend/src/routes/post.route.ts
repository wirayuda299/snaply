import { Router } from "express";

import PostController from "../controllers/post.controller";
import postModel from "../models/post.model";
import tagModel from "../models/tag.model";
import userModel from "../models/user.model";
import groupModel from "../models/group.model";
import PostService from "../services/post.service";

const router = Router();

const service = new PostService(postModel, tagModel, userModel, groupModel);

const posts = new PostController(service);

router.post("/share", (req, res) => posts.share(req, res));
router.get("/related-posts", (req, res) => posts.relatedPosts(req, res));
router.post("/like", (req, res) => posts.like(req, res));
router.post("/increment-view", (req, res) => posts.updateView(req, res));
router.get("/all", (req, res) => posts.allPosts(req, res));
router.get("/", (req, res) => posts.getPostById(req, res));
router.post("/create", (req, res) => posts.create(req, res));

export default router;
