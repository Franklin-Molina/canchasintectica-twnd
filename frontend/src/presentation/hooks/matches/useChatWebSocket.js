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
    
    // Obtener el host del API desde las variables de entorno de Vite
    // VITE_API_URL suele ser http://localhost:8000 o http://192.168.1.111:8000
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Extraer solo el host (dominio/ip + puerto) eliminando el protocolo
    const wsHost = apiUrl.replace(/^https?:\/\//, '');
    
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
      
      // Reconectar automáticamente si no fue un cierre normal (1000) o cierre por token/invalidez
      if (event.code !== 1000 && event.code < 4000) {
        console.log('🔄 Intentando reconectar chat...');
        setTimeout(() => this.connect(matchId), 3000);
      }
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
