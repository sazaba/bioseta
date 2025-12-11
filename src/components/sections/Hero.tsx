import { LuxuryLogo } from "@/components/LuxuryLogo";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-20">
      
      {/* Logo Mediano Central (Elemento visual principal) */}
      <div className="mb-8 mt-10">
        <LuxuryLogo className="w-48 h-48 md:w-72 md:h-72" />
      </div>

      {/* Títulos */}
      <h1 className="font-serif text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600/80 mb-6 drop-shadow-lg">
        Alquimia Natural
      </h1>
      
      <p className="font-sans text-amber-100/60 text-sm md:text-base tracking-[0.3em] uppercase max-w-lg mx-auto leading-relaxed">
        Suplementos de hongos funcionales para elevar la consciencia y el rendimiento humano.
      </p>

      {/* Indicador de Scroll hacia abajo */}
      <div className="absolute bottom-10 animate-bounce text-amber-500/50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
};