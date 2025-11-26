import React from 'react';
import { Bell } from 'lucide-react';

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-gray-900 border border-green-500/30 rounded-xl px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
          <Bell className="text-green-500" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1 text-white">Nueva Reserva</h4>
          <p className="text-xs text-gray-400">{message}</p>
        </div>
      </div>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Notification;
