import { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (selectedUser, onMessageReceived) => {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

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
            onMessageReceived(receivedMessage);
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

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [selectedUser, onMessageReceived]);

  const sendMessage = (content, receiverId) => {
    if (content.trim() && stompClientRef.current && connected && receiverId) {
      const messageRequest = {
        receiverId: receiverId,
        content: content.trim()
      };

      stompClientRef.current.publish({
        destination: '/app/send',
        body: JSON.stringify(messageRequest),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      return true;
    }
    return false;
  };

  return { connected, sendMessage };
};
