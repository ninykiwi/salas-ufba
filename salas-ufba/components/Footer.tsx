import { HelpCircle, Settings } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-3">
      <Image src="/ufba-logo.png" alt="UFBA" width={28} height={28} className="object-contain" />

        <div>
          <p className="text-xs font-bold text-gray-800">UFBA</p>
          <p className="text-xs text-gray-400">UNIVERSIDADE FEDERAL DA BAHIA</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        © 2026 Salas UFBA 2.0 • Sistema de Gestão de Espaços Acadêmicos
      </p>
      <div className="flex items-center gap-3 text-gray-400">
        <button className="hover:text-gray-600 transition-colors">
          <HelpCircle size={18} />
        </button>
        <button className="hover:text-gray-600 transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </footer>
  );
}