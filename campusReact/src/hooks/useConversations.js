import { useState, useEffect } from 'react';
import api from '../Apis';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messagesLoading, setMessagesLoading] = useState(true);

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
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/messages/unread/count");
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  return {
    conversations,
    unreadCount,
    messagesLoading,
    refetchConversations: fetchConversations,
    refetchUnreadCount: fetchUnreadCount
  };
};
