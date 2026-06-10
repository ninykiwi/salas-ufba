'use client'
import React, { useState } from 'react';

interface StatusFilterProps {
  options: string[];
}

export function StatusFilter({ options }: StatusFilterProps) {
  const [active, setActive] = useState(options[0]);

  return (
    <div className="flex bg-secondary-container rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setActive(opt)}
          className={`px-4 py-1.5 rounded-md font-label-bold text-label-bold transition-colors ${
            active === opt
              ? 'bg-surface-container-lowest shadow-sm text-primary'
              : 'text-secondary hover:text-primary'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}