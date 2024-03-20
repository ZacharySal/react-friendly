import express from "express";
import {
  deletePost,
  getAllPosts,
  getImage,
  getPost,
  getUserPosts,
  likePost,
  savePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authorizeUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/post/:post_id", verifyToken, getPost);
router.get("/:user_id", verifyToken, getUserPosts);
router.get("/image/:key", verifyToken, getImage);
router.patch("/:post_id/like", verifyToken, likePost);
router.patch("/:post_id/save", verifyToken, savePost);
router.delete("/:post_id", verifyToken, deletePost);

export default router;
