"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "mente", label: "Mente" },
  { id: "calma", label: "Calma" },
  { id: "energia", label: "Energía" },
  { id: "inmunidad", label: "Inmunidad" },
];

// Aceptamos los productos como props
export const ProductCatalog = ({ products }: { products: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = products.filter((p) => 
    activeCategory === "all" ? true : p.category === activeCategory
  );

  return (
    <section className="relative bg-[#0a0a0a] min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      
      {/* 1. TEXTURA DE FONDO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      
      {/* 2. LUCES AMBIENTALES */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* 3. HEADER & FILTROS */}
      <div className="relative z-10 max-w-7xl mx-auto mb-20 md:mb-32 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-8">
        <div>
           <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">The Collection</span>
           <h2 className="text-5xl md:text-8xl font-serif text-white mt-2 leading-none">
             ALQUIMIA
           </h2>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. GRID DE PRODUCTOS */}
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="popLayout">
           <div className="grid grid-cols-1 gap-16 md:gap-32">
             {filtered.map((product, index) => (
               <ProductCard key={product.id} data={product} index={index} />
             ))}
           </div>
        </AnimatePresence>
        
        {filtered.length === 0 && (
           <div className="text-center py-20 text-white/20 font-serif text-xl border border-white/10 rounded-lg bg-white/5">
             El catálogo se está actualizando...
           </div>
        )}
      </div>

    </section>
  );
};

// --- TARJETA DE PRODUCTO REAL ---
const ProductCard = ({ data, index }: { data: any, index: number }) => {
  const isEven = index % 2 === 0;

  // Asignamos color según categoría para el "Glow"
  const getColor = (cat: string) => {
      if(cat === 'mente') return '#fbbf24'; // Amber
      if(cat === 'calma') return '#f87171'; // Red
      if(cat === 'energia') return '#f97316'; // Orange
      return '#818cf8'; // Default Indigo
  };
  const accentColor = getColor(data.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 group ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      
      {/* A. VISUAL (IMAGEN REAL DE CLOUDINARY) */}
      <div className="w-full md:w-1/2 relative flex justify-center items-center py-10 md:py-20 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-none overflow-hidden h-[500px]">
         {/* Fondo Glow detrás del frasco */}
         <div 
            className="absolute w-64 h-64 rounded-full blur-[100px] opacity-20 transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundColor: accentColor }}
         ></div>
         
         {/* IMAGEN: Usamos la URL real guardada en BD */}
         <div className="relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 w-72 h-auto drop-shadow-2xl">
            <img 
                src={data.imageUrl} 
                alt={data.name} 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            />
         </div>

         {/* Botón flotante en Móvil */}
         <button className="md:hidden absolute bottom-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg active:scale-90 transition-transform">
           +
         </button>
      </div>

      {/* B. INFO (Editorial) */}
      <div className="w-full md:w-1/2 text-center md:text-left">
         <div className="inline-flex items-center gap-2 mb-6 opacity-50">
            <span className="h-[1px] w-8 bg-white"></span>
            <span className="text-xs font-mono tracking-widest text-white uppercase">N° 0{index + 1}</span>
         </div>

         <h3 className="text-4xl md:text-7xl font-sans font-black text-white mb-2 tracking-tighter uppercase leading-[0.9]">
           {data.name}
         </h3>
         
         <p className="text-lg md:text-2xl text-amber-500/80 font-serif italic mb-6">
           {data.subtitle}
         </p>

         <p className="text-sm md:text-base text-stone-400 max-w-md mx-auto md:mx-0 leading-relaxed mb-8 whitespace-pre-line">
           {data.description}
         </p>

         {/* Tags Dinámicos (JSON) */}
         {data.benefits && Array.isArray(data.benefits) && (
             <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
                {data.benefits.map((b: string) => (
                  <span key={b} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 border border-white/10 rounded-full">
                    {b}
                  </span>
                ))}
             </div>
         )}

         {/* Footer Desktop */}
         <div className="hidden md:flex items-center gap-10 border-t border-white/10 pt-8 mt-8 max-w-sm">
            <span className="text-2xl font-serif text-white">
                {/* Formateamos el precio */}
                ${Number(data.price).toLocaleString()}
            </span>
            <button className="group/btn flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white uppercase hover:text-amber-400 transition-colors">
               Agregar al Carrito
               <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
            </button>
         </div>
         
         {/* Footer Móvil */}
         <div className="flex md:hidden items-center justify-between gap-4 w-full bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-xl font-serif text-white">
                ${Number(data.price).toLocaleString()}
            </span>
            <button className="px-6 py-2 bg-white text-black text-xs font-bold uppercase rounded-sm">
               Comprar
            </button>
         </div>

      </div>

    </motion.div>
  );
};