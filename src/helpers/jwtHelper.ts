import jwt from "jsonwebtoken";

interface JWTPayload {
  id: number | string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d"; // bisa kamu ubah sesuai kebutuhan

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "object" || !("id" in decoded)) return null;
    return decoded as JWTPayload;
  } catch {
    return null;
  }
};
