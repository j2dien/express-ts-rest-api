import { Request, Response } from "express";
import { Comment, Post } from "../models";

export default class CommentController {
  static async getComments(req: Request, res: Response) {
    const comments = await Comment.findAll({
      include: {
        model: Post,
        as: "post",
      },
    });

    return res.status(200).json(comments);
  }

  static async createComment(req: Request, res: Response) {
    const body = req.body;

    if (!body.comment)
      return res.status(400).json({ message: "Comment is required" });
    if (!body.post_id)
      return res.status(400).json({ message: "Post id is required" });

    const post = await Post.findByPk(body.post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Comment.create({
      comment: body.comment,
      post_id: body.post_id,
    });

    return res.status(201).json({
      message: "Comment added successfully",
    });
  }
}
