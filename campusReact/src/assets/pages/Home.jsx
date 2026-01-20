import React, { useState, useEffect } from 'react';
import api from '../../Apis';
import AddPostForm from './AddPostForm';
import SearchBar from '../../components/SearchBar';
import ConversationsSidebar from '../../components/ConversationsSidebar';
import PostsFeed from '../../components/PostsFeed';
import ChatPanel from '../../components/ChatPanel';
import { usePosts } from '../../hooks/usePosts';
import { useConversations } from '../../hooks/useConversations';

function Home({ showForm, setShowForm }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Use custom hooks for data management
  const { posts, loading, error, refetchPosts } = usePosts(searchQuery);
  const {
    conversations,
    unreadCount,
    messagesLoading,
    refetchConversations,
    refetchUnreadCount
  } = useConversations();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await api.get('/api/auth/current-user');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleMessageClick = (post) => {
    setSelectedUser({
      id: post.user.id,
      name: post.studentName
    });
    setShowChat(true);
  };

  const handleConversationClick = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedUser(null);
    refetchConversations();
    refetchUnreadCount();
  };

  return (
    <div className="home-page">
      <AddPostForm showForm={showForm} setShowForm={setShowForm} onPostCreated={refetchPosts} />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
      />

      <div className="main-container">
        <ConversationsSidebar
          conversations={conversations}
          unreadCount={unreadCount}
          messagesLoading={messagesLoading}
          onConversationClick={handleConversationClick}
        />

        <PostsFeed
          posts={posts}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          onMessageClick={handleMessageClick}
        />

        {showChat && selectedUser && (
          <ChatPanel
            selectedUser={selectedUser}
            onClose={handleCloseChat}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
