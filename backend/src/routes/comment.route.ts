import { Router } from 'express';
import { Container } from 'typedi';

import CommentService from '../services/comment.service';
import commentModel from '../models/comment.model';
import postModel from '../models/post.model';
import userModel from '../models/user.model';

const router = Router();

Container.set('CommentModel', commentModel);
Container.set('PostModel', postModel);

const commentService = Container.get(CommentService);

router.get('/:id', (req, res) => commentService.getReplies(req, res));
router.post('/create', (req, res) => commentService.createComment(req, res));
router.post('/like', (req, res) => commentService.like(req, res));

export default router;
