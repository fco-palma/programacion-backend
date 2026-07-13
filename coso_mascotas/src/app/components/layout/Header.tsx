import { useState, type Dispatch, type SetStateAction } from "react";
import { Cat, ChevronDown, Dog, Flame, Menu, Pill, Search, User, X } from "lucide-react";
import { PET_SUBCATEGORIES } from "../../data/shopData";
import type { CatalogSubcategory, CatalogView, Product, Species } from "../../data/shopData";
import type { StoreSettings } from "../../data/storeSettings";
import { CartPopover } from "../shop/CartPopover";
import logo from "../../../assets/lily-pets-logo-transparent.png";
import cartIcon from "../../../assets/icons/carrito.png";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  userMenuOpen: boolean;
  setUserMenuOpen: Dispatch<SetStateAction<boolean>>;
  loggedIn: boolean;
  isAdmin: boolean;
  userName?: string;
  cartOpen: boolean;
  cartItemsCount: number;
  cartItems: { productId: number; qty: number }[];
  products: Product[];
  activeCatalogView: CatalogView;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCatalogNavigate: (view: CatalogView, subcategory?: CatalogSubcategory | null) => void;
  onCartToggle: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  updateCartItemQty: (productId: number, qty: number) => void;
  removeCartItem: (productId: number) => void;
  onCheckout: () => void;
  storeSettings: StoreSettings;
}

const mainButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-200 2xl:min-h-12 2xl:px-5 2xl:py-2.5 2xl:text-[15px]";

export function Header({
  menuOpen,
  setMenuOpen,
  userMenuOpen,
  setUserMenuOpen,
  loggedIn,
  isAdmin,
  userName,
  cartOpen,
  cartItemsCount,
  cartItems,
  products,
  activeCatalogView,
  searchQuery,
  onSearchChange,
  onCatalogNavigate,
  onCartToggle,
  onLogout,
  onLoginClick,
  onRegisterClick,
  updateCartItemQty,
  removeCartItem,
  onCheckout,
  storeSettings,
}: HeaderProps) {
  const [pinnedPetMenu, setPinnedPetMenu] = useState<Species | null>(null);
  const [hoveredPetMenu, setHoveredPetMenu] = useState<Species | null>(null);
  const visiblePetMenu = hoveredPetMenu ?? pinnedPetMenu;

  const scrollToCatalog = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const navigate = (view: CatalogView, subcategory: CatalogSubcategory | null = null) => {
    onCatalogNavigate(view, subcategory);
    setPinnedPetMenu(null);
    setHoveredPetMenu(null);
    setMenuOpen(false);
    scrollToCatalog();
  };

  const handleSearchInput = (value: string) => {
    onSearchChange(value);
    if (value.trim()) scrollToCatalog();
  };

  const togglePinnedPetMenu = (species: Species) => {
    onCatalogNavigate(species, null);
    setPinnedPetMenu((current) => (current === species ? null : species));
    scrollToCatalog();
  };

  const isSelected = (view: CatalogView) => activeCatalogView === view;
  const selectedClass = "bg-sky-50 text-slate-900 ring-2 ring-sky-200";
  const idleClass = "bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-800";

  const petMenu = (species: Species) => (
    <div className="absolute left-1/2 top-full z-50 w-[430px] -translate-x-1/2 pt-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15">
        <div className="mb-2 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Para {species}</p>
          <p className="mt-1 text-sm text-slate-500">Elige una sección para llegar directamente a sus productos.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PET_SUBCATEGORIES.map((subcategory) => (
            <button
              key={subcategory.id}
              type="button"
              onClick={() => navigate(species, subcategory.id)}
              className="rounded-2xl border border-transparent p-3 text-left transition hover:border-sky-100 hover:bg-sky-50"
            >
              <span className="text-xl" aria-hidden="true">{subcategory.icon}</span>
              <span className="mt-1 block text-sm font-semibold text-slate-800">{subcategory.label}</span>
              <span className="mt-1 block text-xs leading-4 text-slate-500">{subcategory.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-[0_12px_35px_rgba(71,85,105,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] flex-col px-3 py-1.5 sm:px-6 sm:py-2 xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 xl:grid xl:grid-cols-[180px_minmax(0,1fr)_180px] xl:gap-0 2xl:grid-cols-[200px_minmax(0,1fr)_200px]">
          <a
            href="#"
            aria-label="Lily Pets - Inicio"
            className="flex shrink-0 items-center rounded-2xl transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-sky-200"
            onClick={() => {
              onCatalogNavigate("todos", null);
              setPinnedPetMenu(null);
              setHoveredPetMenu(null);
            }}
          >
            <img
              src={logo}
              alt="Lily Pets Store"
              className="h-16 w-16 object-contain drop-shadow-md sm:h-[5.5rem] sm:w-[5.5rem] 2xl:h-[6.25rem] 2xl:w-[6.25rem]"
            />
          </a>

          <div className="hidden min-w-0 items-center justify-center gap-3 xl:flex 2xl:gap-4">
          <nav className="flex shrink-0 items-center justify-center gap-1.5 2xl:gap-2" aria-label="Categorías principales">
            {(["perros", "gatos"] as Species[]).map((species) => {
              const Icon = species === "perros" ? Dog : Cat;
              return (
                <div
                  key={species}
                  className="relative"
                  onPointerEnter={() => setHoveredPetMenu(species)}
                  onPointerLeave={() => setHoveredPetMenu(null)}
                >
                  <button
                    type="button"
                    data-testid={`desktop-menu-${species}`}
                    onClick={() => togglePinnedPetMenu(species)}
                    aria-expanded={visiblePetMenu === species}
                    aria-pressed={pinnedPetMenu === species}
                    className={`${mainButtonClass} shadow-[0_10px_25px_rgba(71,85,105,0.14)] ${isSelected(species) ? selectedClass : idleClass}`}
                  >
                    <Icon size={18} />
                    <span className="capitalize">{species}</span>
                    <ChevronDown size={15} className={`transition-transform ${visiblePetMenu === species ? "rotate-180" : ""}`} />
                  </button>
                  {visiblePetMenu === species && petMenu(species)}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => navigate("farmacia")}
              className={`${mainButtonClass} bg-emerald-200/90 text-slate-800 shadow-[0_10px_28px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 hover:bg-emerald-200 ${isSelected("farmacia") ? "ring-2 ring-emerald-400" : ""}`}
            >
              <Pill size={18} /> Farmacia
            </button>
            <button
              type="button"
              onClick={() => navigate("ofertas")}
              className={`${mainButtonClass} bg-[#ff7c5c] text-slate-900 shadow-[0_10px_28px_rgba(255,124,92,0.25)] hover:-translate-y-0.5 hover:bg-[#ff896d] ${isSelected("ofertas") ? "ring-2 ring-orange-400" : ""}`}
            >
              <Flame size={18} /> Ofertas
            </button>
          </nav>

          <div className="relative w-[220px] shrink-0 2xl:w-[300px] min-[1800px]:w-[380px]">
            <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 2xl:left-5 2xl:size-[22px]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchInput(event.target.value)}
              placeholder="Buscar tus productos..."
              className="min-h-11 w-full rounded-full border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-700 shadow-inner placeholder:text-slate-400 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80 2xl:min-h-12 2xl:py-2.5 2xl:pl-12 2xl:pr-5 2xl:text-[15px]"
            />
          </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 xl:justify-self-end">
            <div className="relative">
              <button
                type="button"
                className="flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(71,85,105,0.14)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 sm:px-3 2xl:min-h-12 2xl:px-4 2xl:text-[15px]"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-label="Usuario"
              >
                <User size={16} />
                <span className="hidden whitespace-nowrap sm:inline">{loggedIn ? (isAdmin ? "Administrador" : userName || "Mi cuenta") : "Mi cuenta"}</span>
              </button>
              {userMenuOpen && (
                <div className="fixed left-3 right-3 top-[8.25rem] z-[80] w-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/15 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-48 sm:p-1">
                  {loggedIn ? (
                    <>
                      <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>Mi perfil</button>
                      <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>Configuración</button>
                      <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={onLogout}>Cerrar sesión</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onLoginClick(); setUserMenuOpen(false); }}>Iniciar sesión</button>
                      <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onRegisterClick(); setUserMenuOpen(false); }}>Registrar</button>
                    </>
                  )}
                </div>
              )}
            </div>

            {!isAdmin && (
              <div className="relative">
                <button type="button" className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-[0_8px_20px_rgba(71,85,105,0.14)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 2xl:min-h-12 2xl:min-w-12" onClick={onCartToggle}>
                  <span className="sr-only">Ver carrito</span>
                  <img src={cartIcon} alt="" aria-hidden="true" className="h-5 w-5 object-contain opacity-80" />
                  {cartItemsCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-semibold text-white">{cartItemsCount}</span>}
                </button>
                <CartPopover
                  open={cartOpen}
                  cartItems={cartItems}
                  products={products}
                  onClose={onCartToggle}
                  updateCartItemQty={updateCartItemQty}
                  removeCartItem={removeCartItem}
                  onCheckout={onCheckout}
                  storeSettings={storeSettings}
                />
              </div>
            )}

            <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-slate-700 xl:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex flex-col items-center gap-2 pb-1.5 xl:hidden">
          <div className="relative w-full max-w-2xl">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchInput(event.target.value)}
              placeholder="Buscar tus productos"
              className="min-h-11 w-full rounded-full border border-slate-200 bg-slate-50/80 py-2.5 pl-11 pr-5 text-base text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white px-3 py-3 xl:hidden" aria-label="Categorías principales para móvil">
          <div className="mx-auto grid max-w-7xl gap-2">
            {(["perros", "gatos"] as Species[]).map((species) => {
              const Icon = species === "perros" ? Dog : Cat;
              return (
                <div key={species} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2">
                  <button
                    type="button"
                    onClick={() => togglePinnedPetMenu(species)}
                    className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-base font-semibold ${isSelected(species) ? "bg-sky-600 text-white" : "text-slate-700"}`}
                    aria-expanded={visiblePetMenu === species}
                  >
                    <span className="flex items-center gap-3"><Icon size={21} /><span className="capitalize">{species}</span></span>
                    <ChevronDown size={18} className={`transition-transform ${visiblePetMenu === species ? "rotate-180" : ""}`} />
                  </button>
                  {visiblePetMenu === species && (
                    <div className="mt-2 grid gap-1">
                      {PET_SUBCATEGORIES.map((subcategory) => (
                        <button key={subcategory.id} type="button" onClick={() => navigate(species, subcategory.id)} className="flex min-h-12 items-center gap-3 rounded-xl bg-white px-4 text-left text-sm font-medium text-slate-700">
                          <span className="text-lg" aria-hidden="true">{subcategory.icon}</span>
                          {subcategory.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => navigate("farmacia")} className={`flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 px-5 text-base font-semibold ${isSelected("farmacia") ? "bg-sky-600 text-white" : "bg-white text-slate-700"}`}><Pill size={21} /> Farmacia</button>
            <button type="button" onClick={() => navigate("ofertas")} className={`flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 px-5 text-base font-semibold ${isSelected("ofertas") ? "bg-sky-600 text-white" : "bg-white text-slate-700"}`}><Flame size={21} /> Ofertas</button>
          </div>
        </nav>
      )}
    </header>
  );
}
