import { useEffect, useCallback, useRef } from 'react';

class ChatWebSocket {
  constructor() {
    this.ws = null;
    this.matchId = null;
    this.listeners = [];
    this.connecting = false;
  }

  connect(matchId) {
    if (this.connecting) return;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.matchId === matchId) {
      return;
    }

    if (this.ws) {
      this.ws.close();
    }

    this.connecting = true;
    this.matchId = matchId;
    const token = localStorage.getItem('accessToken');
    
    const wsBaseUrl = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = 'localhost:8000'; 
    const wsUrl = `${wsBaseUrl}//${wsHost}/ws/chat/${matchId}/?token=${token}`;

    console.log(`Intentando conectar a WebSocket: ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connecting = false;
      console.log(`✅ Chat WebSocket conectado al match ${matchId}`);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(callback => callback(data));
    };

    this.ws.onerror = (error) => {
      this.connecting = false;
      console.error('❌ Error Chat WebSocket:', error);
    };

    this.ws.onclose = (event) => {
      this.connecting = false;
      console.log(`🔌 Chat WebSocket desconectado del match ${matchId}. Código: ${event.code}`);
    };
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message }));
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.matchId = null;
    }
  }
}

const chatWebSocket = new ChatWebSocket();

export const useChatWebSocket = (matchId, onMessage) => {
  useEffect(() => {
    if (!matchId) return;

    chatWebSocket.connect(matchId);
    const unsubscribe = chatWebSocket.subscribe(onMessage);

    return () => {
      unsubscribe();
    };
  }, [matchId, onMessage]);

  const sendMessage = useCallback((message) => {
    chatWebSocket.sendMessage(message);
  }, []);

  return { sendMessage };
};
