import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// ==========================
// 🔒 Type Definitions
// ==========================

// Hanya field yang aman (tanpa password)
export type SafeUser = Omit<User, "password">;

// JWT payload yang dikembalikan saat verifikasi token
interface AuthTokenPayload extends jwt.JwtPayload {
  id: number | string;
  email: string;
}

// ==========================
// 🧠 Middleware Function
// ==========================
export default async function authN(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokenHeader = req.headers.authorization;

    // Cek format token
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      res.status(403).json({ message: "Forbidden - Invalid token format" });
      return;
    }

    const access_token = tokenHeader.split(" ")[1];

    // Verifikasi token dan pastikan payload valid
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string);

    if (typeof decoded !== "object" || !("id" in decoded)) {
      res.status(403).json({ message: "Forbidden - Invalid token payload" });
      return;
    }

    const payload = decoded as AuthTokenPayload;

    // Ambil user tanpa password
    const user = await User.findByPk(payload.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(403).json({ message: "Forbidden - User not found" });
      return;
    }

    // Simpan user aman ke request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: "Forbidden - Token expired" });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Forbidden - Invalid token" });
      return;
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
