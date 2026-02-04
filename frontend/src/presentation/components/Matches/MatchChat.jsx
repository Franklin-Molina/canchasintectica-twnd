import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChatWebSocket } from '../../hooks/matches/useChatWebSocket';
import { getChatMessages } from '../../../infrastructure/api/chatService';
import { Send, X, MessageSquare } from 'lucide-react';

const MatchChat = ({ matchId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Cargar mensajes históricos
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatMessages(matchId);
        setMessages(history);
      } catch (err) {
        console.error('Error cargando historial de chat:', err);
        setError('No se pudo cargar el historial.');
      }
    };
    if (matchId) loadHistory();
  }, [matchId]);

  // Manejar mensajes entrantes por WebSocket
  const handleIncomingMessage = useCallback((data) => {
    if (data.type === 'chat_message') {
      setMessages(prev => [...prev, {
        id: data.id,
        message: data.message,
        username: data.username,
        user_id: data.user_id,
        created_at: data.created_at
      }]);
    } else if (data.type === 'error') {
      setError(data.message);
    }
  }, []);

  const { sendMessage } = useChatWebSocket(matchId, handleIncomingMessage);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || error) return;

    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Chat del Partido</h3>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 rounded-full p-1 transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50 dark:bg-slate-800/50">
        {error ? (
          <div className="text-center p-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.username === user?.username;
            return (
              <div key={msg.id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%]`}>
                  {!isOwn && (
                    <span className="text-[10px] text-slate-500 ml-1 mb-1 block">
                      {msg.username}
                    </span>
                  )}
                  <div className={`px-3 py-1.5 rounded-2xl text-xs ${
                    isOwn 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex gap-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!!error}
            placeholder={error ? "Chat cerrado" : "Escribe..."}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900"
          />
          <button
            type="submit"
            disabled={!!error}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-slate-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchChat;
