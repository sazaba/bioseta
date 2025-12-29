"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
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

  // Scarcity / urgency (sin mentir: usamos stock real)
  const stock = Number(product.stock || 0);
  const stockLabel =
    stock <= 0 ? "Agotado" : stock <= 10 ? "Últimas unidades" : "Stock disponible";

  const urgencyCopy =
    stock > 0 && stock <= 12
      ? `⚠️ ${stockLabel}: quedan ${stock} hoy.`
      : "🔥 Promoción activa hoy (pago contraentrega).";

  const heroSubtitle =
    product.subtitle ||
    "Más claridad mental, enfoque y energía para tu día (sin complicarte).";

  function submit() {
    setError(null);

    // validación mínima, cero fricción pero sin basura
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
    <div className="min-h-screen bg-black text-white">
      {/* BACKGROUND premium */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        <div className="absolute -top-48 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl opacity-40" />
        <div className="absolute top-[30%] left-[-160px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl opacity-30" />
        <div className="absolute bottom-[-140px] right-[-160px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl opacity-35" />
      </div>

      {/* Sticky top bar (mobile-first CTA) */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-white/60">BIOSERTA</div>
            <div className="text-sm font-semibold truncate">{product.name}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              type="button"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              <LuCopy size={14} />
              Copiar link
            </button>

            <a
              href="#comprar"
              className="rounded-xl bg-white text-black px-4 py-2 text-xs font-extrabold tracking-wide hover:opacity-90"
            >
              Comprar ahora
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-8 md:grid-cols-2 md:items-center"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {urgencyCopy}
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-white/70 text-base md:text-lg leading-relaxed">
              {heroSubtitle}
            </p>

            {/* Micro proof */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Badge icon={<LuTruck />} title="Envíos nacionales" desc="Pago contraentrega" />
              <Badge icon={<LuShieldCheck />} title="Compra segura" desc="Confirmación WhatsApp" />
              <Badge icon={<LuZap />} title="Uso simple" desc="Rutina diaria" />
              <Badge icon={<LuClock />} title="Rápido de pedir" desc="En 30 segundos" />
            </div>

            {/* Price + CTA */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
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
                className="mt-4 block w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-extrabold text-center hover:opacity-90"
              >
                Quiero pedir ahora
              </a>

              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                * Pago contraentrega. Confirmamos por WhatsApp para coordinar el envío.
              </p>
            </div>
          </motion.div>

          {/* Image side */}
          <motion.div variants={fadeUp} className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-3">
              <div className="relative aspect-[4/4] w-full overflow-hidden rounded-[24px] bg-black/40">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 grid gap-2 sm:grid-cols-3"
              >
                <MiniPill icon={<LuSparkles />} text="Ultra premium" />
                <MiniPill icon={<LuCheck />} text="Fácil de usar" />
                <MiniPill icon={<LuShieldCheck />} text="Compra segura" />
              </motion.div>
            </div>

            {/* floating accent */}
            <motion.div
              aria-hidden
              className="absolute -z-10 -top-8 right-6 h-20 w-20 rounded-3xl bg-white/10 blur-xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* PROOF + BENEFITS */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80"
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
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
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

      {/* FAQ */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-4 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Preguntas frecuentes</h3>
            <p className="mt-2 text-sm text-white/70">
              Resolvimos lo típico para que tomes decisión rápido.
            </p>

            <div className="mt-5 space-y-3">
              <FAQ q="¿Es pago contraentrega?" a="Sí. Confirmamos por WhatsApp y pagas al recibir el producto." />
              <FAQ q="¿Envían a todo Colombia?" a="Sí. Envío nacional. El tiempo depende de tu ciudad." />
              <FAQ q="¿Cómo hago seguimiento?" a="Una vez confirmemos, te compartimos la información necesaria por WhatsApp." />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Última razón para no pensarlo tanto</h3>
            <p className="mt-2 text-sm text-white/70">
              Si te interesa, pídelo hoy: es la forma más fácil de probar sin fricción.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm text-white/70">Disponibilidad</div>
              <div className="mt-1 text-lg font-semibold">{urgencyCopy}</div>
              <div className="mt-3 text-xs text-white/50">
                Nota: la disponibilidad cambia rápido por rotación de inventario.
              </div>

              <a
                href="#comprar"
                className="mt-4 block w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-extrabold text-center hover:opacity-90"
              >
                Sí, lo quiero
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CHECKOUT */}
      <section id="comprar" className="relative mx-auto max-w-6xl px-4 pb-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
              Resumen
            </div>
            <h3 className="mt-2 text-2xl font-semibold">{product.name}</h3>
            <p className="mt-2 text-sm text-white/70">
              {product.description?.slice(0, 220) || "Producto premium para tu rutina diaria."}
              {product.description?.length > 220 ? "…" : ""}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
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
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Contraentrega
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Envío nacional
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Confirmación WA
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
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
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15"
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
                  <Input label="Celular (WhatsApp)" value={phone} onChange={setPhone} inputMode="tel" />
                  <Input label="Ciudad" value={city} onChange={setCity} />
                  <Input label="Dirección" value={address} onChange={setAddress} />
                  <Input label="Barrio (opcional)" value={neighborhood} onChange={setNeighborhood} />

                  <div>
                    <label className="text-xs text-white/60">Notas (opcional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
                      placeholder="Ej: Conjunto, torre, apartamento, referencias..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={isPending}
                    className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-extrabold hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? "Creando pedido..." : "Finalizar pedido (contraentrega)"}
                  </button>

                  <p className="text-xs text-white/50 leading-relaxed">
                    Al enviar este formulario aceptas que te contactemos por WhatsApp para confirmar y coordinar el envío.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} BIOSERTA. Todos los derechos reservados.
        </div>
      </section>
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

function Badge({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-white/70">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="text-xs text-white/60 mt-0.5">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function MiniPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 flex items-center gap-2">
      <span className="text-white/70">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
        Paso {n}
      </div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/70">{desc}</div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-sm font-semibold">{q}</div>
      <div className="mt-1 text-sm text-white/70">{a}</div>
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
      className="h-10 w-10 rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/10"
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
        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
        placeholder={label}
      />
    </div>
  );
}
