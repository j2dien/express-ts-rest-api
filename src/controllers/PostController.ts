import { Response } from "express";
import { TypedRequest } from "../types/request";
import { Comment, Post } from "../models";

interface CreatePostBody {
  title: string;
  description: string;
}

interface UpdatePostBody {
  title: string;
  description: string;
}

export default class PostController {
  static async getPosts(_req: TypedRequest, res: Response) {
    const posts = await Post.findAll();
    return res.status(200).json(posts);
  }

  static async getPost(req: TypedRequest<{ id: string }>, res: Response) {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: {
        model: Comment,
        as: "comments",
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json(post);
  }

  static async createPost(
    req: TypedRequest<{}, any, CreatePostBody>,
    res: Response
  ) {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });
    if (!description)
      return res.status(400).json({ message: "description is required" });

    await Post.create({ title, description });

    return res.status(201).json({ message: "Data added successfully" });
  }

  static async updatePost(
    req: TypedRequest<{ id: string }, any, UpdatePostBody>,
    res: Response
  ) {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });
    if (!description)
      return res.status(400).json({ message: "description is required" });

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Data not found" });
    }

    await Post.update({ title, description }, { where: { id: post.id } });

    return res.status(200).json({ message: "Data updated successfully" });
  }

  static async deletePost(req: TypedRequest<{ id: string }>, res: Response) {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Data not found" });
    }

    await Post.destroy({
      where: { id: post.id },
      // force: true // Hard delete
    });

    return res.status(200).json({ message: "Data deleted successfully" });
  }
}
