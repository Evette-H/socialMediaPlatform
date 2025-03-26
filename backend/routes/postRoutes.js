const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

// POST CRUD
router.post("/", protect, createPost);                  // Create a post
router.get("/", protect, getPosts);                  // Get all posts
router.put("/:id", protect, updatePost);                // Update a post
router.delete("/:id", protect, deletePost);             // Delete a post

// Likes
router.post("/:id/like", protect, likePost);            // Like a post
router.post("/:id/unlike", protect, unlikePost);        // Unlike a post



module.exports = router;
