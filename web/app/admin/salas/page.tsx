"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRoomTable from "@/components/admin/AdminRoomTable";
import AdminRoomModals from "@/components/admin/AdminRoomModals";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getRooms, getInstitutes, ApiError, Room, Institute } from "@/lib/api";

export default function GestaoSalas() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const instituteId = user?.institutes?.[0]?.id;

  const fetchData = async () => {
    try {
      const [roomsData, institutesData] = await Promise.all([
        getRooms(instituteId ? { institute_id: instituteId } : undefined),
        getInstitutes(),
      ]);
      setRooms(roomsData);
      setInstitutes(institutesData);
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsEditOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/salas" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestão de Salas</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gerencie as salas disponíveis para reserva no seu instituto.
              </p>
            </div>

            <Link href="/admin/cadastrar-sala">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#000666] text-white rounded-md font-bold text-sm tracking-wide hover:bg-blue-900 transition-colors shadow-sm">
                <Plus size={18} />
                ADICIONAR SALA
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <Loader2 className="animate-spin text-[#000666]" size={36} />
              <p className="text-sm">Carregando salas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm font-semibold max-w-md mx-auto mt-10">
              {error}
            </div>
          ) : (
            <AdminRoomTable rooms={rooms} onEdit={openEdit} />
          )}
        </main>

        <Footer />
      </div>

      <AdminRoomModals
        isEditOpen={isEditOpen}
        onCloseEdit={() => setIsEditOpen(false)}
        selectedRoom={selectedRoom}
        institutes={institutes}
        onRoomUpdated={fetchData}
      />
    </div>
  );
}
