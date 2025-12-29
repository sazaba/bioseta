"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/actions/orders";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Truck, Zap, Clock, Sparkles, Check, Brain, 
  Flame, BadgeCheck, Leaf, Star, RefreshCcw, CircleAlert, Info, ChevronDown 
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

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const total = Number(product.price) * qty;

  const handleOrder = () => {
    if (!fullName || !phone || !city || !address) {
      setError("Por favor completa todos los campos de envío.");
      return;
    }
    startTransition(async () => {
      const res = await createOrder({ productId: product.id, quantity: qty, fullName, phone, city, address, fbclid });
      if (res.ok) setOk(true);
      else setError("Hubo un error, intenta de nuevo.");
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      
      {/* 1. HERO HIGH CONVERSION */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
        
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-bold mb-6">
              <Sparkles size={14} /> PRODUCTO ORIGINAL COMPROBADO
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
              Potencia tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Enfoque Mental</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl mb-8 leading-relaxed">
              {product.subtitle || "Fórmula avanzada diseñada para quienes buscan maximizar su rendimiento diario sin caídas de energía."}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Check size={18} className="text-green-500" /> Envío Gratis
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Check size={18} className="text-green-500" /> Pago al Recibir
              </div>
            </div>

            <a href="#form" className="inline-block w-full md:w-auto text-center bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
              PEDIR AHORA - ${Number(product.price).toLocaleString()}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10">
                <Image src={product.imageUrl} alt="Producto" fill className="object-cover" priority />
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. PROOF & TRUST BAR */}
      <div className="border-y border-white/5 bg-zinc-900/50 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
           <TrustIcon icon={<ShieldCheck />} text="Calidad Premium" />
           <TrustIcon icon={<Truck />} text="Entrega 24-48h" />
           <TrustIcon icon={<RefreshCcw />} text="Garantía de Satis." />
           <TrustIcon icon={<Leaf />} text="100% Natural" />
        </div>
      </div>

      {/* 3. POR QUÉ ELEGIRNOS (High Ticket Section) */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">La ciencia detrás del éxito</h2>
          <p className="text-zinc-500">Resultados reales para personas extraordinarias.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="text-indigo-400" />} 
            title="Claridad Mental" 
            desc="Elimina la niebla mental y mantente enfocado en tus tareas más difíciles por horas." 
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />} 
            title="Energía Limpia" 
            desc="Sin taquicardia ni bajones. Energía constante proveniente de ingredientes naturales." 
          />
          <FeatureCard 
            icon={<Flame className="text-orange-400" />} 
            title="Máximo Rendimiento" 
            desc="Diseñado para emprendedores, estudiantes y atletas que exigen más de sí mismos." 
          />
        </div>
      </section>

      {/* 4. FORMULARIO DE COMPRA (Conversión Directa) */}
      <section id="form" className="py-20 px-4 bg-indigo-600/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 py-4 px-8 text-center">
              <p className="text-sm font-bold tracking-widest uppercase">Oferta por tiempo limitado</p>
            </div>
            
            <div className="p-8 md:p-12">
              {ok ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">¡Pedido Exitoso!</h3>
                  <p className="text-zinc-400">Un asesor te contactará por WhatsApp en breve.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Datos de envío</h3>
                    <div className="space-y-4">
                      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"><CircleAlert size={16}/> {error}</div>}
                      <Input label="Tu Nombre Completo" placeholder="Ej: Juan Pérez" value={fullName} onChange={setFullName} />
                      <Input label="WhatsApp / Teléfono" placeholder="Para confirmar entrega" value={phone} onChange={setPhone} />
                      <Input label="Ciudad" placeholder="Ej: Medellín" value={city} onChange={setCity} />
                      <Input label="Dirección Exacta" placeholder="Calle, número, apto/barrio" value={address} onChange={setAddress} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6 text-center">Resumen de Compra</h3>
                    <div className="flex items-center justify-between mb-6">
                       <span>Cantidad:</span>
                       <div className="flex items-center gap-4 bg-zinc-800 p-1 rounded-xl">
                          <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded-lg">-</button>
                          <span className="font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => setQty(q => q+1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded-lg">+</button>
                       </div>
                    </div>
                    <div className="border-t border-white/10 pt-4 mb-8">
                       <div className="flex justify-between text-zinc-400 text-sm mb-2"><span>Envío:</span><span className="text-green-400 font-bold">GRATIS</span></div>
                       <div className="flex justify-between text-2xl font-black"><span>Total:</span><span>${total.toLocaleString()}</span></div>
                    </div>
                    <button 
                      onClick={handleOrder}
                      disabled={isPending}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-600/30"
                    >
                      {isPending ? "PROCESANDO..." : "COMPRAR CONTRAENTREGA"}
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase tracking-tighter">🔒 Pago 100% seguro al recibir el producto</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECCIÓN (Derribo de objeciones) */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <FaqItem q="¿En cuánto tiempo llega mi pedido?" a="El tiempo de entrega es de 2 a 4 días hábiles dependiendo de tu ciudad. Te enviaremos el número de guía por WhatsApp." />
          <FaqItem q="¿Es seguro el pago contraentrega?" a="¡Totalmente! Solo pagas el dinero en efectivo al repartidor cuando tengas el producto en tus manos." />
          <FaqItem q="¿Cómo debo tomar el producto?" a="Recomendamos 1 cápsula al día, preferiblemente en la mañana con el desayuno para energía constante." />
        </div>
      </section>

      {/* STICKY CTA (Aparece al hacer scroll) */}
      <AnimatePresence>
        {showSticky && !ok && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-[100] bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 md:hidden"
          >
            <a href="#form" className="flex items-center justify-between bg-indigo-600 p-4 rounded-xl font-bold">
              <span>PEDIR AHORA</span>
              <span>${total.toLocaleString()}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function TrustIcon({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300">
      <span className="text-indigo-400">{icon}</span> {text}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-colors group">
      <div className="mb-4 scale-110 group-hover:scale-125 transition-transform duration-500">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">{label}</label>
      <input {...props} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all" />
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 bg-zinc-900/30 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-5 flex justify-between items-center text-left font-bold">
        {q} <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-5 pt-0 text-zinc-400 text-sm leading-relaxed">{a}</div>}
    </div>
  );
}