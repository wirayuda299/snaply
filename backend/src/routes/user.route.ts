import { Router } from 'express';

import Middleware from '../middleware/middleware';
import userModel from '../models/user.model';
import UserService from '../services/user.service';
import UserController from '../controllers/user.controller';

const router = Router();
const service = new UserService(userModel);
const userController = new UserController(service);

router.post('/create', (req, res) => userController.create(req, res));
router.get('/', Middleware.validate, (req, res) =>
	userController.getUserById(req, res)
);
router.get('/all-users', (req, res) => userController.listAllUsers(req, res));

router.post('/follow', Middleware.validate, (req, res) =>
	userController.followUser(req, res)
);

export default router;
