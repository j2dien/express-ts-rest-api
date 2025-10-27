import { Response } from "express";
import { TypedRequest } from "../types/request"; // helper type
import { Comment, Post } from "../models";

// Definisikan struktur body untuk pembuatan komentar
interface CreateCommentBody {
  comment: string;
  post_id: number;
}

export default class CommentController {
  static async getComments(_req: TypedRequest, res: Response) {
    const comments = await Comment.findAll({
      include: {
        model: Post,
        as: "post",
      },
    });

    return res.status(200).json(comments);
  }

  static async createComment(
    req: TypedRequest<{}, any, CreateCommentBody>,
    res: Response
  ) {
    const { comment, post_id } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    if (!post_id) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Comment.create({
      comment,
      post_id,
    });

    return res.status(201).json({
      message: "Comment added successfully",
    });
  }
}
