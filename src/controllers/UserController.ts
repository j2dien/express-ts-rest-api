import { Response } from "express";
import { TypedRequest } from "../types/request";
import { User } from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export default class UserController {
  static async register(
    req: TypedRequest<{}, any, RegisterBody>,
    res: Response
  ) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({ name, email, password: hash });

    return res.status(201).json({ message: "User registered successfully" });
  }

  static async login(req: TypedRequest<{}, any, LoginBody>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "jwt_token_saya"
    );

    return res.status(200).json({ token });
  }

  static async profile(req: TypedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json(user);
  }

  // --- LOGOUT ---
  static async logout(req: Request, res: Response) {
    // Karena JWT stateless, logout cukup dilakukan di sisi client
    // tapi kita bisa memberikan response yang jelas dan aman

    return res.status(200).json({
      message:
        "Logout successful. Please remove your token from client storage (localStorage or sessionStorage).",
    });
  }
}
