import { BadgeDollarSign, ContactRound, Save, Share2 } from "lucide-react";
import type { StoreSettings } from "../../data/storeSettings";

interface GlobalSettingsPanelProps {
  settings: StoreSettings;
  saving: boolean;
  onChange: (field: keyof StoreSettings, value: string | number) => void;
  onSave: () => void;
}

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100";
const currencyInputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100";
const labelClass = "block text-sm font-medium text-slate-700";

export function GlobalSettingsPanel({ settings, saving, onChange, onSave }: GlobalSettingsPanelProps) {
  const numericField = (field: "freeShippingMinimum" | "standardShippingCost" | "lowStockThreshold", value: string) => {
    onChange(field, value === "" ? 0 : Number(value));
  };

  return (
    <section id="configuracion-global" className="scroll-mt-36 rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Configuración global</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Configuración global de la tienda</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Estos valores se aplican al inicio, inventario, carrito y pie de página sin modificar el código.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><BadgeDollarSign size={19} /></span>
              <div>
                <p className="font-semibold text-slate-900">Parámetros de venta</p>
                <p className="text-xs text-slate-500">Envíos y control de inventario.</p>
              </div>
            </div>
            <div className="grid items-end gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Monto mínimo para envío gratis
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">$</span>
                  <input type="number" min="0" step="100" value={settings.freeShippingMinimum} onChange={(event) => numericField("freeShippingMinimum", event.target.value)} className={currencyInputClass} />
                </div>
              </label>
              <label className={labelClass}>
                Costo de envío estándar
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">$</span>
                  <input type="number" min="0" step="100" value={settings.standardShippingCost} onChange={(event) => numericField("standardShippingCost", event.target.value)} className={currencyInputClass} />
                </div>
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Alerta de bajo stock
                <input type="number" min="1" step="1" value={settings.lowStockThreshold} onChange={(event) => numericField("lowStockThreshold", event.target.value)} className={inputClass} />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><ContactRound size={19} /></span>
              <div>
                <p className="font-semibold text-slate-900">Información de contacto y footer</p>
                <p className="text-xs text-slate-500">Datos visibles para los clientes.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Teléfono de soporte
                <input type="tel" value={settings.supportPhone} onChange={(event) => onChange("supportPhone", event.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Correo de la tienda
                <input type="email" value={settings.storeEmail} onChange={(event) => onChange("storeEmail", event.target.value)} className={inputClass} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Dirección física
                <input type="text" value={settings.address} onChange={(event) => onChange("address", event.target.value)} className={inputClass} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Share2 size={19} /></span>
              <div>
                <p className="font-semibold text-slate-900">Enlaces de redes sociales</p>
                <p className="text-xs text-slate-500">Los iconos del footer usarán estos destinos.</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className={labelClass}>
                Enlace de Instagram
                <input type="url" value={settings.instagramUrl} onChange={(event) => onChange("instagramUrl", event.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Enlace de TikTok
                <input type="url" value={settings.tiktokUrl} onChange={(event) => onChange("tiktokUrl", event.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Enlace de Facebook
                <input type="url" value={settings.facebookUrl} onChange={(event) => onChange("facebookUrl", event.target.value)} className={inputClass} />
              </label>
            </div>
          </div>
          <div className="flex justify-end">
          <button type="button" onClick={onSave} disabled={saving} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              <Save size={17} /> {saving ? "Guardando..." : "Guardar configuración global"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
