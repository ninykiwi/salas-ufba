import { LayoutGrid, CalendarDays, Map, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Ocupação em Tempo Real", href: "/", icon: <LayoutGrid size={18} /> },
  { label: "Agenda Completa", href: "/agenda", icon: <CalendarDays size={18} /> },
  { label: "Mapa do Campus", href: "/mapa", icon: <Map size={18} /> },
  { label: "TV Display", href: "/view", icon: <Monitor size={18} /> },

];

interface SidebarProps {
  activeHref?: string;
}

export default function Sidebar({ activeHref = "/" }: SidebarProps) {
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

      <div className="px-4 py-6">
        <Link
          href="/login"
          className="block w-full bg-[#000666] hover:bg-[#333784] text-white text-sm font-bold text-center py-3 rounded-lg transition-colors"
        >
          LOGIN
        </Link>
      </div>
    </aside>
  );
}