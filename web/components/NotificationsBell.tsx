"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AppNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";

function formatNotificationDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsBell() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    getNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const source = new EventSource("/api/notifications/stream");
    source.onmessage = (event) => {
      const notification: AppNotification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
    };

    return () => source.close();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 10);
  const solicitacoesRoute =
    user?.role === "PROFESSOR"
      ? "/professor/minhas-solicitacoes"
      : "/admin/solicitacoes";

  const handleSelect = async (notification: AppNotification) => {
    setOpen(false);
    if (!notification.read) {
      try {
        await markNotificationRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      } catch {
        // Navegar mesmo se marcar como lida falhar.
      }
    }
    router.push(solicitacoesRoute);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Ignora falha ao marcar todas como lidas.
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1 text-gray-400 hover:text-[#000666] transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#000666] hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    !item.read ? "bg-blue-50/60" : ""
                  }`}
                >
                  <p className="text-xs font-semibold text-[#000666]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{item.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatNotificationDate(item.createdAt)}
                  </p>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                Nenhuma notificação.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
