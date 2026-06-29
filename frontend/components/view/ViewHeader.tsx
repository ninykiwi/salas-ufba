"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface ViewHeaderProps {
  institute: string;
  location: string;
}

export default function ViewHeader({ institute, location }: ViewHeaderProps) {
  const [time, setTime] = useState("");
  const [dateLabel, setDateLabel] = useState("");

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">{institute}</h1>
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