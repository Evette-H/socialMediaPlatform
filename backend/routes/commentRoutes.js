const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

router.post("/:postId", protect, addComment);
router.get("/:postId", protect, getCommentsByPost);
router.delete("/:postId/:commentId", protect, deleteComment);

module.exports = router;
