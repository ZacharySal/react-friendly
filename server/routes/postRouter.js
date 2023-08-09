import express from "express";
import {
    getAllPosts,
    getUserPosts,
    likePost
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authorizeUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

export default router;