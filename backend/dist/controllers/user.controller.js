"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const bcrypt_1 = __importDefault(require("bcrypt"));
let User = class User {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(req, res) {
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
            bcrypt_1.default.hash(password, 10, async (err, hash) => {
                await this.userModel.create({
                    email,
                    ...(image && { profileImage: image }),
                    _id: id,
                    password: hash,
                    username,
                });
                return res.status(201).json({ message: 'User created' }).end();
            });
        }
        catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).send('Internal Server Error').end();
        }
    }
    async getUser(req, res) {
        try {
            const user = await this.userModel
                .findById(req.query.id)
                .populate('posts')
                .populate('groups');
            res.json({ data: user }).end();
        }
        catch (error) {
            res.json(error).end();
        }
    }
    async updateGroupFields(id, field, groupId) {
        try {
            const foundUser = await this.userModel.findById(id);
            if (!foundUser)
                return;
            // @ts-ignore
            foundUser[`${field}`].push(groupId);
            await foundUser.save();
        }
        catch (error) {
            throw error;
        }
    }
};
User = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('UserModel')),
    __metadata("design:paramtypes", [Object])
], User);
exports.default = User;
//# sourceMappingURL=user.controller.js.map