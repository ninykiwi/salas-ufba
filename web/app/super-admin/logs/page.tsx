"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Footer from "@/components/home/Footer";
import { Search, Shield } from "lucide-react";

interface LogEntry {
  id: number;
  admin: string;
  role: string;
  action: string;
  resourceType: string;
  description: string;
  createdAt: string;
}

const mockLogs: LogEntry[] = [
  { id: 1,  admin: "João Silva",    role: "ADMIN",      action: "ACCEPT_REQUEST", resourceType: "solicitação", description: "Aceitou reserva do Lab 1 por Prof. Ricardo",       createdAt: "2026-06-10 10:32" },
  { id: 2,  admin: "Maria Souza",   role: "ADMIN",      action: "REJECT_REQUEST", resourceType: "solicitação", description: "Recusou troca de Sala 101 por Profa. Ana",          createdAt: "2026-06-10 10:15" },
  { id: 3,  admin: "João Silva",    role: "ADMIN",      action: "EDIT_MAP",       resourceType: "mapa",        description: "Editou planta baixa do IC: Piso 2",               createdAt: "2026-06-10 09:50" },
  { id: 4,  admin: "Carlos Lima",   role: "SUPERADMIN", action: "CREATE_USER",    resourceType: "usuário",     description: "Criou conta de admin para Maria Souza",            createdAt: "2026-06-10 09:20" },
  { id: 5,  admin: "Maria Souza",   role: "ADMIN",      action: "EDIT_ROOM",      resourceType: "sala",        description: "Editou capacidade da Sala 102 para 45 pessoas",    createdAt: "2026-06-10 08:55" },
  { id: 6,  admin: "João Silva",    role: "ADMIN",      action: "ACCEPT_REQUEST", resourceType: "solicitação", description: "Aceitou empréstimo do Lab 203 por Profa. Carla",    createdAt: "2026-06-09 17:40" },
  { id: 7,  admin: "Carlos Lima",   role: "SUPERADMIN", action: "DELETE_USER",    resourceType: "usuário",     description: "Removeu conta de admin inativo",                   createdAt: "2026-06-09 16:10" },
  { id: 8,  admin: "Maria Souza",   role: "ADMIN",      action: "CREATE_ROOM",    resourceType: "sala",        description: "Cadastrou nova sala: Sala 305",                    createdAt: "2026-06-09 14:30" },
  { id: 9,  admin: "João Silva",    role: "ADMIN",      action: "EDIT_MAP",       resourceType: "mapa",        description: "Editou planta baixa do IC: Piso 1",               createdAt: "2026-06-09 13:00" },
  { id: 10, admin: "Carlos Lima",   role: "SUPERADMIN", action: "LOGIN",          resourceType: "sistema",     description: "Login realizado",                                  createdAt: "2026-06-09 08:00" },
];

const actionLabels: Record<string, { label: string; className: string }> = {
  ACCEPT_REQUEST: { label: "Aceitou solicitação", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  REJECT_REQUEST: { label: "Recusou solicitação", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  EDIT_MAP:       { label: "Editou mapa",         className: "bg-gray-100 text-gray-600 border border-gray-200" },
  CREATE_USER:    { label: "Criou usuário",        className: "bg-gray-100 text-gray-600 border border-gray-200" },
  DELETE_USER:    { label: "Removeu usuário",      className: "bg-gray-100 text-gray-600 border border-gray-200" },
  EDIT_ROOM:      { label: "Editou sala",          className: "bg-gray-100 text-gray-600 border border-gray-200" },
  CREATE_ROOM:    { label: "Criou sala",           className: "bg-gray-100 text-gray-600 border border-gray-200" },
  LOGIN:          { label: "Login",                className: "bg-gray-100 text-gray-600 border border-gray-200" },
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterResource, setFilterResource] = useState("todos");

  const resources = ["todos", "solicitação", "mapa", "sala", "usuário", "sistema"];

  const filtered = mockLogs.filter((log) => {
    const matchSearch = log.admin.toLowerCase().includes(search.toLowerCase()) ||
                        log.description.toLowerCase().includes(search.toLowerCase());
    const matchResource = filterResource === "todos" || log.resourceType === filterResource;
    return matchSearch && matchResource;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/logs" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Logs do Sistema</h1>
            <p className="text-sm text-gray-400 mt-0.5">Histórico de ações realizadas pelos administradores.</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Shield size={13} className="text-indigo-900" />
            <span>Visível apenas para <span className="font-bold text-indigo-900">Superadmin</span></span>
          </div>
        </div>

        <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white flex-1 max-w-sm">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por admin ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-700 outline-none w-full placeholder-gray-300"
            />
          </div>

          <div className="flex items-center gap-1">
            {resources.map((r) => (
              <button
                key={r}
                onClick={() => setFilterResource(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                  filterResource === r
                    ? "bg-indigo-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Ação</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Recurso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                      Nenhum log encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => {
                    const action = actionLabels[log.action] ?? { label: log.action, className: "bg-gray-100 text-gray-600 border border-gray-200" };
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-gray-900">{log.admin}</p>
                          <p className="text-xs text-gray-400">{log.role}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${action.className}`}>
                            {action.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600 max-w-xs">{log.description}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-gray-500 capitalize">{log.resourceType}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{log.createdAt}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}