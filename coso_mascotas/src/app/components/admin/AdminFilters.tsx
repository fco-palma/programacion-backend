import type { ChangeEvent } from "react";
import { Button } from "../ui/button";

interface AdminFiltersProps {
  searchQuery: string;
  species: string;
  category: string;
  status: string;
  stock: string;
  sortBy: string;
  categories: string[];
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
}

export function AdminFilters({
  searchQuery,
  species,
  category,
  status,
  stock,
  sortBy,
  categories,
  onFilterChange,
  onReset,
}: AdminFiltersProps) {
  const labelClass = "flex flex-col gap-1.5 text-xs font-medium text-slate-600";
  const controlClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

  return (
    <div id="admin-filtros" className="scroll-mt-36 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <label className={`${labelClass} col-span-2 sm:col-span-1`}>
            Nombre o ID
            <input
              value={searchQuery}
              onChange={(event) => onFilterChange("searchQuery", event.target.value)}
              placeholder="Buscar..."
              className={controlClass}
            />
          </label>
          <label className={labelClass}>
            Especie
            <select
              value={species}
              onChange={(event) => onFilterChange("species", event.target.value)}
              className={controlClass}
            >
              <option value="todos">Todos</option>
              <option value="perros">Perros</option>
              <option value="gatos">Gatos</option>
            </select>
          </label>
          <label className={labelClass}>
            Categoría
            <select
              value={category}
              onChange={(event) => onFilterChange("category", event.target.value)}
              className={controlClass}
            >
              <option value="todos">Todas</option>
              {categories.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Estado
            <select
              value={status}
              onChange={(event) => onFilterChange("status", event.target.value)}
              className={controlClass}
            >
              <option value="todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Oculto">Oculto</option>
            </select>
          </label>
          <label className={labelClass}>
            Stock
            <select
              value={stock}
              onChange={(event) => onFilterChange("stock", event.target.value)}
              className={controlClass}
            >
              <option value="todos">Todos</option>
              <option value="available">Disponible</option>
              <option value="low">Bajo stock</option>
              <option value="empty">Sin stock</option>
            </select>
          </label>
          <label className={labelClass}>
            Orden
            <select
              value={sortBy}
              onChange={(event) => onFilterChange("sortBy", event.target.value)}
              className={controlClass}
            >
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="inventory">Stock</option>
              <option value="createdAt">Fecha</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onReset} className="w-full xl:w-auto">
            Reiniciar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
