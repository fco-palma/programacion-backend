import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import logo from "../../../assets/lily-pets-logo-transparent.png";

interface AdminHeaderProps {
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function AdminHeader({ onProfile, onSettings, onLogout }: AdminHeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden shrink-0 sm:block">
            <img src={logo} alt="Lily Pets Store" className="h-24 w-24 object-contain drop-shadow-md" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-600">Panel administrador</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Panel de administración</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Gestiona productos, stock, categorías, apariencia y operaciones de la tienda.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-left sm:text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
            <ShieldAlert size={16} /> <span>🛠 Modo administrador activo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
            <Button variant="outline" size="sm" onClick={onProfile} className="w-full sm:w-auto">
              Mi perfil
            </Button>
            <Button variant="outline" size="sm" onClick={onSettings} className="w-full sm:w-auto">
              Configuración
            </Button>
            <Button variant="secondary" size="sm" onClick={onLogout} className="col-span-2 w-full sm:w-auto">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
