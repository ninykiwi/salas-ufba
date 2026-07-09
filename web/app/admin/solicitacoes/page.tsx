"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Footer from "@/components/home/Footer";
import { Check, X, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getRooms,
  getSchedules,
  updateSchedule,
  Room,
  Schedule,
  ScheduleCategory,
  SCHEDULE_CATEGORIES,
} from "@/lib/api";

type FilterTab = "todas" | ScheduleCategory;

function formatRequestDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatRequestedAt(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SolicitacoesPage() {
  const { user } = useAuth();
  const instituteId = user?.institutes[0]?.id;

  const [requests, setRequests] = useState<Schedule[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = useCallback(async (instId: string) => {
    const [schedulesData, roomsData] = await Promise.all([
      getSchedules({ institute_id: instId, status: "pendente" }),
      getRooms({ institute_id: instId }),
    ]);
    setRequests(schedulesData);
    setRooms(roomsData);
  }, []);

  useEffect(() => {
    if (!instituteId) return;
    setIsLoading(true);
    loadRequests(instituteId).finally(() => setIsLoading(false));
  }, [instituteId, loadRequests]);

  const roomNameById = useMemo(
    () => new Map(rooms.map((room) => [room._id, room.name])),
    [rooms]
  );

  const filtered = requests.filter((r) =>
    activeTab === "todas" ? true : r.category === activeTab
  );

  const handleDecision = async (
    id: string,
    status: "confirmado" | "cancelado"
  ) => {
    if (!instituteId) return;
    setProcessingId(id);
    try {
      await updateSchedule(id, { status });
      await loadRequests(instituteId);
    } finally {
      setProcessingId(null);
    }
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todas", label: "Todas" },
    ...SCHEDULE_CATEGORIES.map((c) => ({ key: c.value as FilterTab, label: c.label })),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/solicitacoes" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Solicitações Pendentes</h1>
            <p className="text-sm text-gray-400 mt-0.5">Gerencie as solicitações dos professores.</p>
          </div>
          {requests.length > 0 && (
            <span className="text-sm text-gray-500">
              <span className="font-bold text-indigo-900">{requests.length}</span> nova{requests.length > 1 ? "s" : ""} solicitaç{requests.length > 1 ? "ões" : "ão"}
            </span>
          )}
        </div>

        <div className="px-8 pt-4 bg-white border-b border-gray-200 flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-indigo-900 text-indigo-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3">
          {isLoading ? (
            <p className="text-sm text-gray-400">Carregando solicitações...</p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-sm">Nenhuma solicitação encontrada.</p>
            </div>
          ) : (
            filtered.map((req) => {
              const categoryLabel =
                SCHEDULE_CATEGORIES.find((c) => c.value === req.category)?.label ??
                req.category;
              return (
                <div
                  key={req._id}
                  className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {req.professor_name}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                        {categoryLabel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {req.title}: {roomNameById.get(req.room_id) ?? "Sala removida"} (
                      {formatRequestDate(req.date)}, {req.start_time} - {req.end_time})
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />
                      <span>Solicitado em {formatRequestedAt(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(req._id, "confirmado")}
                      disabled={processingId === req._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Check size={14} />
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, "cancelado")}
                      disabled={processingId === req._id}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red-400 text-red-500 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X size={14} />
                      Recusar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
