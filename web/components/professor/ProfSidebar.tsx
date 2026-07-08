"use client";

import { LayoutGrid, ClipboardClock, UserPlus, Monitor, ClipboardPen, Home, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Visão Geral", href: "/professor", icon: <LayoutGrid size={18} /> },
  { label: "Cadastrar Eventos", href: "/professor/cadastrar-evento", icon: <ClipboardPen size={18} /> },
  { label: "Minhas Solicitações", href: "/professor/minhas-solicitacoes", icon: <ClipboardClock size={18} /> },
];

interface ProfSidebarProps {
  activeHref?: string;
}

export default function ProfSidebar({ activeHref = "/" }: ProfSidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="w-60 h-full bg-white border-r border-gray-200 flex flex-col">

      <div className="flex items-center gap-3 px-5 py-6">

        <Image src="/ufba-logo.png" alt="UFBA" width={32} height={32} className="object-contain" />

        <div>
          <p className="font-bold text-sm text-gray-900 leading-tight">Salas UFBA 2.0</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Gestão de Espaços</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-50 text-[#1A237E] font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Home size={18} />
          Ir para Home
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

    </aside>
  );
}