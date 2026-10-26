import React, { useState } from "react";
import { ParsedCaptura } from "../types";
import { Play, PackageOpen, List, Grid } from "lucide-react";
import { motion } from "motion/react";

interface CardFeedProps {
  capturas: ParsedCaptura[];
  onSelectCard: (card: ParsedCaptura) => void;
}

export default function CardFeed({ capturas, onSelectCard }: CardFeedProps) {
  const [isGridView, setIsGridView] = useState(false);

  if (capturas.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-[#3D2620] bg-black/10">
        <PackageOpen className="mx-auto text-[#A58A7F] mb-3" size={32} />
        <p className="text-[#A58A7F] font-mono text-sm uppercase">No se hallaron capturas disponibles</p>
        <p className="text-xs text-[#856E65] mt-1 font-sans">Prueba buscando otros términos o agrega una URL nueva.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* UI Toggle with Firewatch industrial-rustic style */}
      <div className="flex justify-between items-center border-[#3D2620]/60 border bg-black/20 px-4 py-3">
        <span className="text-[10px] font-mono tracking-widest text-[#A58A7F] uppercase">
          {isGridView ? "VISTA: CUADRÍCULA" : "VISTA: LISTA DE RECURSOS"}
        </span>
        <div className="flex gap-1.5 p-1 bg-black/40 border border-[#3D2620]/60">
          <button
            onClick={() => setIsGridView(false)}
            className={`p-1.5 transition-all duration-250 cursor-pointer ${
              !isGridView
                ? "bg-[#E87045] text-black font-bold"
                : "text-[#A58A7F] hover:text-[#F4EFEA]"
            }`}
            title="Vista Lista"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setIsGridView(true)}
            className={`p-1.5 transition-all duration-250 cursor-pointer ${
              isGridView
                ? "bg-[#E87045] text-black font-bold"
                : "text-[#A58A7F] hover:text-[#F4EFEA]"
            }`}
            title="Vista Cuadrícula"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Grid or List layout wrapper mimicking FlatList behavior with custom columns layout and required re-render key */}
      <div
        key={isGridView ? "grid" : "list"}
        className={
          isGridView
            ? "grid grid-cols-3 gap-3"
            : "space-y-6"
        }
      >
        {capturas.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.25) }}
            onClick={() => onSelectCard(item)}
            className="group relative cursor-pointer border border-[#3D2620] bg-black/35 hover:bg-black/50 transition-all duration-300 overflow-hidden"
            style={{ contentVisibility: "auto" }}
          >
            {isGridView ? (
              /* GRID VIEW: Thumbnail only (square) */
              <div className="relative w-full aspect-square bg-neutral-950 overflow-hidden">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.titulo_sintetizado}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-95 transition-all duration-500 scale-100 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 text-xs font-mono text-[#856E65]">
                    [SIN IMAGEN]
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play size={20} className="text-[#E87045]" fill="currentColor" />
                </div>
              </div>
            ) : (
              /* LIST VIEW: Full width thumbnail and only synthesized_title directly below */
              <div>
                <div className="w-full relative h-56 md:h-64 bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-[#3D2620]">
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      alt={item.titulo_sintetizado}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 scale-100 group-hover:scale-[1.02]"
                    />
                  )}
                  {/* Premium overlay styles */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 bg-[#E87045]/5 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />

                  {/* Play visual indicator */}
                  <div className="relative z-20 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border border-[#E87045] bg-[#192C2C]/85 group-hover:bg-[#E87045] transition-all duration-300 flex items-center justify-center text-[#E87045] group-hover:text-black">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Left/Right styled titles below the thumbnail */}
                <div className="p-4 md:p-5">
                  <h3 className="text-lg md:text-xl font-sans font-bold text-[#F4EFEA] group-hover:text-[#E87040] transition-colors leading-snug">
                    {item.titulo_sintetizado}
                  </h3>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
