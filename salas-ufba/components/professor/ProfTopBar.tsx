"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Building2, ChevronDown, Info, Bell } from "lucide-react";

interface ProfTopBarProps {
  campuses: { id: number; name: string }[];
  selectedCampus: number | null;
  onCampusChange: (id: number) => void;
  institutes: { id: number; name: string }[];
  selectedInstitute: number | null;
  onInstituteChange: (id: number) => void;
}

export default function ProfTopBar() {

    const [time, setTime] = useState("");
    const [dateLabel, setDateLabel] = useState("");


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
                
                <div className="text-right mr-[10]">
                    <p className="text-3xl font-bold text-[#000666] leading-none">{time}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{dateLabel}</p>
                </div>

                <button className="text-gray-400 hover:text-[#000666] transition-colors">
                    <Bell size={20} />
                </button>

                <button className="text-gray-400 hover:text-[#000666] transition-colors">
                    <Info size={20} />
                </button>
                
            </div>

        </div>
    );
}