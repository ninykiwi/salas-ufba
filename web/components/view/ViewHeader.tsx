"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

interface ViewHeaderProps {
  institutes: { id: string; name: string }[];
  selectedInstitute: string | null;
  onInstituteChange: (id: string) => void;
  location: string;
}

export default function ViewHeader({
  institutes,
  selectedInstitute,
  onInstituteChange,
  location,
}: ViewHeaderProps) {
  const [time, setTime] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [instituteOpen, setInstituteOpen] = useState(false);
  const instituteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      setDateLabel(
        now
          .toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
          .toUpperCase()
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
        setInstituteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const instituteName =
    institutes.find((i) => i.id === selectedInstitute)?.name ?? "Selecione um instituto";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="relative" ref={instituteRef}>
            <button
              onClick={() => setInstituteOpen((v) => !v)}
              className="flex items-center gap-2 text-3xl font-bold text-indigo-900"
            >
              {instituteName}
              <ChevronDown size={22} className="text-indigo-900" />
            </button>

            {instituteOpen && (
              <ul className="absolute top-full left-0 mt-1 min-w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                {institutes.map((i) => (
                  <li
                    key={i.id}
                    onClick={() => {
                      onInstituteChange(i.id);
                      setInstituteOpen(false);
                    }}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                  >
                    {i.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={13} />
            <span>{location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-base font-semibold tracking-widest uppercase">
          {dateLabel}
        </p>

        <p className="text-6xl font-bold text-indigo-900 tabular-nums">{time}</p>
      </div>

      <div className="h-0.5 bg-indigo-900 w-full" />
    </div>
  );
}
