"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  updateSchedule,
  ApiError,
  Room,
  Schedule,
  ScheduleCategory,
  SCHEDULE_CATEGORIES,
} from "@/lib/api";

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  room: Room | undefined;
  onScheduleUpdated: () => void;
}

export default function EditScheduleModal({
  isOpen,
  onClose,
  schedule,
  room,
  onScheduleUpdated,
}: EditScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ScheduleCategory | "">("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [expectedAudience, setExpectedAudience] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setCategory(schedule.category);
      setDate(schedule.date);
      setStartTime(schedule.start_time);
      setEndTime(schedule.end_time);
      setExpectedAudience(String(schedule.expected_audience));
      setEquipment(schedule.equipment_requested);
      setNotes(schedule.notes);
      setError("");
      setFieldErrors({});
    }
  }, [schedule, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const audienceNumber = Number(expectedAudience);
  const audienceExceedsCapacity =
    !!room && Number.isInteger(audienceNumber) && audienceNumber > room.capacity;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule) return;
    setError("");

    const errors: Record<string, boolean> = {
      title: !title.trim(),
      category: !category,
      date: !date,
      startTime: !startTime,
      endTime: !endTime,
      expectedAudience:
        !expectedAudience ||
        !Number.isInteger(audienceNumber) ||
        audienceNumber < 1 ||
        audienceExceedsCapacity,
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await updateSchedule(schedule._id, {
        title: title.trim(),
        category: category as ScheduleCategory,
        date,
        start_time: startTime,
        end_time: endTime,
        expected_audience: audienceNumber,
        equipment_requested: equipment,
        notes: notes.trim(),
      });
      onScheduleUpdated();
      onClose();
    } catch (err: any) {
      setError(
        err instanceof ApiError ? err.message : "Erro de conexão com o servidor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100"
      >
        <h3 className="text-lg font-bold text-[#000666] mb-5 border-b pb-2 border-b-gray-200">
          Editar Solicitação
        </h3>

        {error && (
          <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Sala / Instituto
            </label>
            <div className="w-full bg-gray-50 border border-gray-200 text-gray-600 rounded-md p-2 text-sm select-none">
              {room ? `${room.name} (Capacidade: ${room.capacity})` : "Sala não encontrada"}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Título do Evento / Disciplina
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Categoria
            </label>
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setCategoryOpen((v) => !v)}
                className={`flex items-center justify-between gap-2 w-full border rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white ${
                  fieldErrors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                {SCHEDULE_CATEGORIES.find((c) => c.value === category)?.label ?? "Selecione"}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {categoryOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  {SCHEDULE_CATEGORIES.map((c) => (
                    <li
                      key={c.value}
                      onClick={() => { setCategory(c.value); setCategoryOpen(false); }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Público Estimado
            </label>
            <input
              type="number"
              min={1}
              value={expectedAudience}
              onChange={(e) => setExpectedAudience(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.expectedAudience || audienceExceedsCapacity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {audienceExceedsCapacity && room && (
              <p className="text-xs text-red-600 font-semibold mt-1">
                O público estimado não pode ultrapassar a capacidade máxima da sala ({room.capacity} pessoas)
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Início</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.startTime ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Término</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.endTime ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Equipamentos Solicitados
            </label>
            {!room || room.resources.length === 0 ? (
              <p className="text-sm text-gray-400">Esta sala não possui recursos cadastrados.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {room.resources.map((resource) => (
                  <label
                    key={resource}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input
                      className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4"
                      type="checkbox"
                      checked={equipment.includes(resource)}
                      onChange={() => toggleEquipment(resource)}
                    />
                    <span className="text-sm text-gray-700">{resource}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm h-20 resize-none focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 border-t pt-4 border-t-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </form>
    </div>
  );
}
