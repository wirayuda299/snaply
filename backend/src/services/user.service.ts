import { Service } from 'typedi';
import { Request, Response } from 'express';

import User from '../controllers/user.controller';

@Service()
export default class UserService {

	constructor(private _userController: User) {}

	createUser(req: Request, res: Response) {
		return this._userController.createUser(req, res);
	}

	getUserById(req: Request, res: Response) {
		return this._userController.getUser(req, res);
	}
}
