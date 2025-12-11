"use client";
import { useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";

// --- CONFIGURACIÓN ---
const PHONE_NUMBER = "573000000000";

const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "mente", label: "Mente" },
  { id: "calma", label: "Calma" },
  { id: "energia", label: "Energía" },
  { id: "cuerpo", label: "Cuerpo" },
  { id: "inmunidad", label: "Inmunidad" },
];

const getAccentColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "mente": return "#fbbf24";
    case "calma": return "#f87171";
    case "energia": return "#f97316";
    case "cuerpo": return "#8b5cf6";
    case "inmunidad": return "#10b981";
    default: return "#ffffff";
  }
};

export const ProductCatalog = ({ products }: { products: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Lógica para mostrar filtros solo al llegar a la sección
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowFilters(latest > 0 && latest < 1);
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      activeCategory === "all" ? true : p.category === activeCategory
    );
  }, [products, activeCategory]);

  return (
    <section ref={sectionRef} className="bg-[#020202] relative min-h-screen">
      {/* DIFUMINADO DE CONEXIÓN SUPERIOR */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#020202] via-[#020202]/90 to-transparent z-20 pointer-events-none" />

      {/* HEADER FLOTANTE (FILTROS) */}
      <div
        className={`fixed top-[110px] md:top-[140px] left-0 w-full z-[30] pointer-events-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-500 ${
          showFilters
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        {/* Título */}
        <div className="pointer-events-auto mix-blend-difference relative z-50 px-4 md:px-6">
          <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em] block mb-1">
            Bioseta Lab Series
          </span>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="pointer-events-auto w-full md:w-auto relative z-50">
          <div
            className="flex gap-3 overflow-x-auto no-scrollbar items-center pl-4 pr-12 md:px-6 md:justify-end pb-2 md:pb-0"
            style={{
              maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 whitespace-nowrap shadow-lg backdrop-blur-xl ${
                  activeCategory === cat.id
                    ? "bg-white text-black border-white scale-105"
                    : "bg-[#0a0a0a]/60 text-stone-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAZO DE CARTAS (STACK) */}
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <div key={activeCategory}>
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id || index}
                  product={product}
                  index={index}
                  total={filteredProducts.length}
                />
              ))}
            </div>
          ) : (
            <div className="h-screen flex items-center justify-center text-white/30 font-mono text-xs uppercase">
              Sin especímenes en esta categoría.
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-[20vh] bg-[#020202] flex items-end justify-center pb-10 text-white/10 relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-widest">
          End of Archive
        </p>
      </div>
    </section>
  );
};

const Card = ({
  product,
  index,
  total,
}: {
  product: any;
  index: number;
  total: number;
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const textParallax = useTransform(scrollYProgress, [0, 1], [200, -100]);
  
  // NOTA: Se ha eliminado la variable 'opacity' para que sea visible siempre.

  const accentColor = getAccentColor(product.category);

  const handleWhatsApp = () => {
    const message = `Hola Bioseta, estoy interesado en *${product.name}* (${product.subtitle}). ¿Me das más info?`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      ref={containerRef}
      // Eliminado style={{ opacity }}
      className="sticky top-0 min-h-[100dvh] w-full flex items-center justify-center overflow-y-auto bg-[#050505]"
    >
      {/* Fondo Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
          filter: "blur(120px)",
        }}
      />
      
      {/* Textura Noise */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      ></div>

      {/* Contenedor Principal */}
      <div className="relative w-full max-w-[1600px] min-h-[100dvh] px-6 md:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between pt-24 md:pt-0 pb-20 md:pb-0">
        
        {/* TEXTO DE FONDO (Outline) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
          <motion.h2
            style={{
                y: textParallax,
                WebkitTextStroke: "1px rgba(255,255,255,0.8)",
            } as any}
            className="text-[25vw] font-sans font-black uppercase text-transparent leading-none whitespace-nowrap opacity-[0.08]"
          >
            {product.name?.split(" ")[0]}
          </motion.h2>
        </div>

        {/* INFO IZQUIERDA */}
        <div className="relative z-10 w-full md:w-1/3 flex flex-col gap-6 order-2 md:order-1 mt-6 md:mt-0">
          <div className="flex items-center gap-4 pb-2">
            <span className="text-[10px] font-mono text-white/30">
              ID_00{index + 1}
            </span>
            <span className="h-[1px] w-8 bg-white/10" />
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              {product.category}
            </span>
          </div>

          <div>
            <h3 className="text-5xl md:text-7xl font-sans font-black text-white leading-[0.9] tracking-tighter mb-2">
              {product.name}
            </h3>
            <p className="text-lg md:text-2xl text-stone-300 font-serif italic">
              {product.subtitle}
            </p>
          </div>

          <p className="text-xs md:text-sm text-stone-500 leading-relaxed max-w-sm font-mono">
            {product.description}
          </p>

          <div className="flex flex-col gap-5 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-sans font-black text-white tracking-tighter">
                ${Number(product.price).toLocaleString()}
              </span>
              <span className="text-xs text-white/30 font-mono uppercase">
                COP / Unidad
              </span>
            </div>

            <button
              onClick={handleWhatsApp}
              className="group relative overflow-hidden w-full md:w-fit bg-white text-black px-8 py-4 rounded-sm transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <div className="flex items-center justify-between gap-6 relative z-10">
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  ¡Quiero este producto!
                </span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* IMAGEN CENTRAL (Radar) */}
        <div className="relative z-10 w-full md:w-1/3 h-[40vh] md:h-[60vh] flex items-center justify-center order-1 md:order-2">
          <div
            className="absolute w-[280px] h-[280px] md:w-[500px] md:h-[500px] border border-white/5 rounded-full animate-[spin_12s_linear_infinite]"
            style={{ borderTopColor: accentColor }}
          />
          <div className="absolute w-[220px] h-[220px] md:w-[400px] md:h-[400px] border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

          <motion.div
            style={{ scale: imageScale }}
            className="relative w-[70%] h-[70%] flex items-center justify-center"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </div>

        {/* DATA DERECHA (Desktop) */}
        <div className="hidden md:flex flex-col gap-8 w-1/3 items-end order-3 z-10 text-right opacity-60">
          {product.benefits && (
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[9px] text-amber-500 uppercase tracking-widest font-mono border-b border-amber-500/20 pb-1 mb-2">
                Principios Activos
              </span>
              {product.benefits.slice(0, 3).map((b: string, i: number) => (
                <span
                  key={i}
                  className="text-sm font-sans font-bold text-white uppercase tracking-wider"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BARRA PROGRESO INFERIOR */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <motion.div
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "left",
            backgroundColor: accentColor,
          }}
          className="h-full w-full shadow-[0_0_10px_currentColor]"
        />
      </div>
    </motion.div>
  );
};