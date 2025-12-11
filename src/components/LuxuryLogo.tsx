"use client";
import { motion } from "framer-motion";

export const LuxuryLogo = ({ className = "w-64 h-64" }: { className?: string }) => {
  return (
    <div className={`${className} relative select-none`}>
      <motion.svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(191,149,63,0.3)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <defs>
          {/* Gradiente Oro Premium */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
        </defs>

        {/* Grupo Principal */}
        <g transform="translate(200, 180) scale(1.1)">
          {/* 1. MELENA DE LEÓN */}
          <g transform="translate(-60, -90)">
            <path
              d="M60 10 C 90 10, 110 30, 115 50 C 130 55, 135 80, 125 100 C 120 120, 100 130, 90 150 C 80 170, 70 165, 60 180 C 50 165, 40 170, 30 150 C 20 130, 0 120, -5 100 C -15 80, -10 55, 5 50 C 10 30, 30 10, 60 10 Z"
              stroke="url(#goldGradient)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Textura interna */}
            <path d="M60 20 C 60 40, 60 120, 60 170" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M40 25 C 35 50, 30 110, 35 150" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M80 25 C 85 50, 90 110, 85 150" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M20 60 C 15 80, 10 110, 15 130" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
            <path d="M100 60 C 105 80, 110 110, 105 130" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
          </g>

          {/* 2. ASHWAGANDHA */}
          <g transform="translate(-60, -90)">
            <path d="M40 175 C 20 180, -20 160, -30 120" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M-30 120 Q -45 110, -35 100 Q -25 110, -30 120" stroke="url(#goldGradient)" strokeWidth="0.8" fill="none" />
            <path d="M-25 135 Q -40 135, -35 145" stroke="url(#goldGradient)" strokeWidth="0.8" fill="none" />
            <circle cx="-32" cy="120" r="3" stroke="url(#goldGradient)" strokeWidth="1" fill="none" />
            <circle cx="-25" cy="130" r="2.5" stroke="url(#goldGradient)" strokeWidth="1" fill="none" />
            
            <path d="M80 175 C 100 180, 140 160, 150 120" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="152" cy="120" r="3" stroke="url(#goldGradient)" strokeWidth="1" fill="none" />
          </g>
        </g>

        {/* 3. TIPOGRAFÍA - Usando la variable CSS de Cinzel */}
        <text
          x="200"
          y="330"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-cinzel)" }} // Aquí aplicamos la fuente
          fontSize="62"
          letterSpacing="12"
          fill="url(#goldGradient)"
          fontWeight="500"
        >
          BIOSETA
        </text>

        {/* Línea decorativa */}
        <line x1="160" y1="355" x2="240" y2="355" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.7" strokeLinecap="square" />
      </motion.svg>
    </div>
  );
};