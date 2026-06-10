import React from 'react';

export function AddRoomCard() {
  return (
    <div className="border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center p-6 text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer min-h-[300px] h-full">
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
        <p className="font-label-bold text-label-bold uppercase tracking-wider">Cadastrar Sala</p>
      </div>
    </div>
  );
}