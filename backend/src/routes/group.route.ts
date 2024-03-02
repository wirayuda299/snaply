import { Router } from 'express';

import tagModel from '../models/tag.model';
import groupModel from '../models/group.model';
import {
	RequestBody,
	RequestBodyTypes,
	RequestWithQuery,
} from '../types/group';
import GroupController from '../controllers/group.controller';
import userModel from '../models/user.model';
import GroupService from '../services/group.service';

const router = Router();

const groupService = new GroupService(groupModel, tagModel, userModel);
const group = new GroupController(groupService);

router.post(
	'/join',
	(req: RequestWithQuery<{ groupId: string; userId: string }>, res) =>
		group.joinOrLeave(req, res)
);
router.get('/all', (_, res) => group.allGroups(res));
router.get('/', (req: RequestWithQuery<{ id: string }>, res) =>
	group.getGroupById(req, res)
);
router.get('/group-member', (req, res) =>
	group.getAllGroupsWhereUserIn(req, res)
);
router.post('/create', (req, res) => group.create(req, res));
router.post(
	'/update',
	(req: RequestBody<RequestBodyTypes & { groupId: string }>, res) =>
		group.update(req, res)
);
router.patch('/delete', (req, res) => group.delete(req, res));

export default router;
