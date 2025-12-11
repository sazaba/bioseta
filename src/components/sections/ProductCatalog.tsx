"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "mente", label: "Mente" },
  { id: "calma", label: "Calma" },
  { id: "energia", label: "Energía" },
  { id: "cuerpo", label: "Cuerpo" },
  { id: "inmunidad", label: "Inmunidad" },
];

export const ProductCatalog = ({ products }: { products: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = products.filter((p) => 
    activeCategory === "all" ? true : p.category === activeCategory
  );

  return (
    <section className="relative bg-[#050505] min-h-screen py-20 px-4 md:px-12 overflow-hidden">
      
      {/* 1. AMBIENTE & TEXTURA (Ultra sutil) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      
      {/* Luces volumétricas tenues */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* 2. HEADER IMPACTANTE */}
      <div className="relative z-10 max-w-[1400px] mx-auto mb-16 md:mb-32 flex flex-col items-center md:items-start">
        
        {/* Etiqueta Superior */}
        <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-amber-500/80 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 md:mb-6"
        >
            The Collection 2025
        </motion.span>

        {/* TÍTULO "ALQUIMIA" (Centrado en móvil, Left en Desktop) */}
        <h2 className="text-[18vw] md:text-[11vw] font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-[0.8] tracking-tighter text-center md:text-left w-full md:w-auto">
          ALQUIMIA
        </h2>

        {/* LÍNEA SEPARADORA & FILTROS */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mt-12 md:mt-16 border-t border-white/10 pt-8">
             {/* Texto descriptivo oculto en móvil para limpieza */}
            <p className="hidden md:block text-stone-500 text-sm max-w-xs leading-relaxed font-mono">
                Extractos funcionales diseñados para potenciar la biología humana a través de la naturaleza.
            </p>

            {/* FILTROS (Estilo Moderno Industrial) */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto w-full md:w-auto no-scrollbar px-2 md:px-0 scroll-smooth snap-x">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`snap-center flex-shrink-0 px-5 py-3 md:px-6 md:py-2 rounded-full text-xs md:text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-white text-black border-white scale-105"
                      : "bg-transparent text-stone-500 border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* 3. GRID DE PRODUCTOS */}
      <div className="max-w-[1400px] mx-auto relative z-10">
        <AnimatePresence mode="popLayout">
           <div className="flex flex-col gap-24 md:gap-40">
             {filtered.map((product, index) => (
               <ProductCard key={product.id} data={product} index={index} />
             ))}
           </div>
        </AnimatePresence>
        
        {filtered.length === 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
             <span className="text-white/30 font-mono text-sm tracking-widest uppercase">Sin resultados en esta categoría</span>
           </motion.div>
        )}
      </div>

    </section>
  );
};

// --- TARJETA DE PRODUCTO "AWWWARDS STYLE" ---
const ProductCard = ({ data, index }: { data: any, index: number }) => {
  const isEven = index % 2 === 0;
  
  // Colores dinámicos
  const getColor = (cat: string) => {
      if(cat === 'mente') return '#fbbf24'; 
      if(cat === 'calma') return '#f87171'; 
      if(cat === 'energia') return '#f97316'; 
      if(cat === 'cuerpo') return '#7c3aed'; 
      if(cat === 'inmunidad') return '#22c55e';
      return '#818cf8'; 
  };
  const accentColor = getColor(data.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }} // Curva "Cubic Bezier" suave
      className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 group relative`}
    >
        {/* Orden alternado en Desktop, siempre Imagen primero en Mobile */}
        <div className={`contents ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            
            {/* A. IMAGEN ESCULTURAL */}
            <div className="w-full md:w-7/12 relative aspect-square md:aspect-[4/3] flex justify-center items-center bg-[#080808] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                 {/* Glow Ambiental Detrás del producto */}
                 <div 
                    className="absolute inset-0 opacity-20 transition-opacity duration-1000 group-hover:opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"
                    style={{ '--tw-gradient-from': accentColor, '--tw-gradient-to': 'transparent' } as any}
                 ></div>
                 
                 <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                 {/* IMAGEN FLOTANTE */}
                 <motion.div 
                    whileHover={{ scale: 1.05, rotate: -2, y: -10 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative z-10 w-[60%] h-[60%] md:w-[50%] md:h-[70%]"
                 >
                    <img 
                        src={data.imageUrl} 
                        alt={data.name} 
                        className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]" 
                    />
                 </motion.div>

                 {/* Categoría Flotante (Etiqueta estilo militar/técnico) */}
                 <div className="absolute top-6 left-6 md:top-8 md:left-8 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/60">
                        {data.category}
                    </span>
                 </div>
            </div>

            {/* B. INFO EDITORIAL */}
            <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left">
                 
                 {/* Índice Numérico */}
                 <span className="text-amber-500/50 font-mono text-xs mb-4 block">
                    ( 00{index + 1} )
                 </span>

                 {/* Título Masivo */}
                 <h3 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black text-white mb-2 tracking-tighter uppercase leading-[0.85]">
                   {data.name}
                 </h3>
                 
                 {/* Subtítulo Elegante */}
                 <p className="text-lg md:text-2xl text-stone-400 font-serif italic mb-6">
                   {data.subtitle}
                 </p>

                 {/* Descripción */}
                 <p className="text-sm md:text-base text-stone-500 leading-relaxed max-w-md mb-8">
                   {data.description}
                 </p>

                 {/* Beneficios (Tags Minimalistas) */}
                 {data.benefits && (
                     <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-10 text-xs font-mono text-white/40 uppercase tracking-widest">
                        {data.benefits.map((b: string) => (
                            <span key={b} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                {b}
                            </span>
                        ))}
                     </div>
                 )}

                 {/* ZONA DE COMPRA: NUEVA TIPOGRAFÍA MODERNA */}
                 <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 border-t border-white/10 pt-6 md:border-none md:pt-0">
                    
                    {/* PRECIO: AHORA ES SANS-SERIF Y BOLD (Solicitado) */}
                    <span className="text-4xl md:text-5xl font-sans font-black tracking-tighter text-white">
                        ${Number(data.price).toLocaleString()}
                    </span>

                    {/* Botón CTA Premium */}
                    <button className="relative overflow-hidden group/btn bg-white text-black px-8 py-4 w-full md:w-auto rounded-full md:rounded-sm transition-transform active:scale-95">
                        <div className="absolute inset-0 bg-amber-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em]">
                            Adquirir
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                    </button>
                 </div>
            </div>

        </div>
    </motion.div>
  );
};