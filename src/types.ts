export interface EnlaceReferencia {
  titulo: string;
  url: string;
}

export interface Captura {
  id: string;
  titulo_sintetizado: string;
  etiqueta: string;
  pasos: string; // Stored as serialized JSON ([string]) or raw multiline text
  stack: string; // Stored as serialized JSON ([string]) or raw multiline text
  enlaces_referencia: string; // Stored as serialized JSON ([EnlaceReferencia]) or raw JSON text
  url_origen: string;
}

// Client helper interface for representing parsed/instantiated fields
export interface ParsedCaptura {
  id: string;
  titulo_sintetizado: string;
  etiqueta: string;
  pasosArray: string[];
  stackArray: string[];
  enlacesReferenciaList: EnlaceReferencia[];
  url_origen: string;
  transcripcion: string; // Kept in memory or extracted dynamically
  thumbnail_url?: string | null;
}
