import { Request, Response } from 'express';
import type { Types } from 'mongoose';

import {
	RequestBody,
	RequestBodyTypes,
	RequestWithQuery,
} from '../types/group';

import Tag from '../services/tag.service';
import UserService from '../services/user.service';
import { TagModel } from '../models/tag.model';
import { userModelType } from '../models/user.model';
import { groupModelType } from '../models/group.model';

export default class GroupService {
	groupModel;
	tagModel;
	userModel;

	constructor(
		groupModel: groupModelType,
		tagModel: TagModel,
		userModel: userModelType
	) {
		this.groupModel = groupModel;
		this.tagModel = tagModel;
		this.userModel = userModel;
	}

	isAdmin(admins: string[], members: string[]) {
		return admins.findIndex((admin) => members.includes(admin));
	}

	async createTagsForGroup(tags: string[], groupId: string) {
		await new Tag(this.groupModel, this.tagModel).createTagIfExists(
			tags,
			groupId
		);
	}

	async populateGroupFieldWithUsers(
		users: string[],
		field: string,
		groupId: Types.ObjectId
	) {
		for (const user of users) {
			await this.groupModel.findByIdAndUpdate(groupId, {
				$push: { [field]: user },
			});
			const userService = new UserService(this.userModel);
			if (field === 'members') {
				await userService.updateGroupFields(user, 'groupMembers', groupId);
			} else {
				await userService.updateGroupFields(user, 'groups', groupId);
			}
		}
	}

	async createGroup(req: RequestBody<RequestBodyTypes>, res: Response) {
		try {
			const {
				admins,
				tags,
				members,
				banner,
				description,
				logo,
				name,
				bannerAssetId,
				logoAssetId,
				category,
			} = req.body;

			if (this.isAdmin(admins, members) !== -1) {
				return res.status(400).json({
					message:
						'The user cannot be both a regular member and an admin simultaneously.',
					error: true,
				});
			}

			const group = await this.groupModel.create({
				banner,
				description,
				logo,
				name,
				bannerAssetId,
				logoAssetId,
				category,
			});

			await this.userModel.findByIdAndUpdate(admins[0], {
				$inc: {
					points: 5,
				},
			});

			if (tags && tags.length >= 1) {
				await this.createTagsForGroup(tags, group.id);
			}

			await Promise.all([
				this.populateGroupFieldWithUsers(admins, 'admins', group._id),
				this.populateGroupFieldWithUsers(members, 'members', group._id),
			]);

			if (tags && tags.length >= 1) {
				await new Tag<typeof this.groupModel>(
					this.groupModel,
					this.tagModel
				).createTagIfExists(tags, group.id);
			}

			res
				.status(201)
				.json({ message: 'Group has been created', error: false })
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getGroup(req: RequestWithQuery<{ id: string }>, res: Response) {
		try {
			const foundGroup = await this.groupModel
				.findById(req.query.id)
				.populate({
					path: 'posts',
					model: 'Post',
					populate: [
						{
							path: 'author',
							model: 'User',
							select: 'username _id profileImage',
						},
						{ path: 'group', model: 'Group' },
						{ path: 'tags', model: 'Tag' },
					],
				})
				.populate('admins', '_id username profileImage')
				.populate('members', '_id username profileImage');

			if (!foundGroup) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true });
			}
			res.setHeader('Cache-Control', 'public, max-age=3600');
			return res.json({ data: foundGroup, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getAllGroups(res: Response) {
		try {
			const foundGroup = await this.groupModel
				.find({})
				.populate('admins', 'username _id profileImage')
				.populate('members', 'username _id profileImage')
				.populate('tags')
				.populate({
					path: 'posts',
					populate: [
						{ path: 'author', model: 'User' },
						{ path: 'group', model: 'Group' },
					],
				});
			res.setHeader('Cache-Control', 'public, max-age=3600');
			return res.status(200).json({ data: foundGroup, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
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
			const group = await this.groupModel.findById(req.query.groupId);
			if (!group) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true })
					.end();
			}

			const memberIndex = group.members.indexOf(req.query.userId);
			if (memberIndex !== -1) {
				group.members.splice(memberIndex, 1);
			} else {
				group.members.push(req.query.userId);
			}
			await group.save();
			res.status(200).json({ data: group, error: false }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}

	async getGroupsWhereUserIsAdminOrMember(req: Request, res: Response) {
		try {
			const groups = await this.groupModel
				.find({
					$or: [
						{
							admins: {
								$in: [req.query.admins],
							},
						},
						{
							members: {
								$in: [req.query.members],
							},
						},
					],
				})
				.populate('admins', 'username');
			return res.json({ data: groups, error: false });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
		}
	}
}
