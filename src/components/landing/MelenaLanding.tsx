"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";

import gal1 from "./melena/gallery-1.webp";
import gal2 from "./melena/gallery-2.webp";
import gal3 from "./melena/gallery-3.webp";

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
  X,
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

  const base =
    "relative rounded-[2rem] overflow-hidden transition-all will-change-transform";

  const styles: Record<CardVariant, string> = {
    glass:
      "border border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900/50",
    glow:
      "border border-white/10 bg-zinc-900/35 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_18px_60px_rgba(99,102,241,0.10)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_80px_rgba(168,85,247,0.14)]",
    gradientBorder: "border border-transparent bg-zinc-950/40 hover:bg-zinc-950/55",
    outlineDashed:
      "border border-dashed border-white/15 bg-black/20 hover:border-white/25 hover:bg-black/30",
    solid: "border border-white/8 bg-zinc-900/70 hover:bg-zinc-900/80",
    split: "border border-white/10 bg-zinc-900/40",
  };

  return (
    <div className={cx(base, styles[variant], className)}>
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-0 opacity-80",
          `bg-gradient-to-br ${accentMap[accent]}`
        )}
      />

      {variant === "gradientBorder" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 p-[1px]">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-indigo-500/35 via-purple-500/25 to-fuchsia-500/35" />
          <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-zinc-950/55" />
        </div>
      )}

      {/* ✅ Quitado: efecto “rectángulo” animado encima de las cards */}

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

// ---------------- META TRACKING HELPERS ----------------
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function buildFbc(fbclid?: string) {
  if (!fbclid) return undefined;
  return `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
}

function genEventId(prefix: string) {
  const uid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as any).randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${uid}`;
}

async function sendCapi(payload: any) {
  try {
    const r = await fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    try {
      return { ok: r.ok, data: JSON.parse(text) };
    } catch {
      return { ok: r.ok, data: text };
    }
  } catch (e) {
    return { ok: false, error: e };
  }
}

function fbqTrack(event: string, params?: Record<string, any>, eventId?: string) {
  const w = typeof window !== "undefined" ? (window as any) : undefined;
  if (!w?.fbq) return;
  try {
    if (eventId) w.fbq("track", event, params || {}, { eventID: eventId });
    else w.fbq("track", event, params || {});
  } catch {}
}

function fbqTrackCustom(
  event: string,
  params?: Record<string, any>,
  eventId?: string
) {
  const w = typeof window !== "undefined" ? (window as any) : undefined;
  if (!w?.fbq) return;
  try {
    if (eventId) w.fbq("trackCustom", event, params || {}, { eventID: eventId });
    else w.fbq("trackCustom", event, params || {});
  } catch {}
}
// -------------------------------------------------------

export default function MelenaLanding({ product }: { product: ProductDTO }) {
  // ✅ Galería con imports
  const GALLERY = useMemo(() => [gal1, gal2, gal3], []);
  const MAIN_IMG = gal1; // ✅ 1) imagen principal = gal1

  const [fbclid, setFbclid] = useState<string | undefined>(undefined);
  const viewContentSentRef = useRef(false);

  const getFbp = () => getCookie("_fbp");
  const getFbc = (_fbclid?: string) => {
    const fromCookie = getCookie("_fbc");
    if (fromCookie) return fromCookie;
    return buildFbc(_fbclid);
  };

  const trackMeta = async ({
    event_name,
    event_id,
    event_source_url,
    user,
    custom_data,
    fbclid,
  }: {
    event_name: string;
    event_id: string;
    event_source_url: string;
    user?: { phone?: string; fullName?: string; email?: string };
    custom_data?: Record<string, any>;
    fbclid?: string;
  }) => {
    const fbp = getFbp();
    const fbc = getFbc(fbclid);

    fbqTrack(event_name, custom_data, event_id);

    await sendCapi({
      event_name,
      event_id,
      event_source_url,
      user: {
        phone: user?.phone,
        email: user?.email,
        fullName: user?.fullName,
      },
      custom_data,
      fbp,
      fbc,
      client_user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      fbclid,
      test_event_code: "TEST66276",
    });
  };

  const trackCTA = async (label: string, extra?: Record<string, any>) => {
    const event_id = genEventId("cta");
    const url = typeof window !== "undefined" ? window.location.href : "";
    const fbp = getFbp();
    const fbc = getFbc(fbclid);

    fbqTrackCustom("CTA_Click", { label, ...extra }, event_id);

    await sendCapi({
      event_name: "CTA_Click",
      event_id,
      event_source_url: url,
      custom_data: {
        label,
        product_id: product?.id,
        product_name: product?.name,
        value: Number(product?.price || 0) * Number(extra?.qty || 1),
        currency: "COP",
        ...extra,
      },
      fbp,
      fbc,
      client_user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      fbclid,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!product?.id) return;

    const params = new URLSearchParams(window.location.search);
    const fbclidParam = params.get("fbclid") || undefined;
    setFbclid(fbclidParam);

    if (viewContentSentRef.current) return;
    viewContentSentRef.current = true;

    const event_id = genEventId("viewcontent");
    const url = window.location.href;

    trackMeta({
      event_name: "ViewContent",
      event_id,
      event_source_url: url,
      fbclid: fbclidParam,
      custom_data: {
        currency: "COP",
        value: Number(product?.price || 0),
        content_name: product?.name,
        content_ids: [String(product?.id)],
        content_type: "product",
      },
    });
  }, [product?.id]);

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

  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

  useEffect(() => {
    if (deadline - now <= 0) setDeadline(Date.now() + 1000 * 60 * 15);
  }, [now, deadline]);

  const total = Number(product.price) * qty;

  const remainingStock = useMemo(() => {
    const s = Number(product.stock ?? 0);
    return Number.isFinite(s) ? s : 0;
  }, [product.stock]);

  const lowStock = remainingStock > 0 && remainingStock <= 20;
  const countdown = useMemo(() => formatTime(deadline - now), [deadline, now]);

  // ✅ Lightbox (click en galería => ver grande)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, GALLERY.length]);

  // ✅ NO TOCAR: backend createOrder
  const handleOrder = () => {
    if (!fullName || !phone || !city || !address) {
      setError("Por favor completa todos los campos de envío.");
      return;
    }

    startTransition(async () => {
      await trackMeta({
        event_name: "InitiateCheckout",
        event_id: genEventId("initcheckout"),
        event_source_url: typeof window !== "undefined" ? window.location.href : "",
        fbclid,
        user: { fullName, phone },
        custom_data: {
          currency: "COP",
          value: total,
          content_ids: [String(product?.id)],
          content_name: product?.name,
          content_type: "product",
          num_items: qty,
        },
      });

      const res = await createOrder({
        productId: product.id,
        quantity: qty,
        fullName,
        phone,
        city,
        address,
        fbclid,
      });

      if (res.ok) {
        await trackMeta({
          event_name: "Purchase",
          event_id: genEventId("purchase"),
          event_source_url: typeof window !== "undefined" ? window.location.href : "",
          fbclid,
          user: { fullName, phone },
          custom_data: {
            currency: "COP",
            value: total,
            content_ids: [String(product?.id)],
            content_name: product?.name,
            content_type: "product",
            num_items: qty,
            city,
          },
        });

        setOk(true);
      } else {
        setError("Hubo un error, intenta de nuevo.");
      }
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

  // ======================== UI ========================
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-clip">
      {/* BG premium */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.78)_78%)]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      {/* TOP OFFER BAR */}
      <div className="sticky top-0 z-[250] border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl overflow-x-clip">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <motion.div
              aria-hidden
              initial="hidden"
              animate="show"
              variants={glowPulse}
              className="pointer-events-none absolute -z-10 left-1/2 -translate-x-1/2 top-[-3.25rem] w-[70vw] max-w-[520px] h-[320px] sm:h-[420px] bg-indigo-600/16 blur-[70px] rounded-full"
            />
            <span className="text-[10px] sm:text-[11px] md:text-xs font-extrabold tracking-widest uppercase text-indigo-200/90 truncate">
              Oferta activa • envío gratis • pago al recibir
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
              onClick={() => trackCTA("topbar_tomar_oferta", { section: "topbar" })}
            >
              Pedir ahora <ArrowRight size={14} />
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

        <div className="border-t border-white/5 bg-black/20">
          <div className="max-w-6xl mx-auto px-4 py-2 overflow-x-clip">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-black tracking-widest uppercase text-zinc-300/80 sm:hidden">
              <MarqueePill icon={<Truck size={14} className="text-indigo-300" />} text="Envío gratis hoy" />
              <MarqueePill icon={<Lock size={14} className="text-indigo-300" />} text="Pago contraentrega" />
              <MarqueePill icon={<Package size={14} className="text-indigo-300" />} text="Stock limitado" />
              <MarqueePill icon={<Timer size={14} className="text-indigo-300" />} text="Oferta limitada" />
              <MarqueePill icon={<ShieldCheck size={14} className="text-indigo-300" />} text="Compra segura" />
            </div>

            <div className="hidden sm:block overflow-hidden">
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

                <MarqueePill icon={<Truck size={14} className="text-indigo-300" />} text="Envío gratis hoy" />
                <MarqueePill icon={<Lock size={14} className="text-indigo-300" />} text="Pago contraentrega" />
                <MarqueePill icon={<Package size={14} className="text-indigo-300" />} text="Stock limitado" />
                <MarqueePill icon={<Timer size={14} className="text-indigo-300" />} text="Oferta por tiempo limitado" />
                <MarqueePill icon={<ShieldCheck size={14} className="text-indigo-300" />} text="Compra segura" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HERO / PDP STYLE ================= */}
      <section className="pt-10 sm:pt-12 md:pt-16 pb-10 px-4 overflow-x-clip">
        <motion.div
          aria-hidden
          initial="hidden"
          animate="show"
          variants={glowPulse}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[78vw] max-w-[620px] h-[380px] sm:h-[480px] bg-indigo-600/16 blur-[80px] rounded-full -z-10"
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-start"
        >
          {/* LEFT: GALLERY / IMAGE */}
          <motion.div variants={fadeUp} className="min-w-0">
            <CardShell variant="glow" accent="indigo" className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <BadgePill icon={<Sparkles size={14} />} text="OFERTA ACTIVA" tone="indigo" />
                {lowStock && <BadgePill icon={<Package size={14} />} text={`quedan ${remainingStock}`} tone="orange" />}
              </div>

              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="relative w-full aspect-square overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                aria-label="Ver imagen principal en grande"
              >
                <Image
                  src={MAIN_IMG}
                  alt={product?.name || "Producto"}
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 520px, 560px"
                  className="object-contain p-5 sm:p-7"
                />
              </button>

              {/* thumbs (clic => abre grande) */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {GALLERY.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    aria-label={`Ver Galería ${i + 1} en grande`}
                  >
                    <Image
                      src={src}
                      alt={`Galería ${i + 1}`}
                      fill
                      sizes="(max-width:640px) 30vw, 160px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill icon={<Truck size={18} className="text-indigo-300" />} text="Envío GRATIS" />
                <Pill icon={<Lock size={18} className="text-indigo-300" />} text="Pagas al recibir" />
                <Pill
                  icon={<Timer size={18} className="text-indigo-300" />}
                  text={
                    <>
                      Cierra{" "}
                      <span className="font-black tabular-nums text-white">
                        {countdown.h}:{countdown.m}:{countdown.s}
                      </span>
                    </>
                  }
                />
              </div>
            </CardShell>
          </motion.div>

          {/* RIGHT: PRICE / CTA / QUICK CHECKOUT */}
          <motion.div variants={fadeUp} className="min-w-0">
            {/* ✅ 3) full responsive: evitar desbordes */}
            <h1 className="text-[28px] sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight break-words text-pretty max-w-full">
              {product?.name || "Melena de León"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 break-words">
                (120 cápsulas)
              </span>
            </h1>

            <p className="mt-3 text-zinc-400 text-[14px] sm:text-lg max-w-xl break-words text-pretty">
              {product?.subtitle || "Enfoque más estable para tu día: trabajo, estudio y tareas exigentes."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
              <MiniStat icon={<Users size={16} />} title="Confirmación" desc="Te escribimos por WhatsApp" />
              <MiniStat icon={<HandCoins size={16} />} title="Contraentrega" desc="Pagas al recibir" />
              <MiniStat icon={<Truck size={16} />} title="Envío gratis" desc="Activa hoy" />
              <MiniStat icon={<ShieldCheck size={16} />} title="Compra segura" desc="Proceso simple" />
            </div>

            {/* PRICE BOX */}
            <div className="mt-7">
              <CardShell variant="gradientBorder" accent="purple" className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-black">Precio hoy</p>
                    <p className="text-3xl sm:text-4xl font-black mt-1 break-words">
                      ${Number(product?.price || 0).toLocaleString()}
                      <span className="text-xs text-zinc-400 font-bold ml-2">COP</span>
                    </p>
                    <p className="text-[12px] text-zinc-400 mt-2">
                      Incluye envío gratis + confirmación por WhatsApp.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {/* ✅ 4) estrella visible (fill) */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-2 text-[11px] font-black">
                      <Star size={14} className="text-yellow-400" fill="currentColor" />
                      <span className="text-white">4.9</span>
                      <span className="text-zinc-500 font-bold">• reseñas</span>
                    </div>
                    <div className="mt-2 text-[11px] text-zinc-500 font-bold tabular-nums">
                      Cierra: {countdown.h}:{countdown.m}:{countdown.s}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#form"
                    className="inline-flex justify-center items-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 px-6 py-4 rounded-2xl font-black text-base shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
                    onClick={() => trackCTA("hero_ir_form", { section: "hero" })}
                  >
                    Comprar contraentrega <ArrowRight size={18} />
                  </a>

                  {/* ✅ 2) Quitado botón “Ver fotos” */}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MicroProof icon={<Lock size={16} />} text="Pagas al recibir" />
                  <MicroProof icon={<Truck size={16} />} text="Envío gratis" />
                  <MicroProof icon={<ShieldCheck size={16} />} text="Compra segura" />
                  <MicroProof icon={<RefreshCcw size={16} />} text="Garantía" />
                </div>
              </CardShell>
            </div>

            {/* QUICK BENEFITS SHORT */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <ConversionCard
                icon={<Brain className="text-indigo-300" />}
                title="Enfoque"
                desc="Bloques de concentración más largos para avanzar."
              />
              <ConversionCard
                icon={<BatteryCharging className="text-yellow-300" />}
                title="Ritmo estable"
                desc="Sensación de constancia durante el día."
              />
              <ConversionCard
                icon={<ShieldCheck className="text-green-300" />}
                title="Cero fricción"
                desc="Sin pagos online: confirmación y entrega."
              />
            </div>
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

      {/* HOW IT WORKS */}
      <section className="py-14 sm:py-16 px-4 max-w-6xl mx-auto">
        <div className="rounded-[2.4rem] border border-white/10 bg-zinc-900/35 overflow-hidden">
          <div className="p-7 sm:p-9 md:p-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-black mb-2 break-words text-pretty">
                Compra en 3 pasos
              </h3>
              <p className="text-zinc-500 text-sm md:text-base max-w-2xl break-words text-pretty">
                Sin cuentas, sin pagos anticipados. Solo confirmación por WhatsApp y pagas al recibir.
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
                  title="Confirmamos por WhatsApp"
                  desc="Validamos datos para envío."
                />
                <StepCard
                  n="3"
                  icon={<HandCoins className="text-indigo-200" size={18} />}
                  title="Recibe y paga"
                  desc="Pagas cuando lo tienes en tus manos."
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
                  onClick={() => trackCTA("how_it_works_ir_form", { section: "how_it_works" })}
                >
                  Ir a pedir ahora <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FORM (NO DAÑAR FUNCIONALIDAD) ================= */}
      <section id="form" className="py-16 sm:py-20 px-4 bg-indigo-600/5">
        <div className="max-w-5xl mx-auto">
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
                  <h3 className="text-3xl font-black mb-2 break-words">¡Pedido Exitoso!</h3>
                  <p className="text-zinc-400 break-words">
                    Un asesor te contactará por WhatsApp en breve.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12">
                  {/* LEFT: Shipping */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div className="min-w-0">
                        <h3 className="text-2xl font-black break-words">Datos de envío</h3>
                        <p className="text-zinc-500 text-sm mt-1 break-words">
                          Completa para reservar tu pedido (pago al recibir).
                        </p>
                      </div>
                      {lowStock && (
                        <div className="hidden sm:inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl text-orange-200 text-xs font-black shrink-0">
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

                  {/* RIGHT: Summary */}
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-fit sticky top-[88px]">
                    <h3 className="text-xl font-black mb-5 text-center break-words">Resumen</h3>

                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 mb-5">
                      <div className="flex items-center justify-between text-sm text-zinc-300 gap-3">
                        <span className="font-bold truncate">{product?.name}</span>
                        <span className="font-black shrink-0">
                          ${Number(product?.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-2">
                        <Truck size={14} className="text-indigo-300" />
                        Envío GRATIS • Contraentrega
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-zinc-300">Cantidad:</span>
                      <div className="flex items-center gap-3 bg-zinc-800 p-1 rounded-xl">
                        <button
                          onClick={() => {
                            setQty((q) => {
                              const next = Math.max(1, q - 1);
                              trackMeta({
                                event_name: "AddToCart",
                                event_id: genEventId("addtocart"),
                                event_source_url: window.location.href,
                                fbclid,
                                custom_data: {
                                  currency: "COP",
                                  value: Number(product?.price || 0) * next,
                                  content_ids: [String(product?.id)],
                                  content_name: product?.name,
                                  content_type: "product",
                                  num_items: next,
                                },
                              });
                              return next;
                            });
                          }}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
                          aria-label="Disminuir cantidad"
                          type="button"
                        >
                          -
                        </button>

                        <span className="font-black w-6 text-center tabular-nums">{qty}</span>

                        <button
                          onClick={() => {
                            setQty((q) => {
                              const next = q + 1;
                              trackMeta({
                                event_name: "AddToCart",
                                event_id: genEventId("addtocart"),
                                event_source_url: window.location.href,
                                fbclid,
                                custom_data: {
                                  currency: "COP",
                                  value: Number(product?.price || 0) * next,
                                  content_ids: [String(product?.id)],
                                  content_name: product?.name,
                                  content_type: "product",
                                  num_items: next,
                                },
                              });
                              return next;
                            });
                          }}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
                          aria-label="Aumentar cantidad"
                          type="button"
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
                      <div className="flex justify-between text-2xl font-black gap-3">
                        <span>Total:</span>
                        <span className="break-words">${total.toLocaleString()}</span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-200/90 mb-1 flex items-center gap-2">
                        <Timer size={14} />
                        Cierra en{" "}
                        <span className="tabular-nums text-white">
                          {countdown.h}:{countdown.m}:{countdown.s}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-300">
                        Completa el pedido y lo reservamos para confirmación por WhatsApp.
                      </p>
                    </motion.div>

                    <button
                      onClick={() => {
                        trackCTA("form_comprar_contraentrega", { section: "form", qty });
                        handleOrder();
                      }}
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
      <section className="py-16 sm:py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10 break-words">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          <FaqItem q="¿En cuánto tiempo llega mi pedido?" a="El tiempo de entrega suele ser de 2 a 4 días hábiles según tu ciudad. Te confirmamos y coordinamos por WhatsApp." />
          <FaqItem q="¿Es seguro el pago contraentrega?" a="Sí. Solo pagas cuando recibes el producto. Antes confirmamos tu información de envío." />
          <FaqItem q="¿Qué pasa si necesito cambiar mis datos?" a="Cuando te contactemos por WhatsApp puedes corregir ciudad, dirección o teléfono antes del envío." />
          <FaqItem q="¿Cómo debo usarlo?" a="Sigue las indicaciones del empaque. Si tienes condiciones médicas o estás en tratamiento, consulta a un profesional." />
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
              onClick={() => trackCTA("sticky_pedir_ahora", { section: "sticky", qty })}
            >
              <span>PEDIR AHORA</span>
              <span className="tabular-nums">${total.toLocaleString()}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm p-4 sm:p-8"
            onMouseDown={(e) => {
              // cerrar si el click es en el overlay (no en el contenido)
              if (e.target === e.currentTarget) closeLightbox();
            }}
            aria-modal="true"
            role="dialog"
          >
            <div className="max-w-5xl mx-auto h-full flex items-center">
              <motion.div
                initial={{ scale: 0.98, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.98, y: 10, opacity: 0 }}
                className="w-full rounded-[2rem] border border-white/10 bg-zinc-950/70 overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10">
                  <div className="text-xs sm:text-sm font-black tracking-widest uppercase text-zinc-300">
                    Galería • {lightboxIdx + 1}/{GALLERY.length}
                  </div>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-2"
                    aria-label="Cerrar"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative w-full aspect-square bg-black/40">
                  <Image
                    src={GALLERY[lightboxIdx]}
                    alt={`Galería ${lightboxIdx + 1}`}
                    fill
                    sizes="(max-width: 640px) 92vw, 980px"
                    className="object-contain p-4 sm:p-8"
                  />
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length)
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-black"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIdx((i) => (i + 1) % GALLERY.length)}
                    className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-black"
                  >
                    Siguiente →
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- SUBCOMPONENTES ---------------- */

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
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black tracking-widest uppercase ${cls}`}
    >
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

function MiniStat({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-200 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black truncate">{title}</p>
        <p className="text-[11px] text-zinc-500 truncate">{desc}</p>
      </div>
    </div>
  );
}

function ConversionCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <CardShell
      variant="gradientBorder"
      accent="indigo"
      className="p-6 sm:p-7 hover:-translate-y-[2px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-black/20 border border-white/10 px-3 py-2 rounded-full">
          Beneficio
        </span>
      </div>
      <h3 className="mt-4 text-xl font-black break-words">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed break-words text-pretty">
        {desc}
      </p>
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
        <span className="text-[11px] font-black tracking-widest uppercase text-zinc-400">
          Paso {n}
        </span>
      </div>
      <h4 className="font-black mb-1 break-words">{title}</h4>
      <p className="text-sm text-zinc-500 break-words text-pretty">{desc}</p>
    </div>
  );
}

function Input({ label, icon, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all">
        <span className="shrink-0">{icon}</span>
        <input {...props} className="bg-transparent outline-none text-sm w-full min-w-0" />
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
        type="button"
      >
        <span className="text-sm md:text-base break-words text-pretty">{q}</span>
        <ChevronDown className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="p-5 pt-0 text-zinc-400 text-sm leading-relaxed break-words text-pretty">
          {a}
        </div>
      )}
    </div>
  );
}

function MicroProof({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 flex items-center gap-2 text-[11px] text-zinc-300 font-bold min-w-0">
      <span className="text-indigo-300 shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}
