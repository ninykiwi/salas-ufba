export default function RoomCard() {
    return (
        <div className="room-card bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col h-full">
<div className="p-container-padding flex-grow">
<div className="flex justify-between items-start mb-4">
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Laboratório 1</h3>
<span className="bg-surface-container-highest text-secondary px-3 py-1 rounded-full font-label-bold text-[10px] uppercase">Livre</span>
</div>
<div className="bg-surface-container-low border-l-4 border-outline-variant p-4 rounded-r-lg mb-6">
<div className="flex items-center gap-3 text-secondary mb-1">
<span className="material-symbols-outlined">event_available</span>
<p className="font-label-bold text-label-bold uppercase tracking-wider">Disponível</p>
</div>
<h4 className="font-headline-sm text-headline-sm font-bold text-secondary mb-1 leading-tight">SALA LIVRE</h4>
<p className="font-body-sm text-body-sm">Sem atividades no momento</p>
</div>
<div className="space-y-1">
<p className="font-label-md text-label-md text-secondary uppercase tracking-widest">Próximo Evento</p>
<div className="flex justify-between items-center py-2 border-t border-outline-variant">
<span className="font-body-lg text-body-lg font-medium">Aula: Lab 1 (Redes)</span>
<span className="font-label-bold text-label-bold text-secondary">11:35</span>
</div>
</div>
</div>
<div className="bg-surface-container-low px-container-padding py-3 flex items-center justify-between">
<span className="font-label-md text-label-md text-secondary flex items-center gap-1">
<span className="material-symbols-outlined text-sm">devices</span> 30 Máquinas
                    </span>
<button className="text-primary font-label-bold text-label-bold hover:underline">Ver Horários</button>
</div>
</div>

    )
};