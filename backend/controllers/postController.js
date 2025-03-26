const Post = require("../models/Post");

// --- Create a post
const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      content: req.body.content,
      user: req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// --- View all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// --- Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.content = req.body.content || post.content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// --- Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// --- Like a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Unlike a post
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};




