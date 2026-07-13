import type { LucideIcon } from "lucide-react";

interface ControlItem {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface AdminControlsProps {
  items: ControlItem[];
}

export function AdminControls({ items }: AdminControlsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Controles de tienda</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Accesos rápidos</h3>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="group flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-sky-200 hover:bg-white sm:flex-row sm:items-center sm:gap-3 sm:rounded-3xl sm:p-4"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-200">
                <Icon size={20} />
              </span>
              <span className="break-words text-sm font-semibold leading-5 text-slate-900">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
