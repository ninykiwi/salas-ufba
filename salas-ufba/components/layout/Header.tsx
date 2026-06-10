'use client'
import React, { useState, useEffect } from 'react';
import { SelectDropdown } from '../ui/SelectDropdown';

export function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      const dateStr = now.toLocaleDateString('pt-BR', options);
      setDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-6 py-4 h-[100px]">
      <div className="flex items-center gap-4">
        <SelectDropdown label="Campus" options={['Federação', 'Ondina', 'Canela']} />
        <SelectDropdown label="Prédio" options={['Instituto de Computação', 'PAF I', 'PAF II', 'Escola Politécnica']} />
        
        <div className="h-8 w-px bg-outline-variant mx-2 hidden md:block"></div>
        <div className="hidden md:flex gap-4">
          <a href="#" className="text-on-primary-fixed-variant border-b-2 border-primary pb-1 font-label-bold">Hoje</a>
          <a href="#" className="text-secondary hover:text-primary transition-all font-label-bold">Semana</a>
          <a href="#" className="text-secondary hover:text-primary transition-all font-label-bold">Mês</a>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <div className="font-display-lg text-[32px] leading-none font-bold text-primary animate-pulse tracking-tight">
            {time}
          </div>
          <div className="font-label-bold text-[10px] text-secondary uppercase tracking-widest mt-1">
            {date}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-secondary-container rounded-full transition-colors text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 hover:bg-secondary-container rounded-full transition-colors text-primary">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </div>
    </header>
  );
}