"use client";

import { useEffect, useState } from "react";

interface ViewFooterProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
}

const COUNTDOWN_MS = 15000;
const TICK_MS = 100;

export default function ViewFooter({
  currentPage,
  totalPages,
  onNext,
}: ViewFooterProps) {
  const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        setElapsed(0);
    }, [currentPage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed((prev) => Math.min(prev + TICK_MS, COUNTDOWN_MS));
        }, TICK_MS);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (elapsed >= COUNTDOWN_MS) {
            onNext();
            setElapsed(0);
        }
    }, [elapsed, onNext]);

  const progress = (elapsed / COUNTDOWN_MS) * 100;
  const secondsLeft = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === currentPage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Exibindo Página {currentPage + 1} de {totalPages}
          </span>
        </div>

        <p className="text-sm font-bold text-gray-700 tracking-wide uppercase">
          Próxima Atualização em {secondsLeft}s
        </p>
      </div>

      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-900 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}