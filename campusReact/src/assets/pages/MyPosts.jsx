import React, { useState, useEffect } from 'react';
import api from '../../Apis';
import { BiTrash } from 'react-icons/bi';


function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/items/my-items");
      setMyPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching my posts:", error);
      setError("Failed to load your posts");
      setLoading(false);
    }
  }

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/items/${postId}`);
        setMyPosts(myPosts.filter(post => post.id !== postId));
      } catch (error) {
        console.log("Error deleting:", error);
        alert("Failed to delete post");
      }
    }
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  return (
    <div className="my-posts-page">
      <div className="my-posts-container">
        <div className="page-header">
          <h1>My Posts</h1>
          <p className="post-count">{myPosts.length} total posts</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your posts...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : myPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>You haven't created any posts. Click "Add Post" to create one!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>ID Number</th>
                  <th>Posted</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="student-name-cell">
                      <div className="avatar">
                        {post.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <span>{post.studentName}</span>
                    </td>
                    <td className="id-cell">{post.idNumber}</td>
                    <td className="time-cell">{getTimeAgo(post.createdAt)}</td>
                    <td className="date-cell">{formatDate(post.createdAt)}</td>
                    <td className="actions-cell">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(post.id)}
                        title="Delete post"
                      >
                        <BiTrash />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPosts;