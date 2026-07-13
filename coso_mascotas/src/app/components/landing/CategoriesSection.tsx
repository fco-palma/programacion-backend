import type { Category } from "../../data/shopData";

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export function CategoriesSection({ categories, onSelectCategory }: CategoriesSectionProps) {
  const categoryOrder = ["alimentos", "juguetes", "accesorios", "farmacia"];
  const orderedCategories = [...categories].sort((left, right) => {
    const speciesDifference = (left.species === "perros" ? 0 : 1) - (right.species === "perros" ? 0 : 1);
    if (speciesDifference !== 0) return speciesDifference;

    const leftLabel = left.label.toLocaleLowerCase("es");
    const rightLabel = right.label.toLocaleLowerCase("es");
    const leftPosition = categoryOrder.findIndex((name) => leftLabel.includes(name));
    const rightPosition = categoryOrder.findIndex((name) => rightLabel.includes(name));
    return leftPosition - rightPosition;
  });

  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Explora por tipo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Categorías
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {orderedCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category)}
            aria-label={`Ver productos de ${category.label}`}
            className="group relative h-44 overflow-hidden rounded-2xl bg-secondary text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:h-56 lg:h-72"
          >
            <img
              src={category.image}
              alt={category.label}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/75 via-[#2C1A0E]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{category.label}</p>
              <p className="text-white/60 text-xs">{category.count}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
