"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/home/Sidebar";
import TopBar from "@/components/home/TopBar";
import Footer from "@/components/home/Footer";
import RoomCard from "@/components/home/RoomCard";
import {
  getInstitutes,
  getRooms,
  getSchedulesToday,
  Institute,
  Room,
  Schedule,
} from "@/lib/api";
import { computeRoomOccupancy, RoomOccupancyStatus } from "@/lib/roomOccupancy";

type StatusFilter = "TODAS" | "LIVRES" | "OCUPADAS";

const filterMap: Record<StatusFilter, RoomOccupancyStatus[]> = {
  TODAS: ["OCUPADA", "LIVRE", "EM_REUNIAO"],
  LIVRES: ["LIVRE"],
  OCUPADAS: ["OCUPADA", "EM_REUNIAO"],
};

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const REFRESH_INTERVAL_MS = 60_000;

export default function Home() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);

  useEffect(() => {
    getInstitutes()
      .then((data) => {
        setInstitutes(data);
        if (data.length > 0) {
          setSelectedInstitute(data[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setInstitutes([]);
        setIsLoading(false);
      });
  }, []);

  const [filter, setFilter] = useState<StatusFilter>("TODAS");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOccupancy = useCallback(async (instituteId: string) => {
    const [roomsData, schedulesData] = await Promise.all([
      getRooms({ institute_id: instituteId, status: "ativa" }),
      getSchedulesToday(instituteId),
    ]);
    setRooms(roomsData);
    setTodaySchedules(schedulesData);
  }, []);

  useEffect(() => {
    if (!selectedInstitute) return;

    setIsLoading(true);
    loadOccupancy(selectedInstitute).finally(() => setIsLoading(false));

    const interval = setInterval(
      () => loadOccupancy(selectedInstitute),
      REFRESH_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, [selectedInstitute, loadOccupancy]);

  const roomsWithOccupancy = rooms.map((room) => ({
    room,
    occupancy: computeRoomOccupancy(room, todaySchedules),
  }));

  const filtered = roomsWithOccupancy.filter(({ occupancy }) =>
    filterMap[filter].includes(occupancy.status)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeHref="/" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          campuses={mockCampuses}
          selectedCampus={selectedCampus}
          onCampusChange={setSelectedCampus}
          institutes={institutes}
          selectedInstitute={selectedInstitute}
          onInstituteChange={setSelectedInstitute}
        />

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
                <RoomCard
                  key={room._id}
                  name={room.name}
                  status={occupancy.status}
                  currentEvent={occupancy.currentEvent}
                  nextEvent={occupancy.nextEvent}
                  capacity={room.capacity}
                  freeUntil={occupancy.freeUntil}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
