"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminRoomCard from "@/components/admin/AdminRoomCard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type StatusFilter = "TODAS" | "LIVRES" | "OCUPADAS";
type RoomStatus = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface Room {
  id: number;
  name: string;
  status: RoomStatus;
  currentEvent?: { title: string; startTime: string; endTime: string };
  nextEvent?: { title: string; time: string };
  capacity: number;
  freeUntil?: string;
}

interface Evento {
  id: number;
  nome: string;
  tipo: string;
  sala: string;
  predio: string;
  data: string;
  horario: string;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "SmartClass II",
    status: "OCUPADA",
    currentEvent: { title: "Aula: Grafos", startTime: "07:55", endTime: "09:35" },
    nextEvent: { title: "Reunião Geral IC", time: "10:00" },
    capacity: 40,
  },
  {
    id: 2,
    name: "Laboratório 1",
    status: "LIVRE",
    nextEvent: { title: "Aula: Lab 1 (Redes)", time: "11:35" },
    capacity: 30,
  },
  {
    id: 3,
    name: "Sala 101",
    status: "OCUPADA",
    currentEvent: { title: "Aula: EDA 1", startTime: "08:50", endTime: "10:40" },
    nextEvent: { title: "Cálculo A", time: "13:00" },
    capacity: 60,
  },
  {
    id: 4,
    name: "Sala de Reuniões",
    status: "EM_REUNIAO",
    currentEvent: { title: "Planejamento 2026", startTime: "09:00", endTime: "11:00" },
    nextEvent: { title: "Reunião Formas", time: "14:50" },
    capacity: 12,
  },
  {
    id: 5,
    name: "Auditório",
    status: "LIVRE",
    nextEvent: { title: "Colação de Grau", time: "18:30" },
    capacity: 120,
    freeUntil: "18:30",
  },
  {
    id: 6,
    name: "Sala 102",
    status: "OCUPADA",
    currentEvent: { title: "Aula: POO", startTime: "07:55", endTime: "09:35" },
    nextEvent: { title: "Eletromag", time: "09:45" },
    capacity: 45,
  },
];

const filterMap: Record<StatusFilter, RoomStatus[]> = {
  TODAS: ["OCUPADA", "LIVRE", "EM_REUNIAO"],
  LIVRES: ["LIVRE"],
  OCUPADAS: ["OCUPADA", "EM_REUNIAO"],
};

const mockEventos: Evento[] = [
  { id: 1, nome: "Aula: Grafos", tipo: "Aula", sala: "SmartClass II", predio: "Instituto de Computação", data: "24 Out", horario: "07:55" },
  { id: 2, nome: "Reunião Geral IC", tipo: "Reunião", sala: "SmartClass II", predio: "Instituto de Computação", data: "24 Out", horario: "10:00" },
  { id: 3, nome: "Aula: Lab 1", tipo: "Aula", sala: "Laboratório 1", predio: "Instituto de Computação", data: "24 Out", horario: "11:35" },
  { id: 4, nome: "Planejamento 2026", tipo: "Reunião", sala: "Sala de Reuniões", predio: "Faculdade de Direito", data: "24 Out", horario: "09:00" },
];

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [{ id: 1, name: "Instituto de Computação" }, {id: 2, name: "Faculdade de Direito"}];

export default function Home() {

  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);

  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  const [filter, setFilter] = useState<StatusFilter>("TODAS");

  const filtered = rooms.filter((r) => filterMap[filter].includes(r.status));

  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [salaFiltro, setSalaFiltro] = useState("Todas");
  const [predioFiltro, setPredioFiltro] = useState("Todos");

  const eventosFiltrados = mockEventos.filter(e => 
    (tipoFiltro === "Todos" || e.tipo === tipoFiltro) &&
    (salaFiltro === "Todas" || e.sala === salaFiltro) &&
    (predioFiltro === "Todos" || e.predio === predioFiltro)
  );

return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/admin" />

        <div className="flex flex-col flex-1 overflow-hidden">

          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocupação em Tempo Real</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe a disponibilidade das salas do IC.
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

            <div className="grid grid-cols-3 gap-4">
              {filtered.map((room) => (
                <AdminRoomCard key={room.id} {...room} />
              ))}
              
              {/* Add Card */}
              <Link href="/salas/cadastrar-evento">
							  <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 hover:border-[#000666] hover:text-[#000666] transition-all cursor-pointer min-h-[300px]">
							    <div className="text-center justify-center flex flex-col items-center gap-2">
							  		<CirclePlus size={36}/>
							      <p className="font-bold uppercase tracking-wider text-sm">Cadastrar Evento</p>
							    </div>
							  </div>
              </Link>
            </div>

            {/* Tabela de Eventos */}
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
                  >
                    <option value="Todos">Filtrar por Prédio</option>
                    <option value="Instituto de Computação">Instituto de Computação</option>
                    <option value="Faculdade de Direito">Faculdade de Direito</option>
                  </select>
                  
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#000666]"
                    onChange={(e) => setSalaFiltro(e.target.value)}
                  >
                    <option value="Todas">Filtrar por Sala</option>
                    {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
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
                    <div key={ev.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors">
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}