import { Router } from 'express';
import TagController from '../controllers/tag.controller';
import TagService from '../services/tag.service';
import postModel from '../models/post.model';
import TagModel from '../models/tag.model';

const router = Router();
const service = new TagService(postModel, TagModel);
const tag = new TagController(service);

router.get('/all-tags', (req, res) => tag.getAllTags(res));
export default router;
