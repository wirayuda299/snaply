import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import type { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { userModelType } from '../models/user.model';

@Service()
export default class User {
	constructor(@Inject('UserModel') private userModel: userModelType) {}

	async createUser(req: Request, res: Response) {
		try {
			const { email, id, image, password, username } = req.body;

			if (!email || !id || !password) {
				return res
					.status(400)
					.json({
						message: 'Email,user id, username and password are required',
						error: true,
					})
					.end();
			}
			bcrypt.hash(password, 10, async (err, hash) => {
				await this.userModel.create({
					email,
					...(image && { profileImage: image }),
					_id: id,
					password: hash,
					username,
				});
				return res.status(201).json({ message: 'User created' }).end();
			});
		} catch (error) {
			console.error('Error creating user:', error);
			return res.status(500).send('Internal Server Error').end();
		}
	}

	async getUser(req: Request, res: Response) {
		try {
			const user = await this.userModel
				.findById(req.query.id)
				.populate('posts')
				.populate('groups');

			res.json({ data: user }).end();
		} catch (error) {
			res.json(error).end();
		}
	}

	async updateGroupFields(id: string, field: string, groupId: Types.ObjectId) {
		try {
			const foundUser = await this.userModel.findById(id);
			if (!foundUser) return;
			// @ts-ignore
			foundUser[`${field}`].push(groupId);
			await foundUser.save();
		} catch (error) {
			throw error;
		}
	}
}
