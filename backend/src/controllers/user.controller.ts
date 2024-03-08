import { Request, Response } from 'express';

import UserService from '../services/user.service';

export default class User {
	private userService: UserService;

	constructor(_userService: UserService) {
		this.userService = _userService;
	}

	create(req: Request, res: Response) {
		const { email, id, password } = req.body;
		if (!email || !id || !password) {
			return res
				.status(400)
				.json({
					message: 'Email,user id, username and password are required',
					error: true,
				})
				.end();
		}
		return this.userService.createUser(req, res);
	}

	getUserById(req: Request, res: Response) {
		if (!req.query.id) {
			return res.status(400).json({ message: 'id is required', error: true });
		}
		return this.userService.getUser(req, res);
	}

	followUser(req: Request, res: Response) {
		return this.userService.handleFollow(req, res);
	}

	listAllUsers(req: Request, res: Response) {
		return this.userService.getAllUsers(req, res);
	}
}
