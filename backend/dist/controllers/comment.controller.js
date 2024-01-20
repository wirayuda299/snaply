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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let Comment = class Comment {
    commentModel;
    postModel;
    constructor(commentModel, postModel) {
        this.commentModel = commentModel;
        this.postModel = postModel;
    }
    async uploadComment(req, res) {
        try {
            const { author, comment, postId, parentId } = req.body;
            if (!author || !postId || !comment) {
                return res
                    .status(400)
                    .json({ message: 'Author, Post ID and comment are required' });
            }
            const post = await this.postModel.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' }).end();
            }
            const c = await this.commentModel.create({
                author,
                comment,
                postId: post.id,
                ...(parentId && { parentId }),
            });
            post.comments.push(c.id);
            await post.save();
            res.status(200).json({ message: 'Comment uploaded', error: false }).end();
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ message: 'Internal server error', error: true })
                .end();
        }
    }
    async getCommentReplies(req, res) {
        try {
            const comments = await this.commentModel
                .find({
                parentId: req.params.id,
            })
                .populate('author', 'username profileImage createdAt updateAt');
            if (comments.length < 1)
                return res
                    .status(404)
                    .json({ message: 'Comment not found', error: true });
            return res.status(200).json({ data: comments, error: false }).end();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message, error: true }).end();
            }
        }
    }
    async likeComment(req, res) {
        const { userId, commentId } = req.body;
        try {
            const comment = await this.commentModel.findById(commentId);
            if (!comment) {
                return res
                    .status(404)
                    .json({ message: 'Comment not found', error: true });
            }
            const hasLikedIndex = comment.likes.indexOf(userId);
            if (hasLikedIndex !== -1) {
                comment.likes.splice(hasLikedIndex, 1);
            }
            else {
                comment.likes.push(userId);
            }
            await comment.save();
            return res.status(200).end();
        }
        catch (error) {
            res
                .status(500)
                .json({ message: 'Internal server error', error: true })
                .end();
        }
    }
};
Comment = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('CommentModel')),
    __param(1, (0, typedi_1.Inject)('PostModel')),
    __metadata("design:paramtypes", [Object, Object])
], Comment);
exports.default = Comment;
//# sourceMappingURL=comment.controller.js.map