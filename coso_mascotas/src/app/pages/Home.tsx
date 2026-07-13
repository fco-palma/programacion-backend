import type { Dispatch, SetStateAction } from "react";
import { BarChart3, ClipboardList, Megaphone, Package, Plus, Settings2, Tags, Truck, UserRound } from "lucide-react";
import { HeroSection, StoreStats } from "../components/landing/HeroSection";
import { CategoriesSection } from "../components/landing/CategoriesSection";
import { OfferBanner } from "../components/landing/OfferBanner";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminControls } from "../components/admin/AdminControls";
import { AdminStats } from "../components/admin/AdminStats";
import { AdminFilters } from "../components/admin/AdminFilters";
import { CategoryManager } from "../components/admin/CategoryManager";
import { ProductModal } from "../components/admin/ProductModal";
import { DeleteConfirmModal } from "../components/admin/DeleteConfirmModal";
import { AnnouncementManager } from "../components/admin/AnnouncementManager";
import { GlobalSettingsPanel } from "../components/admin/GlobalSettingsPanel";
import { ProductsSection } from "../components/shop/ProductsSection";
import { HERO, SEASONS } from "../data/shopData";
import type { Announcement, Category, Product, SeasonKey, Species } from "../data/shopData";
import type { StoreSettings } from "../data/storeSettings";

interface HomePageProps {
  hero: "perros" | "gatos";
  heroData: typeof HERO;
  setHeroData: Dispatch<SetStateAction<typeof HERO>>;
  onSaveHeroImage: (species: Species) => void;
  isAdmin: boolean;
  products: Product[];
  allProducts: Product[];
  catalogTitle: string;
  showCatalogReset: boolean;
  onShowAllProducts: () => void;
  categoriesData: Category[];
  onSelectCategory: (category: Category) => void;
  wishlist: Set<number>;
  toggleWishlist: (id: number) => void;
  season: SeasonKey;
  setSeason: (season: SeasonKey) => void;
  productModalOpen: boolean;
  productModalMode: "create" | "edit" | "view";
  currentProduct: Product | null;
  onProductModalChange: (field: keyof Product, value: string | number | string[]) => void;
  onSaveProductModal: () => void;
  onCloseProductModal: () => void;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  deleteModalOpen: boolean;
  productToDelete: Product | null;
  onConfirmDeleteProduct: () => void;
  onCloseDeleteModal: () => void;
  adminSearch: string;
  adminSpecies: "todos" | "perros" | "gatos";
  adminCategory: string;
  adminStatus: "todos" | "Activo" | "Inactivo" | "Oculto";
  adminStock: "todos" | "available" | "low" | "empty";
  adminSortBy: "name" | "price" | "inventory" | "createdAt";
  onAdminFilterChange: (field: string, value: string) => void;
  onAdminResetFilters: () => void;
  onOpenCreateProduct: () => void;
  onCreateCategory: (label: string, species: string, image: string) => void;
  onUpdateCategory: (index: number, label: string, species: string, image: string) => void;
  onDeleteCategory: (index: number) => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  addToCart: (id: number) => void;
  announcements: Announcement[];
  onCreateAnnouncement: (announcement: Omit<Announcement, "id">) => Promise<boolean>;
  onUpdateAnnouncement: (announcement: Announcement) => Promise<boolean>;
  onDeleteAnnouncement: (id: number) => Promise<boolean>;
  storeSettings: StoreSettings;
  storeSettingsDraft: StoreSettings;
  savingGlobalSettings: boolean;
  onGlobalSettingsChange: (field: keyof StoreSettings, value: string | number) => void;
  onSaveGlobalSettings: () => void;
}

export function HomePage({
  hero,
  heroData,
  setHeroData,
  onSaveHeroImage,
  isAdmin,
  products,
  allProducts,
  catalogTitle,
  showCatalogReset,
  onShowAllProducts,
  categoriesData,
  onSelectCategory,
  wishlist,
  toggleWishlist,
  season,
  setSeason,
  productModalOpen,
  productModalMode,
  currentProduct,
  onProductModalChange,
  onSaveProductModal,
  onCloseProductModal,
  onViewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  deleteModalOpen,
  productToDelete,
  onConfirmDeleteProduct,
  onCloseDeleteModal,
  adminSearch,
  adminSpecies,
  adminCategory,
  adminStatus,
  adminStock,
  adminSortBy,
  onAdminFilterChange,
  onAdminResetFilters,
  onOpenCreateProduct,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onProfile,
  onSettings,
  onLogout,
  addToCart,
  announcements,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  storeSettings,
  storeSettingsDraft,
  savingGlobalSettings,
  onGlobalSettingsChange,
  onSaveGlobalSettings,
}: HomePageProps) {
  const categoryLabels = categoriesData.map((category) => category.label);
  const adminCategoryLabels = Array.from(
    new Set(categoriesData.map((category) => category.label.split("·")[0].trim())),
  );

  const lowStockCount = allProducts.filter((product) => product.inventory > 0 && product.inventory <= storeSettings.lowStockThreshold).length;
  const activeProductsCount = allProducts.filter((product) => product.status === "Activo").length;

  const adminStats = [
    {
      label: "Productos totales",
      value: `${allProducts.length}`,
      detail: "Total en el catálogo",
      icon: Package,
    },
    {
      label: "Activos",
      value: `${activeProductsCount}`,
      detail: "Disponibles para venta",
      icon: BarChart3,
    },
    {
      label: "Bajo stock",
      value: `${lowStockCount}`,
      detail: "Productos que necesitan reaprovisionamiento",
      icon: Truck,
    },
    {
      label: "Categorías",
      value: `${categoriesData.length}`,
      detail: "Secciones configuradas",
      icon: ClipboardList,
    },
  ];

  const scrollToAdminSection = (id: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const adminControls = [
    { label: "Catálogo", icon: ClipboardList, onClick: () => scrollToAdminSection("admin-catalogo") },
    { label: "Categorías", icon: Tags, onClick: () => scrollToAdminSection("admin-categorias") },
    { label: "Anuncios", icon: Megaphone, onClick: () => scrollToAdminSection("admin-anuncios") },
    { label: "Estadísticas", icon: BarChart3, onClick: () => scrollToAdminSection("admin-estadisticas") },
    { label: "Configuración", icon: Settings2, onClick: onSettings },
    { label: "Mi perfil", icon: UserRound, onClick: onProfile },
  ];

  const blankProduct: Product = {
    id: 0,
    categoryId: categoriesData[0]?.id ?? 0,
    name: "",
    category: categoriesData[0]?.label ?? "Accesorios · Perros",
    desc: "",
    price: "",
    original: null,
    rating: 4,
    reviews: 0,
    badge: "Nuevo",
    badgeColor: "orange",
    image: "",
    inventory: 0,
    status: "Activo",
    type: "perros",
    tags: ["Nuevo"],
    createdAt: new Date().toISOString(),
  };

  return (
    <>
      <HeroSection hero={hero} heroData={heroData} setHeroData={setHeroData} onSaveHeroImage={onSaveHeroImage} isAdmin={isAdmin} freeShippingMinimum={storeSettings.freeShippingMinimum} />

      {isAdmin ? (
        <section className="mx-auto max-w-7xl space-y-6 px-4 pb-12 sm:space-y-8 sm:px-6 sm:pb-16">
          <AdminHeader onProfile={onProfile} onSettings={onSettings} onLogout={onLogout} />

          <AdminControls items={adminControls} />

          <div id="admin-tema" className="scroll-mt-36 rounded-3xl border border-border bg-secondary p-5 shadow-sm sm:p-6 admin-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Tema de la página</p>
                <p className="mt-1 text-sm text-muted-foreground">Selecciona la apariencia estacional visible para los clientes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SEASONS) as SeasonKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSeason(key)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      season === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {SEASONS[key].icon}
                    {SEASONS[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <GlobalSettingsPanel
            settings={storeSettingsDraft}
            saving={savingGlobalSettings}
            onChange={onGlobalSettingsChange}
            onSave={onSaveGlobalSettings}
          />

          <AnnouncementManager
            announcements={announcements}
            onCreate={onCreateAnnouncement}
            onUpdate={onUpdateAnnouncement}
            onDelete={onDeleteAnnouncement}
          />

          <AdminStats stats={adminStats} />

          <div className="space-y-8">
            <CategoryManager categories={categoriesData} onCreate={onCreateCategory} onUpdate={onUpdateCategory} onDelete={onDeleteCategory} />

            <div id="admin-catalogo" className="scroll-mt-36 space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Administración del catálogo</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Productos del catálogo</h2>
                </div>
                <button type="button" onClick={onOpenCreateProduct} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700">
                  <Plus size={17} /> Agregar producto
                </button>
              </div>
              <AdminFilters
                searchQuery={adminSearch}
                species={adminSpecies}
                category={adminCategory}
                status={adminStatus}
                stock={adminStock}
                sortBy={adminSortBy}
                categories={adminCategoryLabels}
                onFilterChange={onAdminFilterChange}
                onReset={onAdminResetFilters}
              />
              <ProductsSection
                products={products}
                catalogTitle={catalogTitle}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                isAdmin={isAdmin}
                onViewProduct={onViewProduct}
                onEditProduct={onEditProduct}
                onDuplicateProduct={onDuplicateProduct}
                onDeleteProduct={onDeleteProduct}
                addToCart={addToCart}
                lowStockThreshold={storeSettings.lowStockThreshold}
                showHeader={false}
              />
            </div>
          </div>

          <ProductModal
            open={productModalOpen}
            mode={productModalMode}
            product={currentProduct ?? blankProduct}
            categories={categoryLabels}
            onChange={onProductModalChange}
            onSave={onSaveProductModal}
            onClose={onCloseProductModal}
          />

          <DeleteConfirmModal
            open={deleteModalOpen}
            productName={productToDelete?.name ?? ""}
            onConfirm={onConfirmDeleteProduct}
            onClose={onCloseDeleteModal}
          />
        </section>
      ) : (
        <>
          <CategoriesSection categories={categoriesData} onSelectCategory={onSelectCategory} />
          <ProductsSection
            products={products}
            catalogTitle={catalogTitle}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            isAdmin={isAdmin}
            onViewProduct={onViewProduct}
            onEditProduct={onEditProduct}
            onDuplicateProduct={onDuplicateProduct}
            onDeleteProduct={onDeleteProduct}
            addToCart={addToCart}
            lowStockThreshold={storeSettings.lowStockThreshold}
            showAllButton={showCatalogReset}
            onShowAll={onShowAllProducts}
          />
          <StoreStats />
          <OfferBanner />
        </>
      )}
    </>
  );
}
