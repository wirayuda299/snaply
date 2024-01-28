import { Router } from "express";

import UserController from "../controllers/user.controller";
import userModel from "../models/user.model";
import Middleware from "../middleware/middleware";
import UserService from "../services/user.service";

const router = Router();
const service = new UserService(userModel);
const userController = new UserController(service);

router.post("/create", (req, res) => userController.create(req, res));
router.get("/", Middleware.validate, (req, res) =>
  userController.getUserById(req, res),
);

export default router;
