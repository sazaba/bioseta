"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/actions/orders";
import { motion } from "framer-motion";
import {
  LuShieldCheck,
  LuTruck,
  LuZap,
  LuClock,
  LuSparkles,
  LuCheck,
  LuCopy,
  LuBrain,
  LuFlame,
  LuBadgeCheck,
  LuLeaf,
  LuChevronRight,
  LuStar,
  LuRefreshCcw,
  LuMessageCircle,
} from "react-icons/lu";

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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

export default function MelenaLanding({ product }: { product: ProductDTO }) {
  const sp = useSearchParams();
  const fbclid = sp.get("fbclid") || undefined;

  const benefits = useMemo(() => {
    if (!product.benefits) return [];
    if (Array.isArray(product.benefits)) return product.benefits as string[];
    return [];
  }, [product.benefits]);

  const priceNumber = Number(product.price);
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [notes, setNotes] = useState("");

  const [ok, setOk] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => {
    const q = Math.max(1, Number(qty || 1));
    return priceNumber * q;
  }, [priceNumber, qty]);

  const stock = Number(product.stock || 0);
  const stockLabel =
    stock <= 0 ? "Agotado" : stock <= 10 ? "Últimas unidades" : "Stock disponible";

  const urgencyCopy =
    stock > 0 && stock <= 12
      ? `⚠️ ${stockLabel}: quedan ${stock} hoy.`
      : "🔥 Promo activa hoy (pago contraentrega).";

  const heroSubtitle =
    product.subtitle ||
    "Rutina simple para potenciar tu enfoque, claridad y rendimiento diario.";

  // ===== Contador promo (cierra fin de día local) =====
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const promoEnd = useMemo(() => {
    const d = new Date(now);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [now]);

  const msLeft = Math.max(0, promoEnd.getTime() - now.getTime());
  const isOver = msLeft <= 0;

  const hours = Math.floor(msLeft / 3_600_000);
  const minutes = Math.floor((msLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((msLeft % 60_000) / 1000);

  const timeParts = {
    hh: String(hours).padStart(2, "0"),
    mm: String(minutes).padStart(2, "0"),
    ss: String(seconds).padStart(2, "0"),
  };

  const promoLabel =
    stock > 0 && stock <= 12 ? "Últimas unidades hoy" : "Promo activa hoy (contraentrega)";

  function submit() {
    setError(null);

    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setError("Por favor completa nombre, celular, ciudad y dirección.");
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
        neighborhood: neighborhood || undefined,
        notes: notes || undefined,
        fbclid,
      });

      if (!res.ok) {
        setOk(false);
        setOrderId(null);
        setError(res.message || "No se pudo crear el pedido.");
        return;
      }

      setOk(true);
      setOrderId(Number(res.orderId));
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient lights (mismo lenguaje del dashboard) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-180px] left-[-200px] w-[520px] h-[520px] bg-indigo-600/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-180px] right-[-200px] w-[520px] h-[520px] bg-purple-600/12 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-260px] w-[620px] h-[620px] bg-emerald-500/10 rounded-full blur-[140px]" />
        {/* “noise” sutil */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
        />
      </div>

      {/* Sticky Top Bar (más tipo dashboard) */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/55 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold text-green-400 tracking-wider uppercase">
                Compra contraentrega
              </span>
            </div>
            <div className="text-sm font-semibold truncate mt-1">
              {product.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              type="button"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.10] transition-colors"
            >
              <LuCopy size={14} />
              Copiar link
            </button>

            <a
              href="#comprar"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-extrabold tracking-wide shadow-lg shadow-indigo-500/20 transition-colors"
            >
              Comprar ahora
            </a>
          </div>
        </div>
      </div>

      {/* HERO (más “header-card” premium) */}
      <section className="relative mx-auto max-w-6xl px-4 pt-6 pb-8 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[2rem] p-6 md:p-10 border border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

          <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
            {/* LEFT */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {urgencyCopy}
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-white">
                {product.name}
              </h1>

              <p className="mt-3 text-zinc-300/90 text-base md:text-lg leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Countdown (más “dashboard card”) */}
              <div className="mt-4">
                <PromoCountdown
                  label={promoLabel}
                  hh={timeParts.hh}
                  mm={timeParts.mm}
                  ss={timeParts.ss}
                  isOver={isOver}
                />
              </div>

              {/* Trust + micro-benefits (KPI cards) */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <KpiCard
                  icon={<LuTruck size={18} />}
                  title="Envío nacional"
                  desc="Pagas al recibir"
                  tone="emerald"
                />
                <KpiCard
                  icon={<LuShieldCheck size={18} />}
                  title="Compra segura"
                  desc="Confirmación WhatsApp"
                  tone="indigo"
                />
                <KpiCard
                  icon={<LuZap size={18} />}
                  title="Rutina simple"
                  desc="Fácil de usar"
                  tone="cyan"
                />
                <KpiCard
                  icon={<LuClock size={18} />}
                  title="Pedido rápido"
                  desc="En 1 minuto"
                  tone="purple"
                />
              </div>

              {/* CTA Price Box (más fuerte para conversión) */}
              <div className="mt-6">
                <Card className="p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">Precio hoy</div>
                      <div className="text-3xl font-bold tracking-tight text-white mt-1">
                        ${priceNumber.toLocaleString("es-CO")}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {stock > 0 ? `Disponibles: ${stock}` : "Sin stock por ahora"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <QtyButton onClick={() => setQty((v) => Math.max(1, v - 1))}>–</QtyButton>
                      <div className="min-w-[44px] text-center text-lg font-semibold">{qty}</div>
                      <QtyButton onClick={() => setQty((v) => Math.min(9, v + 1))}>+</QtyButton>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-zinc-400 font-medium">Total</div>
                    <div className="text-xl font-bold">
                      ${Math.round(total).toLocaleString("es-CO")}
                    </div>
                  </div>

                  <a
                    href="#comprar"
                    className="mt-4 group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 text-sm font-extrabold transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Finalizar pedido
                    <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
                  </a>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                    <Pill icon={<LuCheck size={14} />} text="Contraentrega" />
                    <Pill icon={<LuMessageCircle size={14} />} text="Confirmación WA" />
                    <Pill icon={<LuRefreshCcw size={14} />} text="Proceso rápido" />
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* RIGHT (image card + proof badges) */}
            <motion.div variants={fadeUp} className="relative">
              <Card className="p-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-black/40">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Mobile-safe overlay badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                    <Badge text={stockLabel} />
                    <Badge text="Pago contraentrega" />
                    <Badge text="Envío nacional" />
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <MiniPill icon={<LuSparkles />} text="Premium" />
                  <MiniPill icon={<LuBadgeCheck />} text="Seleccionado" />
                  <MiniPill icon={<LuShieldCheck />} text="Seguro" />
                </div>
              </Card>

              {/* Floating mini-card desktop */}
              <motion.div
                aria-hidden
                className="absolute -right-2 -top-6 hidden md:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Card className="px-4 py-3">
                  <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                    Disponibilidad
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">{stockLabel}</div>
                </Card>
              </motion.div>

              {/* Social proof mini (looks like dashboard chip) */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-white/5">
                      <LuStar size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Compra fácil</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Dejas tus datos y confirmamos por WhatsApp.
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-white/5">
                      <LuTruck size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Entrega nacional</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Recibes y pagas al momento de entrega.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* BENEFITS + AUDIENCE (copy más conversion) */}
      <section className="relative mx-auto max-w-6xl px-4 pb-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                ¿Para quién es?
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Para días donde necesitas rendir sin complicarte
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Enfocado en una rutina simple: pedir → confirmar → recibir → usar.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-zinc-300/90">
                {[
                  "Cuando necesitas enfoque para trabajar o estudiar.",
                  "Si quieres consistencia en tu rutina diaria.",
                  "Si buscas algo práctico (sin procesos complicados).",
                  "Si prefieres pagar al recibir (contraentrega).",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#comprar"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 text-sm font-extrabold transition-colors border border-zinc-700"
              >
                Quiero pedir ahora <LuChevronRight />
              </a>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                Beneficios principales
              </div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Lo que más valoran quienes lo compran
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(benefits.length ? benefits.slice(0, 6) : defaultBenefits).map((b, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/90"
                  >
                    {String(b)}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-zinc-500 leading-relaxed">
                * Beneficios percibidos según rutina y constancia. Este producto no reemplaza una
                alimentación equilibrada ni hábitos de sueño.
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* “SCIENCE / FEATURES” (misma vibra, pero más limpia) */}
      <section className="relative mx-auto max-w-6xl px-4 pb-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <Card className="p-6 md:p-8">
            <motion.div variants={fadeUp} className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                  Enfoque premium
                </div>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">
                  Se siente como “claridad” cuando tienes constancia
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Sección diseñada para aumentar confianza (claridad + simple + sin fricción).
                </p>
              </div>

              <a
                href="#comprar"
                className="hidden md:inline-flex rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 text-sm font-extrabold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Comprar ahora
              </a>
            </motion.div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <FeatureTile
                icon={<LuBrain size={20} />}
                title="Enfoque"
                desc="Ideal para trabajo, estudio y tareas largas."
              />
              <FeatureTile
                icon={<LuFlame size={20} />}
                title="Energía mental"
                desc="Sensación de impulso para tu rutina diaria."
              />
              <FeatureTile
                icon={<LuLeaf size={20} />}
                title="Ritual simple"
                desc="Lo integras sin complicarte."
              />
            </div>
          </Card>
        </motion.div>
      </section>

      {/* HOW IT WORKS (más directo a conversión) */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <Card className="p-6 md:p-8">
            <motion.div variants={fadeUp} className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                  Cómo funciona la compra
                </div>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">
                  Pídelo en 1 minuto (sin pagos online)
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Dejas tus datos, confirmamos por WhatsApp y pagas al recibir.
                </p>
              </div>

              <a
                href="#comprar"
                className="hidden md:inline-flex rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 text-sm font-extrabold transition-colors border border-zinc-700"
              >
                Ir al formulario
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 grid gap-3 md:grid-cols-3">
              <StepCard n="1" title="Deja tus datos" desc="Nombre, celular, ciudad y dirección." />
              <StepCard n="2" title="Confirmamos por WhatsApp" desc="Validamos pedido y envío." />
              <StepCard n="3" title="Recibes y pagas" desc="Pago contraentrega al recibir." />
            </motion.div>
          </Card>
        </motion.div>
      </section>

      {/* CHECKOUT (CTA principal) */}
      <section id="comprar" className="relative mx-auto max-w-6xl px-4 pb-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* SUMMARY */}
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
                Resumen
              </div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">{product.name}</h3>
              <p className="mt-2 text-sm text-zinc-400">
                {product.description?.slice(0, 220) || "Producto premium para tu rutina diaria."}
                {product.description?.length > 220 ? "…" : ""}
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-400 font-medium">Cantidad</div>
                  <div className="flex items-center gap-2">
                    <QtyButton onClick={() => setQty((v) => Math.max(1, v - 1))}>–</QtyButton>
                    <div className="min-w-[44px] text-center text-lg font-semibold">{qty}</div>
                    <QtyButton onClick={() => setQty((v) => Math.min(9, v + 1))}>+</QtyButton>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-zinc-400 font-medium">Total</div>
                  <div className="text-xl font-bold">
                    ${Math.round(total).toLocaleString("es-CO")}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-zinc-300/80">
                <Chip>Contraentrega</Chip>
                <Chip>Envío nacional</Chip>
                <Chip>Confirmación WA</Chip>
              </div>

              <div className="mt-5">
                <a
                  href="#form"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 text-sm font-extrabold transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Completar datos y pedir <LuChevronRight />
                </a>
                <p className="mt-2 text-xs text-zinc-500">
                  * Pago contraentrega. Confirmamos por WhatsApp para coordinar el envío.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* FORM */}
          <motion.div variants={fadeUp} id="form">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Completa tus datos</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Toma menos de 1 minuto. Confirmamos por WhatsApp.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400 font-medium">Total</div>
                  <div className="text-xl font-bold">
                    ${Math.round(total).toLocaleString("es-CO")}
                  </div>
                </div>
              </div>

              {ok ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-lg font-bold">✅ Pedido creado</div>
                  <p className="mt-2 text-sm text-zinc-400">
                    Tu pedido quedó registrado correctamente.
                  </p>
                  {orderId ? (
                    <p className="mt-2 text-sm text-zinc-400">
                      Número de pedido: <span className="text-white font-semibold">#{orderId}</span>
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      setOk(false);
                      setOrderId(null);
                      setFullName("");
                      setPhone("");
                      setCity("");
                      setAddress("");
                      setNeighborhood("");
                      setNotes("");
                      setQty(1);
                    }}
                    className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold hover:bg-white/[0.10] transition-colors"
                  >
                    Hacer otro pedido
                  </button>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-3">
                    <Input label="Nombre completo" value={fullName} onChange={setFullName} />
                    <Input
                      label="Celular (WhatsApp)"
                      value={phone}
                      onChange={setPhone}
                      inputMode="tel"
                    />
                    <Input label="Ciudad" value={city} onChange={setCity} />
                    <Input label="Dirección" value={address} onChange={setAddress} />
                    <Input
                      label="Barrio (opcional)"
                      value={neighborhood}
                      onChange={setNeighborhood}
                    />

                    <div>
                      <label className="text-xs text-zinc-400 font-medium">Notas (opcional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-white/20"
                        placeholder="Ej: Conjunto, torre, apartamento, referencias..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={submit}
                      disabled={isPending || stock <= 0}
                      className="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 text-sm font-extrabold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:hover:bg-indigo-600"
                    >
                      {stock <= 0
                        ? "Agotado por ahora"
                        : isPending
                        ? "Creando pedido..."
                        : "Finalizar pedido (contraentrega)"}
                    </button>

                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Al enviar este formulario aceptas que te contactemos por WhatsApp para confirmar
                      y coordinar el envío.
                    </p>
                  </div>
                </>
              )}

              {/* Trust chips */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-[11px] text-zinc-300/80">
                <TrustChip icon={<LuTruck />} text="Envío nacional" />
                <TrustChip icon={<LuShieldCheck />} text="Seguro" />
                <TrustChip icon={<LuCheck />} text="Confirmación WA" />
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} BIOSERTA. Todos los derechos reservados.
        </div>
      </section>

      {/* Global styles: soporte mobile + cross-browser + “premium dashboard look” */}
      <style jsx global>{`
        /* iOS Safari: evitar zoom raro y “rubber band” con blur */
        html,
        body {
          background: #09090b;
        }
        /* Mejor rendering en móviles */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}

/* =========================
   UI blocks (dashboard style)
========================= */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl",
        "shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/85 backdrop-blur-xl">
      {text}
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
      <span className="text-white/80">{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      {children}
    </div>
  );
}

function QtyButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors"
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="text-xs text-zinc-400 font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-white/20"
        placeholder={label}
      />
    </div>
  );
}

function TrustChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center flex items-center justify-center gap-2">
      <span className="text-white/80">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function KpiCard({
  icon,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: "indigo" | "emerald" | "cyan" | "purple";
}) {
  const toneMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-300",
    emerald: "bg-emerald-500/10 text-emerald-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    purple: "bg-purple-500/10 text-purple-300",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-xl relative overflow-hidden hover:border-white/10 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className={`p-3 rounded-2xl border border-white/5 ${toneMap[tone]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/95">{title}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureTile({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden hover:border-white/10 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl border border-white/10 bg-black/25 flex items-center justify-center text-white/90">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-zinc-400">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
        Paso {n}
      </div>
      <div className="mt-2 text-lg font-bold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-zinc-400">{desc}</div>
    </div>
  );
}

function MiniPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/85 flex items-center gap-2 backdrop-blur-xl">
      <span className="text-white/80">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

/* =========================
   Countdown (dashboard look)
========================= */

function PromoCountdown({
  label,
  hh,
  mm,
  ss,
  isOver,
}: {
  label: string;
  hh: string;
  mm: string;
  ss: string;
  isOver: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
            Ventana de promoción
          </div>
          <div className="mt-1 text-sm font-semibold text-white/90 truncate">{label}</div>
          <div className="mt-1 text-xs text-zinc-500">
            {isOver ? "Finalizó por hoy" : "Cierra al final del día"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TimePill value={hh} unit="HRS" pulse={!isOver} />
          <Colon />
          <TimePill value={mm} unit="MIN" pulse={!isOver} />
          <Colon />
          <TimePill value={ss} unit="SEG" pulse={!isOver} />
        </div>
      </div>
    </Card>
  );
}

function TimePill({
  value,
  unit,
  pulse,
}: {
  value: string;
  unit: string;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl px-3 py-2 text-center min-w-[64px]"
      animate={pulse ? { y: [0, -1.5, 0], opacity: [1, 0.96, 1] } : { opacity: 0.9 }}
      transition={pulse ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <div className="text-xl font-extrabold tabular-nums leading-none">{value}</div>
      <div className="mt-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        {unit}
      </div>
    </motion.div>
  );
}

function Colon() {
  return <div className="text-white/30 font-extrabold tabular-nums select-none">:</div>;
}

const defaultBenefits = [
  "Enfoque y claridad para tareas importantes",
  "Rutina diaria más consistente",
  "Sensación de energía mental y productividad",
  "Fácil de integrar a tu día",
  "Compra simple: contraentrega y confirmación",
  "Ideal para trabajo o estudio",
];
