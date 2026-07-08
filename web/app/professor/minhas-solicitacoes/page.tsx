"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfTopBar from "@/components/professor/ProfTopBar";
import Footer from "@/components/home/Footer";
import ProfSidebar from "@/components/professor/ProfSidebar";
import EditScheduleModal from "@/components/professor/EditScheduleModal";
import { Clock, CheckCircle2, XCircle, Calendar, MapPin, ChevronDown, Pencil, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getSchedules,
  getRooms,
  getInstitutes,
  ApiError,
  Schedule,
  Room,
  Institute,
  ScheduleCategory,
  ScheduleStatus,
  SCHEDULE_CATEGORIES,
} from "@/lib/api";

const categoryOptions = [
  { value: "Todos", label: "Filtrar por Categoria" },
  ...SCHEDULE_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

const statusOptions: { value: string; label: string }[] = [
  { value: "Todos", label: "Filtrar por Status" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
];

const statusBadges: Record<ScheduleStatus, { text: string; classes: string; icon: React.ReactNode }> = {
  pendente: {
    text: "Pendente",
    classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200",
    icon: <Clock size={12} className="text-amber-500 mr-1" />,
  },
  confirmado: {
    text: "Confirmado",
    classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200",
    icon: <CheckCircle2 size={12} className="text-green-500 mr-1" />,
  },
  cancelado: {
    text: "Cancelado",
    classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-50 text-red-700 border border-red-200",
    icon: <XCircle size={12} className="text-red-500 mr-1" />,
  },
};

function categoryLabel(category: ScheduleCategory): string {
  return SCHEDULE_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export default function MinhasSolicitacoes() {
  const router = useRouter();
  const { user } = useAuth();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const categoriaRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [schedulesData, roomsData, institutesData] = await Promise.all([
        getSchedules({ professor_id: user.id }),
        getRooms(),
        getInstitutes(),
      ]);
      setSchedules(schedulesData);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriaRef.current && !categoriaRef.current.contains(e.target as Node)) {
        setCategoriaOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roomsById = new Map(rooms.map((r) => [r._id, r]));
  const institutesById = new Map(institutes.map((i) => [i.id, i]));

  const solicitacoesFiltradas = schedules.filter((s) => {
    const bateCategoria = categoriaFiltro === "Todos" || s.category === categoriaFiltro;
    const bateStatus = statusFiltro === "Todos" || s.status === statusFiltro;
    return bateCategoria && bateStatus;
  });

  const openEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfSidebar activeHref="/professor/minhas-solicitacoes" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <ProfTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Minhas Solicitações de Reserva</h1>
              <p className="text-sm text-gray-500 mt-1">
                Aqui você pode visualizar e gerenciar suas solicitações de reserva.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

              {/* Barra Superior com os Dropdowns */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-700">Histórico de Pedidos</h3>

                {/* Grupo de Filtros */}
                <div className="flex items-center gap-3">
                  {/* Dropdown Filtro por Categoria */}
                  <div className="relative" ref={categoriaRef}>
                    <button
                      type="button"
                      onClick={() => setCategoriaOpen((v) => !v)}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-800 transition-colors shadow-sm font-medium"
                    >
                      {categoryOptions.find((o) => o.value === categoriaFiltro)?.label}
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {categoriaOpen && (
                      <ul className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {categoryOptions.map((o) => (
                          <li
                            key={o.value}
                            onClick={() => { setCategoriaFiltro(o.value); setCategoriaOpen(false); }}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                              categoriaFiltro === o.value ? "text-[#000666] font-semibold" : "text-gray-700"
                            }`}
                          >
                            {o.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Dropdown Filtro por Status */}
                  <div className="relative" ref={statusRef}>
                    <button
                      type="button"
                      onClick={() => setStatusOpen((v) => !v)}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-800 transition-colors shadow-sm font-medium"
                    >
                      {statusOptions.find((o) => o.value === statusFiltro)?.label}
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {statusOpen && (
                      <ul className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {statusOptions.map((o) => (
                          <li
                            key={o.value}
                            onClick={() => { setStatusFiltro(o.value); setStatusOpen(false); }}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                              statusFiltro === o.value ? "text-[#000666] font-semibold" : "text-gray-700"
                            }`}
                          >
                            {o.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Cabeçalho */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-gray-200 text-xs font-bold text-gray-500 tracking-wider">
                <div className="col-span-4">LOCALIZAÇÃO / AMBIENTE</div>
                <div className="col-span-3">HORÁRIO / DATA</div>
                <div className="col-span-2">CATEGORIA</div>
                <div className="col-span-2 text-right">STATUS</div>
                <div className="col-span-1 text-right">EDITAR</div>
              </div>

              {/* Corpo */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                  <Loader2 className="animate-spin text-[#000666]" size={32} />
                  <p className="text-sm">Carregando solicitações...</p>
                </div>
              ) : error ? (
                <div className="p-10 text-center text-red-600 text-sm font-semibold">{error}</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {solicitacoesFiltradas.length > 0 ? (
                    solicitacoesFiltradas.map((s) => {
                      const status = statusBadges[s.status];
                      const room = roomsById.get(s.room_id);
                      const institute = institutesById.get(s.institute_id);
                      const canEdit = s.status === "pendente";

                      return (
                        <div key={s._id} className="flex flex-col">
                          <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors">
                            <div className="col-span-4 flex items-center gap-4">
                              <div className="w-1.5 h-10 bg-[#000666] rounded-sm shrink-0"></div>
                              <div>
                                <p className="font-bold text-base text-gray-800">
                                  {room?.name ?? "Sala removida"}
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <MapPin size={12} /> {institute?.name ?? "-"}
                                </p>
                              </div>
                            </div>

                            <div className="col-span-3">
                              <p className="text-sm font-semibold text-gray-700">
                                {s.start_time} - {s.end_time}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar size={12} /> {formatDateBR(s.date)}
                              </p>
                            </div>

                            <div className="col-span-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600">
                                {categoryLabel(s.category)}
                              </span>
                            </div>

                            <div className="col-span-2 flex justify-end">
                              <span className={status.classes}>
                                {status.icon}
                                {status.text}
                              </span>
                            </div>

                            <div className="col-span-1 flex justify-end">
                              <button
                                onClick={() => canEdit && openEdit(s)}
                                disabled={!canEdit}
                                title={
                                  canEdit
                                    ? "Editar solicitação"
                                    : "Não é possível editar uma solicitação já processada"
                                }
                                className="p-1.5 text-gray-400 hover:text-[#000666] hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                              >
                                <Pencil size={18} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-10 text-center text-gray-500 text-sm">
                      Nenhuma solicitação encontrada com os filtros selecionados.
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>

          <Footer />
        </div>

      <EditScheduleModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        schedule={selectedSchedule}
        room={selectedSchedule ? roomsById.get(selectedSchedule.room_id) : undefined}
        onScheduleUpdated={fetchData}
      />
    </div>
  );
}
