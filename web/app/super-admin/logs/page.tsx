"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import { Search, Loader2 } from "lucide-react";
import { getLogs, ApiError, AuditLog } from "@/lib/api";

const actionLabels: Record<string, { label: string; className: string }> = {
  CREATE_USER: { label: "Criou usuário", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  UPDATE_USER: { label: "Editou usuário", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  DELETE_USER: { label: "Removeu usuário", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  CREATE_INSTITUTE: { label: "Criou instituto", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  DELETE_INSTITUTE: { label: "Removeu instituto", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  LOGIN: { label: "Login", className: "bg-gray-100 text-gray-600 border border-gray-200" },
};

function formatDateTimeBR(isoString: string): string {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterResource, setFilterResource] = useState("todos");

  const resources = ["todos", "usuario", "instituto", "sistema"];

  useEffect(() => {
    getLogs()
      .then(setLogs)
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          router.push("/login");
          return;
        }
        setError(err.message || "Não foi possível carregar os logs.");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.admin_name.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());
    const matchResource = filterResource === "todos" || log.resource_type === filterResource;
    return matchSearch && matchResource;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/super-admin/logs" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <div className="px-8 py-5 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Logs do Sistema</h1>
          <p className="text-sm text-gray-400 mt-0.5">Histórico de ações realizadas pelos administradores.</p>
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
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold">
              {error}
            </div>
          )}

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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-[#000666]" size={28} />
                        <p className="text-sm">Carregando logs...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
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
                          <p className="font-semibold text-gray-900">{log.admin_name}</p>
                          <p className="text-xs text-gray-400">{log.admin_role}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${action.className}`}>
                            {action.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600 max-w-xs">{log.description}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-gray-500 capitalize">{log.resource_type}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDateTimeBR(log.created_at)}</td>
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
