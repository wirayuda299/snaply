import { Request, Response } from 'express';
import type { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { userModelType } from '../models/user.model';
import { createError } from '../utils/createError';

export default class UserService {
	constructor(private userModel: userModelType) {}

	async createUser(req: Request, res: Response) {
		try {
			const { email, id, image, password, username } = req.body;
			bcrypt.hash(password, 10, async (err, hash) => {
				if (err) {
					return res
						.status(400)
						.json({ message: 'Failed to hash password', error: true });
				}

				await this.userModel.create({
					email,
					...(image && { profileImage: image }),
					_id: id,
					password: hash,
					username,
				});

				return res
					.status(201)
					.json({ message: 'User created', error: false })
					.end();
			});
		} catch (error) {
			createError(error, req, res, 'create-user');
		}
	}

	async getUser(req: Request, res: Response) {
		try {
			const user = await this.userModel
				.findById(req.query.id)
				.populate({
					path: 'posts',
					populate: [
						{
							path: 'author',
						},
						{
							path: 'tags',
						},
					],
				})
				.populate('groups')
				.populate('meetups')
				.populate({
					path: 'podcasts',
					populate: {
						path: 'author',
					},
				});

			if (!user)
				return res.status(404).json({ message: 'User not found', error: true });

			res.json({ data: user, error: false }).end();
		} catch (error) {
			createError(error, req, res, 'get-user');
		}
	}

	async updateGroupFields(id: string, field: string, groupId: Types.ObjectId) {
		try {
			const foundUser = await this.userModel.findById(id);
			if (!foundUser) throw new Error('User not found');

			foundUser[field as keyof typeof foundUser].push(groupId);
			await foundUser.save();
		} catch (error) {
			throw error;
		}
	}

	async handleFollow(req: Request, res: Response) {
		try {
			const { userId, followerId } = req.body;

			const user = await this.userModel.findById(userId);
			let follower = await this.userModel.findById(followerId);

			if (!user || !follower)
				return res
					.status(404)
					.json({ message: 'User not found', error: false });

			const followersIndex = user.followers.indexOf(followerId);

			if (followersIndex === -1) {
				user.followers.push(followerId);
				follower.followings.push(user._id);
			} else {
				user.followers.splice(followersIndex, 1);
				follower.followings = follower.followings.filter(
					(following) => following !== user._id.toString()
				);
			}
			await Promise.all([user.save(), follower.save()]);
			res.status(200).end();
		} catch (error) {
			createError(error, req, res, 'follow-user');
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await this.userModel
				.find({
					_id: {
						$ne: req.query.userId,
					},
				})
				.select('_id username profileImage createdAt');
			return res.json({ data: users, error: false });
		} catch (error) {
			createError(error, req, res, 'get-all-user');
		}
	}
}
