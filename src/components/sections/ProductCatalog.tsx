"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Estilos compartidos para el efecto cristal (Glassmorphism)
const glassClasses = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-300";

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
      
      {/* 1. AMBIENTE & TEXTURA */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      {/* Luz ambiental dorada muy sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* 2. HEADER IMPACTANTE */}
      <div className="relative z-10 max-w-[1400px] mx-auto mb-16 md:mb-28 flex flex-col items-center md:items-start">
        
        <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-amber-300/70 font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-4"
        >
            The Collection 2025
        </motion.span>

        {/* TÍTULO "ALQUIMIA" CON NEÓN ELEGANTE */}
        {/* Nota: El estilo 'textShadow' crea el resplandor ámbar multicapa */}
        <h2 
            className="text-[12vw] md:text-[9vw] font-sans font-black text-white leading-[0.8] tracking-tighter text-center md:text-left w-full md:w-auto drop-shadow-2xl"
            style={{ 
                textShadow: '0 0 15px rgba(251, 191, 36, 0.3), 0 0 30px rgba(251, 191, 36, 0.2)' 
            }}
        >
          ALQUIMIA
        </h2>

        {/* LÍNEA SEPARADORA & FILTROS GLASSMORPHISM */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mt-12 pt-8 border-t border-white/5">
             <p className="hidden md:block text-stone-500 text-xs max-w-xs leading-relaxed font-mono">
                Extractos funcionales diseñados para potenciar la biología humana a través de la naturaleza.
            </p>

            {/* FILTROS DE CRISTAL */}
            <div className="flex gap-3 overflow-x-auto w-full md:w-auto no-scrollbar px-2 md:px-0 scroll-smooth snap-x py-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`snap-center flex-shrink-0 px-5 py-2 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest ${glassClasses} ${
                    activeCategory === cat.id
                      ? "bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "text-stone-400 hover:text-white hover:bg-white/10"
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
           <div className="flex flex-col gap-20 md:gap-32">
             {filtered.map((product, index) => (
               <ProductCard key={product.id} data={product} index={index} />
             ))}
           </div>
        </AnimatePresence>
      </div>

    </section>
  );
};

// --- TARJETA DE PRODUCTO REFINADA ---
const ProductCard = ({ data, index }: { data: any, index: number }) => {
  const isEven = index % 2 === 0;
  
  // Colores dinámicos para el glow ambiental
  const getColor = (cat: string) => {
      if(cat === 'mente') return '#fbbf24'; 
      if(cat === 'calma') return '#f87171'; 
      if(cat === 'energia') return '#f97316'; 
      if(cat === 'cuerpo') return '#7c3aed'; 
      if(cat === 'inmunidad') return '#22c55e';
      return '#818cf8'; 
  };
  const accentColor = getColor(data.category);

  // Función placeholder para WhatsApp (Reemplazar con lógica real)
  const handleWhatsAppClick = () => {
      const message = `Hola, estoy interesado en el producto: ${data.name}`;
      // window.open(`https://wa.me/TU_NUMERO?text=${encodeURIComponent(message)}`, '_blank');
      console.log("Redirigiendo a WhatsApp con:", message);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 group relative`}
    >
        {/* A. IMAGEN */}
        <div className={`contents ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            
            <div className="w-full md:w-6/12 relative aspect-square md:aspect-[4/3] flex justify-center items-center rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#080808]">
                 {/* Glow Ambiental */}
                 <div 
                    className="absolute inset-0 opacity-15 transition-opacity duration-1000 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"
                    style={{ '--tw-gradient-from': accentColor, '--tw-gradient-to': 'transparent' } as any}
                 ></div>
                 <div className="absolute inset-0 opacity-[0.3] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                 {/* Producto Flotante */}
                 <motion.div 
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative z-10 w-[55%] h-[55%] md:w-[50%] md:h-[70%]"
                 >
                    <img 
                        src={data.imageUrl} 
                        alt={data.name} 
                        className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]" 
                    />
                 </motion.div>

                 {/* Etiqueta Categoría Glassmorphism */}
                 <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1 rounded-full ${glassClasses}`}>
                    <span className="text-[9px] font-black tracking-widest uppercase text-white/70">
                        {data.category}
                    </span>
                 </div>
            </div>

            {/* B. INFO REFINADA */}
            <div className="w-full md:w-6/12 flex flex-col items-center md:items-start text-center md:text-left">
                 
                 <span className="text-amber-500/40 font-mono text-[10px] mb-4 block tracking-wider">
                    — 00{index + 1}
                 </span>

                 {/* Título Reducido */}
                 <h3 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black text-white mb-2 tracking-tighter uppercase leading-[0.9]">
                   {data.name}
                 </h3>
                 
                 {/* Subtítulo Reducido */}
                 <p className="text-base md:text-xl text-stone-300 font-serif italic mb-4">
                   {data.subtitle}
                 </p>

                 {/* Descripción Reducida */}
                 <p className="text-xs md:text-sm text-stone-500 leading-relaxed max-w-md mb-6">
                   {data.description}
                 </p>

                 {/* Beneficios Glassmorphism */}
                 {data.benefits && (
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                        {data.benefits.map((b: string) => (
                            <span key={b} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white/60 ${glassClasses}`}>
                                {b}
                            </span>
                        ))}
                     </div>
                 )}

                 {/* ZONA DE COMPRA (WhatsApp) */}
                 <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-6 pt-6 border-t border-white/5 md:border-none md:pt-0">
                    
                    {/* Precio Reducido */}
                    <span className="text-3xl md:text-4xl font-sans font-black tracking-tighter text-white">
                        ${Number(data.price).toLocaleString()}
                    </span>

                    {/* Botón WhatsApp Premium */}
                    <button 
                        onClick={handleWhatsAppClick}
                        className="relative overflow-hidden group/btn bg-white text-black px-6 py-3 w-full md:w-auto rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] group-hover/btn:text-black transition-colors">
                            ¡Quiero este producto!
                            {/* Icono de flecha simple, podría cambiarse por logo de WA */}
                            <svg className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                    </button>
                 </div>
            </div>

        </div>
    </motion.div>
  );
};