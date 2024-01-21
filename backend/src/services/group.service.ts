import { Request, Response } from 'express';

import { Service } from 'typedi';
import Group from '../controllers/group.controller';
import { RequestBody, RequestWithQuery } from '../types/group';

@Service()
export default class GroupService {
	constructor(private groupModel: Group) {}

	create(req: Request, res: Response) {
		return this.groupModel.createGroup(req, res);
	}

	getGroupById(req: RequestWithQuery<{ id: string }>, res: Response) {
		return this.groupModel.getGroup(req, res);
	}

	allGroups(res: Response) {
		return this.groupModel.getAllGroups(res);
	}

	joinOrLeave(
		req: RequestWithQuery<{ groupId: string; userId: string }>,
		res: Response
	) {
		return this.groupModel.joinOrLeaveGroup(req, res);
	}
	getAllGroupsWhereUserIn(req: Request, res: Response) {
		return this.groupModel.getGroupsWhereUserIsAdminOrMember(req, res);
	}
}
