import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  let currentUser = null;
try {
  const raw = localStorage.getItem("user");
  if (raw && raw !== "undefined") {
    currentUser = JSON.parse(raw);
  }
} catch (err) {
  console.error("Error parsing user from localStorage in CommentSection:", err);
}


  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/comments/${postId}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewComment("");
      setError("");
      setComments((prev) => [response.data, ...prev]); // Add new comment to top
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/comments/${postId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(response.data.comments); // Updated list from backend
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <div style={{ marginTop: "10px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ padding: "6px", width: "80%" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
        💬 Comment
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {comments.map((comment) => (
        <div
          key={comment._id}
          style={{
            marginBottom: "6px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong>{comment.user?.name || "User"}</strong>: {comment.content || comment.text}
          </div>
          {comment.user?._id === currentUser?._id && (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              style={{
                marginLeft: "10px",
                color: "red",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              🗑
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;

