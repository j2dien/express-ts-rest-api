import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routes from "./routes";

// Load environment variables
dotenv.config();

// Type-safe environment validation
const PORT = Number(process.env.PORT ?? 3000);
const NODE_ENV = process.env.NODE_ENV ?? "development";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ Missing environment variable: JWT_SECRET");
}

const app: Express = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running 🚀",
    env: NODE_ENV,
  });
});

// ✅ API routes
app.use("/api", routes);

// ✅ 404 handler (not found)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ Global error handler
app.use(
  (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    console.error("🔥 Global error caught:", err);

    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message || "Internal server error",
      });
    }

    return res.status(500).json({
      message: "Unknown error occurred",
    });
  }
);

// ✅ Start server
app.listen(PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${PORT} in ${NODE_ENV} mode`
  );
});

// Export for testing (optional)
export default app;
