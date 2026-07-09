"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowLeftRight, ChevronDown, AlertTriangle } from "lucide-react";
import {
  createSchedule,
  ApiError,
  ScheduleCategory,
  SCHEDULE_CATEGORIES,
} from "@/lib/api";

interface ProfSwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  instituteId: string;
  roomName: string;
  roomCapacity: number;
  currentEventTitle?: string;
}

export default function ProfSwapRequestModal({
  isOpen,
  onClose,
  roomId,
  instituteId,
  roomName,
  roomCapacity,
  currentEventTitle,
}: ProfSwapRequestModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<ScheduleCategory>("aula_regular");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [expectedAudience, setExpectedAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCategory("aula_regular");
    setDate(new Date().toISOString().split("T")[0]);
    setStartTime("");
    setEndTime("");
    setExpectedAudience("");
    setNotes("");
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const audienceNumber = Number(expectedAudience);
  const audienceExceedsCapacity =
    !!expectedAudience && Number.isInteger(audienceNumber) && audienceNumber > roomCapacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !date ||
      !startTime ||
      !endTime ||
      !expectedAudience ||
      !Number.isInteger(audienceNumber) ||
      audienceNumber < 1 ||
      audienceExceedsCapacity ||
      !notes.trim()
    ) {
      setError("Preencha todos os campos corretamente antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const context = currentEventTitle
        ? `Sala ocupada atualmente por: "${currentEventTitle}". `
        : "";
      await createSchedule({
        title: `Solicitação de troca — ${roomName}`,
        category,
        room_id: roomId,
        institute_id: instituteId,
        date,
        start_time: startTime,
        end_time: endTime,
        expected_audience: audienceNumber,
        recurrence: "unico",
        notes: `[TROCA] ${context}${notes.trim()}`,
      });
      alert("Solicitação de troca enviada para o administrador do instituto.");
      onClose();
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError("Sua sessão expirou. Faça login novamente.");
      } else {
        setError(err instanceof Error ? err.message : "Não foi possível enviar a solicitação.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-[#000666]">
            <ArrowLeftRight size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Solicitar Troca — {roomName}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
            Esta sala está ocupada{currentEventTitle ? ` por "${currentEventTitle}"` : ""}. Sua
            solicitação será enviada como um novo pedido de reserva desta sala, para aprovação do
            administrador do instituto.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data Desejada</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Público Esperado</label>
              <input
                type="number"
                required
                min={1}
                placeholder={`Máx. ${roomCapacity}`}
                value={expectedAudience}
                onChange={(e) => setExpectedAudience(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none ${
                  audienceExceedsCapacity ? "border-red-500" : "border-gray-200 focus:border-[#000666]"
                }`}
              />
              {audienceExceedsCapacity && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">
                  Acima da capacidade da sala ({roomCapacity}).
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Início</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fim</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoria</label>
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setCategoryOpen((v) => !v)}
                className="flex items-center justify-between gap-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50 focus:border-[#000666] focus:outline-none transition-colors"
              >
                {SCHEDULE_CATEGORIES.find((c) => c.value === category)?.label}
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
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Justificativa</label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explique o motivo da solicitação de troca..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || audienceExceedsCapacity}
              className="px-4 py-2 bg-[#000666] text-white rounded-lg text-xs font-semibold uppercase hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar ao Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
