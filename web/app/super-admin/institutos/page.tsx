"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Building, Plus, Loader2, Landmark, CheckCircle, AlertTriangle, Trash2, ChevronDown } from "lucide-react";
import { getInstitutes, createInstitute, deleteInstitute, getUsers, getRooms, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Institute {
  id: string;
  name: string;
  slug: string;
  floors: number;
  createdAt: string;
}

const FLOOR_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function GestaoInstitutos() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [newInstituteName, setNewInstituteName] = useState("");
  const [newInstituteFloors, setNewInstituteFloors] = useState(1);
  const [floorsOpen, setFloorsOpen] = useState(false);
  const floorsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (floorsRef.current && !floorsRef.current.contains(e.target as Node)) {
        setFloorsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Estados do modal de exclusão
  const [deleteTarget, setDeleteTarget] = useState<Institute | null>(null);
  const [linkedUsersCount, setLinkedUsersCount] = useState(0);
  const [linkedRoomsCount, setLinkedRoomsCount] = useState(0);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isCheckingLinkedUsers, setIsCheckingLinkedUsers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchInstitutes = async () => {
    try {
      const data = await getInstitutes();
      setInstitutes(data);
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      setError("Não foi possível carregar os institutos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchInstitutes();
  }, [user]);

  const handleCreateInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstituteName.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const newInst = await createInstitute(newInstituteName.trim(), newInstituteFloors);
      setInstitutes((prev) => [...prev, newInst].sort((a, b) => a.name.localeCompare(b.name)));
      setNewInstituteName("");
      setNewInstituteFloors(1);
      setSuccess("Instituto cadastrado com sucesso!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao tentar cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = async (institute: Institute) => {
    setDeleteError("");
    setConfirmChecked(false);
    setIsCheckingLinkedUsers(true);

    try {
      const [users, rooms] = await Promise.all([
        getUsers(),
        getRooms({ institute_id: institute.id }),
      ]);
      const usersCount = users.filter((u) =>
        u.institutes.some((inst) => inst.id === institute.id)
      ).length;
      setLinkedUsersCount(usersCount);
      setLinkedRoomsCount(rooms.length);
      setDeleteTarget(institute);
    } catch (err: any) {
      setError(err.message || "Não foi possível verificar dados vinculados.");
    } finally {
      setIsCheckingLinkedUsers(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteError("");
    setConfirmChecked(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteInstitute(deleteTarget.id);
      setInstitutes((prev) => prev.filter((inst) => inst.id !== deleteTarget.id));
      handleCloseDeleteModal();
    } catch (err: any) {
      setDeleteError(err.message || "Ocorreu um erro ao tentar excluir.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/super-admin/institutos" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            
            {/* Header da Página */}
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Gestão de Institutos</h1>
              <p className="text-sm text-gray-500 mt-1">
                Cadastre e visualize os institutos da universidade integrados no sistema.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* Form de Cadastro (1/3 da largura) */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                <div className="flex items-center gap-2 mb-4 text-[#000666]">
                  <Landmark size={20} />
                  <h2 className="font-bold text-sm uppercase tracking-wider">Novo Instituto</h2>
                </div>
                
                <form onSubmit={handleCreateInstitute} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-3 text-xs font-semibold flex items-start gap-2">
                      <CheckCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block">
                      Nome do Instituto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Instituto de Computação"
                      value={newInstituteName}
                      onChange={(e) => setNewInstituteName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block">
                      Quantidade de Andares
                    </label>
                    <div className="relative" ref={floorsRef}>
                      <button
                        type="button"
                        onClick={() => setFloorsOpen((v) => !v)}
                        disabled={isSubmitting}
                        className="flex items-center justify-between gap-2 w-full bg-white border border-gray-300 rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors disabled:opacity-50"
                      >
                        {newInstituteFloors}
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>
                      {floorsOpen && (
                        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-50 overflow-y-auto">
                          {FLOOR_OPTIONS.map((floor) => (
                            <li
                              key={floor}
                              onClick={() => {
                                setNewInstituteFloors(floor);
                                setFloorsOpen(false);
                              }}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              {floor}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !newInstituteName.trim()}
                    className="flex items-center justify-center gap-2 w-full bg-[#000666] hover:bg-[#333784] disabled:bg-gray-200 text-white font-bold text-sm py-3.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        CADASTRANDO...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        CADASTRAR
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Tabela de Institutos (2/3 da largura) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                    Institutos Cadastrados ({institutes.length})
                  </h3>
                </div>

                {isLoading ? (
                  <div className="flex-1 py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Loader2 className="animate-spin text-[#000666]" size={36} />
                    <p className="text-sm">Carregando institutos...</p>
                  </div>
                ) : institutes.length === 0 ? (
                  <div className="flex-1 py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Building size={48} className="text-gray-300" />
                    <p className="text-sm font-semibold">Nenhum instituto cadastrado ainda.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="px-6 py-3">Nome</th>
                          <th className="px-6 py-3">Slug (Identificador)</th>
                          <th className="px-6 py-3">Data de Criação</th>
                          <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {institutes.map((inst) => (
                          <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700">
                            <td className="px-6 py-4 font-bold text-indigo-900 flex items-center gap-2">
                              <Building size={16} className="text-[#000666]" />
                              {inst.name}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{inst.slug}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {new Date(inst.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleOpenDeleteModal(inst)}
                                disabled={isCheckingLinkedUsers}
                                title="Excluir instituto"
                                className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </main>

          <Footer />
        </div>

      {/* Modal de Exclusão de Instituto */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir instituto</h3>

            {linkedUsersCount === 0 && linkedRoomsCount === 0 ? (
              <p className="text-sm text-gray-500 mb-4">
                Tem certeza que deseja excluir <strong>{deleteTarget.name}</strong>? Essa ação não
                pode ser desfeita.
              </p>
            ) : (
              <>
                <ul className="text-sm text-gray-500 mb-4 space-y-1 list-disc list-inside">
                  {linkedUsersCount > 0 && (
                    <li>
                      {linkedUsersCount} usuário(s) vinculado(s) ficarão sem instituto.
                    </li>
                  )}
                  {linkedRoomsCount > 0 && (
                    <li>
                      {linkedRoomsCount} sala(s) vinculada(s) serão removidas do sistema.
                    </li>
                  )}
                </ul>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="rounded text-[#000666] focus:ring-[#000666]"
                  />
                  Prosseguir com a exclusão mesmo assim
                </label>
              </>
            )}

            {deleteError && (
              <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={
                  isDeleting ||
                  ((linkedUsersCount > 0 || linkedRoomsCount > 0) && !confirmChecked)
                }
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting && <Loader2 className="animate-spin" size={16} />}
                EXCLUIR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
