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



// "use client";
// import { useState, useMemo, useEffect, useRef, memo } from "react";
// import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

// // --- CONFIGURACIÓN ---
// const WHATSAPP_LINK = "https://wa.link/gas7d2";

// const CATEGORIES = [
//   { id: "all", label: "TODO" },
//   { id: "mente", label: "MENTE" },
//   { id: "calma", label: "CALMA" },
//   { id: "energia", label: "ENERGÍA" },
//   { id: "cuerpo", label: "CUERPO" },
//   { id: "inmunidad", label: "INMUNIDAD" },
// ];

// const getAccentColor = (category: string) => {
//   switch (category?.toLowerCase()) {
//     case "mente": return "#fbbf24"; 
//     case "calma": return "#f87171"; 
//     case "energia": return "#f97316"; 
//     case "cuerpo": return "#8b5cf6"; 
//     case "inmunidad": return "#10b981"; 
//     default: return "#ffffff";
//   }
// };

// // --- TEXTURA STATIC OPTIMIZADA (Base64) ---
// const StaticNoise = memo(() => (
//   <div 
//     className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
//     style={{
//       backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
//       backgroundSize: '100px 100px'
//     }}
//   />
// ));
// StaticNoise.displayName = "StaticNoise";

// export const ProductCatalog = ({ products }: { products: any[] }) => {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     if (selectedProduct) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "unset";
//   }, [selectedProduct]);

//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start 0.8", "end start"],
//   });

//   useMotionValueEvent(scrollYProgress, "change", (latest) => {
//     const shouldShow = latest > 0 && latest < 1;
//     if (shouldShow !== showFilters) setShowFilters(shouldShow);
//   });

//   const filteredProducts = useMemo(() => {
//     return products.filter((p) =>
//       activeCategory === "all" ? true : p.category === activeCategory
//     );
//   }, [products, activeCategory]);

//   return (
//     <section ref={sectionRef} className="bg-[#020202] relative min-h-screen pb-20">
      
//       {/* FONDO AMBIENTAL */}
//       <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black via-[#050505] to-transparent z-0 pointer-events-none" />
//       <StaticNoise />

//       {/* --- HEADER DE SECCIÓN + FILTROS --- */}
//       <div className="relative z-20 pt-20 md:pt-32 pb-4 px-4 md:px-12 max-w-[1800px] mx-auto">
//         <div className="mb-6 md:mb-10">
//             <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.4em] block mb-2">
//                 Bioseta Lab Series
//             </span>
//             <h2 className="text-3xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter">
//                 Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">2025</span>
//             </h2>
//         </div>

//         {/* BARRA DE FILTROS */}
//         <div className="sticky top-20 z-30 py-2 -mx-4 px-4 md:mx-0 md:px-0 bg-[#020202]/95 border-b border-white/5 md:border-none md:bg-transparent transition-all">
//           <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar items-center pb-2">
//             {CATEGORIES.map((cat) => {
//                 const isActive = activeCategory === cat.id;
//                 const catColor = cat.id === 'all' ? '#ffffff' : getAccentColor(cat.id);
//                 return (
//                   <button
//                     key={cat.id}
//                     onClick={() => setActiveCategory(cat.id)}
//                     className="relative group px-4 py-1.5 md:px-5 md:py-2 rounded-sm transition-all duration-300 overflow-hidden flex-shrink-0"
//                   >
//                     <div 
//                         className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`}
//                         style={{ backgroundColor: catColor }}
//                     />
//                     <div 
//                         className={`absolute inset-0 border transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}
//                         style={{ borderColor: catColor, boxShadow: isActive ? `0 0 10px ${catColor}40` : 'none' }}
//                     />
//                     <span 
//                         className={`relative z-10 text-[9px] md:text-xs font-mono font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
//                             isActive ? 'text-black mix-blend-hard-light' : 'text-white'
//                         }`}
//                     >
//                       {cat.label}
//                     </span>
//                   </button>
//                 );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* --- GRID DE PRODUCTOS --- */}
//       <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />

//       {/* --- MODAL DE PRODUCTO --- */}
//       <AnimatePresence>
//         {selectedProduct && (
//           <ProductModal 
//             product={selectedProduct} 
//             onClose={() => setSelectedProduct(null)} 
//           />
//         )}
//       </AnimatePresence>

//     </section>
//   );
// };

// // --- COMPONENTE GRID MEMOIZADO ---
// const ProductGrid = memo(({ products, onSelect }: { products: any[], onSelect: (p: any) => void }) => {
//     return (
//       <div className="relative z-10 px-3 md:px-12 max-w-[1800px] mx-auto min-h-[50vh]">
//         <motion.div 
//             layout 
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 items-stretch"
//         >
//           <AnimatePresence mode="popLayout">
//             {products.length > 0 ? (
//               products.map((product, index) => (
//                 <GridCard
//                   key={product.id || index}
//                   product={product}
//                   index={index}
//                   onOpen={() => onSelect(product)}
//                 />
//               ))
//             ) : (
//               <motion.div 
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="col-span-full py-20 flex flex-col items-center justify-center text-white/30 font-mono text-xs uppercase gap-4"
//               >
//                 <span>Sin especímenes en esta categoría</span>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     );
// });
// ProductGrid.displayName = "ProductGrid";

// // --- CARTA GRID (OPTIMIZADA PARA PROPORCIÓN PERFECTA) ---
// const GridCard = memo(({ product, index, onOpen }: { product: any; index: number, onOpen: () => void }) => {
//   const accentColor = getAccentColor(product.category);

//   return (
//     <motion.div
//       layout
//       onClick={onOpen}
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ duration: 0.3 }}
//       // CAMBIO: Quitamos min-h fija. Usamos h-full para que todas las cartas en una fila tengan la misma altura.
//       className="group relative w-full h-full cursor-pointer rounded-sm bg-[#080808] border border-white/10 hover:border-white/30 transition-colors duration-500 flex flex-col justify-between overflow-hidden"
//     >
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
//         style={{ background: `radial-gradient(circle at 50% 40%, ${accentColor} 0%, transparent 60%)` }} />
//       <StaticNoise />

//       {/* HEADER CARD */}
//       <div className="relative z-10 flex justify-between items-start p-3 shrink-0">
//         <span className="text-[9px] md:text-[10px] font-mono text-white/30">0{index + 1}</span>
//         <span className="text-[8px] md:text-[9px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 border rounded-[2px]"
//             style={{ color: accentColor, borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }}>
//             {product.category}
//         </span>
//       </div>

//       {/* IMAGEN: CONTENEDOR CUADRADO PERFECTO */}
//       {/* CAMBIO CLAVE: 'aspect-square' fuerza a que sea siempre 1:1. 
//           Usamos padding (p-6) para dar aire.
//           La imagen tiene 'object-contain' para no cortarse nunca. */}
//       <div className="relative z-10 w-full aspect-square p-6 flex items-center justify-center overflow-hidden">
//          <span className="absolute text-[20vw] font-black text-transparent opacity-5 pointer-events-none select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//             style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}>{product.name?.charAt(0)}</span>
        
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] pointer-events-none opacity-30">
//             <div className="absolute inset-0 border border-white/10 rounded-full" style={{ borderTopColor: `${accentColor}60` }} />
//         </div>
        
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <motion.img 
//             whileHover={{ scale: 1.1, y: -5 }} 
//             transition={{ type: "spring", stiffness: 200, damping: 20 }}
//             src={product.imageUrl} 
//             alt={product.name}
//             loading="lazy"
//             // CAMBIO: La imagen llena el contenedor cuadrado con object-contain
//             className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] z-10 relative" 
//         />
//       </div>

//       {/* FOOTER CARD */}
//       <div className="relative z-10 mt-auto bg-black/40 p-3 border-t border-white/5">
//         <div className="mb-3">
//             <h3 className="text-sm md:text-base font-sans font-black text-white leading-tight uppercase tracking-tighter line-clamp-1">{product.name}</h3>
//             <p className="text-[10px] text-stone-500 font-mono mt-1 line-clamp-1">{product.subtitle}</p>
//         </div>
//         <div className="flex items-center justify-between gap-1">
//             <div className="flex flex-col">
//                 <span className="text-[8px] text-white/30 uppercase tracking-widest">COP</span>
//                 <span className="text-xs md:text-sm font-bold text-white tracking-tight">${Number(product.price).toLocaleString()}</span>
//             </div>
            
//             <button 
//                 onClick={(e) => { e.stopPropagation(); onOpen(); }}
//                 className="w-7 h-7 md:w-9 md:h-9 rounded-full text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] shrink-0"
//                 style={{ backgroundColor: accentColor }}
//             >
//                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
//                 </svg>
//             </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// });
// GridCard.displayName = "GridCard";

// // --- MODAL DE PRODUCTO ---
// const ProductModal = ({ product, onClose }: { product: any; onClose: () => void }) => {
//   const accentColor = getAccentColor(product.category);

//   const handleWhatsApp = () => {
//     window.open(WHATSAPP_LINK, "_blank");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0 will-change-[opacity]"
//     >
//       <div className="absolute inset-0 bg-[#000000]/95" onClick={onClose} />
      
//       <motion.div
//         initial={{ scale: 0.95, y: 20, opacity: 0 }}
//         animate={{ scale: 1, y: 0, opacity: 1 }}
//         exit={{ scale: 0.95, y: 20, opacity: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] shadow-2xl"
//       >
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//         </button>

//         {/* COLUMNA IZQUIERDA: IMAGEN EN MODAL */}
//         <div className="w-full md:w-1/2 bg-[#050505] relative flex items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
//            <div className="absolute inset-0 opacity-20 pointer-events-none" 
//                 style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)` }} />
           
//            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
//               <div className="w-[80%] aspect-square border border-white/10 rounded-full" />
//            </div>
           
//            {/* eslint-disable-next-line @next/next/no-img-element */}
//            <motion.img 
//              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
//              src={product.imageUrl} alt={product.name}
//              // CAMBIO: Ajuste de max-height para responsive perfecto
//              className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] relative z-10 max-h-[250px] md:max-h-[400px]"
//            />
//         </div>

//         {/* COLUMNA DERECHA */}
//         <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto no-scrollbar relative">
           
//            <div className="flex items-center gap-3 mb-2">
//               <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded border"
//                   style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }}>
//                   {product.category}
//               </span>
//               <span className="text-[10px] text-white/30 font-mono">STOCK DISPONIBLE</span>
//            </div>

//            <h2 className="text-3xl md:text-5xl font-sans font-black text-white uppercase leading-none tracking-tighter mb-2">
//               {product.name}
//            </h2>
//            <p className="text-lg text-stone-400 font-serif italic mb-6">{product.subtitle}</p>

//            <div className="prose prose-invert prose-sm mb-8">
//               <p className="text-stone-300 leading-relaxed text-sm md:text-base">
//                 {product.description}
//               </p>
//            </div>

//            {product.benefits && (
//              <div className="flex flex-wrap gap-2 mb-8">
//                {product.benefits.map((benefit: string, i: number) => (
//                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-white/60 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
//                    {benefit}
//                  </span>
//                ))}
//              </div>
//            )}

//            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
//               <div className="flex justify-between items-end">
//                   <span className="text-xs text-stone-500 uppercase tracking-widest">Precio Final</span>
//                   <span className="text-3xl font-black text-white tracking-tighter">${Number(product.price).toLocaleString()}</span>
//               </div>

//               <button 
//                 onClick={handleWhatsApp}
//                 className="w-full py-4 rounded-sm font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg text-black"
//                 style={{ backgroundColor: accentColor }}
//               >
//                 <span>Comprar en WhatsApp</span>
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
//               </button>
              
//               <p className="text-center text-[9px] text-stone-600 font-mono">
//                 Envío calculado al confirmar la dirección en WhatsApp.
//               </p>
//            </div>

//         </div>

//       </motion.div>
//     </motion.div>
//   );
// };