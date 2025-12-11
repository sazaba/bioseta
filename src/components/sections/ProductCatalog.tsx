"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. DATA ENRIQUECIDA CON CATEGORÍAS
// Categorías: 'mente', 'calma', 'energia', 'inmunidad'
const products = [
  {
    id: 1,
    category: "mente",
    name: "MELENA DE LEÓN",
    subtitle: "Enfoque Cognitivo & Memoria",
    description: "El secreto ancestral para la claridad mental. Un nootrópico natural que potencia la neurogénesis y despierta tu máximo potencial intelectual.",
    price: "$120.000",
    gradient: "from-amber-200 via-yellow-400 to-amber-600",
    benefits: ["Claridad Mental", "Memoria", "Neurogénesis"],
  },
  {
    id: 2,
    category: "calma",
    name: "ASHWAGANDHA",
    subtitle: "Poder Adaptógeno & Calma",
    description: "Domina el estrés y recupera tu vigor. La raíz de la inmortalidad que equilibra el cortisol y fortalece tu resiliencia física y mental.",
    price: "$115.000",
    gradient: "from-orange-200 via-amber-400 to-red-600",
    benefits: ["Anti-Estrés", "Vigor Físico", "Sueño Profundo"],
  },
  {
    id: 3,
    category: "energia",
    name: "CORDYCEPS MILITARIS",
    subtitle: "Energía ATP & Rendimiento",
    description: "El combustible biológico de los atletas de élite. Aumenta la producción de oxígeno y ATP para una resistencia inagotable.",
    price: "$130.000",
    gradient: "from-orange-400 via-red-500 to-rose-700",
    benefits: ["Energía Física", "Libido", "Oxigenación"],
  },
  {
    id: 4,
    category: "calma",
    name: "REISHI",
    subtitle: "El Hongo de la Inmortalidad",
    description: "Calma el espíritu y nutre el cuerpo. Un potente modulador del sistema inmune que promueve la longevidad y la paz interior.",
    price: "$125.000",
    gradient: "from-red-800 via-red-600 to-amber-900",
    benefits: ["Relajación", "Sueño Reparador", "Longevidad"],
  },
  {
    id: 5,
    category: "mente",
    name: "FOCUS BLEND",
    subtitle: "Sinergia Cognitiva",
    description: "Mezcla exclusiva de Melena de León y Cordyceps para mantener la mente aguda y el cuerpo activo durante largas jornadas.",
    price: "$145.000",
    gradient: "from-blue-200 via-indigo-400 to-purple-600", // Un tono diferente para blends
    benefits: ["Productividad", "Sin Cafeína", "Flow State"],
  },
];

// Definición de las categorías para el menú
const CATEGORIES = [
  { id: "all", label: "TODO EL PORTAFOLIO" },
  { id: "mente", label: "MENTE & ENFOQUE" },
  { id: "calma", label: "CALMA & ESTRÉS" },
  { id: "energia", label: "ENERGÍA & VIGOR" },
];

const ITEMS_PER_PAGE = 3; // Cuántos productos ver por página

export const ProductCatalog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. FILTRADO
  const filteredProducts = products.filter((product) => 
    activeCategory === "all" ? true : product.category === activeCategory
  );

  // 2. PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Función para cambiar categoría (resetea la página a 1)
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  return (
    <section className="relative bg-[#0F1115] py-20 px-4 md:px-0 overflow-hidden min-h-screen">
      
      {/* Título */}
      <div className="text-center mb-16 relative z-10">
        <span className="text-amber-500/60 tracking-[0.5em] text-[10px] md:text-xs uppercase font-sans">
          Colección 2025
        </span>
        <h2 
          className="mt-4 text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-500"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          EL PORTAFOLIO
        </h2>
      </div>

      {/* --- BARRA DE FILTROS (Premium Tabs) --- */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20 max-w-4xl mx-auto px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`text-[10px] md:text-xs tracking-[0.2em] uppercase pb-2 transition-all duration-300 border-b border-transparent ${
              activeCategory === cat.id 
                ? "text-amber-400 border-amber-400" 
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* --- LISTA DE PRODUCTOS (Con AnimatePresence para transiciones) --- */}
      <div className="flex flex-col gap-20 md:gap-32 max-w-7xl mx-auto min-h-[600px]">
        <AnimatePresence mode="wait">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product, index) => (
              <ProductRow key={product.id} product={product} index={index} />
            ))
          ) : (
            // Mensaje si no hay productos en esa categoría
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-stone-600 font-serif italic py-20"
            >
              Próximamente más productos en esta colección.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 mt-24 mb-10">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-xs font-sans tracking-[0.2em] uppercase text-stone-500 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
          >
            Anterior
          </button>

          <span className="font-serif text-amber-500 text-lg">
            {currentPage} <span className="text-stone-600 text-sm mx-2">/</span> {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-xs font-sans tracking-[0.2em] uppercase text-stone-500 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

    </section>
  );
};

// Sub-componente (Igual que antes, solo agregué motion para la entrada suave)
const ProductRow = ({ product, index }: { product: any; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col md:flex-row items-center justify-between gap-10 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      {/* 1. IMAGEN */}
      <div className="w-full md:w-1/2 relative group cursor-pointer px-4 md:px-0">
        <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 hidden md:block"></div>
        <div className="relative aspect-[4/5] bg-[#15171C] overflow-hidden flex items-center justify-center border border-white/5 rounded-sm md:rounded-none">
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${product.gradient} blur-[80px]`}></div>
          <div className="relative z-10 w-32 h-52 md:w-40 md:h-64 border border-white/20 rounded-full flex flex-col items-center justify-end p-6 backdrop-blur-sm bg-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-105">
             <div className="absolute top-0 w-20 md:w-24 h-6 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
             <span className="text-4xl mb-8 opacity-80">🍄</span>
             <p className="font-serif text-[10px] tracking-[0.3em] text-amber-100 uppercase text-center">{product.name}</p>
          </div>
        </div>
      </div>

      {/* 2. TEXTO */}
      <div className="w-full md:w-1/2 text-center md:text-left px-4">
        <div className="flex flex-col items-center md:items-start">
            <span className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4 font-sans border-b border-amber-500/30 pb-2">
              N° 0{product.id}
            </span>
            <h3 className="text-3xl md:text-6xl text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {product.name}
            </h3>
            <p className="text-lg md:text-xl text-stone-400 italic font-serif mb-6 md:mb-8">
              "{product.subtitle}"
            </p>
            <p className="text-stone-300 font-sans leading-relaxed text-sm md:text-base max-w-md mb-8 opacity-80">
              {product.description}
            </p>
            <ul className="flex flex-wrap justify-center md:justify-start gap-3 mb-10 text-[10px] md:text-xs tracking-widest text-amber-200/60 uppercase font-sans">
                {product.benefits.map((benefit: string) => (
                    <li key={benefit} className="border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">{benefit}</li>
                ))}
            </ul>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
                <span className="text-3xl font-serif text-white">{product.price}</span>
                <button className="w-full md:w-auto px-8 py-4 md:py-3 bg-white text-black text-xs font-bold tracking-[0.2em] hover:bg-amber-400 transition-colors uppercase rounded-sm">
                    Adquirir
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};