"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, ShieldCheck, Mail } from "lucide-react";

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];
const mockInstitutes = [{ id: 1, name: "Instituto de Computação" }, { id: 2, name: "Faculdade de Direito" }];

export default function CadastrarUsuario() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

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

            {/* Grid principal para alinhar formulário e sidebar de avisos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* Formulário de Cadastro (2/3 da largura) */}
              <div className="lg:col-span-2">
                <form className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700">Nome Completo</label>
                    <input className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none" placeholder="ex: João Silva" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">E-mail Institucional</label>
                      <input className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none" placeholder="usuario@ufba.br" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Matrícula SIAPE</label>
                      <input className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none" placeholder="ex: 1234567" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Departamento</label>
                      <select className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none">
                        <option>Selecione o departamento</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="font-bold text-sm text-gray-700 block">Tipo de Acesso</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="acesso" className="w-4 h-4 text-[#000666]" defaultChecked />
                          <span className="text-sm text-gray-600">Professor</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="acesso" className="w-4 h-4 text-[#000666]" />
                          <span className="text-sm text-gray-600">Administrador</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <button className="px-8 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors">CANCELAR</button>
                    <button className="px-8 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors">CADASTRAR USUÁRIO</button>
                  </div>
                </form>
              </div>

              {/* Sidebar de Avisos (1/3 da largura) */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex gap-4">
                  <Mail className="text-[#000666] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-[#000666]">Confirmação de E-mail</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Um convite será enviado para o e-mail institucional informado.</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <ShieldCheck className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Nível de Acesso</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Administradores possuem permissões globais de edição.</p>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <Info className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Suporte ao Admin</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Consulte o manual para gestão de permissões avançadas.</p>
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