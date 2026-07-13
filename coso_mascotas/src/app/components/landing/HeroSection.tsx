import type { Dispatch, SetStateAction } from "react";
import { BadgeCheck, ChevronRight, HeartHandshake, MessageCircle, Package, PawPrint, ShieldCheck, Truck, Users } from "lucide-react";
import { HERO } from "../../data/shopData";
import { ImageField } from "../admin/ImageField";
import type { Species } from "../../data/shopData";

interface HeroSectionProps {
  hero: "perros" | "gatos";
  heroData: typeof HERO;
  setHeroData: Dispatch<SetStateAction<typeof HERO>>;
  onSaveHeroImage: (species: Species) => void;
  isAdmin: boolean;
  freeShippingMinimum: number;
}

const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const getBenefits = (freeShippingMinimum: number) => [
  {
    icon: Truck,
    title: "Envío gratis",
    description: `En compras superiores a ${currency.format(freeShippingMinimum)}.`,
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    description: "Pago seguro y protección de datos.",
  },
  {
    icon: MessageCircle,
    title: "Atención personalizada",
    description: "Ayuda rápida cuando la necesites.",
  },
];

const stats = [
  { icon: Package, value: "+100", label: "Productos" },
  { icon: Users, value: "+50", label: "Clientes" },
  { icon: BadgeCheck, value: "+25", label: "Marcas reconocidas" },
  { icon: HeartHandshake, value: "98%", label: "Satisfacción del cliente" },
];

export function HeroSection({ hero, heroData, setHeroData, onSaveHeroImage, isAdmin, freeShippingMinimum }: HeroSectionProps) {
  const { image, alt } = heroData[hero];
  const benefits = getBenefits(freeShippingMinimum);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="flex flex-col gap-5 sm:gap-6 lg:pt-8">
            <div className="space-y-4">
              <h1 className="max-w-2xl text-3xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Todo lo necesario para tu mascota
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Encuentra alimentos, juguetes y accesorios para tus mascotas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-600">Calificación de dueños satisfechos.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#productos" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(125,184,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600">
                Comprar ahora <ChevronRight size={16} />
              </a>
            </div>

            <div className="mt-4 grid gap-3 pt-2 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                      <Icon size={18} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{benefit.title}</p>
                    <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-3 hidden gap-4 text-slate-300 sm:flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="text-2xl opacity-25">
                  <PawPrint size={24} />
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-sky-100/70 blur-3xl lg:block" />
            <div className="absolute -bottom-6 right-6 hidden h-28 w-28 rounded-full bg-sky-200/50 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
              <img key={hero} src={image} alt={alt} className="h-[320px] w-full rounded-[22px] object-cover object-center transition-all duration-500 sm:h-[460px] lg:h-[560px]" />
            </div>
            {isAdmin && (
              <aside className="relative mt-3 rounded-2xl border border-sky-100 bg-white/95 p-3 shadow-lg backdrop-blur" aria-label="Editor de imagen principal">
                <div className="mb-2">
                  <p className="text-sm font-semibold text-slate-900">Editor de imagen principal</p>
                </div>
                <ImageField
                  compact
                  label={`Imagen principal de ${hero}`}
                  showUrlLabel={false}
                  value={heroData[hero].image}
                  onChange={(image) => setHeroData((current) => ({
                    ...current,
                    [hero]: { ...current[hero], image },
                  }))}
                />
                <button
                  type="button"
                  onClick={() => onSaveHeroImage(hero)}
                  className="mt-2 min-h-11 w-full rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Guardar imagen principal
                </button>
              </aside>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export function StoreStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 sm:pb-8" aria-label="Estadísticas de la tienda">
      <div className="rounded-[24px] border border-sky-100 bg-sky-50/80 p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-w-0 items-center gap-2 rounded-2xl bg-white/80 px-3 py-4 shadow-sm sm:gap-3 sm:px-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 sm:h-11 sm:w-11">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 sm:text-xl">{item.value}</p>
                  <p className="text-xs leading-4 text-slate-500 sm:text-sm">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
