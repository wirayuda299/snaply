import { Router } from 'express';
import Container from 'typedi';

import UserService from '../services/user.service';
import userModel from '../models/user.model';
import Middleware from "../middleware/middleware";

const router = Router();

Container.set('UserModel', userModel);
const userService = Container.get(UserService);

router.post('/create', (req, res) => userService.createUser(req, res));
router.get('/', Middleware.validate, (req, res) => userService.getUserById(req, res));

export default router;
