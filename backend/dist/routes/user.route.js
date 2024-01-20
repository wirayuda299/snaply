"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const user_service_1 = __importDefault(require("../services/user.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const middleware_1 = __importDefault(require("../middleware/middleware"));
const router = (0, express_1.Router)();
typedi_1.default.set('UserModel', user_model_1.default);
const userService = typedi_1.default.get(user_service_1.default);
router.post('/create', (req, res) => userService.createUser(req, res));
router.get('/', middleware_1.default.validate, (req, res) => userService.getUserById(req, res));
exports.default = router;
//# sourceMappingURL=user.route.js.map