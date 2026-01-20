import { useState, useEffect } from 'react';
import api from '../Apis';

export const usePosts = (searchQuery) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/items/view-all");
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching posts:", error);
      setError("Failed to load posts");
      setLoading(false);
    }
  };

  const searchPosts = async (query) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/items/search", {
        params: {
          studentName: query,
          studentId: query
        }
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error searching:", error);
      setError("Search failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPosts(searchQuery);
      } else {
        fetchPosts();
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return { posts, loading, error, refetchPosts: fetchPosts };
};
