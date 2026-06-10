import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusFilter } from '../components/ui/StatusFilter';
import { InfoBanner } from '../components/ui/InfoBanner';
import { RoomCard } from '../components/rooms/RoomCard';
import { AddRoomCard } from '../components/rooms/AddRoomCard';

export default function Dashboard() {
  return (
    <AppLayout>
      {/* Header da Seção */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Ocupação em Tempo Real</h2>
          <p className="font-body-sm text-body-sm text-secondary">Acompanhe a disponibilidade das salas do Instituto de Computação.</p>
        </div>
        <StatusFilter options={['TODAS', 'LIVRES', 'EM AULA']} />
      </div>

      {/* Grid de Salas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <RoomCard 
          name="SmartClass II"
          status="Ocupada"
          currentEvent={{ label: 'Acontecendo Agora', title: 'Aula: Grafos', time: '07:55 — 09:35' }}
          nextEvent={{ title: 'Reunião Geral IC', time: '10:00' }}
          capacity={40}
        />
        
        <RoomCard 
          name="Laboratório 1"
          status="Livre"
          currentEvent={{ label: 'Disponível', title: 'SALA LIVRE', description: 'Sem atividades no momento' }}
          nextEvent={{ title: 'Aula: Lab 1 (Redes)', time: '11:35' }}
          capacity={30}
          capacityType="Máquinas"
        />

        <RoomCard 
          name="Sala 101"
          status="Ocupada"
          currentEvent={{ label: 'Acontecendo Agora', title: 'Aula: EDA 1', time: '08:50 — 10:40' }}
          nextEvent={{ title: 'Cálculo A', time: '13:00' }}
          capacity={60}
        />

        <RoomCard 
          name="Sala de Reuniões"
          status="Em Reunião"
          currentEvent={{ label: 'Em andamento', title: 'Planejamento 2024', time: '09:00 — 11:00' }}
          nextEvent={{ title: 'Reunião Formas', time: '14:50' }}
          capacity={12}
        />

        <RoomCard 
          name="Auditório"
          status="Livre"
          currentEvent={{ label: 'Disponível', title: 'SALA LIVRE', description: 'Livre até as 18:30' }}
          nextEvent={{ title: 'Colação de Grau', time: '18:30' }}
          capacity={120}
        />

        <RoomCard 
          name="Sala 102"
          status="Ocupada"
          currentEvent={{ label: 'Acontecendo Agora', title: 'Aula: POO', time: '07:55 — 09:35' }}
          nextEvent={{ title: 'Eletromag', time: '09:45' }}
          capacity={45}
        />

        <AddRoomCard />
      </div>

      <InfoBanner 
        title="Informativo Acadêmico"
        description="Período de reserva de salas para eventos extras aberto até dia 20/06."
        buttonText="SAIBA MAIS"
      />

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
          <p className="font-label-md text-label-md">© 2024 Salas UFBA 2.0 • Sistema de Gestão de Espaços Acadêmicos</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary">help</span>
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary">settings</span>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}