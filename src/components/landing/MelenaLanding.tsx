"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/actions/orders";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  Zap,
  Clock,
  Sparkles,
  Check,
  Brain,
  Flame,
  BadgeCheck,
  Leaf,
  Star,
  RefreshCcw,
  CircleAlert,
  ChevronDown,
  Timer,
  TrendingUp,
  Users,
  Lock,
  Package,
  ArrowRight,
} from "lucide-react";

// --- TIPADOS Y ANIMACIONES ---
type ProductDTO = {
  id: number;
  name: string;
  subtitle: string | null;
  description: string;
  price: any;
  imageUrl: string;
  benefits: any | null;
  stock: number;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.1 } },
};

const glowPulse: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0.25, 0.6, 0.25],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
};

function formatTime(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
}

export default function MelenaLanding({ product }: { product: ProductDTO }) {
  const sp = useSearchParams();
  const fbclid = sp.get("fbclid") || undefined;

  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [showSticky, setShowSticky] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Urgencia (countdown)
  const [deadline, setDeadline] = useState<number>(() => Date.now() + 1000 * 60 * 18); // 18 min
  const [now, setNow] = useState<number>(() => Date.now());

  // Social proof (ticker simple, sin datos reales)
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((p) => (p + 1) % 6), 3500);
    return () => clearInterval(t);
  }, []);

  // Si el tiempo se acaba, reiniciamos una vez para mantener el “time box”
  useEffect(() => {
    if (deadline - now <= 0) setDeadline(Date.now() + 1000 * 60 * 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const total = Number(product.price) * qty;

  const remainingStock = useMemo(() => {
    const s = Number(product.stock ?? 0);
    // “Escasez” suave: si hay stock real, mostramos un umbral si es bajo
    return Number.isFinite(s) ? s : 0;
  }, [product.stock]);

  const lowStock = remainingStock > 0 && remainingStock <= 20;

  const countdown = useMemo(() => formatTime(deadline - now), [deadline, now]);

  const handleOrder = () => {
    if (!fullName || !phone || !city || !address) {
      setError("Por favor completa todos los campos de envío.");
      return;
    }
    startTransition(async () => {
      const res = await createOrder({
        productId: product.id,
        quantity: qty,
        fullName,
        phone,
        city,
        address,
        fbclid,
      });
      if (res.ok) setOk(true);
      else setError("Hubo un error, intenta de nuevo.");
    });
  };

  const purchaseTicker = [
    "Alguien en tu ciudad está a punto de comprar 💥",
    "Últimas unidades con envío gratis 🚚",
    "Pago contraentrega activo hoy ✅",
    "Oferta limitada: se cierra pronto ⏳",
    "Alta demanda en las últimas horas 🔥",
    "Tu pedido queda reservado al completar el formulario 🧾",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* TOP OFFER BANNER */}
      <div className="sticky top-0 z-[200] border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <motion.div
              initial="hidden"
              animate="show"
              variants={glowPulse}
              className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.6)]"
            />
            <span className="text-[11px] md:text-xs font-extrabold tracking-widest uppercase text-indigo-200/90 truncate">
              Oferta por tiempo limitado • envío gratis • pago al recibir
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-zinc-300">
              <Timer size={14} className="text-indigo-300" />
              <span className="text-zinc-400">Cierra en</span>
              <span className="tabular-nums text-white">
                {countdown.h}:{countdown.m}:{countdown.s}
              </span>
            </div>

            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-black transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Tomar oferta <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[11px] text-zinc-400 flex items-center gap-2"
            >
              <TrendingUp size={14} className="text-indigo-300" />
              <span className="truncate">{purchaseTicker[tickerIdx]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 1. HERO HIGH CONVERSION */}
      <section className="relative pt-12 md:pt-16 pb-12 md:pb-16 px-4 overflow-hidden">
        <motion.div
          aria-hidden
          initial="hidden"
          animate="show"
          variants={glowPulse}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] max-w-[120%] h-[520px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-12 items-center"
        >
          <motion.div variants={fadeUp}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-300 text-[11px] font-black tracking-widest uppercase">
                <Sparkles size={14} /> producto original • alta demanda
              </div>

              {lowStock && (
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-300 text-[11px] font-black tracking-widest uppercase">
                  <Package size={14} /> quedan {remainingStock} unidades
                </div>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-5">
              Potencia tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Enfoque Mental
              </span>{" "}
              sin bajones
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg md:text-xl mb-6 leading-relaxed max-w-xl">
              {product.subtitle ||
                "Fórmula avanzada diseñada para quienes buscan maximizar su rendimiento diario sin caídas de energía."}
            </p>

            {/* Sesgos: prueba social + reducción de riesgo */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-7 max-w-xl">
              <MiniStat icon={<Users size={16} />} title="Compra segura" desc="Confirmación por WhatsApp" />
              <MiniStat icon={<Lock size={16} />} title="Sin riesgo" desc="Pagas al recibir" />
              <MiniStat icon={<Truck size={16} />} title="Envío gratis" desc="24–48h (ciudades ppal.)" />
              <MiniStat icon={<RefreshCcw size={16} />} title="Garantía" desc="Satisfacción" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-7">
              <a
                href="#form"
                className="inline-flex justify-center items-center gap-2 w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-500 px-7 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                PEDIR AHORA{" "}
                <span className="opacity-80 font-extrabold">
                  • ${Number(product.price).toLocaleString()}
                </span>
                <ArrowRight size={18} />
              </a>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400">
                <Star className="text-yellow-400" size={16} />
                <span className="font-bold text-zinc-200">4.9</span>
                <span>• opiniones verificadas</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-500" /> Envío Gratis
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-500" /> Pago al Recibir
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-300" /> Oferta cierra:{" "}
                <span className="font-black tabular-nums text-white">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Imagen full responsive */}
          <motion.div variants={fadeUp} className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative w-full max-w-[520px] mx-auto aspect-square rounded-[2rem] overflow-hidden border border-white/10">
              <Image
                src={product.imageUrl}
                alt="Producto"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 92vw, 520px"
              />
            </div>

            {/* Badge de urgencia sobre imagen */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[520px]">
              <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Timer size={16} className="text-indigo-300" />
                  <span className="font-bold">Oferta activa</span>
                  <span className="text-zinc-500">• se agota pronto</span>
                </div>
                <div className="text-xs font-black tabular-nums">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. PROOF & TRUST BAR */}
      <div className="border-y border-white/5 bg-zinc-900/50 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-14 opacity-60">
          <TrustIcon icon={<ShieldCheck />} text="Calidad Premium" />
          <TrustIcon icon={<Truck />} text="Entrega 24-48h" />
          <TrustIcon icon={<RefreshCcw />} text="Garantía Satisf." />
          <TrustIcon icon={<Leaf />} text="Ingredientes Naturales" />
        </div>
      </div>

      {/* 2.5 “BULLETS” DE CONVERSIÓN (sesgos: claridad + microbeneficios) */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <ConversionCard
            icon={<Brain className="text-indigo-300" />}
            title="Más enfoque, menos distracción"
            desc="Ideal para jornadas largas: tareas, estudio, creación y trabajo profundo."
          />
          <ConversionCard
            icon={<Zap className="text-yellow-300" />}
            title="Energía limpia y estable"
            desc="Sensación de energía constante sin el típico “bajón” de media tarde."
          />
          <ConversionCard
            icon={<ShieldCheck className="text-green-300" />}
            title="Compra sin riesgo"
            desc="Pagas cuando lo recibes. Confirmamos por WhatsApp tu dirección y ciudad."
          />
        </div>
      </section>

      {/* 3. POR QUÉ ELEGIRNOS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black mb-4">La razón por la que esto sí funciona</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Sin complicarte: una fórmula pensada para rendimiento diario. Hecho para gente exigente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<Brain className="text-indigo-400" />}
            title="Claridad Mental"
            desc="Reduce la sensación de “niebla mental” y mejora la concentración."
          />
          <FeatureCard
            icon={<Zap className="text-yellow-400" />}
            title="Energía Limpia"
            desc="Energía más estable para sostener tu ritmo sin sentirte “apagado”."
          />
          <FeatureCard
            icon={<Flame className="text-orange-400" />}
            title="Máximo Rendimiento"
            desc="Para emprendedores, estudiantes y personas que necesitan alto desempeño."
          />
        </div>

        {/* sesgo: comparación + aversión a la pérdida */}
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-7">
            <h3 className="text-xl font-black mb-3">Lo que pierdes si lo dejas pasar</h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex gap-2">
                <Check className="text-indigo-300" size={18} /> Hoy: envío gratis + pago al recibir
              </li>
              <li className="flex gap-2">
                <Check className="text-indigo-300" size={18} /> Oferta por tiempo limitado (cierra pronto)
              </li>
              <li className="flex gap-2">
                <Check className="text-indigo-300" size={18} /> {lowStock ? `Stock bajo: quedan ${remainingStock}` : "Alta demanda en este momento"}
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-7">
            <h3 className="text-xl font-black mb-3">Cómo funciona la compra</h3>
            <ol className="space-y-2.5 text-sm text-zinc-300 list-decimal list-inside">
              <li>Completa el formulario con tus datos.</li>
              <li>Te confirmamos por WhatsApp.</li>
              <li>Entregamos en tu ciudad.</li>
              <li>Pagas cuando lo recibes (contraentrega).</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIOS (Prueba social) */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Lo que dicen quienes ya lo probaron</h2>
          <p className="text-zinc-500">Opiniones reales (usa tus testimonios reales aquí).</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Laura M."
            city="Medellín"
            text="Lo uso para trabajar en bloques largos. Se siente más enfoque y menos fatiga."
            rating={5}
          />
          <TestimonialCard
            name="Andrés R."
            city="Bogotá"
            text="Me gustó porque pagué al recibir y la entrega fue rápida. Me rinde bien en el día."
            rating={5}
          />
          <TestimonialCard
            name="Daniela P."
            city="Cali"
            text="Lo pedí por recomendación. No siento el bajón típico. Súper."
            rating={5}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            Quiero el mío ahora <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* 5. “ANTES / DESPUÉS” (sin prometer curas) */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-3xl font-black mb-4">Antes vs. Después (experiencia típica)</h2>
            <p className="text-zinc-500 mb-6">
              Esto es una guía de percepción común. Ajusta el copy según tu evidencia real.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-2">ANTES</p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex gap-2"><CircleAlert size={16} className="text-orange-300" /> Distracción constante</li>
                  <li className="flex gap-2"><CircleAlert size={16} className="text-orange-300" /> Bajón a media tarde</li>
                  <li className="flex gap-2"><CircleAlert size={16} className="text-orange-300" /> Arranque lento</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                <p className="text-xs font-black tracking-widest uppercase text-indigo-200 mb-2">DESPUÉS</p>
                <ul className="space-y-2 text-sm text-zinc-200">
                  <li className="flex gap-2"><BadgeCheck size={16} className="text-green-300" /> Mayor enfoque</li>
                  <li className="flex gap-2"><BadgeCheck size={16} className="text-green-300" /> Energía más estable</li>
                  <li className="flex gap-2"><BadgeCheck size={16} className="text-green-300" /> Mejor ritmo</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-2xl font-black mb-4">Oferta activa ahora</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-indigo-200/80 font-black">Tiempo restante</p>
                <p className="text-2xl font-black tabular-nums">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-black/30 border border-white/10 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Incluye</p>
                <p className="text-sm text-zinc-200 font-bold">
                  Envío gratis + pago contraentrega
                </p>
                {lowStock && (
                  <p className="text-xs text-orange-300 font-black mt-1">
                    ⚠️ Stock bajo: quedan {remainingStock}
                  </p>
                )}
              </div>
            </div>

            <a
              href="#form"
              className="inline-flex w-full justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              Tomar oferta y pedir ahora <ArrowRight size={18} />
            </a>

            <p className="text-[11px] text-zinc-500 mt-4">
              *Al completar el formulario, tu pedido queda en cola de confirmación por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FORMULARIO DE COMPRA (MISMA FUNCIONALIDAD) */}
      <section id="form" className="py-20 px-4 bg-indigo-600/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 py-4 px-6 sm:px-8 text-center">
              <p className="text-sm font-black tracking-widest uppercase flex items-center justify-center gap-2">
                <Timer size={16} />
                Oferta por tiempo limitado •{" "}
                <span className="tabular-nums">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </span>
              </p>
            </div>

            <div className="p-6 sm:p-8 md:p-12">
              {ok ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-2">¡Pedido Exitoso!</h3>
                  <p className="text-zinc-400">
                    Un asesor te contactará por WhatsApp en breve.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-10 md:gap-12">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div>
                        <h3 className="text-2xl font-black">Datos de envío</h3>
                        <p className="text-zinc-500 text-sm mt-1">
                          Completa para reservar tu pedido (pago al recibir).
                        </p>
                      </div>
                      {lowStock && (
                        <div className="hidden sm:inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl text-orange-200 text-xs font-black">
                          <Package size={16} />
                          {remainingStock} disponibles
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                          <CircleAlert size={16} /> {error}
                        </div>
                      )}
                      <Input
                        label="Tu Nombre Completo"
                        placeholder="Ej: Juan Pérez"
                        value={fullName}
                        onChange={(e: any) => setFullName(e.target.value)}
                      />
                      <Input
                        label="WhatsApp / Teléfono"
                        placeholder="Para confirmar entrega"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                      />
                      <Input
                        label="Ciudad"
                        placeholder="Ej: Medellín"
                        value={city}
                        onChange={(e: any) => setCity(e.target.value)}
                      />
                      <Input
                        label="Dirección Exacta"
                        placeholder="Calle, número, apto/barrio"
                        value={address}
                        onChange={(e: any) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <MicroProof icon={<Lock size={16} />} text="Pagas al recibir" />
                      <MicroProof icon={<Truck size={16} />} text="Envío gratis" />
                      <MicroProof icon={<ShieldCheck size={16} />} text="Compra segura" />
                      <MicroProof icon={<RefreshCcw size={16} />} text="Garantía" />
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-black mb-6 text-center">
                      Resumen de Compra
                    </h3>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-zinc-300">Cantidad:</span>
                      <div className="flex items-center gap-4 bg-zinc-800 p-1 rounded-xl">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="w-9 h-9 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="font-black w-5 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-6">
                      <div className="flex justify-between text-zinc-400 text-sm mb-2">
                        <span>Envío:</span>
                        <span className="text-green-400 font-black">GRATIS</span>
                      </div>
                      <div className="flex justify-between text-2xl font-black">
                        <span>Total:</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-200/90 mb-1 flex items-center gap-2">
                        <Timer size={14} />
                        Oferta cierra en{" "}
                        <span className="tabular-nums text-white">
                          {countdown.h}:{countdown.m}:{countdown.s}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-300">
                        Completa el pedido ahora y lo reservamos para confirmación por WhatsApp.
                      </p>
                    </motion.div>

                    <button
                      onClick={handleOrder}
                      disabled={isPending}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.99]"
                    >
                      {isPending ? "PROCESANDO..." : "COMPRAR CONTRAENTREGA"}
                    </button>

                    <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase tracking-tighter">
                      🔒 Pago 100% seguro al recibir el producto
                    </p>

                    {lowStock && (
                      <p className="text-[11px] text-orange-300 text-center mt-2 font-black">
                        ⚠️ Stock bajo: quedan {remainingStock} unidades
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECCIÓN (Derribo de objeciones) */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          <FaqItem
            q="¿En cuánto tiempo llega mi pedido?"
            a="El tiempo de entrega suele ser de 2 a 4 días hábiles según tu ciudad. Te confirmamos y coordinamos por WhatsApp."
          />
          <FaqItem
            q="¿Es seguro el pago contraentrega?"
            a="Sí. Solo pagas cuando recibes el producto. Antes confirmamos tu información de envío."
          />
          <FaqItem
            q="¿Cómo debo tomar el producto?"
            a="Sigue las indicaciones del empaque. Si tienes condiciones médicas o estás en tratamiento, consulta a un profesional."
          />
          <FaqItem
            q="¿Qué pasa si quiero cambiar mis datos?"
            a="No te preocupes: al contactarte por WhatsApp puedes corregir ciudad, dirección o teléfono antes del envío."
          />
        </div>

        <div className="mt-10 text-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            Listo, quiero pedir <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* STICKY CTA (Aparece al hacer scroll) */}
      <AnimatePresence>
        {showSticky && !ok && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-[180] bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 md:hidden"
          >
            <a
              href="#form"
              className="flex items-center justify-between bg-indigo-600 p-4 rounded-xl font-black active:scale-[0.99]"
            >
              <span>PEDIR AHORA</span>
              <span className="tabular-nums">${total.toLocaleString()}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function TrustIcon({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-300">
      <span className="text-indigo-400">{icon}</span> {text}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-7 md:p-8 rounded-[2rem] hover:border-indigo-500/30 transition-colors group">
      <div className="mb-4 scale-110 group-hover:scale-125 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all w-full"
      />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 bg-zinc-900/30 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center text-left font-black gap-3"
      >
        <span className="text-sm md:text-base">{q}</span>
        <ChevronDown className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5 pt-0 text-zinc-400 text-sm leading-relaxed">{a}</div>}
    </div>
  );
}

function MiniStat({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-200">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black">{title}</p>
        <p className="text-[11px] text-zinc-500 truncate">{desc}</p>
      </div>
    </div>
  );
}

function ConversionCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-zinc-900/40 p-7 hover:border-indigo-500/30 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({
  name,
  city,
  text,
  rating,
}: {
  name: string;
  city: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-zinc-900/40 p-7 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-black">{name}</p>
          <p className="text-xs text-zinc-500">{city}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={16} className="text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">“{text}”</p>
    </div>
  );
}

function MicroProof({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 flex items-center gap-2 text-[11px] text-zinc-300 font-bold">
      <span className="text-indigo-300">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}
