import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

const MatchChat = ({ matchId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  // 🔹 Cargar mensajes iniciales
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id, sender:users(username)")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };
    fetchMessages();
  }, [matchId]);

  // 🔹 Suscribirse a mensajes nuevos (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  // 🔹 Enviar mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    console.log("Enviando mensaje:", {
      content,
      match_id: matchId,
      sender_id: user?.id, // Usar optional chaining por si user es null
    });

    const { error } = await supabase.from("messages").insert({
      content,
      match_id: matchId,
      sender_id: user?.id, // Usar optional chaining por si user es null
    });

    if (error) {
      console.error("Error al enviar mensaje:", error);
    } else {
      setContent("");
    }
  };

  // 🔹 Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[450px] border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.sender_id === user.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              <p className="font-semibold text-xs mb-1">
                {msg.sender?.username || "Jugador"}
              </p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default MatchChat;
