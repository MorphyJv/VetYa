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
    <div className="gradient-bg min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto"
      >
        <Link href="/" className="group relative">
          <div className="bg-white rounded-[28%] p-2 shadow-sm overflow-hidden flex items-center justify-center h-16 w-16 transition-transform hover:scale-105 active:scale-95">
            <Logo size={56} className="w-full h-full" />
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--vy-neutral-600)]">
          <a href="#features" className="hover:text-[var(--vy-primary-600)] transition-colors">
            Funciones
          </a>
          <a href="#how-it-works" className="hover:text-[var(--vy-primary-600)] transition-colors">
            Cómo Funciona
          </a>
          <a href="#ai" className="hover:text-[var(--vy-primary-600)] transition-colors">
            IA Asistente
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[var(--vy-neutral-700)] hover:text-[var(--vy-primary-600)] transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[var(--vy-primary-600)] text-white hover:bg-[var(--vy-primary-700)] transition-colors shadow-md hover:shadow-lg"
          >
            Registrarse
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--vy-primary-100)] text-[var(--vy-primary-700)] text-xs font-semibold w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--vy-primary-500)] animate-pulse" />
              Veterinarios disponibles ahora
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--vy-neutral-900)] leading-[1.1]"
            >
              El cuidado de tu mascota,{" "}
              <span className="bg-gradient-to-r from-[var(--vy-primary-600)] to-[var(--vy-primary-400)] bg-clip-text text-transparent">
                siempre a un clic
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg text-[var(--vy-neutral-600)] max-w-md leading-relaxed"
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
              className="flex flex-col sm:flex-row gap-3 mt-2"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[var(--vy-primary-600)] text-white font-semibold text-base hover:bg-[var(--vy-primary-700)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Empezar Gratis
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[var(--vy-neutral-300)] text-[var(--vy-neutral-700)] font-semibold text-base hover:border-[var(--vy-primary-300)] hover:text-[var(--vy-primary-700)] transition-all"
              >
                Cómo Funciona
              </a>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-4 mt-4 text-sm text-[var(--vy-neutral-500)]"
            >
              <div className="flex -space-x-2">
                {["🐕", "🐈", "🦜"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[var(--vy-primary-100)] flex items-center justify-center border-2 border-white text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <span>
                <strong className="text-[var(--vy-neutral-800)]">+2,500</strong>{" "}
                familias ya confían en VetYa
              </span>
            </motion.div>
          </div>

          {/* Right — Hero Visual */}
          <motion.div
            {...floatAnimation}
            className="relative hidden md:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--vy-primary-200)] to-[var(--vy-accent-100)] blur-3xl opacity-40" />

              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute inset-4 glass-card rounded-3xl p-6 flex flex-col items-center justify-center gap-4"
              >
                <div className="mx-auto bg-white rounded-[28%] p-8 shadow-xl overflow-hidden flex items-center justify-center w-64 h-64 transition-transform hover:scale-105">
                  <Logo size={240} className="w-full h-full" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-[var(--vy-neutral-900)] text-lg">
                    Tu mascota, protegida
                  </h3>
                  <p className="text-[var(--vy-neutral-500)] text-sm mt-1">
                    Atención 24/7 con IA + Veterinarios
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  {["📋", "📅", "🚨", "🤖"].map((icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="w-10 h-10 rounded-xl bg-[var(--vy-primary-50)] flex items-center justify-center text-lg shadow-sm"
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
                className="absolute -right-8 top-8 glass-card rounded-2xl p-3 pr-5 flex items-center gap-3 shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--vy-success)] flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--vy-neutral-800)]">
                    Vacuna aplicada
                  </p>
                  <p className="text-[10px] text-[var(--vy-neutral-500)]">
                    Antirrábica — Max
                  </p>
                </div>
              </motion.div>

              {/* Floating SOS */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-4 bottom-12 glass-card rounded-2xl p-3 pr-5 flex items-center gap-3 shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--vy-accent-500)] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">SOS</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--vy-neutral-800)]">
                    Vet conectado
                  </p>
                  <p className="text-[10px] text-[var(--vy-neutral-500)]">
                    Dra. López — 2 min
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Features section ── */}
      <section id="features" className="px-6 py-20 bg-[var(--vy-neutral-50)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--vy-neutral-900)] tracking-tight">
              Todo para el cuidado de tu mascota
            </h2>
            <p className="mt-4 text-[var(--vy-neutral-500)] max-w-lg mx-auto">
              Desde historial médico hasta emergencias, VetYa tiene todo lo que necesitas.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📋",
                title: "Historial Médico",
                desc: "Registra tratamientos, diagnósticos y observaciones de cada mascota.",
                color: "var(--vy-primary-100)",
              },
              {
                icon: "📅",
                title: "Calendario",
                desc: "Programa vacunas, desparasitaciones, citas y medicamentos.",
                color: "var(--vy-accent-100)",
              },
              {
                icon: "🚨",
                title: "SOS Emergencia",
                desc: "Conecta al instante con un veterinario disponible cerca de ti.",
                color: "#fde8e8",
              },
              {
                icon: "🤖",
                title: "Asistente IA",
                desc: "Resuelve dudas de cuidado 24/7 con contexto de tu mascota.",
                color: "#e8f4fd",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl border border-[var(--vy-neutral-200)] bg-[var(--surface)] hover:shadow-xl hover:border-[var(--vy-primary-300)] transition-all cursor-default shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[var(--vy-neutral-900)] text-base">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--vy-neutral-500)] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-6 py-20 bg-[var(--vy-neutral-50)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--vy-neutral-900)] tracking-tight">
              Así de fácil
            </h2>
            <p className="mt-4 text-[var(--vy-neutral-500)]">
              Tres pasos para la tranquilidad de tu familia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--vy-primary-600)] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[var(--vy-neutral-900)] text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--vy-neutral-500)] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 bg-[var(--vy-neutral-50)] border-t border-[var(--vy-neutral-200)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="bg-white rounded-[28%] p-2 shadow-sm overflow-hidden flex items-center justify-center h-14 w-14 opacity-80 grayscale hover:grayscale-0 transition-all">
            <Logo size={40} className="w-full h-full" />
          </div>
          <p className="text-xs text-[var(--vy-neutral-400)]">
            © {new Date().getFullYear()} VetYa. Hecho con ❤️ para las familias y sus mascotas.
          </p>
        </div>
      </footer>
    </div>
  );
}
