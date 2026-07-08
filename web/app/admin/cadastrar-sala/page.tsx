"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, CheckCircle } from "lucide-react";

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

// Novos mocks para os selects do formulário
const mockBuildings = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
  { id: 3, name: "Instituto de Matemática e Estatística (IME)" },
  { id: 4, name: "Escola Politécnica" },
  { id: 5, name: "PAF I" },
  { id: 6, name: "PAF II" },
];

const mockFloors = [
  { id: "terreo", name: "Térreo" },
  { id: "1", name: "1º Andar" },
  { id: "2", name: "2º Andar" },
  { id: "3", name: "3º Andar" },
];

const mockRoomTypes = [
  { id: "sala_aula", name: "Sala de Aula" },
  { id: "laboratorio", name: "Laboratório" },
  { id: "auditorio", name: "Auditório" },
  { id: "sala_reuniao", name: "Sala de Reunião" },
];

export default function Home() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/salas" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <nav className="flex text-sm font-medium text-gray-500 mb-2">
                <span>Salas</span>
                <span className="mx-2">/</span>
                <span className="text-[#000666] font-bold">Cadastrar Sala</span>
              </nav>
              <h1 className="text-xl font-bold text-gray-900">Novo Registro de Sala</h1>
              <p className="text-sm text-gray-400 mt-1">
                Preencha as informações técnicas para disponibilizar o espaço no sistema de reservas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* Main Form Card */}
              <div className="lg:col-span-2">
                <form className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="room_name">Nome da Sala</label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="room_name" placeholder="Ex: Sala 101" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="building">Prédio / Instituto</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="building">
                        <option value="">Selecione o Prédio</option>
                        {mockBuildings.map((building) => (
                          <option key={building.id} value={building.id}>
                            {building.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="floor">Andar</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="floor">
                        <option value="">Selecione o Andar</option>
                        {mockFloors.map((floor) => (
                          <option key={floor.id} value={floor.id}>
                            {floor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="type">Tipo de Sala</label>
                      <select className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="type">
                        <option value="">Selecione o Tipo</option>
                        {mockRoomTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="capacity">Capacidade (Pessoas)</label>
                      <input className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors" id="capacity" placeholder="40" type="number" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="font-bold text-sm text-gray-700">Recursos Disponíveis</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Ar Condicionado</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Projetor</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Quadro Branco</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Computadores</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Sistema de Áudio</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                        <input className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium text-gray-700">Wi-Fi Dedicado</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-gray-700">Status da Sala</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000666]"></div>
                        <span className="ms-3 text-sm font-medium text-gray-700">Ativa</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button className="px-6 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors" type="button">
                      CANCELAR
                    </button>
                    <button className="px-6 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors" type="submit">
                      CADASTRAR SALA
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar Info/Tooltips */}
              <div className="space-y-6">
                
                <div className="bg-[#000666] text-white p-6 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={20} className="text-blue-300" />
                    <h3 className="font-bold text-base">Gestão de Recursos</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Ao cadastrar uma sala com recursos específicos (ex: Ar Condicionado), o sistema automaticamente prioriza essas salas para turmas com necessidades especiais ou eventos oficiais do instituto.
                  </p>
                </div>
                
                <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base text-[#000666] mb-4">Dicas de Cadastro</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Use nomes padronizados como "Sala 101" ou "Auditório A".</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Certifique-se que a capacidade informada segue as normas de segurança.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">O status "Inativo" remove a sala das buscas de reserva temporariamente.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </main>

          <Footer />
        </div>
    </div>
  );
}