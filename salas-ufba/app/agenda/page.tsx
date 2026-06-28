"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";


interface Event {
  id: string | number;
  title: string;
  description?: string;
  date: string; // Formato YYYY-MM-DD
  start: string; // Formato HH:mm
  end: string; // Formato HH:mm
  colorScheme: "blue" | "red" | "green";
}

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];
const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

export default function Home() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);
  
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [startDateInput, setStartDateInput] = useState<string>("");

  // Estado para a data base da visualização atuals
  const [baseDate, setBaseDate] = useState<Date>(new Date()); 

  // Estado dos eventos (adicione novos objetos aqui e eles aparecerão automaticamente)
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Cálculo Diferencial I",
      description: "Sala 102 • Prof. Silva",
      date: "2026-10-21",
      start: "08:00",
      end: "10:00",
      colorScheme: "blue",
    },
    {
      id: 2,
      title: "Reunião Colegiado",
      date: "2026-10-24",
      start: "08:30",
      end: "09:30",
      colorScheme: "red",
    },
    {
      id: 3,
      title: "Sistemas Distribuídos",
      description: "Laboratório 3",
      date: "2026-10-22",
      start: "14:15",
      end: "16:00",
      colorScheme: "green",
    }
  ]);

  // Lógica para gerar os dias da semana a partir da baseDate
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Volta para Domingo
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [baseDate]);

  const handleDateFilter = () => {
    if (startDateInput) {
      // Cria a data adicionando um horário neutro para evitar problemas de fuso horário no JS
      setBaseDate(new Date(`${startDateInput}T12:00:00`));
    }
    setShowFilters(false);
  };

  // Calcula a posição (top) e altura (height) do evento com base no horário
  // Assumindo que 1 hora = 60px de altura (1 minuto = 1px)
  const getEventStyle = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const durationMinutes = endH * 60 + endM - (startH * 60 + startM);
    
    return {
      top: `${startM}px`,
      height: `${durationMinutes}px`,
    };
  };

  // Mapeamento de cores para o Tailwind
  const colorMap = {
    blue: "bg-blue-50 border-blue-500 text-blue-700",
    red: "bg-red-50 border-red-500 text-red-700",
    green: "bg-green-50 border-green-500 text-green-700",
  };

  const diasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeHref="/agenda" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar
            campuses={mockCampuses}
            selectedCampus={selectedCampus}
            onCampusChange={setSelectedCampus}
            institutes={mockInstitutes}
            selectedInstitute={selectedInstitute}
            onInstituteChange={setSelectedInstitute}
          />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Agenda Completa</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Acompanhe a disponibilidade das salas do IC.
                  </p>
                </div>
                
                <div className="flex flex-col justify-end gap-1">
                  <div className="relative flex items-center gap-3">
                    <div className="flex items-center bg-[#f3f4f6] border border-gray-200 rounded-md p-1">
                      <button 
                        className="p-2 hover:bg-gray-200 transition-colors rounded-md text-[#0a1e4a]"
                        onClick={() => setBaseDate(new Date(baseDate.setDate(baseDate.getDate() - 7)))}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <span className="px-4 font-bold text-sm text-[#0a1e4a]">
                        {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <button 
                        className="p-2 hover:bg-gray-200 transition-colors rounded-md text-[#0a1e4a]"
                        onClick={() => setBaseDate(new Date(baseDate.setDate(baseDate.getDate() + 7)))}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>

                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-md text-[#0a1e4a] text-sm font-medium transition-colors ${
                        showFilters ? "border-[#0a1e4a] shadow-sm" : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Filtros
                    </button>

                    {showFilters && (
                      <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white p-5 rounded-xl border border-gray-200 shadow-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-800">Filtrar por data</h3>
                          <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase">A partir de</label>
                          <input 
                            type="date" 
                            value={startDateInput}
                            onChange={(e) => setStartDateInput(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a1e4a]"
                          />
                        </div>
                        
                        <button 
                          onClick={handleDateFilter}
                          className="w-full mt-2 px-4 py-2 bg-[#0a1e4a] text-white text-sm font-bold rounded-md hover:bg-[#071638] transition-colors shadow-sm"
                        >
                          Ir para Data
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[600px]">
              <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="min-w-[1000px] h-full flex flex-col">
                  
                  {/* HEADER DOS DIAS */}
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-gray-50 sticky top-0 z-30 border-b border-gray-200 shadow-sm">
                    <div className="p-4 flex items-center justify-center text-gray-400 border-r border-gray-200 bg-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    {weekDays.map((day, i) => {
                      const isToday = new Date().toDateString() === day.toDateString();
                      return (
                        <div 
                          key={i} 
                          onClick={() => alert(`Você clicou no dia ${day.toLocaleDateString()}`)}
                          className={`p-4 border-r border-gray-200 text-center cursor-pointer hover:bg-gray-100 transition-colors relative ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                        >
                          {isToday && <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600"></div>}
                          <p className={`text-xs uppercase font-semibold tracking-wider ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>
                            {diasDaSemana[day.getDay()]}
                          </p>
                          <p className={`text-xl font-bold ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
                            {day.getDate().toString().padStart(2, '0')}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* CORPO DO CALENDÁRIO COM 24 HORAS */}
                  <div className="relative flex-1 bg-white">
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] auto-rows-[60px]">
                      
                    {Array.from({ length: 18 }).map((_, index) => {
								      const hour = index + 6; // Começa em 6 e vai até 23 (18 slots no total)

								      return (
								        <div className="contents" key={`hour-${hour}`}>
								          {/* Coluna da Hora */}
								          <div className="p-2 text-right pr-4 text-sm text-gray-400 font-medium border-b border-r border-gray-100 bg-white sticky left-0 z-20">
								            {hour.toString().padStart(2, '0')}:00
								          </div>
											
								          {/* 7 Células de cada dia para aquela hora */}
								          {weekDays.map((day, dayIndex) => {
								            const dateString = day.toISOString().split("T")[0];
													
								            const cellEvents = events.filter(
								              (e) => e.date === dateString && parseInt(e.start.split(":")[0]) === hour
								            );
													
								            return (
								              <div 
								                key={`cell-${dayIndex}-${hour}`} 
								                className="border-b border-r border-gray-100 relative group cursor-pointer hover:bg-blue-50/30 transition-colors"
								                onClick={() => alert(`Adicionar evento em ${day.toLocaleDateString()} às ${hour.toString().padStart(2, '0')}:00`)}
								              >
								                {cellEvents.map((event) => {
								                  const style = getEventStyle(event.start, event.end);
								                  const colors = colorMap[event.colorScheme] || colorMap.blue;
																
								                  return (
								                    <div
								                      key={event.id}
								                      onClick={(e) => { e.stopPropagation(); alert(`Detalhes: ${event.title}`); }}
								                      className={`absolute inset-x-2 border-l-4 p-2 rounded shadow-sm z-10 hover:z-20 cursor-pointer hover:shadow-md transition-all overflow-hidden ${colors}`}
								                      style={{ top: style.top, height: style.height }}
								                    >
								                      <p className="text-xs font-bold opacity-90">{event.start} - {event.end}</p>
								                      <p className="text-sm font-bold leading-tight mt-0.5 truncate">{event.title}</p>
								                      {event.description && (
								                        <p className="text-xs mt-1 opacity-80 truncate">{event.description}</p>
								                      )}
								                    </div>
								                  );
								                })}
								              </div>
								            );
								          })}
								        </div>
								      );
								    })}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}