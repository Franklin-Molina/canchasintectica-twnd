class UsersWebSocket {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(token) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}/ws/users/?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ Users WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Users WebSocket message:', data);
          this.listeners.forEach(callback => callback(data));
        } catch (error) {
          console.error('Error parsing Users WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => console.error('❌ Users WebSocket error:', error);

      this.ws.onclose = (event) => {
        console.log('🔌 Users WebSocket disconnected:', event.code);
        if (event.code !== 1000 && event.code !== 1001) {
          this.handleReconnect(token);
        }
      };
    } catch (error) {
      this.handleReconnect(token);
    }
  }

  handleReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(token), this.reconnectDelay);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Normal Closure');
      this.ws = null;
    }
    this.listeners.clear();
  }
}

export const usersWebSocket = new UsersWebSocket();
