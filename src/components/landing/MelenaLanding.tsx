"use client";

import Image from "next/image";
import React, { useMemo, useState, useTransition } from "react";
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
      : "🔥 Promoción activa hoy (pago contraentrega).";

  const heroSubtitle =
    product.subtitle ||
    "Potencia tu enfoque, claridad y rendimiento diario con una rutina simple.";

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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
        />
        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="absolute top-[20%] left-[-220px] h-[620px] w-[620px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[680px] w-[680px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-white/55 font-mono uppercase tracking-widest">
              BIOSERTA • Landing
            </div>
            <div className="text-sm font-semibold truncate">{product.name}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              type="button"
              className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.10]"
            >
              <LuCopy size={14} />
              Copiar link
            </button>

            <a
              href="#comprar"
              className="rounded-2xl bg-white text-black px-4 py-2 text-xs font-extrabold tracking-wide hover:opacity-90"
            >
              Comprar ahora
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12">
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* LEFT */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {urgencyCopy}
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-white/70 text-base md:text-lg leading-relaxed">
              {heroSubtitle}
            </p>

            {/* Glass KPI cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <GlassKPI icon={<LuTruck />} title="Envío nacional" desc="Pago contraentrega" />
              <GlassKPI icon={<LuShieldCheck />} title="Compra segura" desc="Confirmación WhatsApp" />
              <GlassKPI icon={<LuZap />} title="Rutina simple" desc="Fácil de usar" />
              <GlassKPI icon={<LuClock />} title="Pedido rápido" desc="En 1 minuto" />
            </div>

            {/* Price card - glass */}
            <div className="mt-6 glass-card p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-white/60">Precio hoy</div>
                  <div className="text-3xl font-semibold">
                    ${priceNumber.toLocaleString("es-CO")}
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {stock > 0 ? `Stock: ${stock} disponibles` : "Sin stock por ahora"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <QtyButton onClick={() => setQty((v) => Math.max(1, v - 1))}>–</QtyButton>
                  <div className="min-w-[44px] text-center text-lg">{qty}</div>
                  <QtyButton onClick={() => setQty((v) => Math.min(9, v + 1))}>+</QtyButton>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-white/70">Total</div>
                <div className="text-xl font-semibold">
                  ${Math.round(total).toLocaleString("es-CO")}
                </div>
              </div>

              <a
                href="#comprar"
                className="mt-4 group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white text-black px-4 py-3 text-sm font-extrabold hover:opacity-90"
              >
                Quiero pedir ahora
                <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
              </a>

              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                * Pago contraentrega. Confirmamos por WhatsApp para coordinar el envío.
              </p>
            </div>
          </motion.div>

          {/* RIGHT - IMAGE + floating glass */}
          <motion.div variants={fadeUp} className="relative">
            <div className="glass-card p-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-black/40">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <MiniPill icon={<LuSparkles />} text="Premium" />
                <MiniPill icon={<LuBadgeCheck />} text="Seleccionado" />
                <MiniPill icon={<LuShieldCheck />} text="Seguro" />
              </div>
            </div>

            {/* floating accent + glass mini card */}
            <motion.div
              aria-hidden
              className="absolute -right-2 -top-6 hidden md:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="glass-card px-4 py-3">
                <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
                  Disponibilidad
                </div>
                <div className="mt-1 text-sm font-semibold">{stockLabel}</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* SCIENCE / FEATURES (iconos + motion) */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card p-6 md:p-8"
        >
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-6">
            <div>
              <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
                Enfoque premium
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                Se siente como “claridad” cuando tienes constancia
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Diseño tipo “science section” para que se vea pro y aumente confianza.
              </p>
            </div>

            <a
              href="#comprar"
              className="hidden md:inline-flex rounded-2xl bg-white text-black px-5 py-3 text-sm font-extrabold hover:opacity-90"
            >
              Comprar ahora
            </a>
          </motion.div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <ScienceTile
              icon={<LuBrain size={20} />}
              title="Enfoque"
              desc="Ideal para trabajo, estudio y tareas largas."
            />
            <ScienceTile
              icon={<LuFlame size={20} />}
              title="Energía mental"
              desc="Sensación de impulso para tu rutina diaria."
            />
            <ScienceTile
              icon={<LuLeaf size={20} />}
              title="Ritual simple"
              desc="Lo integras sin complicarte."
            />
          </div>
        </motion.div>
      </section>

      {/* BENEFITS + PROOF */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
              ¿Para quién es?
            </div>
            <h3 className="mt-2 text-xl font-semibold">
              Para días donde necesitas rendir… sin sentirte “pesado”.
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {[
                "Cuando necesitas enfoque para trabajar o estudiar.",
                "Si quieres más claridad mental y consistencia en tu rutina.",
                "Si buscas una opción práctica para apoyar tu rendimiento diario.",
                "Si no quieres procesos complicados: pedir, recibir, usar.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
              Beneficios principales
            </div>
            <h3 className="mt-2 text-xl font-semibold">
              Lo que más valora la gente que lo compra
            </h3>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(benefits.length ? benefits.slice(0, 6) : defaultBenefits).map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/85 backdrop-blur-xl"
                >
                  {String(b)}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-white/50 leading-relaxed">
              * Beneficios percibidos según rutina y constancia. Este producto no reemplaza una alimentación equilibrada ni hábitos de sueño.
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card p-6 md:p-8"
        >
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-6">
            <div>
              <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
                Cómo funciona la compra
              </div>
              <h3 className="mt-2 text-2xl font-semibold">Pedirlo es literal 1 minuto</h3>
              <p className="mt-2 text-sm text-white/70">
                Sin registro, sin contraseñas, sin pagos online. Solo dejas tus datos y confirmamos por WhatsApp.
              </p>
            </div>

            <a
              href="#comprar"
              className="hidden md:inline-flex rounded-2xl bg-white text-black px-5 py-3 text-sm font-extrabold hover:opacity-90"
            >
              Comprar ahora
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 grid gap-3 md:grid-cols-3">
            <StepCard n="1" title="Deja tus datos" desc="Nombre, celular, ciudad y dirección." />
            <StepCard n="2" title="Confirmamos por WhatsApp" desc="Validamos tu pedido y el envío." />
            <StepCard n="3" title="Recibes y pagas" desc="Pago contraentrega al recibir." />
          </motion.div>
        </motion.div>
      </section>

      {/* CHECKOUT */}
      <section id="comprar" className="relative mx-auto max-w-6xl px-4 pb-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
              Resumen
            </div>
            <h3 className="mt-2 text-2xl font-semibold">{product.name}</h3>
            <p className="mt-2 text-sm text-white/70">
              {product.description?.slice(0, 220) || "Producto premium para tu rutina diaria."}
              {product.description?.length > 220 ? "…" : ""}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Cantidad</div>
                <div className="flex items-center gap-2">
                  <QtyButton onClick={() => setQty((v) => Math.max(1, v - 1))}>–</QtyButton>
                  <div className="min-w-[44px] text-center text-lg">{qty}</div>
                  <QtyButton onClick={() => setQty((v) => Math.min(9, v + 1))}>+</QtyButton>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-white/70">Total</div>
                <div className="text-xl font-semibold">
                  ${Math.round(total).toLocaleString("es-CO")}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-xl">
                Contraentrega
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-xl">
                Envío nacional
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-xl">
                Confirmación WA
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Completa tus datos</h2>
                <p className="mt-1 text-sm text-white/70">
                  Toma menos de 1 minuto. Confirmamos por WhatsApp.
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Total</div>
                <div className="text-xl font-semibold">
                  ${Math.round(total).toLocaleString("es-CO")}
                </div>
              </div>
            </div>

            {ok ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="text-lg font-semibold">✅ Pedido creado</div>
                <p className="mt-2 text-sm text-white/70">
                  Tu pedido quedó registrado correctamente.
                </p>
                {orderId ? (
                  <p className="mt-2 text-sm text-white/60">
                    Número de pedido: <span className="text-white">#{orderId}</span>
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
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold hover:bg-white/[0.10]"
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
                    <label className="text-xs text-white/60">Notas (opcional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-white/20 backdrop-blur-xl"
                      placeholder="Ej: Conjunto, torre, apartamento, referencias..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={isPending || stock <= 0}
                    className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-extrabold hover:opacity-90 disabled:opacity-60"
                  >
                    {stock <= 0
                      ? "Agotado por ahora"
                      : isPending
                      ? "Creando pedido..."
                      : "Finalizar pedido (contraentrega)"}
                  </button>

                  <p className="text-xs text-white/50 leading-relaxed">
                    Al enviar este formulario aceptas que te contactemos por WhatsApp para confirmar y coordinar el envío.
                  </p>
                </div>
              </>
            )}

            {/* micro trust row */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-[11px] text-white/70">
              <TrustChip icon={<LuTruck />} text="Envío nacional" />
              <TrustChip icon={<LuShieldCheck />} text="Seguro" />
              <TrustChip icon={<LuCheck />} text="Confirmación WA" />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} BIOSERTA. Todos los derechos reservados.
        </div>
      </section>

      {/* local styles via tailwind utility class (no extra file needed) */}
      <style jsx global>{`
        .glass-card {
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.06);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
      `}</style>
    </div>
  );
}

const defaultBenefits = [
  "Enfoque y claridad para tareas importantes",
  "Rutina diaria más consistente",
  "Sensación de energía mental y productividad",
  "Fácil de integrar a tu día",
  "Compra simple: contraentrega y confirmación",
  "Ideal para trabajo o estudio",
];

function GlassKPI({
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
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="glass-card px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-white/75">{icon}</div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="text-xs text-white/60 mt-0.5">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ScienceTile({
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
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* shimmer */}
      <motion.div
        aria-hidden
        className="absolute -inset-24 rotate-12 bg-white/10 blur-2xl opacity-0"
        whileHover={{ opacity: 0.7 }}
        transition={{ duration: 0.35 }}
      />
      <div className="relative flex items-start gap-3">
        <motion.div
          className="h-11 w-11 rounded-2xl border border-white/10 bg-black/25 flex items-center justify-center text-white/85"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-white/70">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/80 flex items-center gap-2 backdrop-blur-xl">
      <span className="text-white/75">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
        Paso {n}
      </div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/70">{desc}</div>
    </div>
  );
}

function TrustChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center flex items-center justify-center gap-2 backdrop-blur-xl">
      <span className="text-white/75">{icon}</span>
      <span>{text}</span>
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
      className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] backdrop-blur-xl"
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
      <label className="text-xs text-white/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-white/20 backdrop-blur-xl"
        placeholder={label}
      />
    </div>
  );
}
