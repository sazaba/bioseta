// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // --- DATOS DEL PRODUCTO ---
// const products = [
//   {
//     id: 1,
//     category: "mente",
//     name: "MELENA DE LEÓN",
//     subtitle: "Enfoque Cognitivo & Memoria",
//     description: "El secreto ancestral para la claridad mental. Potencia la neurogénesis.",
//     price: "$120.000",
//     gradient: "from-amber-300 via-yellow-500 to-amber-700",
//     benefits: ["Claridad", "Memoria", "Focus"],
//   },
//   {
//     id: 2,
//     category: "calma",
//     name: "ASHWAGANDHA",
//     subtitle: "Poder Adaptógeno & Calma",
//     description: "Domina el estrés y recupera tu vigor. Equilibra el cortisol.",
//     price: "$115.000",
//     gradient: "from-orange-300 via-amber-500 to-red-700",
//     benefits: ["Anti-Estrés", "Vigor", "Sueño"],
//   },
//   {
//     id: 3,
//     category: "energia",
//     name: "CORDYCEPS",
//     subtitle: "Energía ATP & Rendimiento",
//     description: "El combustible biológico. Aumenta el oxígeno y la resistencia.",
//     price: "$130.000",
//     gradient: "from-orange-400 via-red-500 to-rose-700",
//     benefits: ["Energía", "Libido", "Oxígeno"],
//   },
//   {
//     id: 4,
//     category: "calma",
//     name: "REISHI",
//     subtitle: "El Hongo de la Inmortalidad",
//     description: "Calma el espíritu y nutre el cuerpo. Longevidad y paz interior.",
//     price: "$125.000",
//     gradient: "from-red-900 via-red-700 to-amber-900",
//     benefits: ["Relax", "Longevidad", "Inmunidad"],
//   },
//   {
//     id: 5,
//     category: "mente",
//     name: "FOCUS BLEND",
//     subtitle: "Sinergia Cognitiva",
//     description: "Mezcla exclusiva para mantener la mente aguda y el cuerpo activo.",
//     price: "$145.000",
//     gradient: "from-indigo-300 via-purple-500 to-indigo-800",
//     benefits: ["Flow State", "Productividad", "Sin Cafeína"],
//   },
// ];

// const CATEGORIES = [
//   { id: "all", label: "All" },
//   { id: "mente", label: "Mente" },
//   { id: "calma", label: "Calma" },
//   { id: "energia", label: "Energía" },
// ];

// const ITEMS_PER_PAGE = 3;

// export const ProductCatalog = () => {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredProducts = products.filter((product) => 
//     activeCategory === "all" ? true : product.category === activeCategory
//   );

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const handleCategoryChange = (catId: string) => {
//     setActiveCategory(catId);
//     setCurrentPage(1);
//   };

//   return (
//     <section className="relative bg-[#0F1115] py-20 px-4 md:px-0 overflow-hidden min-h-screen">
      
//       {/* --- FONDO ANIMADO (Background FX) --- */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {/* Manchas de luz ambiental */}
//         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] mix-blend-screen"></div>
        
//         {/* Esporas flotantes (Partículas) */}
//         <FloatingSpores />
//       </div>

//       {/* --- HEADER MODERNO --- */}
//       <div className="text-center mb-16 relative z-10">
//         <span className="text-amber-200/50 tracking-[0.8em] text-[10px] md:text-xs uppercase font-sans font-bold">
//           The 2025 Collection
//         </span>
//         <h2 className="mt-4 text-5xl md:text-8xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter"
//             style={{ fontFamily: 'var(--font-montserrat)' }}>
//           PORTFOLIO
//         </h2>
//       </div>

//       {/* --- TABS DE FILTRO GLASSMORPHISM --- */}
//       <div className="flex flex-wrap justify-center gap-4 mb-24 relative z-20">
//         <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
//           {CATEGORIES.map((cat) => (
//             <button
//               key={cat.id}
//               onClick={() => handleCategoryChange(cat.id)}
//               className={`px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
//                 activeCategory === cat.id 
//                   ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
//                   : "text-white/60 hover:text-white hover:bg-white/5"
//               }`}
//             >
//               {cat.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- LISTA DE PRODUCTOS --- */}
//       <div className="flex flex-col gap-24 md:gap-40 max-w-7xl mx-auto relative z-10">
//         <AnimatePresence mode="wait">
//           {paginatedProducts.length > 0 ? (
//             paginatedProducts.map((product, index) => (
//               <ProductCard key={product.id} product={product} index={index} />
//             ))
//           ) : (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/30 font-sans py-20">
//               Colección agotada momentáneamente.
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* --- PAGINACIÓN MODERNA --- */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-32 relative z-20">
//            <div className="flex items-center gap-8 backdrop-blur-md bg-white/5 px-8 py-4 rounded-full border border-white/10">
//               <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-white/50 hover:text-amber-400 disabled:opacity-20 transition-colors">←</button>
//               <span className="font-mono text-amber-500">{currentPage} / {totalPages}</span>
//               <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="text-white/50 hover:text-amber-400 disabled:opacity-20 transition-colors">→</button>
//            </div>
//         </div>
//       )}
//     </section>
//   );
// };

// // --- COMPONENTE DE TARJETA (Modern Glassmorphism) ---
// const ProductCard = ({ product, index }: { product: any; index: number }) => {
//   const isEven = index % 2 === 0;

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 100 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-10%" }}
//       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//       className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${isEven ? '' : 'md:flex-row-reverse'}`}
//     >
      
//       {/* 1. VISUAL (El Hongo Abstracto) */}
//       <div className="w-full md:w-1/2 relative group">
//          {/* Glass Container */}
//          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-700 group-hover:border-amber-500/30">
            
//             {/* Gradiente Interno Dinámico */}
//             <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${product.gradient} blur-[100px] group-hover:opacity-40 transition-opacity duration-700`}></div>
            
//             {/* Visual Vectorial Abstracto */}
//             <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
//                <AbstractFungi gradientId={`grad-${product.id}`} colors={product.gradient} />
//             </div>

//             {/* Etiqueta Flotante */}
//             <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
//                <span className="text-xs font-mono text-amber-500">{product.price}</span>
//             </div>
//          </div>
//       </div>

//       {/* 2. INFO (Tipografía Moderna) */}
//       <div className="w-full md:w-1/2 px-4 md:px-0 text-center md:text-left">
//          <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-widest text-black bg-amber-500 rounded-sm uppercase">
//             N° 0{index + 1}
//          </span>
         
//          <h3 className="text-5xl md:text-7xl font-black text-white mb-4 leading-[0.9] tracking-tighter uppercase" style={{ fontFamily: 'var(--font-montserrat)' }}>
//             {product.name}
//          </h3>
         
//          <p className="text-xl md:text-2xl text-white/60 font-serif italic mb-8">
//             {product.subtitle}
//          </p>
         
//          <p className="text-sm md:text-base text-stone-400 font-sans leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
//             {product.description}
//          </p>

//          {/* Tags Modernos */}
//          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
//             {product.benefits.map((benefit: string) => (
//                <span key={benefit} className="px-4 py-2 text-[10px] font-bold tracking-wider text-white border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors uppercase cursor-default">
//                   {benefit}
//                </span>
//             ))}
//          </div>

//          <button className="w-full md:w-auto px-10 py-4 bg-white text-black font-black text-xs tracking-[0.2em] uppercase hover:bg-amber-400 transition-colors rounded-sm">
//             Add to Cart
//          </button>
//       </div>

//     </motion.div>
//   );
// };

// // --- COMPONENTE VISUAL: Hongo Abstracto SVG ---
// // Dibuja formas orgánicas que parecen hongos modernos/arte digital
// const AbstractFungi = ({ gradientId, colors }: { gradientId: string, colors: string }) => {
//   return (
//     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
//       <defs>
//         <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="white" stopOpacity="0.8" />
//           <stop offset="100%" stopColor="white" stopOpacity="0.1" />
//         </linearGradient>
//       </defs>
      
//       {/* Cuerpo del Hongo Abstracto (Glass) */}
//       <motion.path 
//         d="M100 20 C 140 20, 170 50, 170 90 C 170 130, 140 180, 100 180 C 60 180, 30 130, 30 90 C 30 50, 60 20, 100 20 Z"
//         fill={`url(#${gradientId})`}
//         stroke="white"
//         strokeWidth="0.5"
//         strokeOpacity="0.5"
//         initial={{ d: "M100 30 C 140 30, 160 60, 160 90 C 160 130, 140 170, 100 170 C 60 170, 40 130, 40 90 C 40 60, 60 30, 100 30 Z" }}
//         animate={{ 
//           d: [
//             "M100 30 C 150 20, 180 60, 170 100 C 160 150, 130 180, 100 170 C 50 160, 20 120, 30 80 C 40 40, 70 30, 100 30 Z",
//             "M100 20 C 130 30, 160 50, 160 90 C 160 140, 140 170, 100 180 C 60 170, 40 140, 40 90 C 40 50, 70 20, 100 20 Z"
//           ],
//         }}
//         transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//         style={{ filter: 'blur(1px)' }}
//       />
      
//       {/* Núcleo Brillante */}
//       <motion.circle cx="100" cy="100" r="40" fill="white" fillOpacity="0.2" filter="blur(20px)" 
//         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
//         transition={{ duration: 3, repeat: Infinity }}
//       />
//     </svg>
//   );
// };

// // --- COMPONENTE FONDO: Esporas Flotantes ---
// const FloatingSpores = () => {
//   // Generamos 10 esporas aleatorias
//   const spores = Array.from({ length: 10 }).map((_, i) => ({
//     id: i,
//     x: Math.random() * 100,
//     y: Math.random() * 100,
//     size: Math.random() * 4 + 1,
//     duration: Math.random() * 10 + 10,
//   }));

//   return (
//     <>
//       {spores.map((spore) => (
//         <motion.div
//           key={spore.id}
//           className="absolute rounded-full bg-white/20 blur-[1px]"
//           style={{
//             left: `${spore.x}%`,
//             top: `${spore.y}%`,
//             width: spore.size,
//             height: spore.size,
//           }}
//           animate={{
//             y: [0, -100, 0],
//             x: [0, Math.random() * 50 - 25, 0],
//             opacity: [0, 0.8, 0],
//           }}
//           transition={{
//             duration: spore.duration,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//         />
//       ))}
//     </>
//   );
// };


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