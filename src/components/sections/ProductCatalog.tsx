"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN ---
const PHONE_NUMBER = "573000000000";

const CATEGORIES = [
  { id: "all", label: "TODO" },
  { id: "mente", label: "MENTE" },
  { id: "calma", label: "CALMA" },
  { id: "energia", label: "ENERGÍA" },
  { id: "cuerpo", label: "CUERPO" },
  { id: "inmunidad", label: "INMUNIDAD" },
];

// Helper para colores NEÓN
const getAccentColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "mente": return "#fbbf24"; // Amber
    case "calma": return "#f87171"; // Red
    case "energia": return "#f97316"; // Orange
    case "cuerpo": return "#8b5cf6"; // Violet
    case "inmunidad": return "#10b981"; // Emerald
    default: return "#ffffff";
  }
};

export const ProductCatalog = ({ products }: { products: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filtramos productos
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      activeCategory === "all" ? true : p.category === activeCategory
    );
  }, [products, activeCategory]);

  // Color actual para el efecto Neón general
  const activeColor = activeCategory === 'all' ? '#ffffff' : getAccentColor(activeCategory);

  return (
    <section className="bg-[#020202] relative min-h-screen pb-20">
      
      {/* FONDO AMBIENTAL */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black via-[#050505] to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* --- HEADER DE SECCIÓN + FILTROS --- */}
      <div className="relative z-20 pt-20 md:pt-32 pb-8 px-4 md:px-12 max-w-[1800px] mx-auto">
        
        {/* Título de la Sección */}
        <div className="mb-8 md:mb-12">
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] block mb-2">
                Bioseta Lab Series
            </span>
            <h2 className="text-4xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter">
                Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">2025</span>
            </h2>
        </div>

        {/* BARRA DE FILTROS (STICKY) 
            - sticky top-20: Se pega al bajar, pero respetando el espacio del Navbar.
            - z-30: Encima de los productos.
        */}
        <div className="sticky top-20 z-30 py-4 -mx-4 px-4 md:mx-0 md:px-0 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 md:border-none md:bg-transparent md:backdrop-blur-none">
          <div className="flex flex-wrap gap-2 md:gap-4 overflow-x-auto no-scrollbar items-center">
            {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const catColor = cat.id === 'all' ? '#ffffff' : getAccentColor(cat.id);
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="relative group px-6 py-2 md:px-5 md:py-2 rounded-sm transition-all duration-300 overflow-hidden"
                  >
                    {/* Fondo Activo (Neón Fill) */}
                    <div 
                        className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`}
                        style={{ backgroundColor: catColor }}
                    />
                    
                    {/* Borde Neón (Glow) */}
                    <div 
                        className={`absolute inset-0 border transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}
                        style={{ 
                            borderColor: catColor,
                            boxShadow: isActive ? `0 0 15px ${catColor}40, inset 0 0 10px ${catColor}20` : 'none'
                        }}
                    />

                    {/* Texto Tipografía Moderna */}
                    <span 
                        className={`relative z-10 text-[10px] md:text-xs font-mono font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
                            isActive ? 'text-black mix-blend-hard-light' : 'text-white'
                        }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
            })}
          </div>
        </div>

      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      <div className="relative z-10 px-4 md:px-12 max-w-[1800px] mx-auto min-h-[50vh]">
        <motion.div 
            layout 
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <GridCard
                  key={product.id || index}
                  product={product}
                  index={index}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-white/30 font-mono text-xs uppercase gap-4"
              >
                <div className="w-12 h-12 border border-dashed border-white/20 rounded-full animate-spin" />
                <span>Sin especímenes en esta categoría</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </section>
  );
};

// --- COMPONENTE CARTA GRID (Con efectos Neón sutiles) ---
const GridCard = ({ product, index }: { product: any; index: number }) => {
  const accentColor = getAccentColor(product.category);

  const handleWhatsApp = () => {
    const message = `Hola Bioseta, estoy interesado en *${product.name}* (${product.subtitle}). ¿Me das más info?`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full aspect-[9/14] md:aspect-[3/4] overflow-hidden rounded-sm bg-[#080808] border border-white/10 hover:border-white/30 transition-colors duration-500"
    >
      {/* 1. FONDO GLOW (Brilla al Hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accentColor} 0%, transparent 70%)`,
        }}
      />
      
      {/* 2. TEXTURA DE RUIDO */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* 3. ELEMENTOS DECORATIVOS (Radar simplificado) */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[160%] h-[50%] pointer-events-none opacity-40">
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_12s_linear_infinite]" style={{ borderTopColor: `${accentColor}40` }} />
      </div>

      {/* 4. CONTENIDO */}
      <div className="relative h-full flex flex-col justify-between p-3 md:p-5 z-10">
        
        {/* HEADER CARTA */}
        <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-white/30">
                0{index + 1}
            </span>
            <span 
                className="text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-[2px] border"
                style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}05` }}
            >
                {product.category}
            </span>
        </div>

        {/* IMAGEN FLOTANTE */}
        <div className="flex-1 relative flex items-center justify-center py-2 md:py-4">
             {/* Texto Outline Detrás */}
            <span 
                className="absolute text-[25vw] md:text-[8vw] font-black text-transparent opacity-10 pointer-events-none select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
            >
                {product.name?.charAt(0)}
            </span>

            <motion.img 
                whileHover={{ scale: 1.1, rotate: -5, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-10"
            />
        </div>

        {/* INFO INFERIOR */}
        <div className="space-y-3 border-t border-white/5 pt-3">
            <div>
                <h3 className="text-xl md:text-2xl font-sans font-black text-white leading-none uppercase tracking-tighter truncate">
                    {product.name}
                </h3>
                <p className="text-[10px] md:text-xs text-stone-500 font-mono mt-1 truncate">
                    {product.subtitle}
                </p>
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="text-sm md:text-lg font-bold text-white tracking-tight">
                    ${Number(product.price).toLocaleString()}
                </span>

                <button 
                    onClick={handleWhatsApp}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: accentColor }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>

      </div>
    </motion.div>
  );
};