"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/actions/orders";

type ProductDTO = {
  id: number;
  name: string;
  subtitle: string | null;
  description: string;
  price: any; // Decimal de Prisma (en runtime se comporta como string/number)
  imageUrl: string;
  benefits: any | null; // Json
  stock: number;
};

export default function MelenaLanding({ product }: { product: ProductDTO }) {
  const sp = useSearchParams();
  const fbclid = sp.get("fbclid") || undefined;

  const benefits = useMemo(() => {
    if (!product.benefits) return [];
    // benefits viene como Json; intentamos normalizar a string[]
    if (Array.isArray(product.benefits)) return product.benefits as string[];
    return [];
  }, [product.benefits]);

  const priceNumber = Number(product.price);
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Form state (mínimo para despacho)
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

  function submit() {
    setError(null);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* fondo premium */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-120px] h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">BIOSERTA</div>
          <div className="text-xs text-white/60">Envío rápido • Contraentrega</div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
          {/* Lado izquierdo: producto */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                Stock disponible: {product.stock}
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
                {product.name}
              </h1>

              {product.subtitle ? (
                <p className="mt-2 text-white/70">{product.subtitle}</p>
              ) : (
                <p className="mt-2 text-white/70">
                  Enfoque, claridad mental y rendimiento diario.
                </p>
              )}

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-white/60">Precio</div>
                  <div className="text-2xl font-semibold">
                    ${priceNumber.toLocaleString("es-CO")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    className="h-10 w-10 rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/10"
                  >
                    –
                  </button>
                  <div className="min-w-[44px] text-center text-lg">{qty}</div>
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.min(9, v + 1))}
                    className="h-10 w-10 rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {benefits?.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-white/80">Beneficios</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {benefits.slice(0, 6).map((b, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80"
                      >
                        {String(b)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-sm text-white/70 whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>

          {/* Lado derecho: formulario (cero fricción) */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Pídelo ahora</h2>
                <p className="mt-1 text-sm text-white/70">
                  Completa tus datos y confirmamos por WhatsApp.
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
                    // reset simple para permitir otro pedido si quieres
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
                    className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? "Creando pedido..." : "Comprar ahora"}
                  </button>

                  <p className="text-xs text-white/50 leading-relaxed">
                    Al enviar este formulario aceptas que te contactemos por WhatsApp para confirmar
                    y coordinar el envío.
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-white/60">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Pago contraentrega
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Confirmación rápida
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                Envíos nacionales
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} BIOSERTA. Todos los derechos reservados.
        </div>
      </div>
    </div>
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
