import express from "express";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";
import UserController from "../controllers/UserController";
import authN from "../middlewares/auth";

const router = express.Router();

// AUTH
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", authN, UserController.profile);

// POST
router.get("/posts", PostController.getPosts);
router.post("/posts", PostController.createPost);
router.get("/posts/:id", PostController.getPost);
router.put("/posts/:id", PostController.updatePost);
router.delete("/posts/:id", PostController.deletePost);

// COMMENT
router.get("/comments", CommentController.getComments);
router.post("/comments", CommentController.createComment);

export default router;
