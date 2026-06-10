"use client";

import { useEffect, useState } from "react";
import { MapPin, Building2, Bell, Info, ChevronDown } from "lucide-react";

export default function TopBar() {
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
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <MapPin size={14} className="text-gray-400" />
          Campus Ondina
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Building2 size={14} className="text-gray-400" />
          Instituto de Computação
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-3xl font-bold text-[#000666] leading-none">{time}</p>
          <p className="text-xs text-gray-700 mt-0.5">{dateLabel}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
}