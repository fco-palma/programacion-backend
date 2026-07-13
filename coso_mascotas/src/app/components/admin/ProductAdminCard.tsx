import { Eye, Edit3, Copy, Trash2, CircleDot } from "lucide-react";
import type { Product } from "../../data/shopData";

interface ProductAdminCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  lowStockThreshold: number;
}

const stockClasses = {
  available: "bg-emerald-100 text-emerald-700",
  low: "bg-amber-100 text-amber-700",
  empty: "bg-rose-100 text-rose-700",
};

export function ProductAdminCard({ product, onView, onEdit, onDuplicate, onDelete, lowStockThreshold }: ProductAdminCardProps) {
  const stockState = product.inventory === 0 ? "empty" : product.inventory <= lowStockThreshold ? "low" : "available";

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-sm transition hover:shadow-md">
      <div className="relative h-52 shrink-0 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center transition duration-500 hover:scale-105" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
              {tag}
            </span>
          ))}
        </div>
        <span className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${stockClasses[stockState as keyof typeof stockClasses]}`}>
          <CircleDot size={10} /> {stockState === "empty" ? "Sin stock" : stockState === "low" ? "Bajo stock" : "Disponible"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{product.category}</p>
            <h3 title={product.name} className="mt-2 line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-slate-900">{product.name}</h3>
            <p title={product.desc} className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{product.desc}</p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            {product.status}
          </span>
        </div>

        <div className="mt-auto h-[234px] shrink-0 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-[118px] flex-col items-center justify-center rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Precio actual</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{product.price}</p>
              {product.original ? <p className="mt-1 text-sm text-slate-500 line-through">{product.original}</p> : null}
            </div>
            <div className="flex h-[118px] flex-col items-center justify-center rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stock</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{product.inventory}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <button
              type="button"
              onClick={() => onView(product)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              <Eye size={16} /> Ver
            </button>
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <Edit3 size={16} /> Editar
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(product)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Copy size={16} /> Duplicar
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
