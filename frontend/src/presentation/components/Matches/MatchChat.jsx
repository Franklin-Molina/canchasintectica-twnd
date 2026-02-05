import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChatWebSocket } from "../../hooks/matches/useChatWebSocket";
import { getChatMessages } from "../../../infrastructure/api/chatService";
import { Send, X, MessageSquare } from "lucide-react";

const MatchChat = ({ matchId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatMessages(matchId);
        setMessages(history);
      } catch {
        setError("No se pudo cargar el historial");
      }
    };
    if (matchId) loadHistory();
  }, [matchId]);

  const handleIncomingMessage = useCallback((data) => {
    if (data.type === "chat_message") {
      setMessages((prev) => [...prev, data]);
    }
    if (data.type === "error") {
      setError(data.message);
    }
  }, []);

  const { sendMessage } = useChatWebSocket(matchId, handleIncomingMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || error) return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[450px] z-50 flex flex-col rounded-2xl overflow-hidden
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-emerald-500/30
      shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
        bg-emerald-600 dark:bg-emerald-700 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-sm font-semibold">Chat del Partido</h3>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3
                      bg-slate-50 dark:bg-slate-900
                      
                      scrollbar-thin
                      scrollbar-thumb-transparent
                      scrollbar-track-transparent

                      hover:scrollbar-thumb-slate-300
                      dark:hover:scrollbar-thumb-slate-600

                      transition-colors">

        {error ? (
          <p className="text-center text-xs text-red-500">{error}</p>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.username === user?.username;
            return (
              <div
                key={msg.id || i}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
              >
                {!isOwn && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    {msg.username}
                  </span>
                )}

                <div className={`px-3 py-2 text-sm max-w-[80%] rounded-2xl
                  ${isOwn
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>
      

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2
          bg-slate-100 dark:bg-slate-800
          focus-within:ring-1 focus-within:ring-emerald-500">

          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!!error}
            placeholder={error ? "Chat cerrado" : "Escribe..."}
            className="flex-1 bg-transparent text-sm outline-none
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!!error}
            className="text-emerald-600 dark:text-emerald-400 hover:opacity-80">
            <Send className="w-4 h-4 rotate-45" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchChat;
