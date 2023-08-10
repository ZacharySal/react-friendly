import express from "express";
import {
    getAllPosts,
    getUserPosts,
    likePost,
    addComment,
    likeComment,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authorizeUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.post("/:postId/comment", verifyToken, addComment);
router.post("/:commentId/like", verifyToken, likeComment);
router.patch("/:postId/like", verifyToken, likePost);

export default router;