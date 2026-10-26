import React from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  supabaseStatus: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  supabaseStatus
}: HeaderProps) {
  const filters = [
    { label: "Todos", value: "" },
    { label: "#Tecnología", value: "Ingeniería" },
    { label: "#Técnica", value: "Técnica" },
    { label: "#Recetas", value: "Receta" },
    { label: "Mayo 2026", value: "2026" }
  ];

  return (
    <header className="border-b border-[#3D2620] pb-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          {/* Main big bold Flat text "HUIÑA" in Sunset-Orange with generous letter spacing */}
          <h1 className="text-5xl font-mono font-extrabold tracking-[0.25em] text-[#E87040] select-none leading-none">
            HUIÑA
          </h1>
          <p className="text-sm font-sans tracking-widest text-[#A58A7F] mt-2 uppercase">
            Atrapa. Estudia. Crea.
          </p>
        </div>

        {/* Database Status indicator using humble, human labels */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#3D2620] bg-[#112020] text-xs font-mono text-[#A58A7F]">
          <span className={`inline-block w-2.5 h-2.5 ${supabaseStatus ? "bg-emerald-500" : "bg-[#E87040]"}`}></span>
          <span>BD: {supabaseStatus ? "SUPABASE ONLINE" : "PREVIEW LOCALSTORAGE"}</span>
        </div>
      </div>

      {/* Styled industrial straight search field */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A58A7F]">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por título, tag o tecnología..."
          className="w-full pl-11 pr-4 py-3.5 bg-black/40 text-[#F4EFEA] border border-[#3D2620] outline-none placeholder-[#856E65] text-sm font-sans focus:border-[#E87040] transition-colors"
        />
      </div>

      {/* Row of rectangular filter pills without rounded corners */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase text-[#856E65] mr-1 flex items-center gap-1">
          <SlidersHorizontal size={12} /> Filtros:
        </span>
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.value;
          return (
            <button
              key={filter.label}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 text-xs font-mono transition-all uppercase border cursor-pointer border-[#3D2620] ${
                isActive
                  ? "bg-[#E87040] text-black border-[#E87040] font-bold"
                  : "bg-black/20 text-[#A58A7F] hover:bg-black/40 hover:text-[#F4EFEA]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
