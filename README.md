# HUIÑA 🌲🪵

> **Aplicación de estudio y cuaderno de campo estilo Firewatch para capturar, sintetizar y organizar recursos técnicos y videos cortos.**

HUIÑA transforma videos cortos (TikToks, Instagram Reels, YouTube Shorts) con tutoriales técnicos, trucos de desarrollo o prompts en **fichas de ingeniería estructuradas y accionables**.

---

## ✨ Características Principales

- 🎯 **Captura Inteligente**: Pega la URL de un TikTok o Reel; el backend extrae miniatura, audio y metadatos reales evitando bloqueos sociales.
- 🤖 **Desglose Asistido por Gemini**:
  - **Pasos secuenciales**: Instrucciones reproducibles paso a paso.
  - **Stack Tecnológico**: Librerías, herramientas, frameworks y lenguajes utilizados.
  - **Enlaces de referencia**: Links directos a documentación o repositorios.
  - **Transcripción depurada**: Extracción del contenido textual sin métricas sociales ni ruido.
- 🎚️ **Vista Dual**:
  - **Modo Síntesis**: Vista al grano con pasos y herramientas.
  - **Modo Transcripción**: Texto íntegro del recurso original.
- 📋 **Exportación en 1 Click**: Copia toda la ficha técnica en Markdown para pegarla en Notion, Obsidian o tu editor de código.
- 🎨 **Estética Firewatch**: Paleta cálida, tipografías mono, diseño retro-técnico para desarrolladores.
- 💾 **Persistencia Híbrida**: Compatible con Supabase (PostgreSQL) con fallback automático y transparente a `localStorage`.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, `@google/genai` (Gemini con Google Search Grounding).
- **Herramientas de Scrape/Extracción**: API de Cobalt + proxies de metadatos.
- **Base de Datos**: Supabase / PostgreSQL (opcional) + LocalStorage.

---

## 🚀 Instalación y Puesta en Marcha Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/huina-app.git
cd huina-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Configura tu clave de Gemini:
```env
GEMINI_API_KEY="tu_api_key_de_gemini"
# Opcional (si usas Supabase):
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📂 Estructura del Proyecto

```
├── server.ts                 # Backend Express + Gemini API + Extracción de videos
├── src/
│   ├── App.tsx               # Componente principal, filtros y estado global
│   ├── components/
│   │   ├── CardFeed.tsx      # Grilla de fichas técnicas
│   │   ├── DetailView.tsx    # Vista detallada (Síntesis vs Transcripción)
│   │   ├── Header.tsx        # Barra de navegación, búsqueda y estado
│   │   └── NewResourceModal.tsx # Modal de captura de URL y previsualización
│   ├── dataManager.ts        # Capa de datos híbrida (Supabase / LocalStorage)
│   ├── supabaseClient.ts     # Cliente Supabase
│   └── types.ts              # Tipos TypeScript para capturas y metadatos
├── package.json
└── README.md
```

---

## 📄 Licencia

MIT
