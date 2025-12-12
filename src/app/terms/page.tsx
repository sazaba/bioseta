import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-stone-300 py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 mb-8 block hover:opacity-70 transition-opacity">← Volver al inicio</Link>
        
        <h1 className="text-4xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter mb-12 leading-none">
          Términos & <br />Condiciones
        </h1>

        <div className="prose prose-invert prose-stone prose-lg font-serif">
          <p className="lead text-xl text-white">Última actualización: Diciembre 2025</p>
          
          <h3>1. Introducción</h3>
          <p>Bienvenido a Bioseta. Al acceder a nuestro sitio web y adquirir nuestros productos (Melena de León, Ashwagandha, etc.), aceptas estar vinculado por estos términos de servicio, todas las leyes y regulaciones aplicables.</p>
          
          <h3>2. Uso de nuestros productos</h3>
          <p>Nuestros extractos son suplementos dietarios. No están destinados a diagnosticar, tratar, curar o prevenir ninguna enfermedad. La información proporcionada en este sitio es solo para fines informativos y no sustituye el consejo médico profesional.</p>
          
          <h3>3. Propiedad Intelectual</h3>
          <p>Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, imágenes y software, es propiedad de Bioseta Research Lab o de sus proveedores de contenido y está protegido por las leyes de derechos de autor de Colombia e internacionales.</p>
          
          {/* Agrega más contenido legal aquí según necesites */}
        </div>
      </div>
    </main>
  );
}