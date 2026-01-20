import React, { useState, useEffect, useRef } from 'react';
import api from '../../Apis';
import AddPostForm from './AddPostForm';
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { BiSearch } from 'react-icons/bi';
import { IoSend, IoClose } from 'react-icons/io5';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function Home({ showForm, setShowForm }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    fetchConversations();
    fetchUnreadCount();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (showChat && selectedUser) {
      fetchConversationHistory();
      connectWebSocket();
    }
    
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [showChat, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search as user types
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        fetchPosts();
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUser = async () => {
    try {
      // Adjust this endpoint based on your backend
      const res = await api.get('/api/auth/current-user');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

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
  }

  const fetchConversations = async () => {
    try {
      setMessagesLoading(true);
      const res = await api.get("/api/messages/conversations");
      setConversations(res.data);
      setMessagesLoading(false);
    } catch (error) {
      console.log("Error fetching conversations:", error);
      setMessagesLoading(false);
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/messages/unread/count");
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log("Error fetching unread count:", error);
    }
  }

  const fetchConversationHistory = async () => {
    if (!selectedUser) return;
    
    try {
      const res = await api.get(`/api/messages/conversation/${selectedUser.id}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    const socket = new SockJS('http://localhost:8080/ws');
    
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      setConnected(true);

      stompClient.subscribe('/user/queue/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        
        if (receivedMessage.sender.id === selectedUser?.id || 
            receivedMessage.receiver.id === selectedUser?.id) {
          setMessages(prev => [...prev, receivedMessage]);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker error: ' + frame.headers['message']);
      setConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const sendMessage = () => {
    if (newMessage.trim() && stompClientRef.current && connected && selectedUser) {
      const messageRequest = {
        receiverId: selectedUser.id,
        content: newMessage.trim()
      };

      // Optimistically add the message to the UI immediately
      const optimisticMessage = {
        id: Date.now(), // temporary ID
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        sender: currentUser,
        receiver: selectedUser
      };

      setMessages(prev => [...prev, optimisticMessage]);

      stompClientRef.current.publish({
        destination: '/app/send',
        body: JSON.stringify(messageRequest),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNewMessage('');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/items/search", {
        params: {
          studentName: searchQuery,
          studentId: searchQuery
        }
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error searching:", error);
      setError("Search failed");
      setLoading(false);
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("");
  }

const handleMessage = (post) => {
  setSelectedUser({
    id: post.user.id, 
    name: post.studentName
  });
  setShowChat(true);
}

  const openConversation = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  }

  const closeChat = () => {
    setShowChat(false);
    setSelectedUser(null);
    setMessages([]);
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    fetchConversations();
    fetchUnreadCount();
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
  }

  return (
    <div className="home-page">
      <AddPostForm showForm={showForm} setShowForm={setShowForm} onPostCreated={fetchPosts} />

      {/* Search Bar */}
      <div className="top-search-bar">
        <div className="top-search-form">
          <BiSearch className="top-search-icon" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="top-search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={handleClearSearch} 
              className="top-clear-btn"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="main-container">
        {/* Left Sidebar - Messages */}
        <aside className="left-sidebar">
          <div className="sidebar-header">
            <h3>Messages</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          
          <div className="messages-list">
            {messagesLoading ? (
              <div className="messages-loading">
                <div className="small-spinner"></div>
                <p>Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="coming-soon">
                <span>💬</span>
                <p>No conversations yet</p>
                <small>Start messaging to see conversations here</small>
              </div>
            ) : (
              conversations.map((user, index) => (
                <div
                  key={user.id}
                  className="conversation-item"
                  onClick={() => openConversation(user)}
                >
                  <div className="conversation-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : (index + 1)}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {user.name || (index + 1)}
                    </div>
                    <div className="conversation-preview">
                      Click to open chat
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center Feed - Posts */}
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
                          onClick={() => handleMessage(post)}
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

        {/* Chat Panel */}
        {showChat && selectedUser && (
          <div className="chat-panel">
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser.id}
                </div>
                <div>
                  <h4>{selectedUser.name || selectedUser.id}</h4>
                  <span className={`status ${connected ? 'online' : 'offline'}`}>
                    {connected ? '🟢 Connected' : '🔴 Disconnected'}
                  </span>
                </div>
              </div>
              <button onClick={closeChat} className="close-chat-btn">
                <IoClose />
              </button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwnMessage = currentUser && msg.sender.id === currentUser.id;
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}
                    >
                      <div className="message-bubble">
                        <p>{msg.content}</p>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="chat-input"
                rows="1"
                disabled={!connected}
              />
              <button 
                onClick={sendMessage} 
                className="send-btn"
                disabled={!newMessage.trim() || !connected}
              >
                <IoSend />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;