"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Info } from "lucide-react";
import NotificationsModal from "./NotificationsModal"; // Ajuste o caminho se necessário

export default function AdminTopBar() {
    const [time, setTime] = useState("");
    const [dateLabel, setDateLabel] = useState("");
    
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState([
        { id: 1, professor: "Dr. Carlos Silva", sala: "Pavilhão I - Sala 102", motivo: "Aula prática de Laboratório de Física" },
        { id: 2, professor: "Dra. Maria Oliveira", sala: "PAF III - Auditório A", motivo: "Seminário de Inteligência Artificial" },
        { id: 3, professor: "Prof. Ricardo Santos", sala: "Inst. de Matemática - Sala 20", motivo: "Aplicação de prova final" },
    ]);

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">

            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#000666]">Painel do Administrador</h2>
            </div>

            <div className="flex items-center gap-4">
                
                <div className="text-right mr-2">
                    <p className="text-3xl font-bold text-[#000666] leading-none">{time}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{dateLabel}</p>
                </div>

                {/* Área do Sininho de Notificações */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="relative p-1 text-gray-400 hover:text-[#000666] transition-colors focus:outline-none"
                    >
                        <Bell size={20} />
                        
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                    </button>

                    {/* Chamada do Novo Componente Isolado */}
                    {notificationsOpen && (
                        <NotificationsModal 
                            notifications={notifications} 
                        />
                    )}
                </div>

                {/* Ícone Info (Tooltip ao passar o mouse) */}
                <div className="relative group flex items-center justify-center">
                    <button className="text-gray-400 hover:text-[#000666] transition-colors focus:outline-none">
                        <Info size={20} />
                    </button>
                    
                    <div className="absolute top-full right-0 mt-2 w-72 scale-0 group-hover:scale-100 transition-all duration-200 origin-top-right bg-[#000666] text-white text-xs rounded-lg p-3 shadow-lg z-50 pointer-events-none">
                        <div className="absolute -top-1 right-2 w-2 h-2 bg-[#000666] rotate-45"></div>

                        <p className="font-semibold mb-1">Salas UFBA 2.0</p>
                        <p className="text-blue-100 leading-relaxed">
                            O <span className="font-bold">Salas UFBA</span> foi feito para otimizar, organizar e facilitar a consulta e a reserva de ambientes, servindo como o <span className="font-bold">Sistema de Gestão de Espaços Acadêmicos</span> oficial da universidade.
                        </p>
                    </div>
                </div>
                
            </div>

        </div>
    );
}