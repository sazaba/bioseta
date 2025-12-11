import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-950 p-6">
      
      {/* Navbar simulado */}
      <nav className="fixed top-0 w-full flex justify-between items-center p-6 backdrop-blur-sm z-50">
        <Logo />
        <button className="text-sm font-medium text-stone-300 border border-stone-700 px-4 py-2 rounded-full hover:bg-stone-800 transition">
          Menú
        </button>
      </nav>

      {/* Contenido Hero Temporal */}
      <div className="text-center mt-20">
        <h1 className="font-serif text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-700 mb-6">
          Naturaleza <br />
          <span className="italic font-light text-white">Ancestral.</span>
        </h1>
        <p className="text-stone-400 max-w-xs mx-auto mb-8">
          Suplementos adaptógenos de alta potencia para el humano moderno.
        </p>
      </div>

    </main>
  );
}