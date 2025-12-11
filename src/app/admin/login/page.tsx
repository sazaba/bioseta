"use client";
import { useFormState, useFormStatus } from "react-dom"; // Hook especial para Server Actions
import { motion } from "framer-motion";
import { LuxuryLogo } from "@/components/LuxuryLogo";
import { loginAction } from "@/actions/auth"; // Importamos nuestra acción

// Botón inteligente que sabe si está cargando
function SubmitButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="mt-4 w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
      ) : (
        "Ingresar"
      )}
    </button>
  );
}

export default function LoginPage() {
  // Conectamos el formulario con la Server Action
  const [state, formAction] = useFormState(loginAction, { error: "" });

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo con Ruido y Luz */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Tarjeta de Login */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative z-10"
      >
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <LuxuryLogo className="w-16 h-16 mb-6" />
          <h1 className="text-2xl font-serif text-white tracking-widest text-center">
            PANEL DE CONTROL
          </h1>
          <p className="text-stone-500 text-xs font-mono uppercase tracking-wider mt-2">
            Acceso Restringido
          </p>
        </div>

        {/* Formulario conectado a Server Action */}
        <form action={formAction} className="flex flex-col gap-6">
          
          <div className="group">
            <label className="block text-[10px] font-mono text-amber-500/80 uppercase tracking-widest mb-2 group-focus-within:text-amber-400 transition-colors">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/10 font-sans"
              placeholder="admin@bioseta.com"
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-mono text-amber-500/80 uppercase tracking-widest mb-2 group-focus-within:text-amber-400 transition-colors">
              Contraseña
            </label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/10 font-sans"
              placeholder="••••••••"
            />
          </div>

          {/* Mensaje de Error del Servidor */}
          {state?.error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-400 text-xs text-center font-sans bg-red-500/10 py-2 rounded border border-red-500/20"
            >
              ⚠️ {state.error}
            </motion.p>
          )}

          <SubmitButton />

        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-[9px] text-stone-600 font-mono uppercase tracking-widest">
            Bioseta Secure System v1.0
          </p>
        </div>

      </motion.div>
    </main>
  );
}