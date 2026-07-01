"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface Evento {
  id: number;
  nome: string;
  tipo: string;
  sala: string;
  predio: string;
  data: string;
  horario: string;
}

interface RoomOption {
  id: number;
  name: string;
}

interface AdminEventTableProps {
  eventos: Evento[];
  rooms: RoomOption[];
}

export default function AdminEventTable({ eventos, rooms }: AdminEventTableProps) {
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [salaFiltro, setSalaFiltro] = useState("Todas");
  const [predioFiltro, setPredioFiltro] = useState("Todos");

  const eventosFiltrados = eventos.filter((e) => 
    (tipoFiltro === "Todos" || e.tipo === tipoFiltro) &&
    (salaFiltro === "Todas" || e.sala === salaFiltro) &&
    (predioFiltro === "Todos" || e.predio === predioFiltro)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      {/* Barra de Filtros Superior */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        
        {/* Filtros de Categoria */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["Todos", "Aula", "Reunião"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTipoFiltro(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                tipoFiltro === tab
                  ? "bg-[#000666] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filtros de Localização */}
        <div className="flex items-center gap-3">
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#000666]"
            onChange={(e) => setPredioFiltro(e.target.value)}
            value={predioFiltro}
          >
            <option value="Todos">Filtrar por Prédio</option>
            <option value="Instituto de Computação">Instituto de Computação</option>
            <option value="Faculdade de Direito">Faculdade de Direito</option>
          </select>

          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#000666]"
            onChange={(e) => setSalaFiltro(e.target.value)}
            value={salaFiltro}
          >
            <option value="Todas">Filtrar por Sala</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
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
                  <p className="text-sm text-gray-500 mt-0.5">Responsável não definido</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600">
                  {ev.tipo}
                </span>
              </div>

              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-800">{ev.sala}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ev.predio}</p>
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