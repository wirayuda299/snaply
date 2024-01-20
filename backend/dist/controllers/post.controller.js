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
const tag_controller_1 = __importDefault(require("./tag.controller"));
const userCountry_1 = __importDefault(require("../utils/userCountry"));
let PostController = class PostController {
    PostModel;
    tagModel;
    userModel;
    constructor(PostModel, tagModel, userModel) {
        this.PostModel = PostModel;
        this.tagModel = tagModel;
        this.userModel = userModel;
    }
    async createPost(req, res) {
        try {
            const { title, body, image, author, tags, group } = req.body;
            const user = await this.userModel.findById(author);
            if (!user)
                return res
                    .status(404)
                    .json({ message: 'User not found', error: true })
                    .end();
            const country = await userCountry_1.default.getUserCountry();
            const post = await this.PostModel.create({
                title,
                body,
                image,
                author: user,
                // @ts-ignore
                country: country.country_name,
                ...(group && { groupId: group }),
            });
            user?.posts.push(post.id);
            await user?.save();
            if (tags && tags.length >= 1) {
                await new tag_controller_1.default(this.PostModel, this.tagModel).createTagIfExists(tags, post.id);
            }
            res.status(201).json({ message: 'Post has been created' }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async getPost(req, res) {
        try {
            const post = await this.PostModel.find({ _id: req.query.id })
                .populate('author', 'username profileImage createdAt')
                .populate('tags')
                .populate({
                path: 'comments',
                match: {
                    // to match where parentId field doesn't exist
                    parentId: {
                        $exists: false,
                    },
                },
                populate: {
                    path: 'author',
                    select: {
                        _id: 1,
                        username: 1,
                        profileImage: 1,
                    },
                },
            });
            if (!post)
                return res.status(404).json({ message: 'Post not found' });
            res.json({ data: post, error: false }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({ message: error.message, error: true }).end();
            }
        }
    }
    async getAllPosts(sort, page = 1, pageSize = 10, res) {
        try {
            let sortOptions = {};
            if (sort === 'newest') {
                sortOptions = { createdAt: -1 };
            }
            else if (sort === 'popular') {
                sortOptions = { createdAt: 1 };
            }
            const [totalPosts, allPosts] = await Promise.all([
                this.PostModel.countDocuments(),
                this.PostModel.find()
                    .populate('author', 'username profileImage createdAt')
                    .populate('tags')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .sort(sortOptions),
            ]);
            res.status(200).json({ error: false, data: allPosts, totalPosts }).end();
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(500).json({ message: e.message, error: true }).end();
            }
        }
    }
    async incremementView(req, res) {
        try {
            const { postId } = req.body;
            if (!postId) {
                return res.status(400).json({ message: 'Post Id is required' });
            }
            const post = this.PostModel.findById(postId);
            if (!post)
                return res.status(404).json({ message: 'Post not found', error: true });
            await this.PostModel.findByIdAndUpdate(postId, {
                $inc: {
                    views: 1,
                },
            });
            res.status(200).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }).end();
            }
        }
    }
    async likePost(req, res) {
        const { postId, userId } = req.body;
        try {
            const [post, user] = await Promise.all([
                this.PostModel.findById(postId),
                this.userModel.findById(userId),
            ]);
            if (!user || !post) {
                return res.status(404).json({ message: 'User or Post not found' });
            }
            const index = post.likes.indexOf(user.id);
            if (index !== -1) {
                post.likes.splice(index, 1);
            }
            else {
                post.likes.push(user.id);
            }
            await post.save();
            res.status(200).end();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' }).end();
        }
    }
    async getRelatedPosts(req, res) {
        const { id, authorId } = req.query;
        try {
            if (!id || !authorId) {
                return res
                    .status(400)
                    .json({ message: 'id and author id are required' });
            }
            const posts = await this.PostModel.find({
                author: authorId,
            }).populate('tags');
            res
                .status(200)
                .json(posts.filter((post) => post._id.toString() !== id))
                .end();
        }
        catch (error) {
            res.status(500).json(error).end();
        }
    }
    // TODO: fix share field not increment by 1
    async sharePost(req, res) {
        try {
            const { postId } = req.query;
            if (!postId) {
                return res.status(400).json({ message: 'Post Id is required' });
            }
            const post = this.PostModel.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found', error: true });
            }
            await this.PostModel.findByIdAndUpdate(postId, {
                $inc: {
                    share: 1,
                },
            });
            res.status(200).end();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' }).end();
        }
    }
};
PostController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('PostModel')),
    __param(1, (0, typedi_1.Inject)('TagModel')),
    __param(2, (0, typedi_1.Inject)('UserModel')),
    __metadata("design:paramtypes", [Object, Object, Object])
], PostController);
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map