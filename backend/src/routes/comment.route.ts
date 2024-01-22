import { Router } from 'express';
import { Container } from 'typedi';

import CommentController from '../controllers/comment.controller';
import commentModel from '../models/comment.model';
import postModel from '../models/post.model';

const router = Router();

Container.set('CommentModel', commentModel);
Container.set('PostModel', postModel);

const commentController = Container.get(CommentController);

router.get('/:id', (req, res) => commentController.getReplies(req, res));
router.post('/create', (req, res) => commentController.createComment(req, res));
router.post('/like', (req, res) => commentController.like(req, res));

export default router;
