import React from 'react';

export type RoomStatus = 'Livre' | 'Ocupada' | 'Em Reunião';

interface RoomCardProps {
  name: string;
  status: RoomStatus;
  currentEvent?: {
    label: string;
    title: string;
    time?: string;
    description?: string;
  };
  nextEvent: {
    title: string;
    time: string;
  };
  capacity: number;
  capacityType?: 'Pessoas' | 'Máquinas';
}

export function RoomCard({ name, status, currentEvent, nextEvent, capacity, capacityType = 'Pessoas' }: RoomCardProps) {
  // Configurações dinâmicas de estilo baseadas no status
  const styles = {
    Ocupada: {
      badge: 'bg-primary-container text-on-primary-container',
      box: 'bg-[#E3F2FD] border-primary',
      textPrimary: 'text-primary',
      textSecondary: 'text-on-primary-fixed-variant',
      title: 'text-on-primary-fixed',
      icon: 'schedule',
    },
    Livre: {
      badge: 'bg-surface-container-highest text-secondary',
      box: 'bg-surface-container-low border-outline-variant',
      textPrimary: 'text-secondary',
      textSecondary: 'text-secondary',
      title: 'text-secondary',
      icon: 'event_available',
    },
    'Em Reunião': {
      badge: 'bg-error-container text-on-error-container',
      box: 'bg-[#FFEBEE] border-error',
      textPrimary: 'text-error',
      textSecondary: 'text-secondary',
      title: 'text-on-error-container',
      icon: 'schedule',
    },
  }[status];

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-primary">{name}</h3>
          <span className={`${styles.badge} px-3 py-1 rounded-full font-label-bold text-[10px] uppercase`}>
            {status}
          </span>
        </div>

        <div className={`${styles.box} border-l-4 p-4 rounded-r-lg mb-6`}>
          {currentEvent && (
            <>
              <div className={`flex items-center gap-2 ${styles.textPrimary} mb-1`}>
                {status === 'Livre' && <span className="material-symbols-outlined">{styles.icon}</span>}
                <p className="font-label-bold text-label-bold uppercase tracking-wider">{currentEvent.label}</p>
              </div>
              <h4 className={`font-headline-sm text-headline-sm font-bold ${styles.title} mb-1 leading-tight`}>
                {currentEvent.title}
              </h4>
              <div className={`flex items-center gap-1.5 ${styles.textSecondary}`}>
                {status !== 'Livre' && <span className="material-symbols-outlined text-sm">{styles.icon}</span>}
                <span className="font-body-sm text-body-sm">
                  {currentEvent.time || currentEvent.description}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-1">
          <p className="font-label-md text-label-md text-secondary uppercase tracking-widest">Próximo Evento</p>
          <div className="flex justify-between items-center py-2 border-t border-outline-variant">
            <span className="font-body-lg text-body-lg font-medium">{nextEvent.title}</span>
            <span className="font-label-bold text-label-bold text-secondary">{nextEvent.time}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low px-6 py-3 flex items-center justify-between">
        <span className="font-label-md text-label-md text-secondary flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">
            {capacityType === 'Máquinas' ? 'devices' : 'group'}
          </span>
          {capacity} {capacityType}
        </span>
        <button className="text-primary font-label-bold text-label-bold hover:underline">Ver Horários</button>
      </div>
    </div>
  );
}