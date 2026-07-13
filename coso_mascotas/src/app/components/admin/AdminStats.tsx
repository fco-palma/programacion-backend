import type { LucideIcon } from "lucide-react";

interface AdminStat {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
}

interface AdminStatsProps {
  stats: AdminStat[];
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div id="admin-estadisticas" className="scroll-mt-36 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:rounded-3xl sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <Icon size={20} />
              </div>
              <span className="min-w-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
                {stat.label}
              </span>
            </div>
            <div className="mt-4 sm:mt-6">
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              {stat.detail ? <p className="mt-2 text-sm text-slate-500">{stat.detail}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
