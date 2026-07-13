import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSeason } from "../utils/getSeason";
import { api, ApiError } from "../services/api";
import type { User } from "../services/api";
import { Header } from "./components/layout/Header";
import { AnnouncementCarousel } from "./components/landing/AnnouncementCarousel";
import { Footer } from "./components/layout/Footer";
import { SeasonDecorations } from "./components/layout/SeasonDecorations";
import { AuthForm } from "./components/auth/AuthForm";
import { HomePage } from "./pages/Home";
import { Toast } from "./components/admin/Toast";
import { ANNOUNCEMENTS, CATEGORIES, HERO, PET_SUBCATEGORIES, PRODUCTS, SEASONS } from "./data/shopData";
import type { Announcement, CatalogSubcategory, CatalogView, Category, Product, SeasonKey, Species } from "./data/shopData";
import { DEFAULT_STORE_SETTINGS } from "./data/storeSettings";
import type { StoreSettings } from "./data/storeSettings";

type CartItem = { productId: number; qty: number };

function readStoredCart(): CartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem("lily-pets-cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readStoredWishlist(): Set<number> {
  try {
    const value = JSON.parse(localStorage.getItem("lily-pets-wishlist") || "[]");
    return new Set(Array.isArray(value) ? value.map(Number) : []);
  } catch {
    return new Set();
  }
}

function errorMessage(error: unknown) {
  return error instanceof ApiError || error instanceof Error ? error.message : "No fue posible completar la operación.";
}

function numericPrice(value: string) {
  return Number(value.replace(/[^0-9-]/g, "")) || 0;
}

const VALID_SEASONS: SeasonKey[] = ["winter", "spring", "summer", "autumn", "permanente"];

function readStoredSeason(): SeasonKey {
  const stored = localStorage.getItem("lily-pets-theme") as SeasonKey | null;
  return stored && VALID_SEASONS.includes(stored) ? stored : getSeason();
}

export default function App() {
  const [hero, setHero] = useState<"perros" | "gatos">("perros");
  const [heroData, setHeroData] = useState(HERO);
  const [categoriesData, setCategoriesData] = useState<Category[]>(CATEGORIES);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [season, setSeason] = useState<SeasonKey>(readStoredSeason);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [storeSettingsDraft, setStoreSettingsDraft] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [savingGlobalSettings, setSavingGlobalSettings] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [localProducts, setLocalProducts] = useState<Product[]>(PRODUCTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [wishlist, setWishlist] = useState<Set<number>>(readStoredWishlist);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(readStoredCart);
  const [catalogView, setCatalogView] = useState<CatalogView>("todos");
  const [catalogSubcategory, setCatalogSubcategory] = useState<CatalogSubcategory | null>(null);
  const [catalogCategoryId, setCatalogCategoryId] = useState<number | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminSpecies, setAdminSpecies] = useState<"todos" | "perros" | "gatos">("todos");
  const [adminCategory, setAdminCategory] = useState("todos");
  const [adminStatus, setAdminStatus] = useState<"todos" | "Activo" | "Inactivo" | "Oculto">("todos");
  const [adminStock, setAdminStock] = useState<"todos" | "available" | "low" | "empty">("todos");
  const [adminSortBy, setAdminSortBy] = useState<"name" | "price" | "inventory" | "createdAt">("name");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit" | "view">("create");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const loggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    document.body.classList.remove("spring", "summer", "autumn", "winter", "permanente");
    document.body.classList.add(season);
    localStorage.setItem("lily-pets-theme", season);
    return () => document.body.classList.remove(season);
  }, [season]);

  useEffect(() => {
    let active = true;
    async function initialize() {
      const [productsResult, categoriesResult, sessionResult, settingsResult, announcementsResult] = await Promise.allSettled([
        api.products.list(),
        api.categories.list(),
        api.auth.me(),
        api.settings.get(),
        api.announcements.list(),
      ]);
      if (!active) return;
      if (productsResult.status === "fulfilled") setLocalProducts(productsResult.value);
      if (categoriesResult.status === "fulfilled") setCategoriesData(categoriesResult.value);
      if (settingsResult.status === "fulfilled" && VALID_SEASONS.includes(settingsResult.value.theme)) {
        const nextStoreSettings = { ...DEFAULT_STORE_SETTINGS, ...(settingsResult.value.global || {}) };
        setStoreSettings(nextStoreSettings);
        setStoreSettingsDraft(nextStoreSettings);
        const pendingTheme = localStorage.getItem("lily-pets-theme-pending") as SeasonKey | null;
        setSeason(pendingTheme && VALID_SEASONS.includes(pendingTheme) ? pendingTheme : settingsResult.value.theme);
        setHeroData((previous) => ({
          perros: { ...previous.perros, image: settingsResult.value.heroImages.perros || previous.perros.image },
          gatos: { ...previous.gatos, image: settingsResult.value.heroImages.gatos || previous.gatos.image },
        }));
      }
      if (announcementsResult.status === "fulfilled") setAnnouncements(announcementsResult.value);
      if (productsResult.status === "rejected" || categoriesResult.status === "rejected") {
        toast.error("No se pudo conectar con la base de datos; se muestran datos de demostración.");
      }
      if (sessionResult.status === "fulfilled") {
        setUser(sessionResult.value.user);
        try {
          const pendingTheme = localStorage.getItem("lily-pets-theme-pending") as SeasonKey | null;
          if (sessionResult.value.user.role === "admin" && pendingTheme && VALID_SEASONS.includes(pendingTheme)) {
            await api.settings.updateTheme(pendingTheme);
            setSeason(pendingTheme);
            localStorage.removeItem("lily-pets-theme-pending");
          }
          const guestCart = readStoredCart();
          const guestWishlist = [...readStoredWishlist()];
          const syncedCart = guestCart.length ? await api.cart.sync(guestCart) : await api.cart.list();
          await Promise.allSettled(guestWishlist.map((id) => api.favorites.add(id)));
          const storedFavorites = await api.favorites.list();
          if (active) {
            setCartItems(syncedCart);
            setWishlist(new Set(storedFavorites));
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    initialize();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) localStorage.setItem("lily-pets-cart", JSON.stringify(cartItems));
  }, [cartItems, loggedIn]);

  useEffect(() => {
    if (!loggedIn) localStorage.setItem("lily-pets-wishlist", JSON.stringify([...wishlist]));
  }, [wishlist, loggedIn]);

  async function reloadCatalog() {
    const [products, categories] = await Promise.all([api.products.list(), api.categories.list()]);
    setLocalProducts(products);
    setCategoriesData(categories);
  }

  async function reloadAnnouncements() {
    setAnnouncements(await api.announcements.list());
  }

  async function hydratePersonalData() {
    const guestCart = cartItems;
    const guestWishlist = [...wishlist];
    const syncedCart = guestCart.length ? await api.cart.sync(guestCart) : await api.cart.list();
    await Promise.allSettled(guestWishlist.map((id) => api.favorites.add(id)));
    const storedFavorites = await api.favorites.list();
    setCartItems(syncedCart);
    setWishlist(new Set(storedFavorites));
    localStorage.removeItem("lily-pets-cart");
    localStorage.removeItem("lily-pets-wishlist");
  }

  const toggleWishlist = async (id: number) => {
    const wasFavorite = wishlist.has(id);
    setWishlist((previous) => {
      const next = new Set(previous);
      wasFavorite ? next.delete(id) : next.add(id);
      return next;
    });
    if (!loggedIn) return;
    try {
      wasFavorite ? await api.favorites.remove(id) : await api.favorites.add(id);
    } catch (error) {
      setWishlist((previous) => {
        const next = new Set(previous);
        wasFavorite ? next.add(id) : next.delete(id);
        return next;
      });
      toast.error(errorMessage(error));
    }
  };

  const removeCartItem = async (productId: number) => {
    if (!loggedIn) {
      setCartItems((previous) => previous.filter((item) => item.productId !== productId));
      return;
    }
    try {
      await api.cart.remove(productId);
      setCartItems((previous) => previous.filter((item) => item.productId !== productId));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const updateCartItemQty = async (productId: number, qty: number) => {
    if (qty <= 0) return removeCartItem(productId);
    if (!loggedIn) {
      setCartItems((previous) => previous.map((item) => (item.productId === productId ? { ...item, qty } : item)));
      return;
    }
    try {
      setCartItems(await api.cart.set(productId, qty));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const addToCart = async (productId: number) => {
    const product = localProducts.find((item) => item.id === productId);
    const currentQty = cartItems.find((item) => item.productId === productId)?.qty || 0;
    const nextQty = currentQty + 1;
    if (!product || product.inventory < nextQty) {
      toast.error("No hay más stock disponible de este producto.");
      return;
    }
    setCartOpen(true);
    if (!loggedIn) {
      setCartItems((previous) => {
        const existing = previous.find((item) => item.productId === productId);
        return existing
          ? previous.map((item) => (item.productId === productId ? { ...item, qty: nextQty } : item))
          : [...previous, { productId, qty: 1 }];
      });
      return;
    }
    try {
      setCartItems(await api.cart.set(productId, nextQty));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleCheckout = async () => {
    if (!loggedIn) {
      toast("Inicia sesión para confirmar tu compra.");
      setCartOpen(false);
      setAuthMode("login");
      return;
    }
    try {
      const order = await api.orders.create();
      setCartItems([]);
      setCartOpen(false);
      await reloadCatalog();
      toast.success(`Pedido #${order.id} creado correctamente.`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const filteredProducts = localProducts.filter((product) => {
    const searchableText = [product.category, product.name, product.desc, ...product.tags].join(" ").toLocaleLowerCase("es");
    const matchesSearch = !catalogSearch.trim() || searchableText.includes(catalogSearch.trim().toLocaleLowerCase("es"));
    const matchesMainCategory =
      catalogView === "todos" ||
      catalogView === product.type ||
      (catalogView === "farmacia" && /(farmacia|antiparasit|suplement|vitamina|pipeta|pulga|garrapata)/.test(searchableText)) ||
      (catalogView === "ofertas" && (Boolean(product.original) || /oferta|descuento|%|–/.test(product.badge.toLocaleLowerCase("es"))));

    const matchesSpecificCategory = catalogCategoryId === null || product.categoryId === catalogCategoryId;

    if (!matchesMainCategory || !matchesSearch || !catalogSubcategory) {
      return matchesMainCategory && matchesSearch && matchesSpecificCategory;
    }

    const subcategoryPatterns: Record<CatalogSubcategory, RegExp> = {
      alimentos: /(alimento|pellet|comida|snack|croqueta|húmeda)/,
      higiene: /(higiene|arena|champú|shampoo|pañal|cepillo|arenero)/,
      juguetes: /(juguete|rascador|pelota|mordedor|caña)/,
      accesorios: /(accesorio|cama|correa|collar|plato|arnés|arnes)/,
    };
    return matchesSpecificCategory && subcategoryPatterns[catalogSubcategory].test(searchableText);
  });
  const adminFilteredProducts = localProducts
    .filter((product) => {
      const matchesSearch = !adminSearch || product.name.toLowerCase().includes(adminSearch.toLowerCase()) || product.id.toString() === adminSearch;
      const matchesSpecies = adminSpecies === "todos" || product.type === adminSpecies;
      const productCategoryName = product.category.split("·")[0].trim();
      const matchesCategory = adminCategory === "todos" || productCategoryName === adminCategory;
      const matchesStatus = adminStatus === "todos" || product.status === adminStatus;
      const matchesStock = adminStock === "todos" ||
        (adminStock === "available" && product.inventory > storeSettings.lowStockThreshold) ||
        (adminStock === "low" && product.inventory > 0 && product.inventory <= storeSettings.lowStockThreshold) ||
        (adminStock === "empty" && product.inventory === 0);
      return matchesSearch && matchesSpecies && matchesCategory && matchesStatus && matchesStock;
    })
    .sort((a, b) => {
      if (adminSortBy === "price") return numericPrice(a.price) - numericPrice(b.price);
      if (adminSortBy === "inventory") return a.inventory - b.inventory;
      if (adminSortBy === "createdAt") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.name.localeCompare(b.name);
    });

  const visibleProducts = isAdmin ? adminFilteredProducts : filteredProducts;
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleCatalogNavigate = (view: CatalogView, subcategory: CatalogSubcategory | null = null) => {
    setCatalogView(view);
    setCatalogSubcategory(subcategory);
    setCatalogCategoryId(null);
    setCatalogSearch("");
    if (view === "perros" || view === "gatos") setHero(view);
  };

  const showCatalogReset = catalogView !== "todos" || catalogSubcategory !== null || catalogCategoryId !== null || Boolean(catalogSearch.trim());

  const handleShowAllProducts = () => {
    handleCatalogNavigate("todos");
    window.requestAnimationFrame(() => {
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleCatalogSearch = (value: string) => {
    setCatalogSearch(value);
    setCatalogView("todos");
    setCatalogSubcategory(null);
    setCatalogCategoryId(null);
  };

  const selectedCatalogCategory = categoriesData.find((category) => category.id === catalogCategoryId);
  const selectedSubcategoryLabel = PET_SUBCATEGORIES.find((item) => item.id === catalogSubcategory)?.label;
  const catalogTitle = catalogSearch.trim()
    ? `Resultados para “${catalogSearch.trim()}”`
    : selectedCatalogCategory
      ? selectedCatalogCategory.label
    : catalogView === "todos"
    ? "Productos destacados"
    : catalogView === "farmacia"
      ? "Farmacia"
      : catalogView === "ofertas"
        ? "Ofertas"
        : `${catalogView === "perros" ? "Perros" : "Gatos"}${selectedSubcategoryLabel ? ` · ${selectedSubcategoryLabel}` : ""}`;

  const handleCategoryNavigate = (category: Category) => {
    setCatalogView(category.species);
    setCatalogSubcategory(null);
    setCatalogCategoryId(category.id);
    setCatalogSearch("");
    setHero(category.species);
    window.requestAnimationFrame(() => {
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSeasonChange = async (nextSeason: SeasonKey) => {
    setSeason(nextSeason);
    try {
      await api.settings.updateTheme(nextSeason);
      localStorage.removeItem("lily-pets-theme-pending");
      toast.success(`Tema ${SEASONS[nextSeason].label} guardado para toda la tienda.`);
    } catch {
      localStorage.setItem("lily-pets-theme-pending", nextSeason);
      toast.warning("El tema quedó guardado en este navegador y se sincronizará al reiniciar la API.");
    }
  };

  const handleGlobalSettingsChange = (field: keyof StoreSettings, value: string | number) => {
    setStoreSettingsDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSaveGlobalSettings = async () => {
    try {
      setSavingGlobalSettings(true);
      const saved = await api.settings.updateGlobal(storeSettingsDraft);
      setStoreSettings(saved);
      setStoreSettingsDraft(saved);
      toast.success("Configuración global guardada correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSavingGlobalSettings(false);
    }
  };

  const handleSettingsNavigate = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("configuracion-global")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSaveHeroImage = async (species: Species) => {
    try {
      await api.settings.updateHeroImage(species, heroData[species].image);
      toast.success("Imagen principal guardada correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleCreateAnnouncement = async (announcement: Omit<Announcement, "id">) => {
    try {
      const created = await api.announcements.create(announcement);
      setAnnouncements((previous) => [...previous, created].sort((a, b) => a.sortOrder - b.sortOrder));
      toast.success("Anuncio creado correctamente.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  };

  const handleUpdateAnnouncement = async (announcement: Announcement) => {
    try {
      const updated = await api.announcements.update(announcement);
      setAnnouncements((previous) => previous.map((item) => item.id === updated.id ? updated : item).sort((a, b) => a.sortOrder - b.sortOrder));
      toast.success("Anuncio actualizado correctamente.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await api.announcements.remove(id);
      setAnnouncements((previous) => previous.filter((item) => item.id !== id));
      toast.success("Anuncio eliminado correctamente.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Completa el correo y la contraseña.");
      return;
    }
    if (authMode === "register" && loginPassword !== confirmPassword) {
      setLoginError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const result = authMode === "register"
        ? await api.auth.register(loginEmail, loginPassword)
        : await api.auth.login(loginEmail, loginPassword);
      setUser(result.user);
      await hydratePersonalData();
      await reloadCatalog();
      await reloadAnnouncements();
      setAuthMode(null);
      setLoginPassword("");
      setConfirmPassword("");
      toast.success(authMode === "register" ? "Cuenta creada correctamente." : "Sesión iniciada correctamente.");
    } catch (error) {
      setLoginError(errorMessage(error));
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // La sesión local igualmente se cierra si el servidor dejó de responder.
    }
    setUser(null);
    setWishlist(new Set());
    setCartItems([]);
    setUserMenuOpen(false);
    setLoginEmail("");
    setLoginPassword("");
    localStorage.removeItem("lily-pets-cart");
    localStorage.removeItem("lily-pets-wishlist");
    try {
      await reloadCatalog();
      await reloadAnnouncements();
    } catch {
      setLocalProducts((products) => products.filter((product) => product.status === "Activo"));
    }
  };

  const getBlankProduct = (): Product => ({
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
    type: categoriesData[0]?.species ?? "perros",
    tags: ["Nuevo"],
    createdAt: new Date().toISOString(),
  });

  const handleOpenCreateProduct = () => {
    setProductModalMode("create");
    setCurrentProduct(getBlankProduct());
    setProductModalOpen(true);
  };
  const handleOpenEditProduct = (product: Product) => {
    setProductModalMode("edit");
    setCurrentProduct(product);
    setProductModalOpen(true);
  };
  const handleOpenViewProduct = (product: Product) => {
    setProductModalMode("view");
    setCurrentProduct(product);
    setProductModalOpen(true);
  };
  const handleDuplicateProduct = (product: Product) => {
    setProductModalMode("create");
    setCurrentProduct({ ...product, id: 0, name: `Copia de ${product.name}`, createdAt: new Date().toISOString() });
    setProductModalOpen(true);
  };
  const handleOpenDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const deleteProduct = async (product: Product) => {
    try {
      await api.products.remove(product.id);
      setLocalProducts((previous) => previous.filter((item) => item.id !== product.id));
      toast.success("Producto eliminado correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete);
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleProductModalChange = (field: keyof Product, value: string | number | string[]) => {
    setCurrentProduct((previous) => {
      if (!previous) return previous;
      if (field === "category") {
        const category = categoriesData.find((item) => item.label === value);
        return { ...previous, category: String(value), categoryId: category?.id ?? previous.categoryId, type: category?.species ?? previous.type };
      }
      return { ...previous, [field]: value } as Product;
    });
  };

  const handleSaveProductModal = async () => {
    if (!currentProduct?.name.trim() || !currentProduct.price.trim()) {
      toast.error("Completa el nombre y el precio del producto.");
      return;
    }
    try {
      const saved = productModalMode === "create"
        ? await api.products.create(currentProduct)
        : await api.products.update(currentProduct);
      setLocalProducts((previous) => productModalMode === "create"
        ? [saved, ...previous]
        : previous.map((product) => (product.id === saved.id ? saved : product)));
      setProductModalOpen(false);
      setCurrentProduct(null);
      await api.categories.list().then(setCategoriesData);
      toast.success(productModalMode === "create" ? "Producto creado correctamente." : "Producto actualizado correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleAdminFilterChange = (field: string, value: string) => {
    if (field === "searchQuery") setAdminSearch(value);
    if (field === "species") setAdminSpecies(value as typeof adminSpecies);
    if (field === "category") setAdminCategory(value);
    if (field === "status") setAdminStatus(value as typeof adminStatus);
    if (field === "stock") setAdminStock(value as typeof adminStock);
    if (field === "sortBy") setAdminSortBy(value as typeof adminSortBy);
  };

  const handleAdminResetFilters = () => {
    setAdminSearch("");
    setAdminSpecies("todos");
    setAdminCategory("todos");
    setAdminStatus("todos");
    setAdminStock("todos");
    setAdminSortBy("name");
  };

  const handleCreateCategory = async (label: string, species: string, image: string) => {
    try {
      const category = await api.categories.create({ label, species: species as Species, image });
      setCategoriesData((previous) => [...previous, category]);
      toast.success("Categoría creada correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleUpdateCategory = async (index: number, label: string, species: string, image: string) => {
    const category = categoriesData[index];
    if (!category) return;
    try {
      const updated = await api.categories.update({ ...category, label, species: species as Species, image });
      setCategoriesData((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      setLocalProducts(await api.products.list());
      toast.success("Categoría actualizada correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleDeleteCategory = async (index: number) => {
    const category = categoriesData[index];
    if (!category) return;
    try {
      await api.categories.remove(category.id);
      setCategoriesData((previous) => previous.filter((item) => item.id !== category.id));
      toast.success("Categoría eliminada correctamente.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (authMode && !loggedIn) {
    return (
      <AuthForm
        authMode={authMode}
        email={loginEmail}
        password={loginPassword}
        confirmPassword={confirmPassword}
        loginError={loginError}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleLogin}
        onCancel={() => { setAuthMode(null); setLoginError(""); }}
      />
    );
  }

  return (
    <div className="min-h-full">
      <SeasonDecorations />
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        loggedIn={loggedIn}
        isAdmin={isAdmin}
        userName={user?.name}
        cartOpen={cartOpen}
        cartItemsCount={cartItemsCount}
        cartItems={cartItems}
        products={localProducts}
        activeCatalogView={catalogView}
        searchQuery={catalogSearch}
        onSearchChange={handleCatalogSearch}
        onCatalogNavigate={handleCatalogNavigate}
        onCartToggle={() => setCartOpen((previous) => !previous)}
        onLogout={handleLogout}
        onLoginClick={() => setAuthMode("login")}
        onRegisterClick={() => setAuthMode("register")}
        updateCartItemQty={updateCartItemQty}
        removeCartItem={removeCartItem}
        onCheckout={handleCheckout}
        storeSettings={storeSettings}
      />
      <AnnouncementCarousel announcements={announcements} />
      <Toast />
      <main>
        <HomePage
          hero={hero}
          heroData={heroData}
          setHeroData={setHeroData}
          onSaveHeroImage={handleSaveHeroImage}
          isAdmin={isAdmin}
          products={visibleProducts}
          allProducts={localProducts}
          catalogTitle={catalogTitle}
          showCatalogReset={showCatalogReset}
          onShowAllProducts={handleShowAllProducts}
          categoriesData={categoriesData}
          onSelectCategory={handleCategoryNavigate}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          season={season}
          setSeason={handleSeasonChange}
          productModalOpen={productModalOpen}
          productModalMode={productModalMode}
          currentProduct={currentProduct}
          onProductModalChange={handleProductModalChange}
          onSaveProductModal={handleSaveProductModal}
          onCloseProductModal={() => { setProductModalOpen(false); setCurrentProduct(null); }}
          onViewProduct={handleOpenViewProduct}
          onEditProduct={handleOpenEditProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onDeleteProduct={handleOpenDeleteProduct}
          deleteModalOpen={deleteModalOpen}
          productToDelete={productToDelete}
          onConfirmDeleteProduct={handleConfirmDeleteProduct}
          onCloseDeleteModal={() => { setDeleteModalOpen(false); setProductToDelete(null); }}
          adminSearch={adminSearch}
          adminSpecies={adminSpecies}
          adminCategory={adminCategory}
          adminStatus={adminStatus}
          adminStock={adminStock}
          adminSortBy={adminSortBy}
          onAdminFilterChange={handleAdminFilterChange}
          onAdminResetFilters={handleAdminResetFilters}
          onOpenCreateProduct={handleOpenCreateProduct}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onProfile={() => toast("El historial de pedidos está disponible mediante la API.")}
          onSettings={handleSettingsNavigate}
          onLogout={handleLogout}
          addToCart={addToCart}
          announcements={announcements}
          onCreateAnnouncement={handleCreateAnnouncement}
          onUpdateAnnouncement={handleUpdateAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          storeSettings={storeSettings}
          storeSettingsDraft={storeSettingsDraft}
          savingGlobalSettings={savingGlobalSettings}
          onGlobalSettingsChange={handleGlobalSettingsChange}
          onSaveGlobalSettings={handleSaveGlobalSettings}
        />
      </main>
      <Footer settings={storeSettings} />
    </div>
  );
}
