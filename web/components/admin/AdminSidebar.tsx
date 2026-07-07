"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, ClipboardClock, UserPlus, Monitor, Building, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  activeHref?: string;
}

export default function AdminSidebar({ activeHref = "/" }: AdminSidebarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session in sidebar", e);
      }
    }
  }, []);

  // Dynamically build navItems based on user role
  const navItems: NavItem[] = [];
  if (user) {
    if (user.role === "SUPERADMIN") {
      navItems.push(
        { label: "Gestão de Institutos", href: "/institutos", icon: <Building size={18} /> },
        { label: "Gestão de Usuários", href: "/usuarios", icon: <UserPlus size={18} /> },
        { label: "TV Display", href: "/view", icon: <Monitor size={18} /> }
      );
    } else {
      // ADMIN
      navItems.push(
        { label: "Visão Geral", href: "/admin", icon: <LayoutGrid size={18} /> },
        { label: "Gestão de Salas", href: "/salas", icon: <ClipboardClock size={18} /> },
        { label: "Gestão de Usuários", href: "/usuarios", icon: <UserPlus size={18} /> },
        { label: "TV Display", href: "/view", icon: <Monitor size={18} /> },
        { label: "Mapear Salas", href: "/admin/cadastrar-mapa", icon: <Map size={18} /> },
      );
    }
  }

  return (
    <aside className="w-60 h-full bg-white border-r border-gray-200 flex flex-col shrink-0">

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

    </aside>
  );
}