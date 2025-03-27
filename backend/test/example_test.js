const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const Comment = require("../models/Comment");

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/postController");

const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

const { expect } = chai;

describe("Post Controller Tests", () => {
  afterEach(() => sinon.restore());

  it("should create a new post", async () => {
    const req = {
      body: { content: "Hello World" },
      user: { id: new mongoose.Types.ObjectId() },
    };

    const savedPost = {
      _id: new mongoose.Types.ObjectId(),
      content: req.body.content,
      user: req.user.id,
    };

    const saveStub = sinon.stub(Post.prototype, "save").resolves(savedPost);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createPost(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(savedPost)).to.be.true;

    saveStub.restore();
  });

  it("should fetch all posts", async () => {
    const posts = [{ content: "Test Post", user: {} }];
    const findStub = sinon.stub(Post, "find").returns({
      populate: sinon.stub().returns({
        sort: sinon.stub().resolves(posts),
      }),
    });

    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getPosts(req, res);

    expect(res.json.calledWith(posts)).to.be.true;

    findStub.restore();
  });

  it("should update a post if authorized", async () => {
    const postId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: postId },
      body: { content: "Updated content" },
      user: { id: "user123" },
    };

    const post = {
      _id: postId,
      user: "user123",
      content: "Old content",
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Post, "findById").resolves(post);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updatePost(req, res);

    expect(post.content).to.equal("Updated content");
    expect(res.json.calledWith(post)).to.be.true;

    findByIdStub.restore();
  });

  it("should delete a post if authorized", async () => {
    const req = {
      params: { id: "post123" },
      user: { id: "user123" },
    };

    const post = {
      user: "user123",
      deleteOne: sinon.stub().resolves(),
    };

    const findByIdStub = sinon.stub(Post, "findById").resolves(post);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await deletePost(req, res);

    expect(res.json.calledWith({ message: "Post deleted" })).to.be.true;

    findByIdStub.restore();
  });

  it("should like a post", async () => {
    const req = {
      params: { id: "post123" },
      user: { id: "user123" },
    };

    const post = {
      likes: [],
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Post, "findById").resolves(post);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await likePost(req, res);

    expect(post.likes).to.include("user123");
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(post)).to.be.true;

    findByIdStub.restore();
  });

  it("should unlike a post", async () => {
    const req = {
      params: { id: "post123" },
      user: { id: "user123" },
    };

    const post = {
      likes: ["user123", "someoneElse"],
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Post, "findById").resolves(post);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await unlikePost(req, res);

    expect(post.likes).to.not.include("user123");
    expect(res.status.calledWith(200)).to.be.true;

    findByIdStub.restore();
  });
});

describe("Comment Controller Tests", () => {
  afterEach(() => sinon.restore());

  it("should add a new comment", async () => {
    const req = {
      body: { content: "Nice post!" },
      user: { id: "user123" },
      params: { postId: "post123" },
    };

    const savedComment = {
      content: "Nice post!",
      user: "user123",
      post: "post123",
    };

    const saveStub = sinon.stub(Comment.prototype, "save").resolves(savedComment);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addComment(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(savedComment)).to.be.true;

    saveStub.restore();
  });

  it("should get comments by post", async () => {
    const comments = [{ content: "Nice!", user: {} }];
    const findStub = sinon.stub(Comment, "find").returns({
      populate: sinon.stub().returns({
        sort: sinon.stub().resolves(comments),
      }),
    });

    const req = { params: { postId: "post123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getCommentsByPost(req, res);

    expect(res.json.calledWith(comments)).to.be.true;

    findStub.restore();
  });

  it("should delete a comment", async () => {
    const comment = {
      user: "user123",
      deleteOne: sinon.stub().resolves(),
    };

    const updatedComments = [{ content: "Another comment", user: {} }];

    const findByIdStub = sinon.stub(Comment, "findById").resolves(comment);
    const findStub = sinon.stub(Comment, "find").returns({
      populate: sinon.stub().returns({
        sort: sinon.stub().resolves(updatedComments),
      }),
    });

    const req = {
      user: { id: "user123" },
      params: { postId: "post123", commentId: "comment123" },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteComment(req, res);

    expect(res.json.calledWith({ message: "Comment deleted", comments: updatedComments })).to.be.true;

    findByIdStub.restore();
    findStub.restore();
  });
});
