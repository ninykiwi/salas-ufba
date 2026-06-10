"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Building2, ChevronDown } from "lucide-react";

interface TopBarProps {
  campuses: { id: number; name: string }[];
  selectedCampus: number | null;
  onCampusChange: (id: number) => void;
  institutes: { id: number; name: string }[];
  selectedInstitute: number | null;
  onInstituteChange: (id: number) => void;
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

        </div>
    );
}