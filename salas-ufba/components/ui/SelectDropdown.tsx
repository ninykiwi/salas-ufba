import React from 'react';

interface SelectDropdownProps {
  label: string;
  options: string[];
}

export function SelectDropdown({ label, options }: SelectDropdownProps) {
  return (
    <div className="relative min-w-[180px] md:min-w-[240px]">
      <label className="absolute -top-4 left-2 px-1 bg-surface text-[10px] font-label-bold text-secondary uppercase">
        {label}
      </label>
      <select className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-body-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
        v
      </span>
    </div>
  );
}