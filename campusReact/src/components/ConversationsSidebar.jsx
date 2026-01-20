import React from 'react';

function ConversationsSidebar({ conversations, unreadCount, messagesLoading, onConversationClick }) {
  return (
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
          <div className="conversations-table-container">
            <table className="conversations-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((user) => (
                  <tr
                    key={user.id}
                    className="conversation-row"
                    onClick={() => onConversationClick(user)}
                  >
                    <td>
                      <div className="user-cell">
                        <div className="conversation-avatar">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="conversation-name">
                            {user.name || user.email}
                          </div>
                          <div className="conversation-preview">
                            Click to open chat
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="chat-action-btn" onClick={(e) => { e.stopPropagation(); onConversationClick(user); }}>
                        💬 Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ConversationsSidebar;
