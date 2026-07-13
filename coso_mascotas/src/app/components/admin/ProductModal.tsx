import type { Product } from "../../data/shopData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ImageField } from "./ImageField";

interface ProductModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  product: Product;
  categories: string[];
  onChange: (field: keyof Product, value: string | number | string[]) => void;
  onSave: () => void;
  onClose: () => void;
}

const tagOptions = ["Nuevo", "Más vendido", "Oferta", "Top rated"];
const statusOptions = ["Activo", "Inactivo", "Oculto"];
const typeOptions = ["perros", "gatos"];

export function ProductModal({ open, mode, product, categories, onChange, onSave, onClose }: ProductModalProps) {
  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Agregar producto" : mode === "edit" ? "Editar producto" : "Ver producto"}
          </DialogTitle>
          <DialogDescription>
            Completa los datos para mantener el catálogo de Lily Pets actualizado.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Nombre
            <input
              disabled={isViewMode}
              value={product.name}
              onChange={(event) => onChange("name", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Precio actual
            <input
              disabled={isViewMode}
              value={product.price}
              onChange={(event) => onChange("price", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Categoría
            <select
              disabled={isViewMode}
              value={product.category}
              onChange={(event) => onChange("category", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Precio anterior
            <input
              disabled={isViewMode}
              value={product.original ?? ""}
              onChange={(event) => onChange("original", event.target.value || null)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
            Descripción
            <textarea
              disabled={isViewMode}
              value={product.desc}
              onChange={(event) => onChange("desc", event.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Stock
            <input
              disabled={isViewMode}
              type="number"
              value={product.inventory}
              onChange={(event) => onChange("inventory", Number(event.target.value))}
              min={0}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Tipo
            <select
              disabled={isViewMode}
              value={product.type}
              onChange={(event) => onChange("type", event.target.value as Product["type"])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Estado
            <select
              disabled={isViewMode}
              value={product.status}
              onChange={(event) => onChange("status", event.target.value as Product["status"])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <ImageField
              value={product.image}
              onChange={(value) => onChange("image", value)}
              disabled={isViewMode}
              label="Imagen del producto"
            />
          </div>
          <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
            Etiquetas
            <div className="grid gap-2 sm:grid-cols-4">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={isViewMode}
                  onClick={() => {
                    const nextTags = product.tags.includes(tag)
                      ? product.tags.filter((item) => item !== tag)
                      : [...product.tags, tag];
                    onChange("tags", nextTags);
                  }}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${product.tags.includes(tag) ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {!isViewMode && (
            <Button onClick={onSave}>{mode === "edit" ? "Guardar producto" : "Guardar producto"}</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
