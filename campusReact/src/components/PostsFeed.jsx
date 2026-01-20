import React from 'react';
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2';

function PostsFeed({ posts, loading, error, searchQuery, onMessageClick }) {
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <main className="feed-container">
      <div className="feed-header">
        <h2>Posts</h2>
      </div>

      <div className="feed-inner">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No posts found</h3>
            <p>{searchQuery ? "Try a different search" : "Be the first to share something!"}</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="post-top">
                  <span className="post-time">{getTimeAgo(post.createdAt)}</span>

                  <div className="post-actions">
                    <button
                      className="action-btn message-btn"
                      onClick={() => onMessageClick(post)}
                      title="Message"
                    >
                      <HiOutlineChatBubbleLeft />
                      <span>Message</span>
                    </button>
                  </div>
                </div>

                <div className="post-body">
                  <div className="info-row">
                    <span className="info-label">Student Name</span>
                    <span className="info-value">{post.studentName}</span>
                  </div>

                  {post.idNumber && (
                    <div className="info-row">
                      <span className="info-label">ID Number</span>
                      <span className="info-value">{post.idNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default PostsFeed;
