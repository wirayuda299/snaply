import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { Types } from 'mongoose';

import Tag from './tag.controller';
import { groupModelType } from '../models/group.model';
import { TagModel } from '../models/tag.model';
import User from './user.controller';
import {
	RequestBody,
	RequestBodyTypes,
	RequestWithQuery,
} from '../types/group';

// TODO: add validation to user session

@Service()
export default class Group {
	constructor(
		@Inject('GroupModel') private groupModel: groupModelType,
		@Inject('TagModel') private tagModel: TagModel,
		@Inject(() => User) private userController: User
	) {}

	private isAdmin(admins: string[], members: string[]) {
		return admins.findIndex((admin) => members.includes(admin));
	}

	private async createTagsForGroup(tags: string[], groupId: string) {
		await new Tag(this.groupModel, this.tagModel).createTagIfExists(
			tags,
			groupId
		);
	}

	private async populateGroupFieldWithUsers(
		users: string[],
		field: string,
		groupId: Types.ObjectId
	) {
		for (const user of users) {
			await this.groupModel.findByIdAndUpdate(groupId, {
				$push: { [field]: user },
			});

			if (field === 'members') {
				await this.userController.updateGroupFields(
					user,
					'groupMembers',
					groupId
				);
			} else {
				await this.userController.updateGroupFields(user, 'groups', groupId);
			}
		}
	}

	async createGroup(req: RequestBody<RequestBodyTypes>, res: Response) {
		try {
			const { admins, tags, members, banner, description, logo, name } =
				req.body;

			if (this.isAdmin(admins, members) !== -1) {
				return res.status(400).json({
					message:
						'The user cannot be both a regular member and an admin simultaneously.',
				});
			}

			const group = await this.groupModel.create({
				banner,
				description,
				logo,
				name,
			});

			if (tags && tags.length >= 1) {
				await this.createTagsForGroup(tags, group.id);
			}

			await Promise.all([
				this.populateGroupFieldWithUsers(admins, 'admins', group._id),
				this.populateGroupFieldWithUsers(members, 'members', group._id),
			]);

			res.status(201).json({ message: 'Group has been created' }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
			}
		}
	}

	async getGroup(req: RequestWithQuery<{ id: string }>, res: Response) {
		try {
			const foundGroup = await this.groupModel
				.findById(req.query.id)
				.populate('admins')
				.populate('members');

			if (!foundGroup) {
				return res.status(404).json({ message: 'Group not found' });
			}

			return res.status(200).json({ data: foundGroup });
		} catch (error) {
			throw error;
		}
	}

	async getAllGroups(res: Response) {
		try {
			const foundGroup = await this.groupModel
				.find({})
				.populate('admins')
				.populate('members');

			return res.status(200).json({ data: foundGroup });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
			}
		}
	}

	async joinOrLeaveGroup(
		req: RequestWithQuery<{
			groupId: string;
			userId: string;
		}>,
		res: Response
	) {
		try {
			if (!req.query.userId || !req.query.groupId) {
				return res
					.status(400)
					.json({ message: 'Group ID and User ID are required' });
			}

			const group = await this.groupModel.findById(req.query.groupId);
			if (!group) {
				return res.status(404).json({ message: 'Group not found' }).end();
			}

			const memberIndex = group.members.indexOf(
				req.query.userId as unknown as Types.ObjectId
			);
			if (memberIndex !== -1) {
				group.members.splice(memberIndex, 1);
			} else {
				group.members.push(req.query.userId as unknown as Types.ObjectId);
			}
			await group.save();
			res.status(200).json({ data: group }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message }).end();
			}
		}
	}
}
