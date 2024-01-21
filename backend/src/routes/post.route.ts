import { Router } from 'express';
import Container from 'typedi';

import PostService from '../services/post.service';
import postModel from '../models/post.model';
import tagModel from '../models/tag.model';
import userModel from '../models/user.model';
import groupModel from '../models/group.model';

const router = Router();
Container.set('PostModel', postModel);
Container.set('TagModel', tagModel);
Container.set('UserModel', userModel);
Container.set('GroupModel', groupModel);

const posts = Container.get(PostService);

router.get('/share', (req, res) => posts.share(req, res));
router.get('/related-posts', (req, res) => posts.relatedPosts(req, res));
router.post('/like', (req, res) => posts.like(req, res));
router.post('/increment-view', (req, res) => posts.updateView(req, res));
router.get('/all', (req, res) => posts.allPosts(req, res));
router.get('/', (req, res) => posts.getPostById(req, res));
router.post('/create', (req, res) => posts.create(req, res));

export default router;
