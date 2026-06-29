"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, CheckCircle, Calendar, Clock, Users } from "lucide-react";

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

// MOCKS DA TRANSAÇÃO (EVENTO)
const mockAvailableRooms = [
  { id: 1, name: "Sala 102 - Bloco A (Capacidade: 45)" },
  { id: 2, name: "Auditório Laranja (Capacidade: 120)" },
  { id: 3, name: "Laboratório 1 (Capacidade: 30)" },
  { id: 4, name: "Sala de Reuniões (Capacidade: 12)" },
];

const mockCategories = [
  { id: "aula_regular", name: "Aula Regular / Extra" },
  { id: "defesa", name: "Defesa de Tese / Dissertação" },
  { id: "palestra", name: "Palestra / Workshop" },
  { id: "reuniao", name: "Reunião de Departamento" },
  { id: "minicurso", name: "Minicurso / Extensão" },
];

const mockProfessors = [
  { id: 1, name: "Dr. Carlos Alberto (DCC)" },
  { id: 2, name: "Dra. Maria Helena (DCC)" },
  { id: 3, name: "Prof. Ricardo Silva (DSI)" },
  { id: 4, name: "Profa. Ana Costa (DSI)" },
];

export default function Home() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/salas" />

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
                <form className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  
                  {/* Linha 1: O Quê */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="event_title">Título do Evento / Disciplina</label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="event_title" placeholder="Ex: IA Generativa na Prática" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="category">Categoria da Atividade</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="category">
                        <option value="">Selecione o motivo...</option>
                        {mockCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Linha 2: Quem e Onde */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="professor">Professor Responsável</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="professor">
                        <option value="">Selecione o docente...</option>
                        {mockProfessors.map((prof) => (
                          <option key={prof.id} value={prof.id}>{prof.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="room">Sala Pretendida</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="room">
                        <option value="">Selecione o espaço...</option>
                        {mockAvailableRooms.map((room) => (
                          <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Linha 3: Quando */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="date">
                        <Calendar size={15} className="text-[#000666]" /> Data
                      </label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600" id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="start_time">
                        <Clock size={15} className="text-[#000666]" /> Início
                      </label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600" id="start_time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="end_time">
                        <Clock size={15} className="text-[#000666]" /> Término
                      </label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors text-gray-600" id="end_time" type="time" />
                    </div>
                  </div>

                  {/* Linha 4: Dimensionamento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 flex items-center gap-1.5" htmlFor="expected_audience">
                        <Users size={15} className="text-[#000666]" /> Público Estimado
                      </label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="expected_audience" placeholder="Ex: 35" type="number" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="recurrence">Tipo de Agendamento</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="recurrence">
                        <option>Evento Único (Apenas na data selecionada)</option>
                        <option>Semanal (Toda semana até o fim do semestre)</option>
                        <option>Quinzenal</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Linha 5: Logística */}
                  <div className="space-y-4">
                    <label className="font-bold text-sm text-gray-700">Equipamentos Solicitados para o Evento</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Ar Condicionado</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Projetor HDMI</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Microfone / Áudio</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Acesso aos PCs</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Gravação de Aula</span>
                      </label>
                    </div>
                  </div>

                  {/* Linha 6: Justificativa */}
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700" htmlFor="motivo_extra">Observações adicionais / Justificativa</label>
                    <textarea className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors h-24 resize-none" id="motivo_extra" placeholder="Ex: Precisaremos abrir a sala 15 minutos antes para montar os banners..." />
                  </div>
                  
                  {/* Botões */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <button className="px-6 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors" type="button">
                      CANCELAR
                    </button>
                    <button className="px-6 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors shadow-sm" type="submit">
                      SOLICITAR RESERVA
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar Info - Atualizada para contexto de Eventos */}
              <div className="space-y-6">
                
                <div className="bg-[#000666] text-white p-6 rounded-lg border-l-4 border-blue-400">
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
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Pedidos de Defesa de Tese têm prioridade máxima sobre agendamentos de reuniões.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">O público estimado não pode ultrapassar a capacidade máxima da sala selecionada.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Solicitações de turnos noturnos exigem aviso prévio de 48h à portaria.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}