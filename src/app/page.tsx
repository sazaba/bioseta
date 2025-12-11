import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    // Usamos un fondo negro absoluto para mayor contraste premium
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-6 overflow-hidden relative">
      
      {/* Efecto de luz de fondo sutil (Opcional) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center p-8 z-50">
        <Logo />
        {/* Botón de menú más elegante */}
        <button className="group relative px-6 py-2 overflow-hidden rounded-full">
          <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-amber-200/20 to-amber-600/20 group-hover:opacity-100 rounded-full"></span>
          <span className="relative text-sm font-medium tracking-widest text-amber-100/80 group-hover:text-amber-50 transition-colors uppercase font-sans">Menú</span>
        </button>
      </nav>

      {/* Contenido Hero */}
      <div className="text-center mt-20 relative z-10">
        {/* Título con la nueva fuente Cormorant */}
        <h1 className="font-serif text-6xl md:text-8xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-50 to-amber-400/80 mb-8">
          Naturaleza <br />
          <span className="italic text-amber-100">Ancestral.</span>
        </h1>
        {/* Subtítulo con la nueva fuente Montserrat */}
        <p className="font-sans text-amber-100/60 text-lg max-w-md mx-auto mb-12 leading-relaxed tracking-wide">
          Suplementos adaptógenos de alta potencia para el humano moderno. Ciencia y pureza en cada dosis.
        </p>
      </div>

    </main>
  );
}