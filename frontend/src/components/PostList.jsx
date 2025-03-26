import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import CommentSection from "./CommentSection";

const PostList = ({ posts, setPosts }) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  let currentUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") {
      currentUser = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
  }
  const currentUserId = currentUser?._id;

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.put(
        `/posts/${postId}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditedContent("");
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(`/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(`/posts/${postId}/unlike`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "15px",
          color: "#333",
          borderBottom: "1px solid #ddd",
          paddingBottom: "5px",
        }}
      >
        ----- All Posts -----
      </h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              position: "relative",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p><strong>{post.user?.name || "Unknown user"}</strong></p>

            {editingPostId === post._id ? (
              <>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={3}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
                <button onClick={() => handleSaveEdit(post._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <p>{post.content}</p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "10px"
                }}>
                  <span style={{ fontSize: "16px" }}>
                    {post.likes?.length || 0} {post.likes?.length === 1 ? "Like" : "Likes"}
                  </span>

                  {post.likes?.includes(currentUserId) ? (
                    <button
                      onClick={() => handleUnlike(post._id)}
                      style={{
                        backgroundColor: "#ffd1d1",
                        border: "1px solid #ff5c5c",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >
                      💔 Unlike
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLike(post._id)}
                      style={{
                        backgroundColor: "#d1f0ff",
                        border: "1px solid #58b4e8",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ❤️ Like
                    </button>
                  )}
                </div>
              </>
            )}

            {editingPostId !== post._id && (
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(post)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#555",
                    border: "1px solid #ccc",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  style={{
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            <CommentSection postId={post._id} />
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;



