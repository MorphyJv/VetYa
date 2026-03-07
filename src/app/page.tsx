"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const floatAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#020617] text-white min-h-screen flex flex-col selection:bg-[var(--vy-primary-500)]/30">
      {/* ── Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50 mt-4 bg-slate-950/20 rounded-[32px] border border-white/5"
      >
        <Link href="/" className="group relative">
          <div className="bg-white rounded-[28%] p-1.5 shadow-xl overflow-hidden flex items-center justify-center h-14 w-14 transition-transform hover:scale-110 active:scale-95">
            <Logo size={48} className="w-full h-full" />
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-slate-400">
          <a href="#features" className="hover:text-[var(--vy-primary-400)] transition-colors">
            Funciones
          </a>
          <a href="#how-it-works" className="hover:text-[var(--vy-primary-400)] transition-colors">
            Cómo Funciona
          </a>
          <a href="#pricing" className="hover:text-[var(--vy-primary-400)] transition-colors">
            Planes
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-[13px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="text-[13px] font-black uppercase tracking-widest px-6 py-3 rounded-full bg-gradient-to-r from-[var(--vy-primary-600)] to-[var(--vy-primary-500)] text-white hover:shadow-[0_0_20px_rgba(0,230,255,0.3)] transition-all active:scale-95"
          >
            Registro
          </Link>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-[var(--vy-primary-400)] text-[10px] font-black uppercase tracking-widest w-fit border border-white/5 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--vy-primary-500)] animate-pulse" />
              Veterinarios disponibles ahora
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1] uppercase"
            >
              El cuidado de tu mascota,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-[var(--vy-primary-400)] to-blue-500 animate-gradient-x">
                siempre a un clic
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg text-slate-400 max-w-md leading-relaxed font-medium"
            >
              Conecta al instante con veterinarios certificados. Historial
              médico, recordatorios, emergencias SOS y un asistente de IA —
              todo en un solo lugar.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 mt-2"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-[var(--vy-primary-600)] to-[var(--vy-primary-500)] text-white font-black uppercase tracking-widest text-[13px] hover:shadow-[0_0_30px_rgba(0,230,255,0.4)] transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Empezar Gratis
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-white/5 text-slate-300 font-black uppercase tracking-widest text-[13px] hover:bg-white/5 transition-all"
              >
                Ver Más
              </a>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              <div className="flex -space-x-2">
                {["🐕", "🐈", "🦜"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-950 text-sm shadow-xl"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <span>
                <strong className="text-slate-300">+2,500</strong>{" "}
                familias ya confían en VetYa
              </span>
            </motion.div>
          </div>

          {/* Right — Hero Visual */}
          <motion.div
            {...floatAnimation}
            className="relative hidden md:flex items-center justify-center"
          >
            <div className="relative w-96 h-96">
              {/* Background glows */}
              <div className="absolute inset-0 rounded-full bg-[var(--vy-primary-500)] blur-[100px] opacity-10 animate-pulse" />
              <div className="absolute -inset-20 rounded-full bg-pink-500 blur-[140px] opacity-5 animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl rounded-[48px] p-8 flex flex-col items-center justify-center gap-6 border border-white/10 shadow-3xl shadow-black"
              >
                <div className="mx-auto bg-white rounded-[28%] p-10 shadow-2xl overflow-hidden flex items-center justify-center w-56 h-56 transition-transform hover:scale-105">
                  <Logo size={200} className="w-full h-full" />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-white text-xl uppercase tracking-tight">
                    Tu mascota, protegida
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 font-medium">
                    Atención 24/7 con IA + Veterinarios
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  {["📋", "📅", "🚨", "🤖"].map((icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner border border-white/5"
                    >
                      {icon}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-12 top-10 bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-4 pr-6 flex items-center gap-4 shadow-2xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--vy-success)] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white text-lg font-black">✓</span>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">
                    Vacuna aplicada
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Antirrábica — Max
                  </p>
                </div>
              </motion.div>

              {/* Floating SOS */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-8 bottom-16 bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-4 pr-6 flex items-center gap-4 shadow-2xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <span className="text-white text-[10px] font-black uppercase tracking-tighter">SOS</span>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">
                    Vet conectado
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Dra. López — 2 min
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Features section ── */}
      <section id="features" className="px-6 py-32 bg-slate-950/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--vy-primary-500)]/5 rounded-full blur-[160px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
              Todo para el cuidado de tu mascota
            </h2>
            <p className="mt-6 text-slate-400 max-w-lg mx-auto font-medium text-lg">
              Desde historial médico hasta emergencias, VetYa tiene todo lo que necesitas.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📋",
                title: "Historial Médico",
                desc: "Registra tratamientos, diagnósticos y observaciones de cada mascota.",
              },
              {
                icon: "📅",
                title: "Calendario",
                desc: "Programa vacunas, desparasitaciones, citas y medicamentos.",
              },
              {
                icon: "🚨",
                title: "SOS Emergencia",
                desc: "Conecta al instante con un veterinario disponible cerca de ti.",
              },
              {
                icon: "🤖",
                title: "Asistente IA",
                desc: "Resuelve dudas de cuidado 24/7 con contexto de tu mascota.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-10 rounded-[48px] border border-white/5 bg-slate-900/40 backdrop-blur-md hover:border-[var(--vy-primary-500)]/30 transition-all cursor-default group shadow-2xl"
              >
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-4xl mb-8 shadow-inner group-hover:scale-110 transition-transform bg-gradient-to-br from-slate-800 to-transparent">
                  {feature.icon}
                </div>
                <h3 className="font-black text-white text-xl uppercase tracking-tight mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing section ── */}
      <section id="pricing" className="px-6 py-32 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[180px]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-8">
              Planes de Suscripción 💳
            </h2>
            <div className="max-w-3xl mx-auto p-10 rounded-[48px] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--vy-primary-500)]/10 blur-3xl group-hover:bg-[var(--vy-primary-500)]/20 transition-all" />
              <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--vy-primary-400)] to-blue-400 leading-tight">
                "Tras un uso gratis de 1 semana tendrías que pagar una suscripción para poder utilizar las funciones de atención veterinaria <span className="text-pink-500">Sin contar al SOS</span>"
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { plan: "SEMANAL", price: "60/S", color: "from-slate-800 to-slate-900", delay: 0 },
              { plan: "MENSUAL", price: "250/S", color: "from-[var(--vy-primary-900)] to-slate-900", popular: true, delay: 0.1 },
              { plan: "ANUAL", price: "2900/S", color: "from-slate-800 to-slate-900", delay: 0.2 }
            ].map((p) => (
              <motion.div
                key={p.plan}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: p.delay }}
                className={`relative p-10 rounded-[56px] border-2 ${p.popular ? "border-[var(--vy-primary-500)] lg:scale-110 z-10 shadow-[0_0_80px_rgba(0,230,255,0.1)]" : "border-white/5"} bg-gradient-to-b ${p.color} shadow-3xl overflow-hidden group`}
              >
                {p.popular && (
                  <div className="absolute top-6 right-8 bg-[var(--vy-primary-500)] text-[#020617] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    Más Popular
                  </div>
                )}
                <h4 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">
                  Plan {p.plan}
                </h4>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black text-white">{p.price.split('/')[0]}</span>
                  <span className="text-2xl font-black text-slate-600">/{p.price.split('/')[1]}</span>
                </div>
                <ul className="space-y-5 mb-12">
                  {["Funciones Completas", "Asistente IA 24/7", "Historial Ilimitado", "Soporte Prioritario"].map(f => (
                    <li key={f} className="flex items-center gap-4 text-sm font-black text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-[var(--vy-primary-500)]/10 flex items-center justify-center border border-[var(--vy-primary-500)]/20">
                        <span className="text-[var(--vy-primary-500)] text-xs">✓</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-[13px] transition-all
                  ${p.popular ? "bg-[var(--vy-primary-500)] text-[#020617] hover:scale-105 shadow-[0_0_40px_rgba(0,230,255,0.4)]" : "bg-white/5 text-white hover:bg-white/10 border border-white/5"}`}>
                  Seleccionar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-6 py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-pink-500/5 rounded-full blur-[160px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
              Así de fácil ⚡
            </h2>
            <p className="mt-6 text-slate-400 font-medium text-lg">
              Tres pasos para la tranquilidad de tu familia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate en segundos y agrega a tus mascotas con su información básica.",
              },
              {
                step: "02",
                title: "Gestiona su salud",
                desc: "Registra historial médico, programa vacunas y configura recordatorios.",
              },
              {
                step: "03",
                title: "Conecta al instante",
                desc: "En emergencias, activa SOS. Para dudas, consulta al asistente IA 24/7.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center p-10 rounded-[64px] bg-slate-900/40 border border-white/10 backdrop-blur-sm shadow-3xl"
              >
                <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-[var(--vy-primary-500)] to-blue-600 text-[#020617] font-black text-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[var(--vy-primary-500)]/30">
                  {item.step}
                </div>
                <h3 className="font-black text-white text-2xl uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-20 bg-slate-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="bg-white rounded-[28%] p-3 shadow-3xl overflow-hidden flex items-center justify-center h-20 w-20 opacity-90 transition-all hover:scale-110 active:scale-95">
            <Logo size={64} className="w-full h-full" />
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--vy-primary-500)] transition-colors">Términos</a>
            <a href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--vy-primary-500)] transition-colors">Privacidad</a>
            <a href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--vy-primary-500)] transition-colors">Soporte</a>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
            © {new Date().getFullYear()} VetYa. Hecho con ❤️ por Antigravity
          </p>
        </div>
      </footer>
    </div>
  );
}
