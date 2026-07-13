import { useState } from "react";
import { Eye, EyeOff, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ImageField } from "./ImageField";
import type { Announcement } from "../../data/shopData";

interface AnnouncementManagerProps {
  announcements: Announcement[];
  onCreate: (announcement: Omit<Announcement, "id">) => Promise<boolean>;
  onUpdate: (announcement: Announcement) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

const emptyAnnouncement = (): Omit<Announcement, "id"> => ({
  title: "",
  subtitle: "",
  image: "",
  link: "#productos",
  active: true,
  durationSeconds: 6,
  sortOrder: 0,
});

export function AnnouncementManager({ announcements, onCreate, onUpdate, onDelete }: AnnouncementManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Omit<Announcement, "id">>(emptyAnnouncement);

  const resetForm = () => {
    setEditingId(null);
    setDraft(emptyAnnouncement());
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.image.trim()) return;
    const successful = editingId === null
      ? await onCreate(draft)
      : await onUpdate({ id: editingId, ...draft });
    if (successful) resetForm();
  };

  return (
    <section id="admin-anuncios" className="scroll-mt-36 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Anuncios</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Ofertas bajo el buscador</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Crea imágenes rotativas, define cuánto tiempo se muestran y enlázalas a productos o categorías.
          </p>
        </div>
        {editingId !== null && <Button variant="outline" size="sm" onClick={resetForm}>Cancelar edición</Button>}
      </div>

      <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          {editingId === null ? <Plus size={16} /> : <Pencil size={16} />}
          {editingId === null ? "Nuevo anuncio" : "Editar anuncio"}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Título
              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ej. 20% de descuento en alimentos" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Texto complementario
              <textarea value={draft.subtitle} onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Enlace al pulsar
              <input value={draft.link} onChange={(event) => setDraft({ ...draft, link: event.target.value })} placeholder="#productos o https://..." className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </label>
          </div>
          <ImageField value={draft.image} onChange={(image) => setDraft({ ...draft, image })} label="Imagen del anuncio" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Segundos en pantalla
            <input type="number" min={3} max={60} value={draft.durationSeconds} onChange={(event) => setDraft({ ...draft, durationSeconds: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Orden
            <input type="number" min={0} value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" />
          </label>
          <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="h-4 w-4 accent-sky-600" />
            Visible en la tienda
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => void save()} disabled={!draft.title.trim() || !draft.image.trim()}>
            {editingId === null ? "Crear anuncio" : "Guardar anuncio"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="relative h-40 bg-slate-200">
              <img src={announcement.image} alt={announcement.title} className="h-full w-full object-cover" />
              <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${announcement.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-900/80 text-white"}`}>
                {announcement.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {announcement.active ? "Visible" : "Oculto"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Megaphone size={18} className="mt-0.5 shrink-0 text-sky-600" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{announcement.subtitle || "Sin texto complementario"}</p>
                  <p className="mt-2 text-xs text-slate-500">{announcement.durationSeconds} segundos · Orden {announcement.sortOrder}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingId(announcement.id);
                  const { id: _id, ...values } = announcement;
                  setDraft(values);
                }}><Pencil size={14} /> Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => void onDelete(announcement.id)}><Trash2 size={14} /> Eliminar</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
