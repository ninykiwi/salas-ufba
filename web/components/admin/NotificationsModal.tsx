"use client";

import Link from "next/link";

interface NotificationItem {
  id: number;
  professor: string;
  sala: string;
  motivo: string;
}

interface NotificationsModalProps {
  notifications: NotificationItem[];
}

export default function NotificationsModal({ notifications }: NotificationsModalProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-800">Solicitações Recentes</h3>
      </div>

      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <p className="text-xs font-semibold text-[#000666]">{item.professor}</p>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5">{item.sala}</p>
              <p className="text-xs text-gray-600 mt-1 italic">"{item.motivo}"</p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-xs text-gray-400">
            Nenhuma solicitação pendente.
          </div>
        )}
      </div>

      <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
        <Link href="/salas">
        <button 
          className="w-full py-1.5 text-xs font-semibold text-[#000666] hover:bg-blue-50 rounded-lg transition-colors"
        >
          Ver todas as solicitações
        </button>
        </Link>
      </div>
    </div>
  );
}