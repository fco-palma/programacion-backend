import { LayoutGrid } from "lucide-react";
import { ProductAdminCard } from "../admin/ProductAdminCard";
import type { Product } from "../../data/shopData";
import { ProductCard } from "./ProductCard";

interface ProductsSectionProps {
  products: Product[];
  catalogTitle: string;
  wishlist: Set<number>;
  toggleWishlist: (id: number) => void;
  isAdmin: boolean;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  addToCart: (id: number) => void;
  lowStockThreshold?: number;
  showHeader?: boolean;
  showAllButton?: boolean;
  onShowAll?: () => void;
}

export function ProductsSection({
  products,
  catalogTitle,
  wishlist,
  toggleWishlist,
  isAdmin,
  onViewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  addToCart,
  lowStockThreshold = 5,
  showHeader = true,
  showAllButton = false,
  onShowAll,
}: ProductsSectionProps) {
  return (
    <section id="productos" className={`mx-auto max-w-7xl scroll-mt-32 sm:scroll-mt-36 ${isAdmin ? "px-0 pb-0" : "px-4 pb-12 sm:px-6 sm:pb-16"}`}>
      {showHeader && <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
            {isAdmin ? "Administración del catálogo" : "Catálogo seleccionado"}
          </p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isAdmin ? "Productos del catálogo" : catalogTitle}
          </h2>
        </div>
        {!isAdmin && showAllButton && onShowAll && (
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 text-sm font-semibold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 sm:w-auto"
          >
            <LayoutGrid size={17} /> Ver todos los productos
          </button>
        )}
      </div>}

      <div className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 ${isAdmin ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
        {!products.length && (
          <div className="col-span-full rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-800">Aún no hay productos en esta sección</p>
            <p className="mt-2 text-sm text-slate-500">Puedes agregarlos desde el panel de administración.</p>
          </div>
        )}

        {products.map((product) =>
          isAdmin ? (
            <ProductAdminCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              onEdit={onEditProduct}
              onDuplicate={onDuplicateProduct}
              onDelete={onDeleteProduct}
              lowStockThreshold={lowStockThreshold}
            />
          ) : (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          ),
        )}
      </div>
    </section>
  );
}
