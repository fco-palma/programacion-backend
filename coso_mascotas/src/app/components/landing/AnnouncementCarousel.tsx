import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Announcement } from "../../data/shopData";

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

export function AnnouncementCarousel({ announcements }: AnnouncementCarouselProps) {
  const visible = announcements.filter((announcement) => announcement.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (currentIndex >= visible.length) setCurrentIndex(0);
  }, [currentIndex, visible.length]);

  useEffect(() => {
    if (paused || visible.length <= 1) return;
    const current = visible[currentIndex];
    const timer = window.setTimeout(
      () => setCurrentIndex((index) => (index + 1) % visible.length),
      (current?.durationSeconds || 6) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [currentIndex, paused, visible]);

  if (!visible.length) return null;
  const current = visible[currentIndex] || visible[0];
  const goPrevious = () => setCurrentIndex((index) => (index - 1 + visible.length) % visible.length);
  const goNext = () => setCurrentIndex((index) => (index + 1) % visible.length);

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-4 lg:px-8" aria-label="Ofertas y novedades">
      <div
        className="group relative h-56 overflow-hidden rounded-2xl border border-white/70 bg-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:h-60 sm:rounded-3xl lg:h-72"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          key={current.id}
          src={current.image}
          alt={current.title}
          className="h-full w-full animate-in fade-in object-cover object-center duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-transparent" />

        <div className="absolute inset-0 flex max-w-2xl flex-col justify-center p-4 pr-14 text-white sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Oferta destacada</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            {current.title}
          </h2>
          {current.subtitle && <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-5 text-white/80 sm:text-base sm:leading-6">{current.subtitle}</p>}
          {current.link && (
            <a href={current.link} className="mt-4 inline-flex min-h-11 w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50 sm:mt-5">
              Ver oferta
            </a>
          )}
        </div>

        {visible.length > 1 && (
          <>
            <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
              <button type="button" onClick={goPrevious} aria-label="Anuncio anterior" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-slate-950/30 text-white backdrop-blur transition hover:bg-slate-950/50">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={goNext} aria-label="Siguiente anuncio" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-slate-950/30 text-white backdrop-blur transition hover:bg-slate-950/50">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="absolute bottom-4 right-5 flex gap-2" aria-label="Seleccionar anuncio">
              {visible.map((announcement, index) => (
                <button
                  key={announcement.id}
                  type="button"
                  aria-label={`Ver anuncio ${index + 1}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
