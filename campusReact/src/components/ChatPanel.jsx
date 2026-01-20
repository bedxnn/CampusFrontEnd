import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoClose } from 'react-icons/io5';
import api from '../Apis';
import { useWebSocket } from '../hooks/useWebSocket';

function ChatPanel({ selectedUser, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { connected, sendMessage } = useWebSocket(selectedUser, (receivedMessage) => {
    setMessages(prev => [...prev, receivedMessage]);
  });

  useEffect(() => {
    if (selectedUser) {
      fetchConversationHistory();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversationHistory = async () => {
    if (!selectedUser) return;

    try {
      const res = await api.get(`/api/messages/conversation/${selectedUser.id}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = () => {
    if (sendMessage(newMessage, selectedUser.id)) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  if (!selectedUser) return null;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {(selectedUser.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>{selectedUser.name || selectedUser.email}</h4>
            <span className={`status ${connected ? 'online' : 'offline'}`}>
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="close-chat-btn">
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
          onClick={handleSendMessage}
          className="send-btn"
          disabled={!newMessage.trim() || !connected}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
