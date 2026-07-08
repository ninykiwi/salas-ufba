"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Search } from "lucide-react";
import { Room, ROOM_TYPES } from "@/lib/api";

interface AdminRoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
}

function floorLabel(floor: string): string {
  if (floor === "terreo") return "Térreo";
  return `${floor}º Andar`;
}

function typeLabel(type: string): string {
  return ROOM_TYPES.find((t) => t.value === type)?.label ?? type;
}

export default function AdminRoomTable({ rooms, onEdit }: AdminRoomTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      {/* Busca */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="relative w-full max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar sala por nome..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] outline-none"
          />
        </div>
      </div>

      {/* Cabeçalho da Tabela */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">NOME</div>
        <div className="col-span-2">TIPO</div>
        <div className="col-span-2">ANDAR</div>
        <div className="col-span-2">CAPACIDADE</div>
        <div className="col-span-1">STATUS</div>
        <div className="col-span-1 text-right">AÇÕES</div>
      </div>

      {/* Corpo da Tabela */}
      <div className="divide-y divide-gray-100">
        {currentRooms.map((room) => (
          <div
            key={room._id}
            className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-4">
              <p className="font-bold text-sm text-[#000666]">{room.name}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">{typeLabel(room.type)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">{floorLabel(room.floor)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">{room.capacity} pessoas</p>
            </div>
            <div className="col-span-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                  room.status === "ativa"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {room.status === "ativa" ? "Ativa" : "Inativa"}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => onEdit(room)}
                className="p-1.5 text-gray-400 hover:text-[#000666] hover:bg-gray-100 rounded transition-colors"
              >
                <Pencil size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Nenhuma sala encontrada.
          </div>
        )}
      </div>

      {/* Controles de Paginação */}
      {filteredRooms.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a{" "}
            <span className="font-medium text-gray-900">
              {Math.min(indexOfLastItem, filteredRooms.length)}
            </span>{" "}
            de <span className="font-medium text-gray-900">{filteredRooms.length}</span> salas
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-[#000666] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
