"use client";

import { useState, useEffect } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUserTable, { Usuario } from "@/components/admin/AdminUserTable";
import AdminUserModals from "@/components/admin/AdminUserModals";
import { UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUsers, getInstitutes, ApiError } from "@/lib/api";

export default function GestaoUsuarios() {
  // Estados para controle dos Modais
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [users, setUsers] = useState<Usuario[]>([]);
  const [institutes, setInstitutes] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const usersData = await getUsers();

      // Fetch institutes for the modals dropdown
      const instsData = await getInstitutes().catch(() => null);
      if (instsData) {
        setInstitutes(instsData);
      }

      const mapped = usersData.map((user: any) => {
        const initials = user.name
          .split(" ")
          .filter(Boolean)
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "U";

        const funcao: "ADMINISTRADOR" | "PROFESSOR" =
          user.role === "SUPERADMIN" || user.role === "ADMIN"
            ? "ADMINISTRADOR"
            : "PROFESSOR";

        const departamento = user.institutes?.map((inst: any) => inst.name).join(", ") || "Sem instituto";

        return {
          id: user.id,
          nome: user.name,
          iniciais: initials,
          email: user.email,
          siape: user.siape || "N/A",
          funcao: funcao,
          departamento: departamento,
          ultimoAcesso: "N/A",
          role: user.role,
          institutes: user.institutes || [],
        };
      });

      setUsers(mapped);
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const openEdit = (user: Usuario) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDelete = (user: Usuario) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/super-admin/usuarios" />

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

              <Link href="/super-admin/usuarios/cadastrar-usuario">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#000666] text-white rounded-md font-bold text-sm tracking-wide hover:bg-blue-900 transition-colors shadow-sm">
                  <UserPlus size={18} />
                  NOVO USUÁRIO
                </button>
              </Link>
            </div>

            {/* Tabela Separada */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <Loader2 className="animate-spin text-[#000666]" size={36} />
                <p className="text-sm">Carregando usuários...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm font-semibold max-w-md mx-auto mt-10">
                {error}
              </div>
            ) : (
              <AdminUserTable 
                users={users} 
                onEdit={openEdit} 
                onDelete={openDelete} 
              />
            )}

          </main>

          <Footer />
        </div>

      {/* Componente Único de Modais */}
      <AdminUserModals
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
        selectedUser={selectedUser}
        institutes={institutes}
        onUserUpdated={fetchData}
      />
    </div>
  );
}