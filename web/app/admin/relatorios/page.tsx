"use client";

import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminRequestsTable, { Solicitacao } from "@/components/admin/AdminRequestsTable";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

const mockRequests: Solicitacao[] = [
  { id: 1, professor: "Dr. Carlos Alberto", sala: "Sala 102 - Bloco A", horario: "14:00 - 16:00", data: "Hoje, 24 Out", motivo: "Aula Extra", tipo: "CANCELAMENTO", frequencia: "Única", descricao: "Necessidade de reposição de carga horária para a turma de cálculo." },
  { id: 2, professor: "Dra. Maria Helena", sala: "Auditório Laranja", horario: "08:30 - 11:30", data: "Amanhã, 25 Out", motivo: "Defesa de Tese", tipo: "EMPRESTIMO", responsavelAtual: "Prof. Jorge Aragão", frequencia: "Única (Pontual)", descricao: "Banca de defesa de doutorado com convidados externos." },
  { id: 3, professor: "Prof. Ricardo Silva", sala: "Sala 101 - Bloco B", horario: "19:00 - 22:00", data: "Hoje, 24 Out", motivo: "Reunião", tipo: "TROCA", responsavelAtual: "Profa. Cláudia Leitte", frequencia: "Toda Semana (Ter)", descricao: "Permuta permanente de sala devido à necessidade de projetor funcional." },
  { id: 4, professor: "Profa. Ana Costa", sala: "Laboratório 1", horario: "10:00 - 12:00", data: "Amanhã, 25 Out", motivo: "Aula Prática", tipo: "RESERVA", frequencia: "Quinzenal", descricao: "Prática de laboratório de estruturas de dados." },
  { id: 5, professor: "Dr. João Pedro", sala: "Sala 205 - Bloco C", horario: "14:00 - 18:00", data: "26 Out", motivo: "Minicurso", tipo: "EMPRESTIMO", responsavelAtual: "Dr. Alan Turing", frequencia: "Única", descricao: "Workshop intensivo de introdução ao Next.js e Tailwind CSS." },
  { id: 6, professor: "Profa. Fernanda Lima", sala: "Auditório Azul", horario: "09:00 - 12:00", data: "27 Out", motivo: "Palestra", tipo: "RESERVA", frequencia: "Única", descricao: "Palestra de abertura da semana de computação." },
  { id: 7, professor: "Prof. Marcos Paulo", sala: "Sala de Reuniões", horario: "15:00 - 16:00", data: "27 Out", motivo: "Orientação", tipo: "TROCA", responsavelAtual: "Profa. Marta Vieira", frequencia: "Única", descricao: "Troca pontual de sala para acomodar atendimento a aluno cadeirante." },
];

export default function Home() {
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

              {/* Seção do Dashboard com os componentes de Stats e os Botões */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Renderiza os 3 blocos de informação */}
                <AdminDashboardStats pendingCount={mockRequests.length} />

                {/* Coluna dos botões mantida na página principal */}
                <div className="flex flex-col gap-3 h-full">
                  <Link href="/admin/cadastrar-sala" className="flex-1 block">
                    <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                      <CirclePlus size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs uppercase tracking-wider">
                        Cadastrar Sala
                      </span>
                    </button>
                  </Link>

                  <Link href="/admin/cadastrar-evento" className="flex-1 block">
                    <button className="w-full h-full bg-[#000666] p-2 rounded-xl border border-transparent flex flex-col items-center justify-center text-white hover:bg-blue-900 transition-colors shadow-sm gap-2 group">
                      <CirclePlus size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs uppercase tracking-wider">
                        Cadastrar Evento
                      </span>
                    </button>
                  </Link>
                </div>
              </section>

              {/* Tabela de Solicitações isolada */}
              <AdminRequestsTable initialRequests={mockRequests} />

            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}