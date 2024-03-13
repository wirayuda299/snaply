import { Response, Request } from 'express';

import GroupService from '../services/group.service';
import {
	RequestBody,
	RequestBodyTypes,
	RequestWithQuery,
} from '../types/group';

export default class Group {
	constructor(private groupService: GroupService) {}

	create(req: Request, res: Response) {
		const {
			admins,
			tags,
			banner,
			description,
			logo,
			name,
			bannerAssetId,
			logoAssetId,
			category,
		} = req.body;

		if (
			admins.length < 1 ||
			tags.length < 1 ||
			!banner ||
			!description ||
			!logo ||
			!name ||
			!bannerAssetId ||
			!logoAssetId ||
			!category
		) {
			return res
				.status(400)
				.json({ message: 'Please provide all required value' });
		}

		return this.groupService.createGroup(req, res);
	}

	getGroupById(req: RequestWithQuery<{ id: string }>, res: Response) {
		if (!req.query.id) {
			return res
				.status(400)
				.json({ message: 'Group ID is required', error: true });
		}
		return this.groupService.getGroup(req, res);
	}

	allGroups(res: Response) {
		return this.groupService.getAllGroups(res);
	}

	join(req: Request, res: Response) {
		const { groupId, userId } = req.body;

		if (!groupId || !userId) {
			return res
				.status(400)
				.json({ message: 'Group ID and User ID are required' });
		}
		return this.groupService.joinGroup(req, res);
	}

	leave(req: Request, res: Response) {
		const { groupId, userId } = req.body;

		if (!groupId || !userId) {
			return res
				.status(400)
				.json({ message: 'Group ID and User ID are required' });
		}

		return this.groupService.leaveGroup(req, res);
	}

	getAllGroupsWhereUserIn(req: Request, res: Response) {
		const { members, admins } = req.query;
		// @ts-ignore
		if (members?.length < 1 && admins?.length < 1) {
			return res.status(400).json({ message: 'admins and members is empty' });
		}
		return this.groupService.getGroupsWhereUserIsAdminOrMember(req, res);
	}

	delete(req: Request, res: Response) {
		const { groupId } = req.body;
		if (groupId) {
			return res.status(400).json({ message: 'Group ID is required' });
		}
		return this.groupService.deleteGroup(req, res);
	}

	update(
		req: RequestBody<RequestBodyTypes & { groupId: string }>,
		res: Response
	) {
		const { groupId } = req.body;
		if (groupId) {
			return res.status(400).json({ message: 'Group ID is required' });
		}
		return this.groupService.updateGroup(req, res);
	}
}
