"use client";
import { motion } from "framer-motion";
import { LuxuryLogo } from "../LuxuryLogo"; // Ajusta la ruta si es necesario

// Datos de tus productos (Simulados por ahora)
const products = [
  {
    id: 1,
    name: "MELENA DE LEÓN",
    subtitle: "Enfoque Cognitivo & Memoria",
    description: "El secreto ancestral para la claridad mental. Un nootrópico natural que potencia la neurogénesis y despierta tu máximo potencial intelectual.",
    price: "$120.000",
    gradient: "from-amber-200 via-yellow-400 to-amber-600",
    benefits: ["Claridad Mental", "Memoria", "Neurogénesis"],
  },
  {
    id: 2,
    name: "ASHWAGANDHA",
    subtitle: "Poder Adaptógeno & Calma",
    description: "Domina el estrés y recupera tu vigor. La raíz de la inmortalidad que equilibra el cortisol y fortalece tu resiliencia física y mental.",
    price: "$115.000",
    gradient: "from-orange-200 via-amber-400 to-red-600",
    benefits: ["Anti-Estrés", "Vigor Físico", "Sueño Profundo"],
  },
  // Puedes agregar más aquí...
];

export const ProductCatalog = () => {
  return (
    <section className="relative bg-[#0F1115] py-20 px-4 md:px-0 overflow-hidden">
      
      {/* Título de la Sección tipo "Editorial" */}
      <div className="text-center mb-32 relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-amber-500/60 tracking-[0.5em] text-xs uppercase font-sans"
        >
          Colección 2025
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-500"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          EL PORTAFOLIO
        </motion.h2>
      </div>

      {/* Lista de Productos Estilo Revista */}
      <div className="flex flex-col gap-32 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <ProductRow key={product.id} product={product} index={index} />
        ))}
      </div>

    </section>
  );
};

// Sub-componente para cada fila de producto
const ProductRow = ({ product, index }: { product: any; index: number }) => {
  const isEven = index % 2 === 0; // Para alternar izquierda/derecha

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      
      {/* 1. IMAGEN DEL PRODUCTO (Lado Visual) */}
      <div className="w-full md:w-1/2 relative group cursor-pointer">
        {/* Marco decorativo de revista */}
        <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
        
        {/* Contenedor de la "Foto" (Placeholder Premium) */}
        <div className="relative aspect-[4/5] bg-[#15171C] overflow-hidden flex items-center justify-center border border-white/5">
          {/* Fondo Radial Brillante */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${product.gradient} blur-[80px]`}></div>
          
          {/* Silueta Abstracta del Frasco (CSS Puro) */}
          <div className="relative z-10 w-40 h-64 border border-white/20 rounded-full flex flex-col items-center justify-end p-6 backdrop-blur-sm bg-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-105">
             <div className="absolute top-0 w-24 h-6 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
             <span className="text-4xl mb-10 opacity-80">🍄</span>
             <p className="font-serif text-xs tracking-[0.3em] text-amber-100 uppercase text-center">{product.name}</p>
          </div>
        </div>
      </div>

      {/* 2. TEXTO EDITORIAL (Lado Informativo) */}
      <div className="w-full md:w-1/2 text-center md:text-left px-4">
        <div className="flex flex-col items-center md:items-start">
            <span className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4 font-sans border-b border-amber-500/30 pb-2">
              N° 0{index + 1}
            </span>
            
            <h3 className="text-4xl md:text-6xl text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {product.name}
            </h3>
            
            <p className="text-lg md:text-xl text-stone-400 italic font-serif mb-8">
              "{product.subtitle}"
            </p>
            
            <p className="text-stone-300 font-sans leading-relaxed text-sm md:text-base max-w-md mb-8 opacity-80">
              {product.description}
            </p>

            {/* Lista de Beneficios Minimalista */}
            <ul className="flex gap-4 mb-10 text-xs tracking-widest text-amber-200/60 uppercase font-sans">
                {product.benefits.map((benefit: string) => (
                    <li key={benefit} className="border border-white/10 px-3 py-1 rounded-full">{benefit}</li>
                ))}
            </ul>

            <div className="flex items-center gap-8">
                <span className="text-3xl font-serif text-white">{product.price}</span>
                <button className="px-8 py-3 bg-white text-black text-xs font-bold tracking-[0.2em] hover:bg-amber-400 transition-colors uppercase">
                    Adquirir
                </button>
            </div>
        </div>
      </div>

    </motion.div>
  );
};