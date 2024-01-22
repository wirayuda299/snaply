import { Router } from 'express';
import Container from 'typedi';

import UserController from '../controllers/user.controller';
import userModel from '../models/user.model';
import Middleware from '../middleware/middleware';

const router = Router();

Container.set('UserModel', userModel);
const userController = Container.get(UserController);

router.post('/create', (req, res) => userController.create(req, res));
router.get('/', Middleware.validate, (req, res) =>
	userController.getUserById(req, res)
);

export default router;
