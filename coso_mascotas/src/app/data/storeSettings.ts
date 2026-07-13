export type StoreSettings = {
  freeShippingMinimum: number;
  standardShippingCost: number;
  lowStockThreshold: number;
  supportPhone: string;
  storeEmail: string;
  address: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  freeShippingMinimum: 50000,
  standardShippingCost: 4500,
  lowStockThreshold: 5,
  supportPhone: "+56 9 1234 5678",
  storeEmail: "contacto@lilypets.cl",
  address: "27 Oriente 22 y media Norte 3431, Talca, Maule.",
  instagramUrl: "https://instagram.com/lilypets.store",
  tiktokUrl: "https://tiktok.com/@lilypets.store",
  facebookUrl: "https://facebook.com/lilypets.store",
};
