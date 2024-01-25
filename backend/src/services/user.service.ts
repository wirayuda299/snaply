import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';

import type { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { userModelType } from '../models/user.model';
import UserCountry from '../utils/userCountry';

@Service()
export default class UserService {
	constructor(@Inject('UserModel') private userModel: userModelType) {}

	async createUser(req: Request, res: Response) {
		try {
			const { email, id, image, password, username } = req.body;

			const country = await UserCountry.getUserCountry();

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
					// @ts-ignore
					country: country.country_name,
					// @ts-ignore
					region: country.region,
				});

				return res
					.status(201)
					.json({ message: 'User created', error: false })
					.end();
			});
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
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
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true }).end();
			}
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
}
