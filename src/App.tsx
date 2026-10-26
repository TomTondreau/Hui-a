import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CardFeed from "./components/CardFeed";
import DetailView from "./components/DetailView";
import NewResourceModal from "./components/NewResourceModal";
import { getCapturas, insertCaptura } from "./dataManager";
import { isSupabaseConfigured } from "./supabaseClient";
import { ParsedCaptura } from "./types";
import { Plus, Coffee, Compass, BookLock, Library } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [capturas, setCapturas] = useState<ParsedCaptura[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [activeCard, setActiveCard] = useState<ParsedCaptura | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all captures from either Supabase or LocalStorage fallback on mount
  useEffect(() => {
    let active = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getCapturas();
        if (active) {
          setCapturas(data);
        }
      } catch (err) {
        console.error("Error pulling captures list:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  // Filter captures by search text AND category filter pill
  const filteredCapturas = capturas.filter((item) => {
    // A. Filter by search input
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.titulo_sintetizado.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.etiqueta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pasosArray.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.stackArray.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // B. Filter by Category Pill
    // selectedFilter is either 'Ingeniería', 'Técnica', 'Receta' or '2026'
    let matchesCategory = true;
    if (selectedFilter) {
      if (selectedFilter === "2026") {
        matchesCategory = item.id !== ""; // Mayo 2026 matches all for now as a date filter
      } else {
        matchesCategory = item.etiqueta.toLowerCase().includes(selectedFilter.toLowerCase());
      }
    }

    return matchesSearch && matchesCategory;
  });

  // Action callback to store a newly created resource
  const handleAddNewResource = async (newResourceData: Omit<ParsedCaptura, "id">) => {
    setIsLoading(true);
    try {
      const saved = await insertCaptura(newResourceData);
      setCapturas((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed adding new synthesized resource:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#192C2C] text-[#F4EFEA] font-sans antialiased relative selection:bg-[#E87040] selection:text-black">
      
      {/* Decorative Warm Top Ambient Sky Gradients inspired by Firewatch skies */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#E87040]/10 via-[#192C2C]/5 to-transparent pointer-events-none" />

      {/* Main Container Shell: Wide card layout, centered, robust padding */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 relative z-10 flex flex-col min-h-screen">
        
        {/* Top Mini Brand Utilities bar */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#856E65] uppercase pb-4 mb-4 border-b border-[#3D2620]/45">
          <div className="flex items-center gap-1.5">
            <Compass size={12} className="text-[#E87045]" />
            <span>HUINA ECOSYSTEMS v2.6.4</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SISTEMA: ESTABLE</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">LOCALE: ES-LATAM</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!activeCard ? (
            // PANTALLA 1: FEED ARCHIVO
            <motion.div
              key="feed_view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <Header
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  supabaseStatus={isSupabaseConfigured}
                />

                {/* Loader status */}
                {isLoading && capturas.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87040] mx-auto mb-4" />
                    <p className="text-xs font-mono text-[#A58A7F] uppercase tracking-widest animate-pulse">
                      Aislando datos de base de datos...
                    </p>
                  </div>
                ) : (
                  <CardFeed
                    capturas={filteredCapturas}
                    onSelectCard={(card) => setActiveCard(card)}
                  />
                )}
              </div>

              {/* Footer info feed limit */}
              <div className="pt-6 mt-12 border-t border-[#3D2620]/60 flex flex-col items-center">
                <span className="text-[9px] font-mono text-[#856E65] uppercase tracking-widest text-center">
                  HUIÑA procesa enlaces de video utilizando inteligencia artificial para extraer síntesis aplicables.
                </span>
              </div>
            </motion.div>
          ) : (
            // PANTALLA 2: VISTA DE DETALLE
            <DetailView
              key="detail_view"
              card={activeCard}
              onGoBack={() => setActiveCard(null)}
            />
          )}
        </AnimatePresence>

        {/* Footer info section */}
        <footer className="mt-16 pt-8 border-t border-[#3D2620] text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#A58A7F]">
            <span className="flex items-center gap-1.5">
              <Library size={12} /> Archivo HUIÑA App
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Coffee size={12} strokeWidth={2} /> 2026 DeepMind
            </span>
          </div>
          <p className="max-w-md mx-auto text-[10px] text-[#856E65] leading-relaxed">
            Aplicación de recopilación de apuntes con diseño Firewatch rústico e industrial. Esquinas rectas y marcos anchos para favorecer la lectura atenta y el estudio asíncrono.
          </p>
        </footer>

        {/* Dynamic Modal Dialog */}
        <NewResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddResource={handleAddNewResource}
        />

      </main>

      {/* FLOATING ACTION BUTTON (FAB) "ATRAPAR" - Elevated to root layout, z-50 with a dark drop shadow */}
      {!activeCard && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-4 px-6 bg-[#E87040] hover:bg-[#ff8654] text-black font-mono font-bold tracking-[0.22em] text-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.95)] border border-black/80 flex items-center justify-center gap-2 select-none"
            title="Capturar nuevo recurso"
          >
            <Plus size={18} strokeWidth={3.5} />
            ATRAPAR
          </button>
        </div>
      )}
    </div>
  );
}
