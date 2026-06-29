"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUserTable, { Usuario } from "@/components/admin/AdminUserTable";
import AdminUserModals from "@/components/admin/AdminUserModals";
import { UserPlus } from "lucide-react";
import Link from "next/link";

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

const mockUsers: Usuario[] = [
  { id: 1, nome: "Rodrigo Lima", iniciais: "RL", email: "rodrigo.lima@ufba.br", siape: "1029384", funcao: "ADMINISTRADOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "HOJE" },
  { id: 2, nome: "Ana Silva", iniciais: "AS", email: "ana.silva@ufba.br", siape: "2283741", funcao: "PROFESSOR", departamento: "Depto. de Matemática", ultimoAcesso: "2 DIAS ATRÁS" },
  { id: 3, nome: "Marcos Costa", iniciais: "MC", email: "m.costa@ufba.br", siape: "1982736", funcao: "PROFESSOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "ONTEM" },
  { id: 4, nome: "Carla Mendes", iniciais: "CM", email: "carla.mendes@ufba.br", siape: "3482711", funcao: "PROFESSOR", departamento: "Depto. de Física", ultimoAcesso: "HOJE" },
  { id: 5, nome: "João Pedro", iniciais: "JP", email: "joao.pedro@ufba.br", siape: "9384756", funcao: "ADMINISTRADOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "5 DIAS ATRÁS" },
  { id: 6, nome: "Fernanda Lima", iniciais: "FL", email: "f.lima@ufba.br", siape: "2233445", funcao: "PROFESSOR", departamento: "Depto. de Estatística", ultimoAcesso: "HOJE" },
  { id: 7, nome: "Lucas Alves", iniciais: "LA", email: "lucas.alves@ufba.br", siape: "5566778", funcao: "PROFESSOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "ONTEM" },
];

export default function GestaoUsuarios() {
  // Estados para controle dos Modais
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const openEdit = (user: Usuario) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDelete = (user: Usuario) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/usuarios" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            
            {/* Header da Página */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestão de Usuários</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerencie as permissões e perfis de professores e administradores do sistema.
                </p>
              </div>

              <Link href="/usuarios/cadastrar-usuario">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#000666] text-white rounded-md font-bold text-sm tracking-wide hover:bg-blue-900 transition-colors shadow-sm">
                  <UserPlus size={18} />
                  NOVO USUÁRIO
                </button>
              </Link>
            </div>

            {/* Tabela Separada */}
            <AdminUserTable 
              users={mockUsers} 
              onEdit={openEdit} 
              onDelete={openDelete} 
            />

          </main>
        </div>
      </div>

      {/* Componente Único de Modais */}
      <AdminUserModals
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
        selectedUser={selectedUser}
        institutes={mockInstitutes}
      />

      <Footer />
    </div>
  );
}