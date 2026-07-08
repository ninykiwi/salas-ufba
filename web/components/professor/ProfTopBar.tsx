"use client";

import { useEffect, useState } from "react";
import { Info, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfTopBar() {
    const [time, setTime] = useState("");
    const [dateLabel, setDateLabel] = useState("");
    const { user, logout } = useAuth();

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
            setDateLabel(
                now.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "long" }).toUpperCase()
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#000666]">Painel do Professor</h2>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="text-right mr-2 flex flex-col items-end">
                        <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 bg-green-100 text-green-800 border border-green-200">
                            {user.role === "PROFESSOR" ? "PROFESSOR" : user.role}
                        </span>
                    </div>
                )}

                <div className="text-right mr-2 border-l border-gray-200 pl-4">
                    <p className="text-3xl font-bold text-[#000666] leading-none">{time}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{dateLabel}</p>
                </div>

                <button className="text-gray-400 hover:text-[#000666] transition-colors focus:outline-none">
                    <Bell size={20} />
                </button>

                {/* Ícone Info (Tooltip ao passar o mouse) */}
                <div className="relative group flex items-center justify-center">
                    <button className="text-gray-400 hover:text-[#000666] transition-colors focus:outline-none">
                        <Info size={20} />
                    </button>
                    
                    {/* O Modalzinho/Tooltip */}
                    <div className="absolute top-full right-0 mt-2 w-72 scale-0 group-hover:scale-100 transition-all duration-200 origin-top-right bg-[#000666] text-white text-xs rounded-lg p-3 shadow-lg z-50 pointer-events-none">
                        {/* Pequena seta apontando para o ícone */}
                        <div className="absolute -top-1 right-2 w-2 h-2 bg-[#000666] rotate-45"></div>

                        <p className="font-semibold mb-1">Salas UFBA 2.0</p>
                        <p className="text-blue-100 leading-relaxed">
                            O <span className="font-bold">Salas UFBA</span> foi feito para otimizar, organizar e facilitar a consulta e a reserva de ambientes, servindo como o <span className="font-bold">Sistema de Gestão de Espaços Acadêmicos</span> oficial da universidade.
                        </p>
                    </div>
                </div>

                {/* Botão de Logout */}
                <button
                    onClick={logout}
                    title="Sair do sistema"
                    className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
}