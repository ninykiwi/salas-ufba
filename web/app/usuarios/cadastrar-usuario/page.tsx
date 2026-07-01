"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, ShieldCheck, Mail, Loader2, CheckCircle, AlertTriangle, UserPlus } from "lucide-react";

interface Institute {
  id: string;
  name: string;
}

export default function CadastrarUsuario() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siape, setSiape] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PROFESSOR" | "ADMIN">("PROFESSOR");
  const [selectedInstituteId, setSelectedInstituteId] = useState("");
  
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUserRole(user.role);

      // Fetch or load institutes
      const loadInstitutes = async () => {
        try {
          if (user.role === "SUPERADMIN") {
            const response = await fetch("http://localhost:3001/institutes", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setInstitutes(data);
              if (data.length > 0) {
                setSelectedInstituteId(data[0].id);
              }
            }
          } else {
            // ADMIN can only register teachers inside the institutes they are associated with
            const adminInsts = user.institutes || [];
            setInstitutes(adminInsts);
            if (adminInsts.length > 0) {
              setSelectedInstituteId(adminInsts[0].id);
            }
          }
        } catch (err) {
          console.error("Failed to load institutes", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadInstitutes();
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Por favor, preencha o Nome, E-mail e Senha.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.\-_])[A-Za-z\d@$!%*?&#.\-_]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial (Ex: @$!%*?&)."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    const payload = {
      name,
      email,
      password,
      role,
      siape: siape ? siape.trim() : undefined,
      instituteIds: selectedInstituteId ? [selectedInstituteId] : [],
    };

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Erro ao registrar usuário");
      }

      setSuccess("Usuário cadastrado com sucesso!");
      setName("");
      setEmail("");
      setSiape("");
      setPassword("");
      setRole("PROFESSOR");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao cadastrar o usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/usuarios" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#000666]">Cadastrar Novo Usuário</h1>
              <p className="text-sm text-gray-500 mt-1">Adicione um novo docente ou administrador ao sistema Salas UFBA 2.0.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* Formulário de Cadastro (2/3 da largura) */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm font-semibold flex items-start gap-2">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-4 text-sm font-semibold flex items-start gap-2">
                      <CheckCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700">Nome Completo</label>
                    <input
                      className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                      placeholder="ex: João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">E-mail Institucional</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                        placeholder="usuario@ufba.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Matrícula SIAPE</label>
                      <input
                        className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                        placeholder="ex: 1234567 (opcional para admin)"
                        value={siape}
                        onChange={(e) => setSiape(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Senha de Acesso</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                        placeholder="Mínimo 8 caracteres (Ex: Senha123!)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">
                        Deve conter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Associar a um Instituto</label>
                      {isLoading ? (
                        <div className="flex items-center gap-2 h-11 text-xs text-gray-400">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Carregando institutos...</span>
                        </div>
                      ) : (
                        <select
                          className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none"
                          value={selectedInstituteId}
                          onChange={(e) => setSelectedInstituteId(e.target.value)}
                          disabled={isSubmitting}
                        >
                          <option value="">Nenhum</option>
                          {institutes.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="font-bold text-sm text-gray-700 block mb-3">Tipo de Acesso</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="acesso"
                          value="PROFESSOR"
                          checked={role === "PROFESSOR"}
                          onChange={() => setRole("PROFESSOR")}
                          disabled={isSubmitting}
                          className="w-4 h-4 text-[#000666] accent-[#000666]"
                        />
                        <span className="text-sm text-gray-600">Professor</span>
                      </label>
                      
                      {currentUserRole === "SUPERADMIN" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="acesso"
                            value="ADMIN"
                            checked={role === "ADMIN"}
                            onChange={() => setRole("ADMIN")}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-[#000666] accent-[#000666]"
                          />
                          <span className="text-sm text-gray-600">Administrador</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => router.push("/usuarios")}
                      disabled={isSubmitting}
                      className="px-8 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          CADASTRANDO...
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          CADASTRAR USUÁRIO
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar de Avisos (1/3 da largura) */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex gap-4">
                  <Mail className="text-[#000666] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-[#000666]">Matrícula SIAPE</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">A matrícula SIAPE é obrigatória para o login de professores e deve ser única no sistema.</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <ShieldCheck className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Nível de Acesso</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {currentUserRole === "SUPERADMIN" 
                        ? "Como Superadministrador, você pode cadastrar Administradores (ADMIN) e Professores."
                        : "Como Administrador, você pode cadastrar apenas Professores."
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <Info className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Associação de Instituto</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">O usuário só poderá visualizar salas e criar reservas referentes aos institutos associados.</p>
                  </div>
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