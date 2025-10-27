import { SafeUser } from "../middlewares/authN";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
