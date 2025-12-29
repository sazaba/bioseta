"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct, deleteProduct, toggleProductStatus, updateProduct } from "@/actions/products";
import { CldUploadWidget } from "next-cloudinary";

// Iconos Premium
import { LuPlus, LuTrash2, LuPencil, LuEye, LuEyeOff, LuImagePlus, LuX } from "react-icons/lu";

// Sweet Alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Configuración visual de la Alerta Premium
const alertConfig = {
  background: '#0a0a0a',
  color: '#ffffff',
  confirmButtonColor: '#d97706', // Amber-600
  cancelButtonColor: '#262626',  // Neutral-800
  customClass: {
    popup: 'border border-white/10 rounded-none shadow-2xl',
    title: 'font-serif tracking-widest uppercase text-amber-500',
    htmlContainer: 'font-sans text-sm text-stone-400',
    confirmButton: 'rounded-none font-bold tracking-widest uppercase px-6 py-3',
    cancelButton: 'rounded-none font-bold tracking-widest uppercase px-6 py-3 text-stone-400'
  }
};

interface Product {
  id: number;
  name: string;
  price: any;
  category: string;
  subtitle?: string | null;
  description: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  benefits?: any;
}

export const ProductManager = ({ products }: { products: Product[] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Estado para saber si editamos
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- ABRIR FORMULARIO (CREAR O EDITAR) ---
  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setImageUrl(product.imageUrl);
    } else {
      setEditingProduct(null);
      setImageUrl("");
    }
    setIsFormOpen(true);
  };

  // --- BORRAR ---
  const handleDelete = async (id: number) => {
    MySwal.fire({
      ...alertConfig,
      title: '¿ELIMINAR?',
      text: "Esta acción borrará el producto de la base de datos permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SÍ, BORRAR',
      cancelButtonText: 'CANCELAR'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct(id);
        MySwal.fire({ ...alertConfig, title: 'ELIMINADO', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  };

  // --- TOGGLE ESTADO ---
  const handleToggle = async (id: number, currentStatus: boolean) => {
    await toggleProductStatus(id, currentStatus);
  };

  // --- GUARDAR (CREAR O EDITAR) ---
  const handleSave = async (formData: FormData) => {
    if (!imageUrl) {
        MySwal.fire({ ...alertConfig, title: 'FALTA IMAGEN', text: 'Por favor sube una fotografía.', icon: 'error' });
        return;
    }

    const actionText = editingProduct ? "¿GUARDAR CAMBIOS?" : "¿CREAR PRODUCTO?";

    MySwal.fire({
      ...alertConfig,
      title: actionText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSaving(true);
        
        if (editingProduct) {
          await updateProduct(editingProduct.id, formData);
        } else {
          await createProduct(formData);
        }

        setIsSaving(false);
        setIsFormOpen(false);
        setImageUrl("");
        setEditingProduct(null);
        
        MySwal.fire({ ...alertConfig, title: 'ÉXITO', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 md:mt-12 px-4 md:px-0 pb-20">
      
      {/* HEADER */}
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
          onClick={() => handleOpenForm()}
          className="w-full md:w-auto bg-white text-black hover:bg-amber-400 px-6 py-4 rounded-sm font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
        >
          <LuPlus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* --- LISTA DE PRODUCTOS --- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
        
        {/* CABECERA (SOLO DESKTOP) */}
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
                
                {/* --- MODO DESKTOP (TABLA) --- */}
                <div className="hidden md:grid grid-cols-12 items-center p-4 text-sm">
                  <div className="col-span-1 text-center text-stone-700 font-mono text-xs">#{product.id}</div>
                  <div className="col-span-1">
                     <div className="w-12 h-12 rounded bg-white/5 overflow-hidden border border-white/10 relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                    <div>
                        <span className="block font-sans font-black text-white uppercase tracking-tight text-lg leading-none">{product.name}</span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${product.isActive ? 'text-green-500/50' : 'text-red-500/50'}`}>
                            {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-stone-300 uppercase tracking-wider">{product.category}</span>
                  </div>
                  <div className="col-span-2 text-right font-mono text-amber-500">
                    ${Number(product.price).toLocaleString()}
                  </div>
                  <div className="col-span-2 flex justify-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleToggle(product.id, product.isActive)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white">
                      {product.isActive ? <LuEye size={18} /> : <LuEyeOff size={18} />}
                    </button>
                    <button onClick={() => handleOpenForm(product)} className="p-2 hover:bg-amber-500/10 rounded-full transition-colors text-stone-400 hover:text-amber-500">
                      <LuPencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-stone-400 hover:text-red-500">
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* --- MODO MÓVIL (TARJETAS) --- */}
                <div className="md:hidden flex flex-col p-5 gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-[10px] font-mono text-stone-500 uppercase">{product.category}</span>
                                    </div>
                                    <h3 className="font-sans font-black text-white text-xl uppercase tracking-tighter leading-none mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-amber-500 font-mono text-sm">
                                        ${Number(product.price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botones Móvil (Anchos y fáciles de tocar) */}
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleToggle(product.id, product.isActive)} className="py-2 flex justify-center items-center bg-white/5 border border-white/10 rounded text-stone-400">
                            {product.isActive ? <LuEye size={20} /> : <LuEyeOff size={20} />}
                        </button>
                        <button onClick={() => handleOpenForm(product)} className="py-2 flex justify-center items-center bg-amber-500/10 border border-amber-500/20 rounded text-amber-500">
                            <LuPencil size={20} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="py-2 flex justify-center items-center bg-red-500/10 border border-red-500/20 rounded text-red-500">
                            <LuTrash2 size={20} />
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
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0F1115] border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header Panel */}
              <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0F1115]/95 backdrop-blur z-10">
                <div>
                    <h3 className="text-2xl font-sans font-black text-white uppercase tracking-tight">
                        {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                    </h3>
                    <p className="text-stone-500 text-[10px] font-mono tracking-widest mt-1">
                        {editingProduct ? `ID REF: #${editingProduct.id}` : "ALTA DE ITEM"}
                    </p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-stone-500 hover:text-white transition-colors p-2">
                    <LuX size={24} />
                </button>
              </div>

              {/* Form Body */}
              <form action={handleSave} className="flex-1 p-8 flex flex-col gap-8">
                
                {/* UPLOADER */}
                <div className="space-y-3">
                   <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Fotografía</label>
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
                                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10 group-hover:border-amber-500/30 text-stone-400 group-hover:text-amber-500">
                                    <LuImagePlus size={24} />
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
                        <input name="name" defaultValue={editingProduct?.name} required placeholder="Ej: MELENA DE LEÓN" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm font-sans font-black tracking-wide transition-colors uppercase" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Subtítulo (Efecto)</label>
                        <input name="subtitle" defaultValue={editingProduct?.subtitle || ""} placeholder="Ej: Claridad & Memoria" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Categoría</label>
                            <div className="relative">
                                {/* CORRECCIÓN: El select está correcto con sus 4 valores */}
                                <select name="category" defaultValue={editingProduct?.category} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm appearance-none cursor-pointer">
                                <option className="bg-black" value="mente">Mente</option>
                                <option className="bg-black" value="calma">Calma</option>
                                <option className="bg-black" value="energia">Energía</option>
                                <option className="bg-black" value="cuerpo">Cuerpo</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">▼</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Precio</label>
                            <input name="price" type="number" defaultValue={editingProduct?.price ? Number(editingProduct.price) : ""} required placeholder="0" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm font-mono" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Stock</label>
                            <input name="stock" type="number" defaultValue={editingProduct?.stock || 100} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Tags (Separa con comas)</label>
                            {/* Convertimos el JSON de la BD a String para mostrarlo en el input */}
                            <input name="benefits" defaultValue={editingProduct?.benefits ? (Array.isArray(editingProduct.benefits) ? editingProduct.benefits.join(", ") : editingProduct.benefits) : ""} placeholder="Focus, Memoria" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 outline-none rounded-sm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Descripción Editorial</label>
                        <textarea name="description" defaultValue={editingProduct?.description} rows={5} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-amber-500 focus:bg-white/10 outline-none rounded-sm leading-relaxed" placeholder="Escribe la descripción premium..."></textarea>
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
                                {editingProduct ? "Guardando Cambios..." : "Publicar Producto"}
                            </>
                        ) : (
                            editingProduct ? "Actualizar Producto" : "Publicar Producto"
                        )}
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