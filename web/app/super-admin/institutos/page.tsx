"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Building, Plus, Loader2, Landmark, CheckCircle, AlertTriangle } from "lucide-react";

interface Institute {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function GestaoInstitutos() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [newInstituteName, setNewInstituteName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const fetchInstitutes = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3001/institutes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Erro ao carregar institutos");
      }

      const data = await response.json();
      setInstitutes(data);
    } catch (err: any) {
      setError("Não foi possível carregar os institutos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "SUPERADMIN") {
        // Only superadmins are allowed
        router.push("/admin");
        return;
      }
      fetchInstitutes(token);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleCreateInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstituteName.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:3001/institutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newInstituteName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao cadastrar instituto");
      }

      const newInst = await response.json();
      setInstitutes((prev) => [...prev, newInst].sort((a, b) => a.name.localeCompare(b.name)));
      setNewInstituteName("");
      setSuccess("Instituto cadastrado com sucesso!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao tentar cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
