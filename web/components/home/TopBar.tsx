"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Building2, ChevronDown, Info, Bell } from "lucide-react";

interface TopBarProps {
  campuses: { id: number; name: string }[];
  selectedCampus: number | null;
  onCampusChange: (id: number) => void;
  institutes: { id: string; name: string }[];
  selectedInstitute: string | null;
  onInstituteChange: (id: string) => void;
}

export default function TopBar({
  campuses,
  selectedCampus,
  onCampusChange,
  institutes,
  selectedInstitute,
  onInstituteChange,
}: TopBarProps) {

    const [time, setTime] = useState("");
    const [dateLabel, setDateLabel] = useState("");

    const [campusOpen, setCampusOpen] = useState(false);
    const [instituteOpen, setInstituteOpen] = useState(false);

    const campusRef = useRef<HTMLDivElement>(null);
    const instituteRef = useRef<HTMLDivElement>(null);


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
            if (campusRef.current && !campusRef.current.contains(e.target as Node)) {
            setCampusOpen(false);
            }
            if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
            setInstituteOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">

            <div className="flex items-center gap-3">
                
                <div className="relative" ref={campusRef}>

                    <button
                        onClick={() => setCampusOpen((v) => !v)}
                        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <MapPin size={14} className="text-gray-400" />
                        {campuses.find((c) => c.id === selectedCampus)?.name ?? "Selecione o campus"}
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {campusOpen && (
                        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {campuses.map((c) => (
                            <li
                            key={c.id}
                            onClick={() => { onCampusChange(c.id); setCampusOpen(false); }}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                            {c.name}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>

                <div className="relative" ref={instituteRef}>

                    <button
                        onClick={() => setInstituteOpen((v) => !v)}
                        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Building2 size={14} className="text-gray-400" />
                        {institutes.find((i) => i.id === selectedInstitute)?.name ?? "Selecione o instituto"}
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {instituteOpen && (
                        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {institutes.map((i) => (
                            <li
                            key={i.id}
                            onClick={() => { onInstituteChange(i.id); setInstituteOpen(false); }}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                            {i.name}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>

            </div>

            <div className="flex items-center gap-4">
                
                <div className="text-right mr-2">
                    <p className="text-3xl font-bold text-[#000666] leading-none">{time}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{dateLabel}</p>
                </div>

                {/*<button className="text-gray-400 hover:text-[#000666] transition-colors">
                    <Bell size={20} />
                </button>*/}

                {/* MODIFICAÇÃO AQUI: Adicionado a classe 'group' e o elemento do modalzinho */}
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
                
            </div>

        </div>
    );
}