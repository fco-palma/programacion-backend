import { Heart, Star } from "lucide-react";
import type { Product } from "../../data/shopData";
import { badgeClasses } from "../../../utils/badgeColors";

interface ProductCardProps {
  product: Product;
  wishlist: Set<number>;
  toggleWishlist: (id: number) => void;
  addToCart: (id: number) => void;
}

export function ProductCard({ product, wishlist, toggleWishlist, addToCart }: ProductCardProps) {
  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-secondary sm:h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium ${badgeClasses[product.badgeColor]}`}>
          {product.badge}
        </span>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
          aria-label={wishlist.has(product.id) ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
        >
          <Heart size={14} className={wishlist.has(product.id) ? "fill-primary text-primary" : "text-muted-foreground"} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">{product.category}</p>
          <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground">{product.name}</p>
          <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-relaxed text-muted-foreground">{product.desc}</p>
        </div>

        <div className="flex items-center gap-1.5" aria-label={`${product.rating} de 5 estrellas`}>
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={10} className={index < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"} />
          ))}
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="mt-auto space-y-3">
          <div>
            <p className="text-base font-semibold text-foreground">{product.price}</p>
            {product.original && <p className="text-xs text-muted-foreground line-through">{product.original}</p>}
          </div>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="min-h-11 w-full touch-manipulation rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
