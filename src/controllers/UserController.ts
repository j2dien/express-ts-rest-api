import { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class UserController {
  static async register(req: Request, res: Response) {
    const body = req.body;
    if (!body.name)
      return res.status(400).json({
        message: "name is required",
      });

    if (!body.email)
      return res.status(400).json({
        message: "email is required",
      });

    if (!body.password)
      return res.status(400).json({
        message: "password is required",
      });

    // cari user berdasarkan email di database
    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (user)
      return res.status(400).json({
        message: "User already exists",
      });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);

    await User.create({
      name: body.name,
      email: body.email,
      password: hash,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  }

  static async login(req: Request, res: Response) {
    const body = req.body;

    if (!body.email)
      return res.status(400).json({
        message: "email is required",
      });

    if (!body.password)
      return res.status(400).json({
        message: "password is required",
      });

    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user)
      return res.status(401).json({
        message: "Invalid email or password",
      });

    const isValidPassword = bcrypt.compareSync(body.password, user.password);

    if (!isValidPassword)
      return res.status(401).json({
        message: "Invalid email or password",
      });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "jwt_token_saya"
    );

    return res.status(200).json({
      token,
    });
  }

  static async profile(req: Request, res: Response) {
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(user);
  }
}
