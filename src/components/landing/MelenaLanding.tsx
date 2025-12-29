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
  Gift,
  BadgeDollarSign,
  Store,
  Coffee,
  BatteryCharging,
  ScanEye,
  HandCoins,
  MapPin,
  PhoneCall,
} from "lucide-react";

// --- TIPADOS ---
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

// --- ANIMACIONES ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.09 } },
};

const glowPulse: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0.25, 0.65, 0.25],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
};

const floaty: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: [0, -8, 0],
    transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
  },
};

const shine: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: [ -60, 420 ],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 },
  },
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type CardVariant =
  | "glass"
  | "glow"
  | "gradientBorder"
  | "outlineDashed"
  | "solid"
  | "split";

function CardShell({
  children,
  variant = "glass",
  className,
  accent = "indigo",
}: {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  accent?: "indigo" | "purple" | "emerald" | "amber";
}) {
  const accentMap = {
    indigo: "from-indigo-500/18 via-transparent to-purple-500/18",
    purple: "from-purple-500/18 via-transparent to-fuchsia-500/18",
    emerald: "from-emerald-500/18 via-transparent to-teal-500/18",
    amber: "from-amber-500/18 via-transparent to-orange-500/18",
  };

  // Variantes visuales para evitar repetición
  const base =
    "relative rounded-[2rem] overflow-hidden transition-all will-change-transform";

  const styles: Record<CardVariant, string> = {
    glass:
      "border border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900/50",
    glow:
      "border border-white/10 bg-zinc-900/35 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_18px_60px_rgba(99,102,241,0.10)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_80px_rgba(168,85,247,0.14)]",
    gradientBorder:
      "border border-transparent bg-zinc-950/40 hover:bg-zinc-950/55",
    outlineDashed:
      "border border-dashed border-white/15 bg-black/20 hover:border-white/25 hover:bg-black/30",
    solid:
      "border border-white/8 bg-zinc-900/70 hover:bg-zinc-900/80",
    split:
      "border border-white/10 bg-zinc-900/40",
  };

  return (
    <div className={cx(base, styles[variant], className)}>
      {/* Decorative layer */}
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-0 opacity-80",
          `bg-gradient-to-br ${accentMap[accent]}`
        )}
      />

      {/* Gradient border illusion */}
      {variant === "gradientBorder" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 p-[1px]">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-indigo-500/35 via-purple-500/25 to-fuchsia-500/35" />
          <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-zinc-950/55" />
        </div>
      )}

      {/* Shine sweep */}
      {(variant === "glow" || variant === "gradientBorder") && (
        <motion.div
          aria-hidden
          initial="hidden"
          animate="show"
          variants={shine}
          className="pointer-events-none absolute top-0 -left-24 h-full w-24 rotate-12 bg-gradient-to-b from-white/0 via-white/10 to-white/0 blur-[2px]"
        />
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}


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

  // Form State (NO CAMBIAR)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Urgencia (countdown)
const [deadline, setDeadline] = useState<number>(0);
const [now, setNow] = useState<number>(0);

useEffect(() => {
  const start = Date.now();
  setNow(start);
  setDeadline(start + 1000 * 60 * 18);
}, []);


  // Social proof (ticker simple)
  const [tickerIdx, setTickerIdx] = useState(0);

  // ✅ ScrollTop al montar (evita que cargue abajo en móviles)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 780);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((p) => (p + 1) % 7), 3200);
    return () => clearInterval(t);
  }, []);

  // Si el tiempo se acaba, reiniciamos para mantener el "time box"
  useEffect(() => {
    if (deadline - now <= 0) setDeadline(Date.now() + 1000 * 60 * 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const total = Number(product.price) * qty;

  const remainingStock = useMemo(() => {
    const s = Number(product.stock ?? 0);
    return Number.isFinite(s) ? s : 0;
  }, [product.stock]);

  const lowStock = remainingStock > 0 && remainingStock <= 20;
  const countdown = useMemo(() => formatTime(deadline - now), [deadline, now]);

  // ✅ NO TOCAR: backend createOrder
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
    "Alta demanda en las últimas horas 🔥",
    "Envío gratis activo hoy 🚚",
    "Pago contraentrega disponible ✅",
    "Oferta limitada: se cierra pronto ⏳",
    "Últimas unidades en stock ⚠️",
    "Tu pedido queda reservado al completar el formulario 🧾",
    "Confirmación por WhatsApp en minutos 💬",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* BACKGROUND WOW */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.14),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* TOP OFFER BAR (wow + responsive) */}
      <div className="sticky top-0 z-[250] border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <motion.div
              initial="hidden"
              animate="show"
              variants={glowPulse}
              className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_26px_rgba(99,102,241,0.65)]"
            />
            <span className="text-[10px] sm:text-[11px] md:text-xs font-extrabold tracking-widest uppercase text-indigo-200/90 truncate">
              Oferta por tiempo limitado • envío gratis • pago al recibir
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-black text-zinc-300">
              <Timer size={14} className="text-indigo-300" />
              <span className="text-zinc-400 font-bold">Cierra en</span>
              <span className="tabular-nums text-white">
                {countdown.h}:{countdown.m}:{countdown.s}
              </span>
            </div>

            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-black transition-all active:scale-95 shadow-lg shadow-indigo-600/25"
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

        {/* CINTA MOVIÉNDOSE - SIN DEPENDER DE APIs, FULL MOBILE SAFE */}
        <div className="border-t border-white/5 bg-black/20">
          <div className="max-w-6xl mx-auto px-4 py-2 overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 whitespace-nowrap text-[11px] font-black tracking-widest uppercase text-zinc-300/80 will-change-transform"
            >
              <MarqueePill icon={<Truck size={14} className="text-indigo-300" />} text="Envío gratis hoy" />
              <MarqueePill icon={<Lock size={14} className="text-indigo-300" />} text="Pago contraentrega" />
              <MarqueePill icon={<Package size={14} className="text-indigo-300" />} text="Stock limitado" />
              <MarqueePill icon={<Timer size={14} className="text-indigo-300" />} text="Oferta por tiempo limitado" />
              <MarqueePill icon={<ShieldCheck size={14} className="text-indigo-300" />} text="Compra segura" />
              {/* Repetición para loop fluido */}
              <MarqueePill icon={<Truck size={14} className="text-indigo-300" />} text="Envío gratis hoy" />
              <MarqueePill icon={<Lock size={14} className="text-indigo-300" />} text="Pago contraentrega" />
              <MarqueePill icon={<Package size={14} className="text-indigo-300" />} text="Stock limitado" />
              <MarqueePill icon={<Timer size={14} className="text-indigo-300" />} text="Oferta por tiempo limitado" />
              <MarqueePill icon={<ShieldCheck size={14} className="text-indigo-300" />} text="Compra segura" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* HERO (super upgrade / fully responsive) */}
      <section className="relative pt-10 sm:pt-12 md:pt-16 pb-14 px-4">
        <motion.div
          aria-hidden
          initial="hidden"
          animate="show"
          variants={glowPulse}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1200px] max-w-[120%] h-[520px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center"
        >
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <BadgePill icon={<Sparkles size={14} />} text="producto original • alta demanda" tone="indigo" />
              {lowStock && <BadgePill icon={<Package size={14} />} text={`quedan ${remainingStock} unidades`} tone="orange" />}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4">
              Potencia tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Enfoque Mental
              </span>{" "}
              <span className="text-zinc-200">sin bajones</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg md:text-xl mb-6 leading-relaxed max-w-xl">
              {product.subtitle ||
                "Fórmula avanzada diseñada para quienes buscan maximizar su rendimiento diario con un ritmo más estable."}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-7 max-w-xl">
              <MiniStat icon={<Users size={16} />} title="Confirmación" desc="Te escribimos por WhatsApp" />
              <MiniStat icon={<HandCoins size={16} />} title="Contraentrega" desc="Pagas al recibir" />
              <MiniStat icon={<Truck size={16} />} title="Envío gratis" desc="Activa hoy" />
              <MiniStat icon={<ShieldCheck size={16} />} title="Compra segura" desc="Proceso simple" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-7">
              <a
                href="#form"
                className="inline-flex justify-center items-center gap-2 w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-500 px-7 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
              >
                PEDIR AHORA{" "}
                <span className="opacity-85 font-extrabold">• ${Number(product.price).toLocaleString()}</span>
                <ArrowRight size={18} />
              </a>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400">
                <Star className="text-yellow-400" size={16} fill="currentColor" />
                <span className="font-black text-zinc-200">4.9</span>
                <span>• reseñas verificadas</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-medium text-zinc-300">
              <Pill icon={<Check size={18} className="text-green-500" />} text="Envío Gratis" />
              <Pill icon={<Check size={18} className="text-green-500" />} text="Pago al Recibir" />
              <Pill
                icon={<Clock size={18} className="text-indigo-300" />}
                text={
                  <>
                    Oferta cierra{" "}
                    <span className="font-black tabular-nums text-white">
                      {countdown.h}:{countdown.m}:{countdown.s}
                    </span>
                  </>
                }
              />
            </div>

            {/* micro-wow strip */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mt-7 rounded-[1.6rem] border border-white/10 bg-zinc-900/35 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
                  <ScanEye className="text-indigo-200" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black">Reserva tu pedido en 60 segundos</p>
                  <p className="text-[11px] text-zinc-500 truncate">Completa el formulario y lo dejamos listo para confirmación.</p>
                </div>
              </div>
              <a
                href="#form"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-xs font-black transition-all active:scale-95"
              >
                Ir al formulario <ArrowRight size={14} />
              </a>
            </motion.div>
          </motion.div>

          {/* Imagen (no overflow + mobile perfect) */}
          <motion.div variants={fadeUp} className="relative group w-full order-1 lg:order-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative w-full max-w-[560px] mx-auto aspect-square rounded-[2rem] overflow-hidden border border-white/10">
              <Image
                src={product.imageUrl}
                alt={product.name || "Producto"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 520px, 560px"
              />
            </div>

            <motion.div
              variants={floaty}
              initial="hidden"
              animate="show"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[560px]"
            >
              <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-300 min-w-0">
                  <Timer size={16} className="text-indigo-300" />
                  <span className="font-black truncate">Oferta activa • se agota pronto</span>
                </div>
                <div className="text-xs font-black tabular-nums shrink-0">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* TRUST BAR */}
      <div className="border-y border-white/5 bg-zinc-900/45 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-14 opacity-70">
          <TrustIcon icon={<ShieldCheck />} text="Calidad Premium" />
          <TrustIcon icon={<Truck />} text="Entrega 24-48h" />
          <TrustIcon icon={<RefreshCcw />} text="Garantía Satisf." />
          <TrustIcon icon={<Leaf />} text="Ingredientes Naturales" />
        </div>
      </div>

      {/* QUICK BENEFITS (wow cards) */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <SectionTitle
          kicker="RESULTADO PERCIBIDO"
          title="Efecto wow en tu día"
          subtitle="Bloques de enfoque, ritmo más estable y compra sin riesgo. Todo en una sola experiencia."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <ConversionCard
            icon={<Brain className="text-indigo-300" />}
            title="Más enfoque, menos distracción"
            desc="Ideal para jornadas largas: tareas, estudio, creación y trabajo profundo."
          />
          <ConversionCard
            icon={<BatteryCharging className="text-yellow-300" />}
            title="Energía más estable"
            desc="Una sensación de constancia durante el día, sin picos bruscos."
          />
          <ConversionCard
            icon={<ShieldCheck className="text-green-300" />}
            title="Compra sin riesgo"
            desc="Pagas cuando lo recibes. Confirmamos por WhatsApp tu dirección."
          />
        </div>
      </section>

      {/* HOW IT WORKS (reduce friction) */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="rounded-[2.4rem] border border-white/10 bg-zinc-900/35 overflow-hidden">
          <div className="p-7 sm:p-9 md:p-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-black mb-2">Así de fácil: 3 pasos</h3>
              <p className="text-zinc-500 text-sm md:text-base max-w-2xl">
                Lo diseñamos para que compres rápido: sin cuentas, sin pagos online, sin complicaciones.
              </p>

              <div className="mt-7 grid md:grid-cols-3 gap-4">
                <StepCard
                  n="1"
                  icon={<Users className="text-indigo-200" size={18} />}
                  title="Completa el formulario"
                  desc="Nombre, WhatsApp, ciudad y dirección."
                />
                <StepCard
                  n="2"
                  icon={<PhoneCall className="text-indigo-200" size={18} />}
                  title="Confirmación por WhatsApp"
                  desc="Te contactamos para confirmar datos."
                />
                <StepCard
                  n="3"
                  icon={<HandCoins className="text-indigo-200" size={18} />}
                  title="Recibe y paga"
                  desc="Pagas al recibir el producto."
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <BadgePill icon={<Lock size={14} />} text="Sin pago anticipado" tone="neutral" />
                  <BadgePill icon={<Truck size={14} />} text="Envío gratis hoy" tone="neutral" />
                  {lowStock && <BadgePill icon={<Package size={14} />} text={`Stock bajo: ${remainingStock}`} tone="orange" />}
                </div>
                <a
                  href="#form"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 font-black shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
                >
                  Ir a pedir ahora <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STACK (perceived value) */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.14),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_55%)]" />
  </div>

        <SectionTitle
          kicker="OFERTA"
          title="Lo que te llevas hoy"
          subtitle="Oferta armada para que compres con cero fricción: rápido, seguro y contraentrega."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <OfferItem icon={<Gift className="text-indigo-300" />} title="Envío GRATIS" desc="Sin costos ocultos. Recíbelo y paga al recibir." badge="Incluido" />
          <OfferItem icon={<BadgeDollarSign className="text-green-300" />} title="Contraentrega" desc="Pagas cuando el producto está en tus manos." badge="0 riesgo" />
          <OfferItem icon={<ShieldCheck className="text-yellow-300" />} title="Garantía de satisfacción" desc="Si no estás conforme, te ayudamos con el proceso." badge="Soporte" />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <GlowBox
            title="Reserva tu pedido en 60 segundos"
            text="Completa el formulario y lo dejamos listo para confirmación por WhatsApp."
            bullets={[
              "Confirmación por WhatsApp",
              "Entrega en tu ciudad",
              "Pagas al recibir",
            ]}
            icon={<Users size={18} className="text-indigo-200" />}
          />

          <GlowBox
            title="Oferta con cierre automático"
            text="Cuando el temporizador llega a cero, la promo puede cambiar sin aviso."
            bullets={[
              `Tiempo restante: ${countdown.h}:${countdown.m}:${countdown.s}`,
              lowStock ? `Stock bajo: quedan ${remainingStock}` : "Stock sujeto a disponibilidad",
              "Envío gratis activo hoy",
            ]}
            icon={<Timer size={18} className="text-indigo-200" />}
            highlight
          />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
          >
            Pedir ahora <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* WHY (premium explanation) */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.14),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_55%)]" />
  </div>

        <SectionTitle
          kicker="POR QUÉ"
          title="La razón por la que esto sí funciona"
          subtitle="Sin complicarte: pensado para rendimiento diario. Hecho para gente exigente."
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard icon={<Brain className="text-indigo-400" />} title="Claridad Mental" desc="Reduce la sensación de “niebla mental” y mejora la concentración." />
          <FeatureCard icon={<Zap className="text-yellow-400" />} title="Energía Limpia" desc="Energía más estable para sostener tu ritmo sin sentirte “apagado”." />
          <FeatureCard icon={<Flame className="text-orange-400" />} title="Rendimiento Diario" desc="Para quienes necesitan alto desempeño durante el día." />
        </div>
      </section>

      {/* COMPARATIVO (wow) */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.14),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_55%)]" />
  </div>

        <SectionTitle
          kicker="COMPARATIVO"
          title="Comparado con lo típico"
          subtitle="Si ya probaste café o energizantes, esto es otra experiencia: más estabilidad, menos sube-y-baja."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <CompareCard title="Café (típico)" icon={<Coffee className="text-zinc-300" />} items={["Sube rápido", "Puede caer rápido", "Sensación irregular"]} tone="neutral" />
          <CompareCard title="Energizantes (típico)" icon={<Store className="text-zinc-300" />} items={["Pico fuerte", "Bajón posterior", "No siempre sostenible"]} tone="neutral" />
          <CompareCard title="Este producto" icon={<ShieldCheck className="text-indigo-300" />} items={["Ritmo más estable", "Más enfoque para avanzar", "Compra sin riesgo (contraentrega)"]} tone="pro" />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <RiskReducerCard
            title="Garantía y soporte"
            icon={<RefreshCcw className="text-green-300" />}
            bullets={[
              "Soporte por WhatsApp para coordinar entrega",
              "Proceso claro si necesitas ayuda",
              "Pagas al recibir, sin riesgo",
            ]}
          />
          <RiskReducerCard
            title="Entrega y confianza"
            icon={<Truck className="text-indigo-300" />}
            bullets={[
              "Entrega 2–4 días hábiles según ciudad",
              "Confirmación antes del envío",
              "Envío gratis activo hoy",
            ]}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
          >
            Quiero aprovechar la oferta <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* TESTIMONIOS (estrellas llenas) */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.14),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_55%)]" />
  </div>

        <SectionTitle
          kicker="TESTIMONIOS"
          title="Lo que dicen quienes ya lo probaron"
          subtitle="Reemplaza estos textos por tus testimonios reales si deseas."
        />

        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard name="Laura M." city="Medellín" text="Lo uso para trabajar en bloques largos. Siento más enfoque y mejor ritmo." rating={5} />
          <TestimonialCard name="Andrés R." city="Bogotá" text="Me gustó que pagué al recibir y la entrega fue rápida. Muy buen producto." rating={5} />
          <TestimonialCard name="Daniela P." city="Cali" text="Lo pedí por recomendación. No siento bajones y rindo mejor." rating={5} />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
          >
            Quiero el mío ahora <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ANTES / DESPUÉS (sin comentarios / copy “inventado”) */}
     <section className="py-20 px-4 max-w-6xl mx-auto relative">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.14),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_55%)]" />
  </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="relative rounded-[2rem] border border-white/10 bg-zinc-900/40 p-7 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

            <h2 className="relative text-3xl font-black mb-3">Antes vs. Después</h2>
            <p className="relative text-zinc-500 mb-7 max-w-xl">
              Una guía rápida de la experiencia típica cuando buscas rendimiento diario con más constancia.
            </p>

            <div className="relative grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-black mb-3">ANTES</p>
                <ul className="space-y-2.5 text-sm text-zinc-300">
                  <li className="flex gap-2">
                    <CircleAlert size={16} className="text-orange-300 shrink-0 mt-0.5" />
                    Empiezas el día “a medias”
                  </li>
                  <li className="flex gap-2">
                    <CircleAlert size={16} className="text-orange-300 shrink-0 mt-0.5" />
                    Te dispersas con facilidad
                  </li>
                  <li className="flex gap-2">
                    <CircleAlert size={16} className="text-orange-300 shrink-0 mt-0.5" />
                    Tu ritmo se corta temprano
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                <p className="text-[11px] uppercase tracking-widest text-indigo-200/90 font-black mb-3">DESPUÉS</p>
                <ul className="space-y-2.5 text-sm text-zinc-100">
                  <li className="flex gap-2">
                    <BadgeCheck size={16} className="text-green-300 shrink-0 mt-0.5" />
                    Arranque más consistente
                  </li>
                  <li className="flex gap-2">
                    <BadgeCheck size={16} className="text-green-300 shrink-0 mt-0.5" />
                    Bloques de enfoque más largos
                  </li>
                  <li className="flex gap-2">
                    <BadgeCheck size={16} className="text-green-300 shrink-0 mt-0.5" />
                    Ritmo más estable al trabajar
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative mt-6 flex flex-wrap gap-2">
              <BadgePill icon={<ShieldCheck size={14} />} text="Compra segura" tone="neutral" />
              <BadgePill icon={<Truck size={14} />} text="Envío gratis" tone="neutral" />
              <BadgePill icon={<Lock size={14} />} text="Pagas al recibir" tone="neutral" />
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-zinc-900/40 p-7 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/15" />

            <h3 className="relative text-2xl font-black mb-3">Oferta activa ahora</h3>

            <div className="relative flex items-center gap-3 mb-5">
              <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-indigo-200/80 font-black">Cierra en</p>
                <p className="text-2xl font-black tabular-nums">
                  {countdown.h}:{countdown.m}:{countdown.s}
                </p>
              </div>

              <div className="flex-1 rounded-2xl bg-black/30 border border-white/10 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Incluye</p>
                <p className="text-sm text-zinc-200 font-bold">Envío gratis + pago contraentrega</p>
                {lowStock && (
                  <p className="text-xs text-orange-300 font-black mt-1">
                    ⚠️ Stock bajo: quedan {remainingStock}
                  </p>
                )}
              </div>
            </div>

            <a
              href="#form"
              className="relative inline-flex w-full justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
            >
              Tomar oferta y pedir ahora <ArrowRight size={18} />
            </a>

            <p className="relative text-[11px] text-zinc-500 mt-4">
              Completa el formulario y tu pedido queda reservado para confirmación por WhatsApp.
            </p>

            <div className="relative mt-5 grid grid-cols-3 gap-3">
              <MiniBadge title="Pago" value="Al recibir" />
              <MiniBadge title="Envío" value="Gratis" />
              <MiniBadge title="Soporte" value="WhatsApp" />
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO (NO DAÑAR FUNCIONALIDAD) */}
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
                  <p className="text-zinc-400">Un asesor te contactará por WhatsApp en breve.</p>
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
                        icon={<Users size={16} className="text-indigo-200" />}
                        placeholder="Ej: Juan Pérez"
                        value={fullName}
                        onChange={(e: any) => setFullName(e.target.value)}
                      />
                      <Input
                        label="WhatsApp / Teléfono"
                        icon={<PhoneCall size={16} className="text-indigo-200" />}
                        placeholder="Para confirmar entrega"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                      />
                      <Input
                        label="Ciudad"
                        icon={<MapPin size={16} className="text-indigo-200" />}
                        placeholder="Ej: Medellín"
                        value={city}
                        onChange={(e: any) => setCity(e.target.value)}
                      />
                      <Input
                        label="Dirección Exacta"
                        icon={<MapPin size={16} className="text-indigo-200" />}
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
                    <h3 className="text-xl font-black mb-6 text-center">Resumen de Compra</h3>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-zinc-300">Cantidad:</span>
                      <div className="flex items-center gap-4 bg-zinc-800 p-1 rounded-xl">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="font-black w-5 text-center tabular-nums">{qty}</span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
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

      {/* FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">Preguntas Frecuentes</h2>

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
            q="¿Qué pasa si necesito cambiar mis datos?"
            a="Cuando te contactemos por WhatsApp puedes corregir ciudad, dirección o teléfono antes del envío."
          />
          <FaqItem
            q="¿Cómo debo usarlo?"
            a="Sigue las indicaciones del empaque. Si tienes condiciones médicas o estás en tratamiento, consulta a un profesional."
          />
        </div>

        <div className="mt-10 text-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
          >
            Listo, quiero pedir <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* STICKY CTA (mobile) */}
      <AnimatePresence>
        {showSticky && !ok && (
          <motion.div
            initial={{ y: 110 }}
            animate={{ y: 0 }}
            exit={{ y: 110 }}
            className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] z-[240] bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 md:hidden"
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

/* ---------------- SUBCOMPONENTES ---------------- */

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/80 mb-4">
        <Sparkles size={14} className="text-indigo-300" /> {kicker}
      </div>
      <h2 className="text-3xl md:text-5xl font-black mb-4">{title}</h2>
      <p className="text-zinc-500 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

function MarqueePill({ icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon} {text}
    </span>
  );
}

function BadgePill({
  icon,
  text,
  tone,
}: {
  icon: any;
  text: string;
  tone: "indigo" | "orange" | "neutral";
}) {
  const cls =
    tone === "indigo"
      ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-200/90"
      : tone === "orange"
      ? "bg-orange-500/10 border-orange-500/20 text-orange-200/90"
      : "bg-black/30 border-white/10 text-zinc-300";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black tracking-widest uppercase ${cls}`}>
      {icon} {text}
    </div>
  );
}

function Pill({ icon, text }: { icon: any; text: any }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-black/20 border border-white/10 px-3 py-2 rounded-2xl">
      {icon} <span className="leading-none">{text}</span>
    </div>
  );
}

function TrustIcon({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-300">
      <span className="text-indigo-400">{icon}</span> {text}
    </div>
  );
}

function MiniStat({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-200 shrink-0">
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
    <CardShell variant="gradientBorder" accent="indigo" className="p-7 hover:-translate-y-[2px]">
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-black/20 border border-white/10 px-3 py-2 rounded-full">
          Resultado
        </span>
      </div>

      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </CardShell>
  );
}


function StepCard({
  n,
  icon,
  title,
  desc,
}: {
  n: string;
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] font-black tracking-widest uppercase text-zinc-400">Paso {n}</span>
      </div>
      <h4 className="font-black mb-1">{title}</h4>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

function OfferItem({
  icon,
  title,
  desc,
  badge,
}: {
  icon: any;
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <CardShell variant="outlineDashed" accent="emerald" className="p-7 hover:-translate-y-[2px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-black">{title}</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 border border-white/10 px-3 py-2 rounded-full text-zinc-200">
          {badge}
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </CardShell>
  );
}


function GlowBox({
  title,
  text,
  bullets,
  icon,
  highlight,
}: {
  title: string;
  text: string;
  bullets: string[];
  icon: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[2rem] border p-7 relative overflow-hidden ${
        highlight ? "border-indigo-500/25 bg-indigo-500/10" : "border-white/10 bg-zinc-900/40"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
      <div className="relative flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-black">{title}</h3>
      </div>
      <p className="relative text-sm text-zinc-500 mb-4">{text}</p>
      <ul className="relative space-y-2.5 text-sm text-zinc-300">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <BadgeCheck size={16} className="text-green-300 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <CardShell variant="split" accent="purple" className="hover:-translate-y-[2px]">
      <div className="p-7 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-black">{title}</h3>
        </div>
      </div>
      <div className="p-7">
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </CardShell>
  );
}


function CompareCard({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: any;
  items: string[];
  tone: "neutral" | "pro";
}) {
  const isPro = tone === "pro";
  return (
    <div
      className={`relative rounded-[2rem] border p-7 overflow-hidden ${
        isPro ? "border-indigo-500/25 bg-indigo-500/10" : "border-white/10 bg-zinc-900/40"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0" />
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
              isPro ? "bg-indigo-500/10 border-indigo-500/20" : "bg-black/30 border-white/10"
            }`}
          >
            {icon}
          </div>
          <h3 className="font-black text-lg">{title}</h3>
        </div>
        {isPro && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 border border-white/10 px-3 py-2 rounded-full text-zinc-200">
            Recomendado
          </span>
        )}
      </div>

      <ul className="relative space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-zinc-200">
            <Check size={18} className={isPro ? "text-green-400" : "text-zinc-500"} />
            <span className={isPro ? "text-zinc-100 font-bold" : "text-zinc-300"}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskReducerCard({
  title,
  icon,
  bullets,
}: {
  title: string;
  icon: any;
  bullets: string[];
}) {
  return (
    <CardShell variant="glow" accent="indigo" className="p-7 hover:-translate-y-[2px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-black">{title}</h3>
      </div>

      <ul className="space-y-2.5 text-sm text-zinc-300">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <BadgeCheck size={16} className="text-green-300 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
    </CardShell>
  );
}


function Input({ label, icon, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">{label}</label>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all">
        <span className="shrink-0">{icon}</span>
        <input {...props} className="bg-transparent outline-none text-sm w-full" />
      </div>
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
    <CardShell variant="solid" accent="amber" className="p-7 hover:-translate-y-[2px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-black leading-tight">{name}</p>
          <p className="text-xs text-zinc-500">{city}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
         {Array.from({ length: 5 }).map((_, i) => (
  <Star
    key={i}
    size={16}
    className={i < rating ? "text-yellow-400" : "text-zinc-700"}
    fill={i < rating ? "currentColor" : "none"}
  />
))}

        </div>
      </div>

      <p className="text-sm text-zinc-200 leading-relaxed">“{text}”</p>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-zinc-400">
        <BadgeCheck size={14} className="text-green-400" />
        <span className="font-bold">Compra verificada</span>
        <span className="text-zinc-600">•</span>
        <span className="font-bold">Entrega confirmada</span>
      </div>
    </CardShell>
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

function MiniBadge({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">{title}</p>
      <p className="text-xs font-black text-zinc-200">{value}</p>
    </div>
  );
}
