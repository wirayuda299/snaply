import { Response, Request } from 'express';
import { Service } from 'typedi';

import GroupService from '../services/group.service';
import { RequestWithQuery } from '../types/group';

@Service()
export default class Group {
	constructor(private groupService: GroupService) {}

	create(req: Request, res: Response) {
		return this.groupService.createGroup(req, res);
	}

	getGroupById(req: RequestWithQuery<{ id: string }>, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'id is required', error: true });
		}
		return this.groupService.getGroup(req, res);
	}

	allGroups(res: Response) {
		return this.groupService.getAllGroups(res);
	}

	joinOrLeave(
		req: RequestWithQuery<{ groupId: string; userId: string }>,
		res: Response
	) {
		if (!req.query.userId || !req.query.groupId) {
			return res
				.status(400)
				.json({ message: 'Group ID and User ID are required' });
		}
		return this.groupService.joinOrLeaveGroup(req, res);
	}
	getAllGroupsWhereUserIn(req: Request, res: Response) {
		return this.groupService.getGroupsWhereUserIsAdminOrMember(req, res);
	}
}
