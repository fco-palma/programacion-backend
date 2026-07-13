export function OfferBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="relative rounded-3xl overflow-hidden h-64 md:h-72 bg-[#2C1A0E]">
        <img
          src="https://images.unsplash.com/photo-1676877323923-759b8a5e9c42?w=1400&h=600&fit=crop&auto=format"
          alt="Perro feliz"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-4">
          <p className="text-xs uppercase tracking-widest text-white/50">Oferta especial julio</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            20% off en alimentos premium
          </h2>
          <p className="text-sm text-white/60 max-w-md">
            Para perros y gatos. Usa el código <span className="bg-white/15 text-white font-mono px-2 py-0.5 rounded">CAGATEDEFRIO</span> al finalizar tu compra.
          </p>
          <button className="mt-1 min-h-11 rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            Aprovechar oferta
          </button>
        </div>
      </div>
    </section>
  );
}
