"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA ---
const products = [
  {
    id: 1,
    category: "mente",
    name: "LION'S MANE",
    subtitle: "Claridad & Memoria",
    description: "Nootrópico natural para el alto rendimiento cognitivo. Despierta tu mente.",
    price: "$120.000",
    color: "#fbbf24", // Amber
    benefits: ["Focus", "Memoria", "Neurogénesis"],
  },
  {
    id: 2,
    category: "calma",
    name: "ASHWAGANDHA",
    subtitle: "Balance & Resiliencia",
    description: "La cura moderna para el estrés. Reduce el cortisol y mejora el descanso.",
    price: "$115.000",
    color: "#f87171", // Red
    benefits: ["Calma", "Sueño", "Anti-Estrés"],
  },
  {
    id: 3,
    category: "energia",
    name: "CORDYCEPS",
    subtitle: "Potencia & Oxígeno",
    description: "Combustible celular ATP. Resistencia física inagotable sin caídas.",
    price: "$130.000",
    color: "#f97316", // Orange
    benefits: ["Energía", "Libido", "Rendimiento"],
  },
  {
    id: 4,
    category: "mente",
    name: "FOCUS BLEND",
    subtitle: "Sinergia Total",
    description: "Fusión maestra de hongos para estados de flujo profundo y trabajo intenso.",
    price: "$145.000",
    color: "#818cf8", // Indigo
    benefits: ["Flow", "Productividad", "Creatividad"],
  },
];

const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "mente", label: "Mente" },
  { id: "calma", label: "Calma" },
  { id: "energia", label: "Cuerpo" },
];

export const ProductCatalog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = products.filter((p) => 
    activeCategory === "all" ? true : p.category === activeCategory
  );

  return (
    <section className="relative bg-[#0a0a0a] min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      
      {/* 1. TEXTURA DE FONDO (Noise Grain Premium) */}
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

        {/* Filtros Minimalistas */}
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
           <div className="text-center py-20 text-white/20 font-serif text-xl">Sin resultados.</div>
        )}
      </div>

    </section>
  );
};

// --- TARJETA DE PRODUCTO (Ultra Responsive Layout) ---
const ProductCard = ({ data, index }: { data: any, index: number }) => {
  const isEven = index % 2 === 0;

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
      
      {/* A. VISUAL (El Frasco Mate) */}
      <div className="w-full md:w-1/2 relative flex justify-center items-center py-10 md:py-20 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-none overflow-hidden">
         {/* Fondo Glow detrás del frasco */}
         <div 
            className="absolute w-64 h-64 rounded-full blur-[100px] opacity-20 transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundColor: data.color }}
         ></div>
         
         {/* El Frasco CSS */}
         <div className="relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2">
            <MatteJar color={data.color} name={data.name} />
         </div>

         {/* Botón flotante en Móvil (Solo visible en pantallas pequeñas) */}
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

         <p className="text-sm md:text-base text-stone-400 max-w-md mx-auto md:mx-0 leading-relaxed mb-8">
           {data.description}
         </p>

         {/* Tags */}
         <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
            {data.benefits.map((b: string) => (
              <span key={b} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 border border-white/10 rounded-full">
                {b}
              </span>
            ))}
         </div>

         {/* Footer Desktop */}
         <div className="hidden md:flex items-center gap-10 border-t border-white/10 pt-8 mt-8 max-w-sm">
            <span className="text-2xl font-serif text-white">{data.price}</span>
            <button className="group/btn flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white uppercase hover:text-amber-400 transition-colors">
               Agregar al Carrito
               <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
            </button>
         </div>
         
         {/* Footer Móvil (Precio + Botón ancho) */}
         <div className="flex md:hidden items-center justify-between gap-4 w-full bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-xl font-serif text-white">{data.price}</span>
            <button className="px-6 py-2 bg-white text-black text-xs font-bold uppercase rounded-sm">
               Comprar
            </button>
         </div>

      </div>

    </motion.div>
  );
};

// --- COMPONENTE VISUAL: FRASCO NEGRO MATE (CSS PURO) ---
// Simula un tarro de suplementos de lujo sin usar imágenes.
const MatteJar = ({ color, name }: { color: string, name: string }) => {
  return (
    <div className="relative w-40 h-56 md:w-48 md:h-64 flex flex-col items-center">
      
      {/* Tapa (Cap) */}
      <div className="w-32 h-8 bg-gradient-to-r from-[#1a1a1a] via-[#333] to-[#1a1a1a] rounded-t-sm border-b border-white/10 shadow-lg relative z-20"></div>
      
      {/* Cuerpo (Body) */}
      <div className="w-40 h-48 bg-gradient-to-r from-[#000] via-[#1a1a1a] to-[#050505] rounded-b-2xl relative shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border-l border-white/5 border-r border-black">
         
         {/* Reflejo de luz en el plástico mate (Highlight) */}
         <div className="absolute top-0 left-2 w-full h-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>

         {/* Etiqueta Premium (Label) */}
         <div className="relative w-full h-32 bg-[#0a0a0a] flex flex-col items-center justify-center border-t border-b border-white/10 shadow-inner">
            {/* Banda de color */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>
            
            {/* Texto en el frasco */}
            <span className="text-[10px] text-white/40 tracking-[0.2em] mb-1">BIOSETA</span>
            <h4 className="text-lg font-bold text-white tracking-widest uppercase text-center leading-tight px-4">
               {name.split(" ")[0]}
            </h4>
            <div className="mt-2 w-8 h-[2px]" style={{ backgroundColor: color }}></div>
         </div>
      </div>

    </div>
  );
};