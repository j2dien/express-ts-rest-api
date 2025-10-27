import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// Extend Express Request interface untuk menambahkan properti user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Interface untuk JWT payload
interface AuthTokenPayload extends jwt.JwtPayload {
  id: string | number;
}

export default async function authN(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization;

    // Validasi format token
    if (!token || !token.startsWith("Bearer ")) {
      return void res.status(403).json({
        message: "Forbidden access - Invalid token format",
      });
    }

    const access_token = token.split(" ")[1];

    // Verifikasi token dengan type safety
    const payload = jwt.verify(
      access_token,
      "jwt_token_saya"
    ) as AuthTokenPayload;

    // Validasi payload
    if (!payload.id) {
      return void res.status(403).json({
        message: "Forbidden access - Invalid token payload",
      });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return void res.status(403).json({
        message: "Forbidden access - User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle berbagai error JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return void res.status(403).json({
        message: "Forbidden access - Invalid token",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return void res.status(403).json({
        message: "Forbidden access - Token expired",
      });
    }

    // Handle error lainnya
    console.error("Auth middleware error:", error);
    return void res.status(500).json({
      message: "Internal server error",
    });
  }
}
