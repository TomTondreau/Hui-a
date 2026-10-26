import React, { useState } from "react";
import { X, Globe, AlertTriangle, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (newResourceData: any) => Promise<void>;
}

export default function NewResourceModal({ isOpen, onClose, onAddResource }: NewResourceModalProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg("Por favor, ingresa una dirección URL válida.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Send URL to our server '/api/analyze' using a real HTTP context immediately
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        throw new Error("Ocurrió un error consultando el analizador inteligente.");
      }

      const payload = await res.json();
      if (payload.success && payload.data) {
        // Step C: Trigger addition to database / storage
        const responseData = {
          titulo_sintetizado: payload.data.titulo_sintetizado,
          etiqueta: payload.data.etiqueta,
          pasosArray: payload.data.pasos,
          stackArray: payload.data.stack,
          enlacesReferenciaList: payload.data.enlaces_referencia,
          url_origen: url.trim(),
          transcripcion: payload.data.transcripcion,
          thumbnail_url: payload.data.thumbnail_url
        };

        await onAddResource(responseData);
        
        // Reset state
        setUrl("");
        setIsProcessing(false);
        onClose();
      } else {
        throw new Error(payload.error || "No se pudo formatear el recurso de manera automática.");
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "No se pudo aislar el recurso. Verifica tu conexión de red o API Key.");
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Semi-transparent backdrop with backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isProcessing ? onClose : undefined}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window: Industrial bold design with straight corners */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#192C2C] border border-[#3D2620] p-6 md:p-8 z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3D2620]">
            <h3 className="text-lg font-mono tracking-widest text-[#E87040] uppercase flex items-center gap-2">
              <Sparkles size={18} /> // EXTRAER NUEVO RECURSO
            </h3>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="text-[#A58A7F] hover:text-[#E87040] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A58A7F] mb-3">
                Copia y pega la URL de tu video o recurso educativo:
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A58A7F]">
                  <Globe size={16} />
                </div>
                <input
                  type="url"
                  required
                  disabled={isProcessing}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-11 pr-4 py-3.5 bg-black/30 text-[#F4EFEA] border border-[#3D2620] outline-none placeholder-[#856E65] text-sm font-sans focus:border-[#E87040] disabled:opacity-40"
                />
              </div>

              <span className="text-[10px] font-mono text-[#856E65] mt-2 block">
                Pega enlaces de YouTube, blogs técnicos, Reddit, GitHub, o recetas rápidas.
              </span>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-[#3D2620] text-red-400 text-xs font-sans flex items-start gap-2">
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions: Giant bold rectangular button as specified */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 text-xs font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#E87040] text-black hover:bg-[#ff8654] disabled:bg-black/40 disabled:text-[#856E65] disabled:border disabled:border-[#3D2620]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Wand2 size={16} className="animate-spin" />
                    <span>AISLANDO... 🔪</span>
                  </div>
                ) : (
                  "EXTRAER PULPA"
                )}
              </button>
              
              {!isProcessing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 text-xs font-mono tracking-wider uppercase text-[#A58A7F] hover:text-[#F4EFEA] hover:bg-black/25 cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Sidenote simulation */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center text-xs font-mono text-[#856E65] animate-pulse"
            >
              HUIÑA está extrayendo información del recurso e invocando el motor de inteligencia artificial...
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
