import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const PostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  if (!user || !user.token) {
    return <p style={{ color: 'red' }}>Please log in to create a post.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Post cannot be empty!");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/posts",
        { content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setContent(""); // Clear form
      if (onPostCreated) {
        onPostCreated(response.data); // Let parent refresh posts list
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#333"
      }}>
        Create a Post
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button
          type="submit"
          style={{
            backgroundColor: "#58b4e8",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;


