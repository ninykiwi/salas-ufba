"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, CheckCircle, Calendar, Clock, Users, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getRooms,
  createSchedule,
  ApiError,
  Room,
  ScheduleCategory,
  ScheduleRecurrence,
  SCHEDULE_CATEGORIES,
  SCHEDULE_RECURRENCES,
} from "@/lib/api";

export default function CadastrarEventoAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const instituteId = user?.institutes?.[0]?.id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory | "">("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [expectedAudience, setExpectedAudience] = useState("");
  const [recurrence, setRecurrence] = useState<ScheduleRecurrence>("unico");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const recurrenceRef = useRef<HTMLDivElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!instituteId) return;
    setIsLoadingRooms(true);
    getRooms({ institute_id: instituteId, status: "ativa" })
      .then(setRooms)
      .catch(() => setError("Não foi possível carregar as salas do instituto."))
      .finally(() => setIsLoadingRooms(false));
  }, [instituteId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) {
        setRoomOpen(false);
      }
      if (recurrenceRef.current && !recurrenceRef.current.contains(e.target as Node)) {
        setRecurrenceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRoom = rooms.find((r) => r._id === selectedRoomId);
  const audienceNumber = Number(expectedAudience);
  const audienceExceedsCapacity =
    !!selectedRoom && Number.isInteger(audienceNumber) && audienceNumber > selectedRoom.capacity;

  const handleRoomChange = (id: string) => {
    setSelectedRoomId(id);
    setEquipment([]);
    setRoomOpen(false);
  };

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!instituteId) {
      setError("Seu usuário não está vinculado a nenhum instituto.");
      return;
    }

    const errors: Record<string, boolean> = {
      title: !title.trim(),
      category: !selectedCategory,
      room: !selectedRoomId,
      date: !date,
      startTime: !startTime,
      endTime: !endTime,
      expectedAudience:
        !expectedAudience ||
        !Number.isInteger(audienceNumber) ||
        audienceNumber < 1 ||
        audienceExceedsCapacity,
      recurrenceEndDate: recurrence !== "unico" && !recurrenceEndDate,
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await createSchedule({
        title: title.trim(),
        category: selectedCategory as ScheduleCategory,
        room_id: selectedRoomId,
        institute_id: instituteId,
        date,
        start_time: startTime,
        end_time: endTime,
        expected_audience: audienceNumber,
        recurrence,
        recurrence_end_date: recurrence !== "unico" ? recurrenceEndDate : undefined,
        equipment_requested: equipment,
        notes: notes.trim() || undefined,
      });
      router.push("/admin");
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      setError(err.message || "Erro ao enviar a solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/cadastrar-evento" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <nav className="flex text-sm font-medium text-gray-500 mb-2">
                <span>Salas</span>
                <span className="mx-2">/</span>
                <span className="text-[#000666] font-bold">Cadastrar Evento</span>
              </nav>
              <h1 className="text-xl font-bold text-gray-900">Nova Solicitação de Reserva</h1>
              <p className="text-sm text-gray-400 mt-1">
                Preencha os dados técnicos do evento para submeter o pedido à aprovação da coordenação.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

              {/* Formulário Principal */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Linha 1: O Quê */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="event_title">Título do Evento / Disciplina</label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                          fieldErrors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        id="event_title"
                        placeholder="Ex: IA Generativa na Prática"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Categoria da Atividade</label>
                      <div className="relative" ref={categoryRef}>
                        <button
                          type="button"
                          onClick={() => setCategoryOpen((v) => !v)}
                          className={`flex items-center justify-between gap-2 w-full bg-white border rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                            fieldErrors.category ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {SCHEDULE_CATEGORIES.find((cat) => cat.value === selectedCategory)?.label ?? "Selecione o motivo..."}
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {categoryOpen && (
                          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-56 overflow-y-auto">
                            {SCHEDULE_CATEGORIES.map((cat) => (
                              <li
                                key={cat.value}
                                onClick={() => { setSelectedCategory(cat.value); setCategoryOpen(false); }}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                {cat.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Linha 2: Onde */}
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700">Sala Pretendida</label>
                    <div className="relative" ref={roomRef}>
                      <button
                        type="button"
                        onClick={() => setRoomOpen((v) => !v)}
                        disabled={isLoadingRooms}
                        className={`flex items-center justify-between gap-2 w-full bg-white border rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors disabled:opacity-50 ${
                          fieldErrors.room ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {isLoadingRooms
                          ? "Carregando..."
                          : selectedRoom
                          ? `${selectedRoom.name} (Capacidade: ${selectedRoom.capacity})`
                          : "Selecione o espaço..."}
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>
                      {roomOpen && (
                        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-56 overflow-y-auto">
                          {rooms.map((room) => (
                            <li
                              key={room._id}
                              onClick={() => handleRoomChange(room._id)}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              {room.name} (Capacidade: {room.capacity})
                            </li>
                          ))}
                          {rooms.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-400">Nenhuma sala ativa neste instituto.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Linha 3: Quando */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="date">
                        <Calendar size={15} className="text-[#000666]" /> Data
                      </label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600 ${
                          fieldErrors.date ? "border-red-500" : "border-gray-300"
                        }`}
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="start_time">
                        <Clock size={15} className="text-[#000666]" /> Início
                      </label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600 ${
                          fieldErrors.startTime ? "border-red-500" : "border-gray-300"
                        }`}
                        id="start_time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="end_time">
                        <Clock size={15} className="text-[#000666]" /> Término
                      </label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600 ${
                          fieldErrors.endTime ? "border-red-500" : "border-gray-300"
                        }`}
                        id="end_time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Linha 4: Dimensionamento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="expected_audience">
                        <Users size={15} className="text-[#000666]" /> Público Estimado
                      </label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                          fieldErrors.expectedAudience || audienceExceedsCapacity ? "border-red-500" : "border-gray-300"
                        }`}
                        id="expected_audience"
                        placeholder="Ex: 35"
                        type="number"
                        min={1}
                        value={expectedAudience}
                        onChange={(e) => setExpectedAudience(e.target.value)}
                      />
                      {audienceExceedsCapacity && selectedRoom && (
                        <p className="text-xs text-red-600 font-semibold">
                          O público estimado não pode ultrapassar a capacidade máxima da sala ({selectedRoom.capacity} pessoas)
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Tipo de Agendamento</label>
                      <div className="relative" ref={recurrenceRef}>
                        <button
                          type="button"
                          onClick={() => setRecurrenceOpen((v) => !v)}
                          className="flex items-center justify-between gap-2 w-full bg-white border border-gray-300 rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors"
                        >
                          {SCHEDULE_RECURRENCES.find((r) => r.value === recurrence)?.label}
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {recurrenceOpen && (
                          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            {SCHEDULE_RECURRENCES.map((option) => (
                              <li
                                key={option.value}
                                onClick={() => { setRecurrence(option.value); setRecurrenceOpen(false); }}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                {option.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {recurrence !== "unico" && (
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="recurrence_end_date">
                        <Calendar size={15} className="text-[#000666]" /> Data de Término da Recorrência
                      </label>
                      <input
                        className={`w-full md:w-1/2 bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600 ${
                          fieldErrors.recurrenceEndDate ? "border-red-500" : "border-gray-300"
                        }`}
                        id="recurrence_end_date"
                        type="date"
                        min={date || undefined}
                        value={recurrenceEndDate}
                        onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Linha 5: Logística */}
                  <div className="space-y-4">
                    <label className="font-bold text-sm text-gray-700">Equipamentos Solicitados para o Evento</label>
                    {!selectedRoom ? (
                      <p className="text-sm text-gray-400">Selecione uma sala para ver os equipamentos disponíveis.</p>
                    ) : selectedRoom.resources.length === 0 ? (
                      <p className="text-sm text-gray-400">Esta sala não possui recursos cadastrados.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedRoom.resources.map((resource) => (
                          <label
                            key={resource}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <input
                              className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4"
                              type="checkbox"
                              checked={equipment.includes(resource)}
                              onChange={() => toggleEquipment(resource)}
                            />
                            <span className="text-sm font-medium text-gray-700">{resource}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Linha 6: Justificativa */}
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700" htmlFor="motivo_extra">Observações adicionais / Justificativa</label>
                    <textarea
                      className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors h-24 resize-none"
                      id="motivo_extra"
                      placeholder="Ex: Precisaremos abrir a sala 15 minutos antes para montar os banners..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      className="px-6 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors"
                      type="button"
                      onClick={() => router.push("/admin")}
                      disabled={isSubmitting}
                    >
                      CANCELAR
                    </button>
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                      SOLICITAR RESERVA
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar Info - Atualizada para contexto de Eventos */}
              <div className="space-y-6">

                <div className="bg-[#000666] text-white p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={20} className="text-blue-300" />
                    <h3 className="font-bold text-base">Fluxo de Aprovação</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Sua solicitação entrará no status <strong className="text-yellow-300">Pendente</strong>. A secretaria do Instituto fará a checagem de choques de horário e notificará o e-mail do professor responsável.
                  </p>
                </div>

                <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base text-[#000666] mb-4">Regras da Instituição</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Pedidos de Defesa de Tese têm prioridade máxima sobre agendamentos de reuniões.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">O público estimado não pode ultrapassar a capacidade máxima da sala selecionada.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Solicitações de turnos noturnos exigem aviso prévio de 48h à portaria.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </main>

          <Footer />
        </div>
    </div>
  );
}
