"use client";

import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/home/Footer";
import ProfRoomCard from "@/components/professor/ProfRoomCard";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import ProfSidebar from "@/components/professor/ProfSidebar";
import ProfTopBar from "@/components/professor/ProfTopBar";
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

  const filtered = roomsWithOccupancy.filter(({ occupancy }) =>
    filterMap[filter].includes(occupancy.status)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfSidebar activeHref="/professor" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <ProfTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocupação em Tempo Real</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe a disponibilidade das salas do seu instituto.
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
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                <p className="text-sm">Nenhuma sala cadastrada neste instituto.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                <p className="text-sm">Nenhuma sala encontrada para o filtro selecionado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map(({ room, occupancy }) => (
                  <ProfRoomCard
                    key={room._id}
                    roomId={room._id}
                    instituteId={room.institute_id}
                    name={room.name}
                    status={occupancy.status}
                    currentEvent={occupancy.currentEvent}
                    nextEvent={occupancy.nextEvent}
                    capacity={room.capacity}
                    freeUntil={occupancy.freeUntil}
                  />
                ))}

                {/* Add Card */}
                <Link href="/professor/cadastrar-evento">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 hover:border-[#000666] hover:text-[#000666] transition-all cursor-pointer min-h-[300px]">
                    <div className="text-center justify-center flex flex-col items-center gap-2">
                      <CirclePlus size={36} />
                      <p className="font-bold uppercase tracking-wider text-sm">Cadastrar Evento</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </main>

          <Footer />
        </div>
    </div>
  );
}
