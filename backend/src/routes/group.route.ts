import Container from 'typedi';
import { Router } from 'express';

import postModel from '../models/post.model';
import tagModel from '../models/tag.model';
import groupModel from '../models/group.model';
import User from '../controllers/user.controller';
import { RequestWithQuery } from '../types/group';
import GroupService from '../services/group.service';

const router = Router();
Container.set('PostModel', postModel);
Container.set('Model', tagModel);
Container.set('GroupModel', groupModel);
Container.set('UserController', User);

const group = Container.get(GroupService);

router.post(
	'/join',
	(req: RequestWithQuery<{ groupId: string; userId: string }>, res) =>
		group.joinOrLeave(req, res)
);
router.get('/all', (_, res) => group.allGroups(res));
router.get('/', (req: RequestWithQuery<{ id: string }>, res) =>
	group.getGroupById(req, res)
);
router.post('/create', (req, res) => group.create(req, res));

export default router;
