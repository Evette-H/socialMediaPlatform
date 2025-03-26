import React, { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import axiosInstance from "../axiosConfig";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token being sent:", token);

      const response = await axiosInstance.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div style={{ padding: "20px" }}>
      
      <PostForm onPostCreated={handlePostCreated} />
      
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default Posts;
