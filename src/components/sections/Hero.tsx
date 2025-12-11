import { LuxuryLogo } from "@/components/LuxuryLogo"; // Ajusta la ruta si es necesario

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] md:min-h-[90vh] text-center px-4 pt-24 md:pt-20">
      
      {/* LOGO: 
         - w-64 h-64: Mucho más grande en móvil (antes era w-48).
         - mt-0: Quitamos el margen superior para subirlo visualmente.
      */}
      <div className="mb-6 md:mb-8 mt-0 md:mt-10">
        <LuxuryLogo className="w-64 h-64 md:w-72 md:h-72" />
      </div>

      {/* Títulos: text-4xl en móvil para que quepa bien en una o dos líneas sin romper */}
      <h1 className="font-serif text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600/80 mb-4 md:mb-6 drop-shadow-lg leading-tight">
        Alquimia Natural
      </h1>
      
      <p className="font-sans text-amber-100/60 text-xs md:text-base tracking-[0.3em] uppercase max-w-xs md:max-w-lg mx-auto leading-relaxed">
        Suplementos de hongos funcionales para elevar la consciencia y el rendimiento humano.
      </p>

      {/* Indicador de Scroll más sutil */}
      <div className="absolute bottom-8 md:bottom-10 animate-bounce text-amber-500/30">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
};