import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { Captura, ParsedCaptura, EnlaceReferencia } from "./types";

// Generates a mock database entries list for out-of-the-box testing and local state
const DEFAULT_CAPTURAS: ParsedCaptura[] = [
  {
    id: "1",
    titulo_sintetizado: "Técnica de infusión para Hot Honey",
    etiqueta: "Receta | 🍯 ESTE ES EL SECRETO...",
    pasosArray: [
      "Calentar la miel pura de abeja a fuego muy bajo (máximo 60°C) para evitar la caramelización o cristalización violenta.",
      "Infundir las hojuelas de chile seco ahumado y ajo machacado durante un ciclo calmo de 25 minutos.",
      "Colar la miel inmediatamente mientras sigue caliente utilizando un colador metálico de malla ultrafina.",
      "Añadir una cucharadita de vinagre de sidra de manzana orgánica fría para balancear la acidez y cortar dulzor."
    ],
    stackArray: [
      "Miel de abeja pura silvestre orgánica",
      "Hojuelas seleccionadas de chile seco rojo picado",
      "Vinagre puro de sidra de manzana orgánica",
      "Termómetro digital metálico de alimentos",
      "Colador cónico de malla ultrafina de cocina"
    ],
    enlacesReferenciaList: [
      { titulo: "Reddit - Discusión de infusión de miel con pimientos ahumados para adobos", url: "https://www.reddit.com/r/sriracha" },
      { titulo: "GitHub - Repositorio de Recetas Libres de Condimentos", url: "https://github.com" }
    ],
    url_origen: "https://www.youtube.com/watch?v=Fhg6vI57u3I",
    transcripcion: "¡Hola a todos! Bienvenidos de vuelta. Hoy les traigo el secreto definitivo que los restaurantes no quieren que sepas: Miel Picante o Hot Honey. Mucha gente simplemente mezcla chile en polvo con miel fría, pero eso es un error terrible. El verdadero truco consiste en calentar la miel pura exactamente a 60 grados. No más que eso porque si se calienta demasiado destruyes su aroma salvaje y se cristaliza. Vertemos los chiles secos ahumados para que liberen su sabor poco a poco. Dejamos reposar unos 25 minutos, colamos rápido y el toque definitivo... un chorrito de vinagre de sidra de manzana. El vinagre rompe el dulzor plano y le da una dimensión increíble. ¡Pruébenlo y me cuentan cómo les va!"
  },
  {
    id: "2",
    titulo_sintetizado: "Docker Multi-stage para NodeJS",
    etiqueta: "Ingeniería | 🐳 REDUCE EL TAMAÑO DE TUS IMÁGENES AL 90%...",
    pasosArray: [
      "Fase de compilación: Usar una imagen oficial de Node regular para instalar dependencias de desarrollo y compilar TypeScript.",
      "Fase de producción: Crear un contenedor liviano basado en Alpine Linux y copiar únicamente el directorio dist/ y dependencias limpias.",
      "Configurar el puerto interno de comunicación en 3000 y el ambiente a PRODUCTION de forma estricta.",
      "Arrancar el servicio con 'node dist/server.cjs' ejecutado por el usuario de sistema no root 'node' por estricta seguridad."
    ],
    stackArray: [
      "Docker Engine v26.0 con soporte de compilación multi-stage",
      "NodeJS v22 base image de compilación",
      "Esbuild bundler ultra-veloz de servidor",
      "TypeScript SDK compilador avanzado"
    ],
    enlacesReferenciaList: [
      { titulo: "GitHub - Plantilla limpia de Dockerfile multi-stage optimizado", url: "https://github.com" },
      { titulo: "Reddit - Debates de optimización y peso de contenedores Alpine en Kubernetes", url: "https://www.reddit.com/r/docker" }
    ],
    url_origen: "https://github.com/features/actions",
    transcripcion: "Hola camaradas del software. Hoy vamos a demoler un mito de DevOps: levantar microservicios con imágenes de más de un gigabyte es una pésima práctica. En este video les muestro la técnica Multi-Stage de Docker. Usamos la imagen pesada de node para construir la aplicación y compilar todo ese TypeScript denso con esbuild, generando un bundler directo. Después, en el segundo bloque 'FROM node:alpine', descartamos las dependencias dev de gigabytes, importamos el micro bundle compilado y voilá: pasamos de 1.1GB a tan solo 75MB de peso final."
  },
  {
    id: "3",
    titulo_sintetizado: "Fermentación Lenta para Sourdough",
    etiqueta: "Técnica | 🥖 LA CORTEZA CRUJIENTE QUE ESTABAS BUSCANDO...",
    pasosArray: [
      "Alimentar la sourdough al 100% de hidratación y esperar a que duplique volumen en cámara templada.",
      "Mezclar harinas blancas e integrales seleccionadas con agua purificada de grifo en autólisis por 45 minutos.",
      "Incorporar la levadura natural y sal rústica para realizar pliegues estilo Rubaud consecutivos.",
      "Retener en atmósfera controlada de refrigerador a 4°C por un transcurso lento de 18 horas de maduración."
    ],
    stackArray: [
      "Harina blanca de fuerza W320 rica en gluten",
      "Masa madre rústica activa de centeno integral",
      "Dutch Oven / Horno holandés de hierro fundido negro",
      "Banetón cónico ovalado de mimbre natural"
    ],
    enlacesReferenciaList: [
      { titulo: "Reddit - Comunidad de Panaderos Artesanales Sourdough", url: "https://www.reddit.com/r/Sourdough" },
      { titulo: "Reddit - Discusión sobre horneado crujiente con vapor o hielo", url: "https://www.reddit.com/r/Sourdough" }
    ],
    url_origen: "https://www.youtube.com/watch?v=Fhg6vI57u3I",
    transcripcion: "¡Hola panaderos inquietos! Sé que muchos tienen problemas para conseguir esos bellos alvéolos en la miga de su pan. Es frustrante, lo sé. Hoy les revelo el secreto absoluto: no destruyan el aire acumulado durante la fermentación. Al hacer el laminado sobre la mesa mojada, estiren la masa con extrema suavidad sin apretar las bolsas que se van formando de gas carbónico. Luego, al meterlo a la heladera a 4 grados centígrados, la levadura se adormece pero las bacterias siguen trabajando, dándole ese inconfundible sabor agrio y rústico único."
  }
];

// Load capturas from either Supabase or LocalStorage fallback
export async function getCapturas(): Promise<ParsedCaptura[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      console.log("Fetching resources from Supabase...");
      const { data, error } = await supabase
        .from("capturas")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Map database records to client parsed representation
        return data.map((item: any) => parseModel(item));
      } else {
        console.log("Supabase table 'capturas' is empty. Feeding beautiful default set.");
        // If empty on remote, let's load defaults
        return DEFAULT_CAPTURAS;
      }
    } catch (dbError) {
      console.error("Failed to read from Supabase. Falling back to LocalStorage:", dbError);
    }
  }

  // LocalStorage mode
  const local = localStorage.getItem("huina_capturas");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      localStorage.setItem("huina_capturas", JSON.stringify(DEFAULT_CAPTURAS));
      return DEFAULT_CAPTURAS;
    }
  } else {
    localStorage.setItem("huina_capturas", JSON.stringify(DEFAULT_CAPTURAS));
    return DEFAULT_CAPTURAS;
  }
}

// Write/Save a new captura model
export async function insertCaptura(newCap: Omit<ParsedCaptura, "id">): Promise<ParsedCaptura> {
  const generatedId = Date.now().toString();
  const modelToSave: ParsedCaptura = {
    id: generatedId,
    ...newCap
  };

  if (isSupabaseConfigured && supabase) {
    try {
      console.log("Attempting to insert capture into Supabase 'capturas' table...");
      
      // We will save 'pasos' as a complex JSON stringified object holding { list, transcripcion }
      // This is extremely defensive programming! It saves both fields into the 'pasos' column
      // without failing if there is no separate 'transcripcion' column in the remote DB schema.
      const pasosPayload = JSON.stringify({
        list: modelToSave.pasosArray,
        transcripcion: modelToSave.transcripcion,
        thumbnail_url: modelToSave.thumbnail_url
      });

      const dbPayload = {
        titulo_sintetizado: modelToSave.titulo_sintetizado,
        etiqueta: modelToSave.etiqueta,
        pasos: pasosPayload,
        stack: JSON.stringify(modelToSave.stackArray),
        enlaces_referencia: JSON.stringify(modelToSave.enlacesReferenciaList),
        url_origen: modelToSave.url_origen
      };

      const { data, error } = await supabase
        .from("capturas")
        .insert([dbPayload])
        .select();

      if (error) {
        throw error;
      }

      console.log("Successfully stored on Supabase DB.");
      if (data && data[0]) {
        return parseModel(data[0]);
      }
    } catch (dbError) {
      console.error("Supabase write failed, shifting writing to LocalStorage state:", dbError);
    }
  }

  // LocalStorage persist fallback
  const existing = await getCapturas();
  const updated = [modelToSave, ...existing];
  localStorage.setItem("huina_capturas", JSON.stringify(updated));
  return modelToSave;
}

// Convert DB schema layout to our ParsedCaptura layout
function parseModel(item: any): ParsedCaptura {
  let stepsList: string[] = [];
  let transVal = "";
  let thumbVal = "";

  // Dynamic parse steps: check if wrapped in our secure defensive JSON body { list, transcripcion, thumbnail_url }
  try {
    const rawPasos = JSON.parse(item.pasos);
    if (rawPasos && typeof rawPasos === "object" && "list" in rawPasos) {
      stepsList = rawPasos.list;
      transVal = rawPasos.transcripcion || "";
      thumbVal = rawPasos.thumbnail_url || "";
    } else if (Array.isArray(rawPasos)) {
      stepsList = rawPasos;
    } else {
      stepsList = [String(item.pasos)];
    }
  } catch {
    stepsList = item.pasos ? String(item.pasos).split("\n").filter(Boolean) : [];
  }

  // Dynamic parse stack tools
  let stackList: string[] = [];
  try {
    const parsedStack = JSON.parse(item.stack);
    if (Array.isArray(parsedStack)) {
      stackList = parsedStack;
    } else {
      stackList = [String(item.stack)];
    }
  } catch {
    stackList = item.stack ? String(item.stack).split("\n").filter(Boolean) : [];
  }

  // Dynamic parse references links
  let linksList: EnlaceReferencia[] = [];
  try {
    const parsedLinks = JSON.parse(item.enlaces_referencia);
    if (Array.isArray(parsedLinks)) {
      linksList = parsedLinks;
    }
  } catch {
    linksList = [];
  }

  // If transcripcion was empty in steps JSON, try to look for fallback, or use a default
  if (!transVal) {
    transVal = `Este recurso no contiene una transcripción completa. Puedes tocar de forma interactiva el campo "Copiar apuntes completos" para exportar la síntesis estructurada, pasos, ingredientes y el enlace original ${item.url_origen}.`;
  }

  // Fallback to extract thumbnail url dynamically on the client if it's missing but it's a YouTube URL!
  if (!thumbVal && item.url_origen) {
    const lowercaseOrig = item.url_origen.toLowerCase();
    if (item.url_origen.includes("Z2aD16zFP8E") || lowercaseOrig.includes("chuds")) {
      thumbVal = "https://i.ytimg.com/vi/Z2aD16zFP8E/maxresdefault.jpg";
    } else {
      const isYoutube = lowercaseOrig.includes("youtube.com") || lowercaseOrig.includes("youtu.be");
      if (isYoutube) {
        try {
          const regMatch = item.url_origen.match(/(?:v=|\/embed\/|\/watch\?v=|\/\d\/|\/vi\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
          if (regMatch && regMatch[1]) {
            thumbVal = `https://i.ytimg.com/vi/${regMatch[1]}/hqdefault.jpg`;
          }
        } catch (e) {
          // Ignored
        }
      }
    }
  }

  return {
    id: String(item.id),
    titulo_sintetizado: item.titulo_sintetizado || "Sin título",
    etiqueta: item.etiqueta || "Sin etiquetas",
    pasosArray: stepsList,
    stackArray: stackList,
    enlacesReferenciaList: linksList,
    url_origen: item.url_origen || "",
    transcripcion: transVal,
    thumbnail_url: thumbVal || null
  };
}
