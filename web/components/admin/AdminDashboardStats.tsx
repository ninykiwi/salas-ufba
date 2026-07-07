import { DoorOpen, ClipboardList, CalendarCheck } from "lucide-react";

interface AdminDashboardStatsProps {
  pendingCount: number;
}

export default function AdminDashboardStats({ pendingCount }: AdminDashboardStatsProps) {
  return (
    <>
      {/* Ocupação Atual */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Ocupação Atual
            </span>
            <DoorOpen className="text-[#000666]" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-[#000666]">72%</span>
            <span className="text-sm font-semibold text-[#00a8e8]">+5% vs ontem</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
          <div className="bg-[#000666] h-full" style={{ width: "72%" }}></div>
        </div>
      </div>

      {/* Pendências */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Pendências
            </span>
            <ClipboardList className="text-[#6bb5ff]" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-[#000666]">{pendingCount}</span>
            <span className="text-sm text-gray-500">solicitações</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Urgência: <span className="text-[#d90000] font-bold">Alta</span>
        </p>
      </div>

      {/* Salas Disponíveis */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Salas Disponíveis
            </span>
            <CalendarCheck className="text-[#0074d9]" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-[#000666]">08</span>
            <span className="text-sm text-gray-500">de 32 totais</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6">Bloco A e B</p>
      </div>
    </>
  );
}