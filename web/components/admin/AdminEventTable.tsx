"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { ScheduleCategory, SCHEDULE_CATEGORIES } from "@/lib/api";

export interface Evento {
  id: string;
  nome: string;
  responsavel: string;
  categoria: ScheduleCategory;
  sala: string;
  andar: string;
  data: string;
  horario: string;
}

interface RoomOption {
  id: string;
  name: string;
}

interface AdminEventTableProps {
  eventos: Evento[];
  rooms: RoomOption[];
}

export default function AdminEventTable({ eventos, rooms }: AdminEventTableProps) {
  const [categoriaFiltro, setCategoriaFiltro] = useState<ScheduleCategory | "Todos">("Todos");
  const [salaFiltro, setSalaFiltro] = useState("Todas");

  const [salaOpen, setSalaOpen] = useState(false);
  const salaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (salaRef.current && !salaRef.current.contains(e.target as Node)) {
        setSalaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventosFiltrados = eventos.filter(
    (e) =>
      (categoriaFiltro === "Todos" || e.categoria === categoriaFiltro) &&
      (salaFiltro === "Todas" || e.sala === salaFiltro)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      {/* Barra de Filtros Superior */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-wrap gap-3">
        {/* Filtros de Categoria */}
        <div className="flex bg-gray-100 p-1 rounded-lg flex-wrap gap-1">
          <button
            onClick={() => setCategoriaFiltro("Todos")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              categoriaFiltro === "Todos"
                ? "bg-[#000666] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Todos
          </button>
          {SCHEDULE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoriaFiltro(cat.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                categoriaFiltro === cat.value
                  ? "bg-[#000666] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filtro de Sala */}
        <div className="relative" ref={salaRef}>
          <button
            type="button"
            onClick={() => setSalaOpen((v) => !v)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#000666] transition-colors"
          >
            {salaFiltro === "Todas" ? "Filtrar por Sala" : salaFiltro}
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {salaOpen && (
            <ul className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-56 overflow-y-auto">
              <li
                onClick={() => { setSalaFiltro("Todas"); setSalaOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                  salaFiltro === "Todas" ? "text-[#000666] font-semibold" : "text-gray-700"
                }`}
              >
                Filtrar por Sala
              </li>
              {rooms.map((r) => (
                <li
                  key={r.id}
                  onClick={() => { setSalaFiltro(r.name); setSalaOpen(false); }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                    salaFiltro === r.name ? "text-[#000666] font-semibold" : "text-gray-700"
                  }`}
                >
                  {r.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">Evento / Responsável</div>
        <div className="col-span-2">Tipo</div>
        <div className="col-span-3">Localização</div>
        <div className="col-span-2">Data / Horário</div>
        <div className="col-span-1 text-right">Ações</div>
      </div>

      {/* Corpo da Tabela Dinâmico */}
      <div className="divide-y divide-gray-100">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((ev) => (
            <div
              key={ev.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-1.5 h-10 bg-[#000666] rounded-sm"></div>
                <div>
                  <p className="font-bold text-base text-[#000666]">{ev.nome}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{ev.responsavel}</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600">
                  {SCHEDULE_CATEGORIES.find((c) => c.value === ev.categoria)?.label ?? ev.categoria}
                </span>
              </div>

              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-800">{ev.sala}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ev.andar}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-800">{ev.data}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ev.horario}</p>
              </div>

              <div className="col-span-1 flex justify-end gap-3">
                <button className="p-1.5 text-gray-400 hover:text-[#000666] transition-colors">
                  <Pencil size={18} />
                </button>
                <button className="p-1.5 text-[#d94848] hover:text-red-700 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500 text-sm">
            Nenhum evento encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
