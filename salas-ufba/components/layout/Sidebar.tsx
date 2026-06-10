import React from 'react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low dark:bg-surface-dim border-r border-outline-variant dark:border-outline flex flex-col z-[60]">
      <div className="p-6 flex flex-col gap-1 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-lg">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed leading-tight">
              Salas UFBA 2.0
            </h1>
            <p className="font-label-md text-label-md text-secondary">Instituto de Computação</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1 flex-grow">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-primary dark:text-primary-fixed font-bold border-r-4 border-primary dark:border-primary-fixed bg-secondary-container/30 transition-opacity opacity-90">
            <span className="material-symbols-outlined">X</span>
            <span className="font-label-md text-label-md">Visão Geral</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container transition-colors">
            <span className="material-symbols-outlined">X</span>
            <span className="font-label-md text-label-md">Relatórios</span>
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-opacity mb-6">
            LOGIN
          </button>
          <div className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-secondary-container transition-colors">
              <span className="material-symbols-outlined">x</span>
              <span className="font-label-md text-label-md">Configurações</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-secondary-container transition-colors">
              <span className="material-symbols-outlined">x</span>
              <span className="font-label-md text-label-md">Ajuda</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}