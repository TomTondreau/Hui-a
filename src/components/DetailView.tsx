import React, { useState } from "react";
import { ParsedCaptura, EnlaceReferencia } from "../types";
import { ArrowLeft, BookOpen, Clock, FileText, Check, Github, ExternalLink, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DetailViewProps {
  card: ParsedCaptura;
  onGoBack: () => void;
  key?: string;
}

export default function DetailView({ card, onGoBack }: DetailViewProps) {
  const [viewMode, setViewMode] = useState<'sintesis' | 'transcripcion'>('sintesis');
  const [copied, setCopied] = useState(false);

  // Combines all metadata into a lovely plain text hierarchy for clipboard export
  const copyCompleteNotes = () => {
    const stepsText = card.pasosArray.map((p, i) => `${i + 1}. ${p}`).join("\n");
    const stackText = card.stackArray.map((s) => `• ${s}`).join("\n");
    const linksText = card.enlacesReferenciaList
      .map((l) => `- ${l.titulo}: ${l.url}`)
      .join("\n");

    const textToCopy = `========================================================
📗 HUIÑA APP: APUNTES COMPLETOS & SÍNTESIS
========================================================
TÍTULO: ${card.titulo_sintetizado}
CATEGORÍA: ${card.etiqueta}
URL ORIGINAL: ${card.url_origen}

--------------------------------------------------------
📌 PASO A PASO EXPLICADO:
--------------------------------------------------------
${stepsText}

--------------------------------------------------------
🛠️ STACK / INGREDIENTES / HERRAMIENTAS:
--------------------------------------------------------
${stackText}

--------------------------------------------------------
💡 ENLACES Y DOCUMENTACIÓN DE REFERENCIA:
--------------------------------------------------------
${linksText}

--------------------------------------------------------
🗣️ TRANSCRIPCIÓN COLOQUIAL COMPLETADA:
--------------------------------------------------------
"${card.transcripcion}"

========================================================
© Capturado con HUIÑA Applet
========================================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Safe helper to grab an icon according to link title contents
  const getLinkIcon = (title: string) => {
    const l = title.toLowerCase();
    if (l.includes("github") || l.includes("repo") || l.includes("código")) {
      return <Github size={16} className="text-[#E87040]" />;
    }
    return <ExternalLink size={16} className="text-[#E87040]" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
      className="pb-16 h-full flex flex-col"
    >
      {/* Main Card View wrapper with direct rectangular straight outline */}
      <div className="border border-[#3D2620] bg-black/35 relative flex flex-col flex-1 overflow-hidden" style={{ maxHeight: '85vh' }}>
        
        {/* Superior Media Player Simulation frame: Full width, height >= 220px */}
        <div className="w-full flex-shrink-0 relative h-[250px] md:h-[320px] bg-black border-b border-[#3D2620] flex flex-col justify-between p-4 pt-16 overflow-hidden">
          {/* Real YouTube Thumbnail or fallback */}
          {card.thumbnail_url && (
            <img
              src={card.thumbnail_url}
              alt={card.titulo_sintetizado}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/95 z-10" />
          
          {/* Circular Glassmorphism Back Button with padding/area tactile optimize */}
          <button
            onClick={onGoBack}
            className="absolute top-4 left-4 z-30 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#3D2620] hover:border-[#E87040] text-white hover:text-[#E87045] transition-all flex items-center justify-center cursor-pointer shadow-xl group"
            title="Volver al Archivo de recursos"
          >
            <ArrowLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform text-[#E87040]" />
          </button>

          {/* Animated signal overlays */}
          <div className="absolute top-5 right-4 z-20 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#E87040] bg-[#192C2C] px-2 py-0.5 border border-[#3D2620]">
            <span className="w-1.5 h-1.5 bg-[#E87040] animate-ping rounded-full inline-block"></span>
            REC PLAYER SOURCE // RUNNING HD
          </div>

          <div className="z-20 text-[9px] font-mono text-[#856E65] tracking-widest uppercase pl-1 sm:pl-2">
            HUIÑA DIGITAL RECORDER v2.0
          </div>

          {/* Center visual play overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-16 h-16 border border-[#E87040] bg-[#192C2C]/70 flex items-center justify-center text-[#E87040]">
              <Clock size={24} className="animate-pulse" />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[#A58A7F] mt-2 block bg-black/75 px-2 py-0.5">
              PAUSED SOURCED VIEW
            </span>
          </div>

          {/* Lower status info inside the player */}
          <div className="z-20 flex justify-between items-center text-xs font-mono text-[#A58A7F]">
            <div className="flex items-center gap-3">
              <span className="text-[#E87040] font-bold">00:00 / --:--</span>
              <span className="hidden md:inline text-[10px] text-[#856E65]">FPS: 60.0 • MUTE</span>
            </div>
            <a
              href={card.url_origen}
              target="_blank"
              rel="noreferrer"
              className="text-[#E87040] hover:underline flex items-center gap-1 bg-black/60 px-2.5 py-1 border border-[#3D2620]"
            >
              VER FUENTE ORIGINAL ↗
            </a>
          </div>
        </div>

        {/* Firewatch Style Tabs right below player */}
        <div className="flex w-full border-b border-[#3D2620] bg-black/40 px-6 md:px-8 flex-shrink-0 z-10 shadow-md shadow-black/50">
          <button
            onClick={() => setViewMode("sintesis")}
            className={`relative py-4 px-2 mr-8 text-xs md:text-sm font-mono uppercase tracking-widest cursor-pointer transition-all duration-300 ${
              viewMode === "sintesis"
                ? "text-[#E87040] font-bold drop-shadow-[0_0_8px_rgba(232,112,64,0.7)]"
                : "text-[#856E65] hover:text-[#A58A7F]"
            }`}
          >
            Síntesis
            {viewMode === "sintesis" && (
              <motion.div layoutId="viewModeIndicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E87040] drop-shadow-[0_0_6px_rgba(232,112,64,1)]" />
            )}
          </button>
          <button
            onClick={() => setViewMode("transcripcion")}
            className={`relative py-4 px-2 mr-8 text-xs md:text-sm font-mono uppercase tracking-widest cursor-pointer transition-all duration-300 ${
              viewMode === "transcripcion"
                ? "text-[#E87040] font-bold drop-shadow-[0_0_8px_rgba(232,112,64,0.7)]"
                : "text-[#856E65] hover:text-[#A58A7F]"
            }`}
          >
            Transcripción
            {viewMode === "transcripcion" && (
              <motion.div layoutId="viewModeIndicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E87040] drop-shadow-[0_0_6px_rgba(232,112,64,1)]" />
            )}
          </button>
        </div>

        {/* Independent Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#E87040]/30 scrollbar-track-black/20 p-6 md:p-8">
          
          {/* Title and tags display */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-[#3D2620] text-[#F4EFEA] font-mono text-[10px] uppercase">
                {card.etiqueta.split('|')[0].trim()}
              </span>
              <span className="px-2 py-0.5 bg-black/40 text-[#A58A7F] border border-[#3D2620] font-mono text-[10px]">
                MAYO 2026
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-[#F4EFEA] leading-tight">
              {card.titulo_sintetizado}
            </h2>

            <p className="text-xs md:text-sm font-sans text-[#856E65] italic tracking-wide uppercase">
              {card.etiqueta.includes('|') ? card.etiqueta.split('|')[1].trim() : "Recurso capturado"}
            </p>
          </div>

          <div className="h-[1px] bg-[#3D2620] mb-8" />

          {/* Dynamic Content Panel view */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {viewMode === "sintesis" ? (
                <motion.div
                  key="sintesis"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                  {/* Left Column: steps */}
                  <div className="md:col-span-7 space-y-4">
                    <h3 className="text-xs font-mono tracking-[0.2em] text-[#E87040] uppercase flex items-center gap-2">
                      <BookOpen size={14} /> // PASO A PASO DETALLADO
                    </h3>
                    <ol className="space-y-4">
                      {card.pasosArray.map((paso, idx) => (
                        <li key={idx} className="flex gap-4 text-sm md:text-base text-[#F4EFEA] leading-relaxed">
                          <span className="font-mono text-xs text-[#E87040] font-bold mt-1 bg-black/40 px-1.5 py-0.5 border border-[#3D2620] h-6 flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="flex-1">{paso}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Right Column: stack */}
                  <div className="md:col-span-5 space-y-4">
                    <h3 className="text-xs font-mono tracking-[0.2em] text-[#E87040] uppercase flex items-center gap-2">
                      <Clock size={14} /> // STACK / INGREDIENTES / HERRAMIENTAS
                    </h3>
                    <ul className="space-y-2.5">
                      {card.stackArray.map((stack, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-[#A58A7F] leading-relaxed">
                          <span className="text-[#E87040] shrink-0">•</span>
                          <span>{stack}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="transcripcion"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <h3 className="text-xs font-mono tracking-[0.2em] text-[#E87040] uppercase">
                    // TEXTO ORIGINAL (TRANSCRIPCIÓN COMPLETA)
                  </h3>
                  <div className="bg-black/20 border border-[#3D2620] p-6 text-sm md:text-base text-[#F4EFEA] leading-relaxed font-sans whitespace-pre-wrap">
                    {card.transcripcion}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="my-8 h-[1px] bg-[#3D2620]" />

          {/* Copy notes action: transparent backboard, orange custom border */}
          <div className="flex flex-col items-center justify-center py-2">
            <button
              onClick={copyCompleteNotes}
              className={`w-full py-4 px-6 border tracking-widest uppercase text-xs font-mono transition-all flex items-center justify-center gap-3 cursor-pointer ${
                copied
                  ? "bg-[#112020] text-[#E87040] border-[#E87040]"
                  : "bg-transparent text-[#E87040] border-[#E87040] hover:bg-[#E87040]/10"
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} /> ¡APUNTES COMPLETOS COPIADOS AL PORTAPAPELES! 📋
                </>
              ) : (
                <>
                  COPIAR APUNTES COMPLETOS DE TRABAJO
                </>
              )}
            </button>
          </div>

          {/* Underlay Tray: Horizontal horizontal links reference card container (Linking API Simulator) */}
          <div className="pt-4 space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#856E65] ml-1">
              • ENLACES DE REFERENCIA & DOCUMENTOS RELACIONADOS (LINKING)
            </h4>
            
            {/* Horizontal scroll container (simulating ScrollView) */}
            <div className="flex overflow-x-auto gap-4 py-2 flex-nowrap scrollbar-thin scrollbar-thumb-[#E87040]/50 scrollbar-track-transparent pb-4">
              {card.enlacesReferenciaList.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-shrink-0 w-72 p-4 bg-black/45 border border-[#3D2620] hover:border-[#E87040] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[9px] font-mono bg-[#192C2C] text-[#E87040] border border-[#3D2620] px-1.5 py-0.5">
                      {link.titulo.toLowerCase().includes("github") ? "GITHUB REPO" : "REDDIT DISCUSSION"}
                    </span>
                    {getLinkIcon(link.titulo)}
                  </div>
                  <h5 className="text-xs text-[#F4EFEA] font-sans font-medium line-clamp-2 min-h-[32px]">
                    {link.titulo}
                  </h5>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#856E65]">
                    <span>LINKING NATIVE ↗</span>
                    <span className="text-[#E87040] hover:underline">ABRIR ENLACE</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
