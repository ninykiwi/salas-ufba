"use client";

import { useCallback, useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminRequestsTable, { Solicitacao } from "@/components/admin/AdminRequestsTable";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getRooms,
  getSchedules,
  getSchedulesToday,
  updateSchedule,
  Room,
  Schedule,
  SCHEDULE_RECURRENCES,
} from "@/lib/api";
import { computeRoomOccupancy } from "@/lib/roomOccupancy";

const REFRESH_INTERVAL_MS = 60_000;
const TROCA_PREFIX = "[TROCA]";

function formatDateBR(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const instituteId = user?.institutes?.[0]?.id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = useCallback(async (instId: string) => {
    const [roomsData, todayData, pendingData] = await Promise.all([
      getRooms({ institute_id: instId, status: "ativa" }),
      getSchedulesToday(instId),
      getSchedules({ institute_id: instId, status: "pendente" }),
    ]);
    setRooms(roomsData);
    setTodaySchedules(todayData);
    setPendingSchedules(pendingData);
  }, []);

  useEffect(() => {
    if (!instituteId) {
      if (!isAuthLoading) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadData(instituteId).finally(() => setIsLoading(false));

    const interval = setInterval(() => loadData(instituteId), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [instituteId, isAuthLoading, loadData]);

  const roomsById = new Map(rooms.map((r) => [r._id, r]));

  const occupiedCount = rooms.filter(
    (r) => computeRoomOccupancy(r, todaySchedules).status !== "LIVRE"
  ).length;
  const totalRooms = rooms.length;
  const occupancyPercent = totalRooms ? Math.round((occupiedCount / totalRooms) * 100) : 0;
  const availableRooms = totalRooms - occupiedCount;

  const requests: Solicitacao[] = pendingSchedules.map((s) => {
    const isTroca = s.notes.startsWith(TROCA_PREFIX);
    const room = roomsById.get(s.room_id);

    let responsavelAtual: string | undefined;
    if (isTroca) {
      const holder = todaySchedules.find(
        (t) =>
          t.room_id === s.room_id &&
          t.date === s.date &&
          t.status === "confirmado" &&
          t.start_time < s.end_time &&
          t.end_time > s.start_time
      );
      responsavelAtual = holder?.professor_name;
    }

    return {
      id: s._id,
      professor: s.professor_name,
      sala: room?.name ?? "Sala removida",
      horario: `${s.start_time} - ${s.end_time}`,
      data: formatDateBR(s.date),
      motivo: s.title,
      tipo: isTroca ? "TROCA" : "RESERVA",
      frequencia: SCHEDULE_RECURRENCES.find((r) => r.value === s.recurrence)?.label,
      descricao: isTroca ? s.notes.slice(TROCA_PREFIX.length).trim() : s.notes,
      responsavelAtual,
    };
  });

  const handleDecision = async (id: string, status: "confirmado" | "cancelado") => {
    if (!instituteId) return;
    setProcessingId(id);
    try {
      await updateSchedule(id, { status });
      await loadData(instituteId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/relatorios" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-8 mt-1 pb-12">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Relatórios e Solicitações</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Acompanhe a ocupação do instituto e gerencie as solicitações pendentes.
                </p>
              </div>

              {isLoading ? (
                <p className="text-sm text-gray-400">Carregando dados...</p>
              ) : !instituteId ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                  <p className="text-sm">Seu usuário não está vinculado a nenhum instituto.</p>
                </div>
              ) : (
                <>
                  {/* Seção do Dashboard com os componentes de Stats e os Botões */}
                  <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AdminDashboardStats
                      pendingCount={requests.length}
                      occupancyPercent={occupancyPercent}
                      availableRooms={availableRooms}
                      totalRooms={totalRooms}
                    />

                    {/* Coluna dos botões mantida na página principal */}
                    <div className="flex flex-col gap-3 h-full">
                      <Link href="/admin/cadastrar-sala" className="flex-1 block">
                        <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                          <CirclePlus size={24} className="group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-xs uppercase tracking-wider">
                            Cadastrar Sala
                          </span>
                        </button>
                      </Link>

                      <Link href="/admin/cadastrar-evento" className="flex-1 block">
                        <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                          <CirclePlus size={24} className="group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-xs uppercase tracking-wider">
                            Cadastrar Evento
                          </span>
                        </button>
                      </Link>
                    </div>
                  </section>

                  {/* Tabela de Solicitações isolada */}
                  <AdminRequestsTable
                    requests={requests}
                    processingId={processingId}
                    onAccept={(id) => handleDecision(id, "confirmado")}
                    onReject={(id) => handleDecision(id, "cancelado")}
                  />
                </>
              )}
            </div>
          </main>

          <Footer />
        </div>
    </div>
  );
}
