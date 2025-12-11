"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct, deleteProduct, toggleProductStatus } from "@/actions/products";
import { CldUploadWidget } from "next-cloudinary";

interface Product {
  id: number;
  name: string;
  price: any;
  category: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
}

export const ProductManager = ({ products }: { products: Product[] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Estado de carga al guardar

  // --- HANDLERS CON CONFIRMACIÓN ---
  const handleDelete = async (id: number) => {
    if (window.confirm("¿ESTÁS SEGURO? \n\nEsta acción eliminará el producto permanentemente de la base de datos.")) {
      await deleteProduct(id);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    // Para el toggle suele ser mejor ser rápido, pero si quieres confirmar:
    // if (!confirm("¿Cambiar estado del producto?")) return;
    await toggleProductStatus(id, currentStatus);
  };

  const handleSave = async (formData: FormData) => {
    // Validación manual de imagen
    if (!imageUrl) {
        alert("Por favor sube una imagen primero.");
        return;
    }

    if (window.confirm("¿CONFIRMAR CREACIÓN? \n\nEl producto se publicará inmediatamente.")) {
      setIsSaving(true);
      await createProduct(formData);
      setIsSaving(false);
      setIsFormOpen(false);
      setImageUrl(""); // Limpiar
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 md:mt-12 px-4 md:px-0">
      
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl text-white font-sans font-black tracking-tighter uppercase">
            Inventario
          </h2>
          <p className="text-amber-500 text-[10px] md:text-xs font-mono tracking-[0.2em] mt-1 uppercase">
            Gestión de Activos Biológicos
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full md:w-auto bg-white text-black hover:bg-amber-400 px-6 py-4 rounded-sm font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
        >
          <PlusIcon /> Nuevo Producto
        </button>
      </div>

      {/* --- LISTA DE PRODUCTOS --- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
        
        {/* CABECERA (SOLO VISIBLE EN DESKTOP) */}
        <div className="hidden md:grid grid-cols-12 bg-white/[0.02] p-5 text-[10px] font-mono text-stone-500 uppercase tracking-widest border-b border-white/10">
          <div className="col-span-1 text-center">ID</div>
          <div className="col-span-1">Visual</div>
          <div className="col-span-4">Producto</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-2 text-center">Controles</div>
        </div>

        {/* CONTENIDO */}
        <div className="divide-y divide-white/5">
          {products.length === 0 ? (
            <div className="p-12 text-center text-stone-600 font-serif italic">
              El inventario está vacío. Inicia la alquimia.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="group transition-colors hover:bg-white/[0.02]">
                
                {/* --- VERSION DESKTOP (Tabla) --- */}
                <div className="hidden md:grid grid-cols-12 items-center p-4 text-sm">
                  <div className="col-span-1 text-center text-stone-700 font-mono text-xs">
                    #{product.id}
                  </div>
                  
                  <div className="col-span-1">
                     <div className="w-12 h-12 rounded bg-white/5 overflow-hidden border border-white/10 relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                     </div>
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                    <div>
                        <span className="block font-sans font-black text-white uppercase tracking-tight text-lg leading-none">
                            {product.name}
                        </span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${product.isActive ? 'text-green-500/50' : 'text-red-500/50'}`}>
                            {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-stone-300 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-right font-mono text-amber-500">
                    ${Number(product.price).toLocaleString()}
                  </div>
                  
                  <div className="col-span-2 flex justify-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleToggle(product.id, product.isActive)} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title={product.isActive ? "Desactivar" : "Activar"}
                    >
                      {product.isActive ? <EyeIcon className="text-white" /> : <EyeSlashIcon className="text-stone-500" />}
                    </button>
                    <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-2 hover:bg-red-500/10 rounded-full transition-colors group/delete"
                        title="Eliminar permanentemente"
                    >
                      <TrashIcon className="text-stone-500 group-hover/delete:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* --- VERSION MÓVIL (Tarjetas) --- */}
                <div className="md:hidden flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-[10px] font-mono text-stone-500 uppercase">
                                    {product.category}
                                </span>
                            </div>
                            <h3 className="font-sans font-black text-white text-lg uppercase tracking-tight leading-none mb-1">
                                {product.name}
                            </h3>
                            <p className="text-amber-500 font-mono text-xs">
                                ${Number(product.price).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => handleToggle(product.id, product.isActive)}
                            className="p-2 bg-white/5 border border-white/10 rounded active:scale-95 transition-transform"
                        >
                            {product.isActive ? <EyeIcon className="w-4 h-4 text-white" /> : <EyeSlashIcon className="w-4 h-4 text-stone-500" />}
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 rounded active:scale-95 transition-transform"
                        >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* FORMULARIO MODAL (SLIDE OVER) */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0F1115] border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header Panel */}
              <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0F1115]/95 backdrop-blur z-10">
                <div>
                    <h3 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Alta de Producto</h3>
                    <p className="text-stone-500 text-[10px] font-mono tracking-widest mt-1">NUEVO ITEM</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-stone-500 hover:text-white transition-colors p-2">✕</button>
              </div>

              {/* Form Body */}
              <form action={handleSave} className="flex-1 p-8 flex flex-col gap-8">
                
                {/* UPLOADER */}
                <div className="space-y-3">
                   <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Fotografía (Requerido)</label>
                   <input type="hidden" name="imageUrl" value={imageUrl} required />
                   <CldUploadWidget 
                      uploadPreset="bioseta_preset"
                      onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                   >
                      {({ open }) => (
                          <div 
                            onClick={() => open()}
                            className="w-full h-48 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group relative overflow-hidden"
                          >
                             {imageUrl ? (
                               <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <div className="text-center group-hover:scale-105 transition-transform">
                                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10 group-hover:border-amber-500/30">
                                    <CameraIcon />
                                  </div>
                                  <span className="text-xs text-stone-400 uppercase tracking-widest group-hover:text-amber-500">Subir Imagen</span>
                               </div>
                             )}
                          </div>
                      )}
                   </CldUploadWidget>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Nombre Principal</label>
                        <input name="name" required placeholder="Ej: MELENA DE LEÓN" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm font-sans font-bold tracking-wide transition-colors" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Subtítulo (Efecto)</label>
                        <input name="subtitle" placeholder="Ej: Claridad & Memoria" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Categoría</label>
                            <div className="relative">
                                <select name="category" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm appearance-none cursor-pointer">
                                <option className="bg-black" value="mente">Mente</option>
                                <option className="bg-black" value="calma">Calma</option>
                                <option className="bg-black" value="energia">Energía</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">▼</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Precio</label>
                            <input name="price" type="number" required placeholder="0" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm font-mono" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Stock</label>
                            <input name="stock" type="number" defaultValue="100" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Tags (Separa con comas)</label>
                            <input name="benefits" placeholder="Focus, Memoria" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Descripción Editorial</label>
                        <textarea name="description" rows={5} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm leading-relaxed" placeholder="Escribe la descripción premium..."></textarea>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[#0F1115] pb-4">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] py-5 hover:bg-amber-400 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                Guardando...
                            </>
                        ) : "Publicar Producto"}
                    </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ICONOS SVG PREMIUM (Componentes internos) ---
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M12 5V19M5 12H19" strokeLinecap="square" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6M10 11V17M14 11V17" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 12S5 4 12 4S22 12 22 12S19 20 12 20S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2.24 2.24l19.52 19.52M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-500">
    <path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);