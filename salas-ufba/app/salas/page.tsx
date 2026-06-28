"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { CirclePlus, DoorOpen, ClipboardList, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

// 1. Interface para tipar as solicitações
interface Solicitacao {
  id: number;
  professor: string;
  sala: string;
  horario: string;
  data: string;
  motivo: string;
}

// 2. Dados de demonstração (7 solicitações)
const mockRequests: Solicitacao[] = [
  { id: 1, professor: "Dr. Carlos Alberto", sala: "Sala 102 - Bloco A", horario: "14:00 - 16:00", data: "Hoje, 24 Out", motivo: "Aula Extra" },
  { id: 2, professor: "Dra. Maria Helena", sala: "Auditório Laranja", horario: "08:30 - 11:30", data: "Amanhã, 25 Out", motivo: "Defesa de Tese" },
  { id: 3, professor: "Prof. Ricardo Silva", sala: "Sala 101 - Bloco B", horario: "19:00 - 22:00", data: "Hoje, 24 Out", motivo: "Reunião" },
  { id: 4, professor: "Profa. Ana Costa", sala: "Laboratório 1", horario: "10:00 - 12:00", data: "Amanhã, 25 Out", motivo: "Aula Prática" },
  { id: 5, professor: "Dr. João Pedro", sala: "Sala 205 - Bloco C", horario: "14:00 - 18:00", data: "26 Out", motivo: "Minicurso" },
  { id: 6, professor: "Profa. Fernanda Lima", sala: "Auditório Azul", horario: "09:00 - 12:00", data: "27 Out", motivo: "Palestra" },
  { id: 7, professor: "Prof. Marcos Paulo", sala: "Sala de Reuniões", horario: "15:00 - 16:00", data: "27 Out", motivo: "Orientação" },
];

export default function Home() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  // Estados para as solicitações e paginação
  const [requests, setRequests] = useState<Solicitacao[]>(mockRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cálculos da paginação
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Exemplo de como adicionar uma nova solicitação dinamicamente:
  // const adicionarSolicitacao = (novaSolicitacao: Solicitacao) => {
  //   setRequests([novaSolicitacao, ...requests]);
  // };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/salas" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-8 mt-1 pb-12">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestão de Salas e Ambientes</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerencie a disponibilidade, capacidade e recursos técnicos dos espaços do instituto.
                </p>
              </div>
              {/* Occupation Summary Grid */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        Ocupação Atual
                      </span>
                      <DoorOpen className="text-[#000666]" size={20} />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-[#000666]">
                        72%
                      </span>
                      <span className="text-sm font-semibold text-[#00a8e8]">
                        +5% vs ontem
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
                    <div className="bg-[#000666] h-full" style={{ width: "72%" }}></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        Pendências
                      </span>
                      <ClipboardList className="text-[#6bb5ff]" size={20} />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-[#000666]">
                        12
                      </span>
                      <span className="text-sm text-gray-500">
                        solicitações
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-6">
                    Urgência: <span className="text-[#d90000] font-bold">Alta</span>
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        Salas Disponíveis
                      </span>
                      <CalendarCheck className="text-[#0074d9]" size={20} />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-[#000666]">
                        08
                      </span>
                      <span className="text-sm text-gray-500">
                        de 32 totais
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-6">Bloco A e B</p>
                </div>

                <div className="flex flex-col gap-3 h-full">
                  <Link href="/salas/cadastrar-sala" className="flex-1 block">
                    <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                      <CirclePlus
                        size={24}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-bold text-xs uppercase tracking-wider">
                        Cadastrar Sala
                      </span>
                    </button>
                  </Link>

                  <Link href="/salas/cadastrar-evento" className="flex-1 block">
                    <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                      <CirclePlus
                        size={24}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-bold text-xs uppercase tracking-wider">
                        Cadastrar Evento
                      </span>
                    </button>
                  </Link>
                </div>
              </section>

              {/* Tabela de Solicitações Redesenhada */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-12">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[#000666]">
                    Solicitações Pendentes
                  </h3>
                  <span className="text-xs font-bold bg-[#f0f4ff] text-[#000666] px-3 py-1 rounded-full">
                    {requests.length} totais
                  </span>
                </div>

                {/* Table Column Headers */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-gray-200 text-xs font-bold text-gray-500 tracking-wider">
                  <div className="col-span-4">PROFESSOR / SALA</div>
                  <div className="col-span-3">HORÁRIO / DATA</div>
                  <div className="col-span-3">MOTIVO</div>
                  <div className="col-span-2 text-right">AÇÕES</div>
                </div>

                {/* Table Body (Renderizado Dinamicamente) */}
                <div className="divide-y divide-gray-200">
                  {currentRequests.map((req) => (
                    <div key={req.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors">
                      
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-[#000666] rounded-sm"></div>
                        <div>
                          <p className="font-bold text-base text-[#000666]">{req.professor}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{req.sala}</p>
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        <p className="text-base text-gray-800">{req.horario}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{req.data}</p>
                      </div>
                      
                      <div className="col-span-3">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#e9ecef] text-gray-700">
                          {req.motivo}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex justify-end gap-2">
                        {/* Botões menores usando px-4 py-1.5 e text-xs */}
                        <button className="px-4 py-1.5 bg-[#000666] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors">
                          Aceitar
                        </button>
                        <button className="px-4 py-1.5 border border-[#d90000] text-[#d90000] rounded text-xs font-semibold hover:bg-red-50 transition-colors">
                          Recusar
                        </button>
                      </div>

                    </div>
                  ))}

                  {/* Estado Vazio caso não haja solicitações */}
                  {requests.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      Nenhuma solicitação pendente no momento.
                    </div>
                  )}
                </div>

                {/* Controles de Paginação */}
                {requests.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-[#f8f9fa]">
                    <span className="text-sm text-gray-500">
                      Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, requests.length)}</span> de <span className="font-medium text-gray-900">{requests.length}</span> resultados
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      <span className="text-sm font-medium text-gray-700 px-2">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
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