# VetYa 🐾
Tu veterinario 24/7 de confianza. Aplicación moderna para la gestión de la salud de mascotas, recordatorios, asistencia de Inteligencia Artificial y un módulo de emergencias (SOS).

## Requisitos Previos

Antes de ejecutar VetYa, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) (viene incluido con Node.js)
- Una cuenta en [Supabase](https://supabase.com/) (para Base de Datos, Autenticación y Realtime)
- Una cuenta en [OpenAI](https://platform.openai.com/) (para el Asistente IA)

---

## 🚀 Guía Paso a Paso para Ejecutar el Proyecto

### 1. Clonar / Inicializar
Si tienes el código localmente, abre tu terminal en la carpeta raíz del proyecto (`VetYa`):
```bash
cd VetYa
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo llamado `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`).
Copia y pega la siguiente estructura, reemplazando con tus propias claves:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# OpenAI (Para VetYa AI Asistente - Sprint 6)
OPENAI_API_KEY=sk-tu_openai_api_key
```

> **¿Dónde encuentro mis credenciales de Supabase?**
> Ve a tu Dashboard de Supabase -> Project Settings -> API.
> Copia la URL del proyecto (`Project URL`) y la clave pública anónima (`Project API Keys: anon, public`).

### 3. Configurar la Base de Datos (Supabase)
Debes asegurarte de que las tablas estén creadas en Supabase. Si no las has creado, debes ejecutar el esquema SQL en el **SQL Editor** de tu panel de Supabase.

Las tablas principales que debes tener (según el Plan del Proyecto):
- `profiles`
- `pets`
- `medical_records`
- `vaccinations`
- `calendar_events`
- `emergency_requests`
- `emergency_messages`
- `ai_conversations`
- `ai_messages`

Si configuraste Supabase Localmente (CLI), ejecuta `npx supabase start` y `npx supabase migration up`.

### 4. Configurar Autenticación (Supabase)
En tu Dashboard de Supabase, ve a **Authentication -> Providers** y asegúrate de que **Email** esté habilitado.

### 5. Iniciar el Servidor de Desarrollo
Una vez instaladas las dependencias y configurado el archivo `.env.local`, ejecuta:

```bash
npm run dev
```

El servidor iniciará localmente. Abre tu navegador web y visita:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## ✨ Comandos Útiles

- `npm run dev`: Inicia el servidor de desarrollo en modo interactivo (Fast Refresh).
- `npm run build`: Compila la aplicación para producción (optimiza páginas, imágenes y código).
- `npm run start`: Inicia el servidor de producción (debes ejecutar `build` primero).

## 🛠️ Tecnologías Usadas
- Next.js 14+ (App Router, Server Actions)
- TypeScript
- Tailwind CSS 4
- Framer Motion (Animaciones)
- Supabase (Backend as a Service)
- Vercel AI SDK (Generación de texto en Streaming)
