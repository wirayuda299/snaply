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
import { createError } from '../utils/createError';
import FileUploadService from './fileUpload.service';
import { RedisService } from './redis.service';

const redis = new RedisService();

export default class GroupService {
	constructor(
		private groupModel: groupModelType,
		private tagModel: TagModel,
		private userModel: userModelType
	) {}

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
			await redis.clearCache('groups');
			res
				.status(201)
				.json({ message: 'Group has been created', error: false })
				.end();
		} catch (error) {
			// @ts-ignore
			createError(error, req, res, 'create-group');
		}
	}

	async getGroup(req: RequestWithQuery<{ id: string }>, res: Response) {
		try {
			const foundGroup = await redis.getOrCacheData(
				`group:${req.query.id}`,
				async () => {
					return await this.groupModel
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
						.populate('members', '_id username profileImage')
						.populate('tags');
				},
				res
			);

			if (!foundGroup) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true });
			}
			return res.json({ data: foundGroup, error: false });
		} catch (error) {
			// @ts-ignore
			createError(error, req, res, 'get-group-by-id');
		}
	}

	async getAllGroups(res: Response) {
		try {
			const foundGroup = await new RedisService().getOrCacheData(
				'groups',
				async () => {
					return await this.groupModel
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
				},
				res
			);
			return res.status(200).json({ data: foundGroup, error: false });
		} catch (error) {
			// @ts-ignore
			createError(error, req, res, 'getAllGroups');
		}
	}

	async joinGroup(req: Request, res: Response) {
		try {
			const { groupId, userId } = req.body;
			const group = await this.groupModel.findById(groupId);
			if (!group) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true })
					.end();
			}
			const memberIndex = group.members.indexOf(userId);
			if (memberIndex !== -1) {
				return res
					.status(400)
					.json({ message: 'You already member of this group' });
			} else {
				group.members.push(userId);
			}
			await group.save();
			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'join-group');
		}
	}

	async leaveGroup(req: Request, res: Response) {
		try {
			const { groupId, userId } = req.body;

			const group = await this.groupModel.findById(groupId);
			if (!group) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true })
					.end();
			}

			const memberIndex = group.members.indexOf(userId);
			if (memberIndex !== -1) {
				group.members.splice(memberIndex, 1);
			} else {
				return res
					.status(400)
					.json({ message: 'You are not member of this group' });
			}
			await group.save();
			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'leave -group');
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
			createError(error, req, res, 'get-all-group-where-user-join');
		}
	}

	async deleteGroup(req: Request, res: Response) {
		try {
			const foundGroup = await this.groupModel.findById(req.body.groupId);
			if (!foundGroup) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true });
			}

			if (foundGroup.admins) {
				const groupAdmin = await this.userModel.findById(foundGroup.admins[0]);
				if (!groupAdmin) {
					return res
						.status(404)
						.json({ message: 'Admin not found', error: true });
				}
				const updatedGroups = groupAdmin.groups.filter(
					(group) => group !== foundGroup._id
				);
				await this.userModel.updateOne(
					{ _id: groupAdmin._id },
					{ $set: { updatedGroups } }
				);
				await groupAdmin.save();
			}

			const fileUploadService = new FileUploadService();
			await Promise.all([
				fileUploadService.deleteAsset(foundGroup.bannerAssetId, res),
				fileUploadService.deleteAsset(foundGroup.logoAssetId, res),
			]);

			await new Tag<typeof this.groupModel>(
				this.groupModel,
				this.tagModel
			).deleteTag(foundGroup.tags, foundGroup._id);

			await this.groupModel.deleteOne({ _id: foundGroup._id });
			await redis.clearCache('groups');
			res.status(201).end();
		} catch (error) {
			createError(error, req, res, 'delete-group');
		}
	}

	async updateGroup(
		req: RequestBody<RequestBodyTypes & { groupId: string }>,
		res: Response
	) {
		try {
			const {
				groupId,
				admins,
				tags,
				members,
				banner,
				description,
				logo,
				name,
				category,
				bannerAssetId,
				logoAssetId,
			} = req.body;

			const group = await this.groupModel.findById(groupId);

			if (!group) {
				return res
					.status(404)
					.json({ message: 'Group not found', error: true });
			}

			if (this.isAdmin(admins, members) !== -1) {
				return res.status(400).json({
					message:
						'The user cannot be both a regular member and an admin simultaneously.',
					error: true,
				});
			}

			const fileUploadService = new FileUploadService();

			if (bannerAssetId !== group.bannerAssetId) {
				await fileUploadService.deleteAsset(group.bannerAssetId, res);
			}

			if (logoAssetId !== group.logoAssetId) {
				await fileUploadService.deleteAsset(group.logoAssetId, res);
			}

			if (tags && tags.length >= 1) {
				await this.createTagsForGroup(tags, group.id);
			}

			await this.groupModel.updateOne(
				{ _id: group._id },
				{
					banner,
					description,
					logo,
					name,
					category,
				}
			);
			await redis.clearCache('groups');
			res.status(201).end();
		} catch (error) {
			// @ts-ignore
			createError(error, req, res, 'update-group');
		}
	}
}
