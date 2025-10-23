import { Request, Response } from "express";
import { Comment, Post } from "../models";

export default class PostController {
  static async getPosts(req: Request, res: Response) {
    const posts = await Post.findAll();
    return res.status(200).json(posts);
  }

  static async getPost(req: Request, res: Response) {
    const postId = req.params.id;
    const post = await Post.findByPk(postId, {
      include: {
        model: Comment,
        as: "comments",
      },
    });
    if (!post) return res.status(404).json({ message: "Data not found" });
    return res.status(200).json(post);
  }

  static async createPost(req: Request, res: Response) {
    const body = req.body;

    if (!body.title)
      return res.status(400).json({ message: "title is required" });
    if (!body.description)
      return res.status(400).json({ message: "description is required" });

    await Post.create({
      title: body.title,
      description: body.description,
    });
    return res.status(201).json({ message: "Data added successfully" });
  }

  static async updatePost(req: Request, res: Response) {
    const postId = req.params.id;
    const body = req.body;

    if (!body.title)
      return res.status(400).json({ message: "title is required" });
    if (!body.description)
      return res.status(400).json({ message: "description is required" });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Data not found" });

    await Post.update(
      {
        title: body.title,
        description: body.description,
      },
      {
        where: {
          id: post.id,
        },
      }
    );

    return res.status(200).json({
      message: "Data updated successfully",
    });
  }

  static async deletePost(req: Request, res: Response) {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Data not found" });

    await Post.destroy({
      where: {
        id: post.id,
      },
      //   force: true, //akan dihapus walau menggunakan softdelete
    });

    return res.status(200).json({ message: "Data deleted successfully" });
  }
}
