"use client";

import { useCallback, useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminRoomCard from "@/components/admin/AdminRoomCard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminEventTable, { Evento } from "@/components/admin/AdminEventTable";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getRooms, getSchedulesToday, Room, Schedule } from "@/lib/api";
import { computeRoomOccupancy, RoomOccupancyStatus } from "@/lib/roomOccupancy";

type StatusFilter = "TODAS" | "LIVRES" | "OCUPADAS";

const filterMap: Record<StatusFilter, RoomOccupancyStatus[]> = {
  TODAS: ["OCUPADA", "LIVRE", "EM_REUNIAO"],
  LIVRES: ["LIVRE"],
  OCUPADAS: ["OCUPADA", "EM_REUNIAO"],
};

const REFRESH_INTERVAL_MS = 60_000;

function floorLabel(floor: string): string {
  if (floor === "terreo") return "Térreo";
  return `${floor}º Andar`;
}

function formatDateBR(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const instituteId = user?.institutes?.[0]?.id;

  const [filter, setFilter] = useState<StatusFilter>("TODAS");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOccupancy = useCallback(async (instId: string) => {
    const [roomsData, schedulesData] = await Promise.all([
      getRooms({ institute_id: instId, status: "ativa" }),
      getSchedulesToday(instId),
    ]);
    setRooms(roomsData);
    setTodaySchedules(schedulesData);
  }, []);

  useEffect(() => {
    if (!instituteId) {
      if (!isAuthLoading) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadOccupancy(instituteId).finally(() => setIsLoading(false));

    const interval = setInterval(() => loadOccupancy(instituteId), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [instituteId, isAuthLoading, loadOccupancy]);

  const roomsWithOccupancy = rooms.map((room) => ({
    room,
    occupancy: computeRoomOccupancy(room, todaySchedules),
  }));

  const filteredRooms = roomsWithOccupancy.filter(({ occupancy }) =>
    filterMap[filter].includes(occupancy.status)
  );

  const roomNameById = new Map(rooms.map((r) => [r._id, r]));

  const eventos: Evento[] = todaySchedules
    .filter((s) => s.status === "confirmado")
    .map((s) => {
      const room = roomNameById.get(s.room_id);
      return {
        id: s._id,
        nome: s.title,
        responsavel: s.professor_name,
        categoria: s.category,
        sala: room?.name ?? "Sala removida",
        andar: room ? floorLabel(room.floor) : "-",
        data: formatDateBR(s.date),
        horario: s.start_time,
      };
    });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocupação em Tempo Real</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe a disponibilidade das salas do instituto.
                </p>
              </div>

              <div className="grid grid-cols-3 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {(["TODAS", "LIVRES", "OCUPADAS"] as StatusFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-2 py-2 text-xs font-semibold transition-colors ${
                      filter === f
                        ? "bg-[#000666] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-400">Carregando salas...</p>
            ) : !instituteId ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                <p className="text-sm">Seu usuário não está vinculado a nenhum instituto.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {filteredRooms.map(({ room, occupancy }) => (
                    <AdminRoomCard
                      key={room._id}
                      name={room.name}
                      status={occupancy.status}
                      currentEvent={occupancy.currentEvent}
                      nextEvent={occupancy.nextEvent}
                      capacity={room.capacity}
                      freeUntil={occupancy.freeUntil}
                    />
                  ))}

                  {/* Add Card */}
                  <Link href="/admin/cadastrar-sala">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 hover:border-[#000666] hover:text-[#000666] transition-all cursor-pointer min-h-[300px]">
                      <div className="text-center justify-center flex flex-col items-center gap-2">
                        <CirclePlus size={36} />
                        <p className="font-bold uppercase tracking-wider text-sm">Cadastrar Sala</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Tabela de Eventos Refatorada */}
                <AdminEventTable
                  eventos={eventos}
                  rooms={rooms.map((r) => ({ id: r._id, name: r.name }))}
                />
              </>
            )}
          </main>

          <Footer />
        </div>
    </div>
  );
}
