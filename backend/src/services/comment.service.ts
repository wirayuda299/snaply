import { Request, Response } from "express";
import { Inject, Service } from "typedi";

import { commentModelType } from "../models/comment.model";
import { postModelType } from "../models/post.model";

@Service()
export default class CommentService {
  constructor(
    @Inject("CommentModel") private commentModel: commentModelType,
    @Inject("PostModel") private postModel: postModelType
  ) {}

  async uploadComment(req: Request, res: Response) {
    try {
      const { author, comment, postId, parentId } = req.body;

      const post = await this.postModel.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "Post not found", error: true })
          .end();
      }

      const c = await this.commentModel.create({
        author,
        comment,
        postId: post.id,
        ...(parentId && { parentId }),
      });
      post.comments.push(c.id);
      await post.save();

      res.status(200).json({ message: "Comment uploaded", error: false }).end();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: true })
        .end();
    }
  }

  async getCommentReplies(req: Request, res: Response) {
    try {
      const comments = await this.commentModel
        .find({ parentId: req.params.id })
        .populate("author", "username profileImage createdAt updateAt");

      if (comments.length < 1)
        return res
          .status(404)
          .json({ message: "Comment not found", error: true });
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.status(200).json({ data: comments, error: false }).end();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message, error: true }).end();
      }
    }
  }

  async likeComment(req: Request, res: Response) {
    const { userId, commentId } = req.body;

    try {
      const comment = await this.commentModel.findById(commentId);

      if (!comment) {
        return res
          .status(404)
          .json({ message: "Comment not found", error: true });
      }
      const hasLikedIndex = comment.likes.indexOf(userId);

      if (hasLikedIndex !== -1) {
        comment.likes.splice(hasLikedIndex, 1);
      } else {
        comment.likes.push(userId);
      }
      await comment.save();

      return res.status(200).end();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: true })
        .end();
    }
  }
}
