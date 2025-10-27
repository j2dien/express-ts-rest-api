import express, { Router } from "express";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";
import UserController from "../controllers/UserController";
import authN from "../middlewares/authN";

const router: Router = express.Router();

// AUTH
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", authN, UserController.profile);
router.post("/logout", authN, UserController.logout);

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
