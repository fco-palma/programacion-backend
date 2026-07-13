import { useState } from "react";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ImageField } from "./ImageField";
import type { Category } from "../../data/shopData";

interface CategoryManagerProps {
  categories: Category[];
  onCreate: (label: string, species: string, image: string) => void;
  onUpdate: (index: number, label: string, species: string, image: string) => void;
  onDelete: (index: number) => void;
}

export function CategoryManager({ categories, onCreate, onUpdate, onDelete }: CategoryManagerProps) {
  const [newLabel, setNewLabel] = useState("");
  const [newSpecies, setNewSpecies] = useState<"perros" | "gatos">("perros");
  const [newImage, setNewImage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingSpecies, setEditingSpecies] = useState<"perros" | "gatos">("perros");
  const [editingImage, setEditingImage] = useState("");

  const createCategory = () => {
    if (!newLabel.trim()) return;
    onCreate(newLabel.trim(), newSpecies, newImage);
    setNewLabel("");
    setNewImage("");
  };

  const orderedCategories = categories
    .map((category, index) => ({ category, index }))
    .sort((first, second) => {
      const firstOrder = first.category.species === "perros" ? 0 : 1;
      const secondOrder = second.category.species === "perros" ? 0 : 1;
      return firstOrder - secondOrder;
    });

  return (
    <div id="admin-categorias" className="scroll-mt-36 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Categorías</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Administración de categorías</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
          Organiza el catálogo y asigna una imagen mediante URL o desde un archivo del equipo.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Plus size={16} className="text-sky-600" /> Nueva categoría
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto] sm:items-end">
          <label className="text-sm font-medium text-slate-700">
            Nombre
            <input
              type="text"
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
              placeholder="Ej. Higiene · Perros"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Tipo
            <select
              value={newSpecies}
              onChange={(event) => setNewSpecies(event.target.value as "perros" | "gatos")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            >
              <option value="perros">Perros</option>
              <option value="gatos">Gatos</option>
            </select>
          </label>
          <Button onClick={createCategory} className="h-11 whitespace-nowrap">
            Crear categoría
          </Button>
        </div>
        <div className="mt-4">
          <ImageField value={newImage} onChange={setNewImage} label="Imagen de la categoría" compact showUrlLabel={false} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderedCategories.map(({ category, index }) => {
          const isEditing = editingIndex === index;
          return (
            <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {isEditing ? (
                <div className="space-y-4 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">
                      Nombre
                      <input
                        type="text"
                        value={editingLabel}
                        onChange={(event) => setEditingLabel(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-700">
                      Tipo
                      <select
                        value={editingSpecies}
                        onChange={(event) => setEditingSpecies(event.target.value as "perros" | "gatos")}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                      >
                        <option value="perros">Perros</option>
                        <option value="gatos">Gatos</option>
                      </select>
                    </label>
                  </div>
                  <ImageField value={editingImage} onChange={setEditingImage} label="Imagen de la categoría" compact showUrlLabel={false} />
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>Cancelar</Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdate(index, editingLabel.trim() || category.label, editingSpecies, editingImage);
                        setEditingIndex(null);
                      }}
                    >
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative h-36 bg-slate-100">
                    {category.image ? (
                      <img src={category.image} alt={category.label} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400"><ImageIcon size={28} /></div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                      {category.species}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="min-h-10 text-sm font-semibold leading-5 text-slate-900">{category.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{category.count}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditingLabel(category.label);
                          setEditingSpecies(category.species);
                          setEditingImage(category.image);
                        }}
                      >
                        <Pencil size={14} /> Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(index)}>
                        <Trash2 size={14} /> Eliminar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
