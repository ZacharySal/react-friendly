import express from "express";
import {
  followUnfollowUser,
  getUserFeed,
  getUserFriends,
  getUserInfo,
  getUserMedia,
  getUserSavedPosts,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authorizeUser.js";

const router = express.Router();

router.get("/:id", verifyToken, getUserInfo);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/savedPosts", verifyToken, getUserSavedPosts);
router.get("/:id/media", verifyToken, getUserMedia);
router.get("/:id/feed", verifyToken, getUserFeed);
router.patch("/:id/:followeeId", verifyToken, followUnfollowUser);

export default router;
