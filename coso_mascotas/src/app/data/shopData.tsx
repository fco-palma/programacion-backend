import { CloudRain, Flower2, Sun, Leaf } from "lucide-react";
import type { ReactNode } from "react";

export type BadgeColor =
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "gray";

export type Species = "perros" | "gatos";

export type CatalogView = "todos" | Species | "farmacia" | "ofertas";

export type CatalogSubcategory = "alimentos" | "higiene" | "juguetes" | "accesorios";

export type HeroData = Record<Species, {
  headline: string;
  sub: string;
  image: string;
  alt: string;
  accent: string;
}>;

export type Category = {
  id: number;
  label: string;
  species: Species;
  image: string;
  count: string;
};

export type Product = {
  id: number;
  categoryId: number;
  name: string;
  category: string;
  desc: string;
  price: string;
  original: string | null;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: BadgeColor;
  image: string;
  inventory: number;
  status: "Activo" | "Inactivo" | "Oculto";
  type: Species;
  tags: string[];
  createdAt: string;
};

export type Announcement = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
  durationSeconds: number;
  sortOrder: number;
};

export type SeasonKey = "winter" | "spring" | "summer" | "autumn" | "permanente";

export type SeasonMeta = {
  label: string;
  background: string;
  accent: string;
  secondary: string;
  accentAlt: string;
  button: string;
  text: string;
  icon: ReactNode;
};

export const PET_SUBCATEGORIES: Array<{
  id: CatalogSubcategory;
  icon: string;
  label: string;
  description: string;
}> = [
  { id: "alimentos", icon: "🍖", label: "Alimentos", description: "Pellets, comida húmeda y snacks" },
  { id: "higiene", icon: "🧼", label: "Higiene y Arena", description: "Arena, champús, pañales y cepillos" },
  { id: "juguetes", icon: "🧸", label: "Juguetes y Rascadores", description: "Pelotas, mordedores, cañas y rascadores" },
  { id: "accesorios", icon: "🎒", label: "Accesorios y Camas", description: "Correas, collares, platos y camas" },
];

export const HERO: HeroData = {
  perros: {
    headline: "Cosas de perro",
    sub: "Algún comentario para el perro.",
    image: "https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=900&h=1100&fit=crop&auto=format",
    alt: "Mujer con su perro en casa",
    accent: "Para perros",
  },
  gatos: {
    headline: "Y del gato",
    sub: "Y comentario para el gato.",
    image: "https://images.unsplash.com/photo-1761249257124-ab02fc22c5b5?w=900&h=1100&fit=crop&auto=format",
    alt: "Gato durmiendo en sofá",
    accent: "Para gatos",
  },
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: -1,
    title: "Ofertas para cuidar a tu mascota",
    subtitle: "Descubre descuentos especiales en alimentos, juguetes y accesorios.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1400&h=500&fit=crop&auto=format",
    link: "#productos",
    active: true,
    durationSeconds: 6,
    sortOrder: 1,
  },
  {
    id: -2,
    title: "Todo para perros y gatos",
    subtitle: "Productos seleccionados para acompañarlos en cada etapa.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1400&h=500&fit=crop&auto=format",
    link: "#categorias",
    active: true,
    durationSeconds: 6,
    sortOrder: 2,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 1,
    label: "Alimentos · Perros",
    species: "perros",
    image: "https://images.unsplash.com/photo-1714068691210-073dc52c6c1d?w=600&h=700&fit=crop&auto=format",
    count: "12 productos",
  },
  {
    id: 2,
    label: "Juguetes · Perros",
    species: "perros",
    image: "https://images.unsplash.com/photo-1531531534025-0b78da954d21?w=600&h=700&fit=crop&auto=format",
    count: "30 productos",
  },
  {
    id: 3,
    label: "Accesorios · Perros",
    species: "perros",
    image: "https://images.unsplash.com/photo-1599773952341-5f5d8d5433d6?w=600&h=700&fit=crop&auto=format",
    count: "25 productos",
  },
  {
    id: 4,
    label: "Alimentos · Gatos",
    species: "gatos",
    image: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=600&h=700&fit=crop&auto=format",
    count: "96 productos",
  },
  {
    id: 5,
    label: "Juguetes · Gatos",
    species: "gatos",
    image: "https://images.unsplash.com/photo-1638826595775-e2eae86cda8e?w=600&h=700&fit=crop&auto=format",
    count: "74 productos",
  },
  {
    id: 6,
    label: "Accesorios · Gatos",
    species: "gatos",
    image: "https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?w=600&h=700&fit=crop&auto=format",
    count: "48 productos",
  },
  {
    id: 7,
    label: "Farmacia · Perros",
    species: "perros",
    image: "https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=600&h=700&fit=crop&auto=format",
    count: "1 producto",
  },
  {
    id: 8,
    label: "Farmacia · Gatos",
    species: "gatos",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=700&fit=crop&auto=format",
    count: "1 producto",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Lo que come la Stella y el Thor",
    category: "Alimentos · Perros",
    desc: "Bolsa 25 kg — Croquetas para perros adultos razas grandes",
    price: "$ 0.000",
    original: "$ 0.000",
    rating: 4.7,
    reviews: 31,
    badge: "Más vendido",
    badgeColor: "blue",
    image: "https://images.unsplash.com/photo-1601758228006-964e41e5e8eb?w=500&h=500&fit=crop&auto=format",
    inventory: 24,
    status: "Activo",
    type: "perros",
    tags: ["Más vendido"],
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: 2,
    categoryId: 4,
    name: "Churu Pack 12 sobres",
    category: "Alimentos · Gatos",
    desc: "Pack 12 sobres — Comida húmeda para gatos adultos",
    price: "$ 0.000",
    original: "$ 0.000",
    rating: 4.6,
    reviews: 341,
    badge: "–15%",
    badgeColor: "red",
    image: "https://www.petmax.ca/cdn/shop/files/5371833.webp?v=1763779767&width=1200",
    inventory: 12,
    status: "Activo",
    type: "gatos",
    tags: ["Oferta"],
    createdAt: "2026-06-05T12:30:00.000Z",
  },
  {
    id: 3,
    categoryId: 5,
    name: "Kit Juguetes",
    category: "Juguetes · Gatos",
    desc: "Set 5 piezas — Plumas, ratones y pelota con cascabel",
    price: "$ 2.990",
    original: null,
    rating: 4.7,
    reviews: 129,
    badge: "Nuevo",
    badgeColor: "orange",
    image: "https://images.unsplash.com/photo-1691351943492-cfee023e9cbf?w=500&h=500&fit=crop&auto=format",
    inventory: 8,
    status: "Activo",
    type: "gatos",
    tags: ["Nuevo"],
    createdAt: "2026-06-10T09:45:00.000Z",
  },
  {
    id: 4,
    categoryId: 3,
    name: "Arnés Ajustable Pro",
    category: "Accesorios · Perros",
    desc: "Tallas S–XL — Anti-jale, transpirable, con reflectantes",
    price: "$ 3.490",
    original: null,
    rating: 4.9,
    reviews: 87,
    badge: "Top rated",
    badgeColor: "gray",
    image: "https://images.unsplash.com/photo-1595523752419-5592b5327242?w=500&h=500&fit=crop&auto=format",
    inventory: 15,
    status: "Activo",
    type: "perros",
    tags: ["Top rated"],
    createdAt: "2026-06-03T16:20:00.000Z",
  },
  {
    id: 5,
    categoryId: 2,
    name: "Pelota Kong Classic",
    category: "Juguetes · Perros",
    desc: "Talla M — Caucho natural, rellena con premios",
    price: "$ 1.890",
    original: "$ 2.100",
    rating: 4.8,
    reviews: 503,
    badge: "Clásico",
    badgeColor: "gray",
    image: "https://images.unsplash.com/photo-1611254965886-e7caa829b627?w=500&h=500&fit=crop&auto=format",
    inventory: 34,
    status: "Activo",
    type: "perros",
    tags: ["Top rated"],
    createdAt: "2026-06-08T11:15:00.000Z",
  },
  {
    id: 6,
    categoryId: 6,
    name: "Arenero Cerrado",
    category: "Accesorios · Gatos",
    desc: "Sirve para que hagan caca.",
    price: "$ 6.200",
    original: null,
    rating: 4.5,
    reviews: 68,
    badge: "Nuevo",
    badgeColor: "orange",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cat%20house.jpg?width=900",
    inventory: 9,
    status: "Activo",
    type: "gatos",
    tags: ["Nuevo"],
    createdAt: "2026-06-12T14:10:00.000Z",
  },
  {
    id: 7,
    categoryId: 7,
    name: "Pipeta antiparasitaria para perros",
    category: "Farmacia · Perros",
    desc: "Protección mensual contra pulgas y garrapatas.",
    price: "$ 8.990",
    original: "$ 10.990",
    rating: 4.8,
    reviews: 42,
    badge: "Oferta",
    badgeColor: "red",
    image: "https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=500&h=500&fit=crop&auto=format",
    inventory: 18,
    status: "Activo",
    type: "perros",
    tags: ["Oferta", "Antiparasitario"],
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: 8,
    categoryId: 8,
    name: "Suplemento Omega 3 para gatos",
    category: "Farmacia · Gatos",
    desc: "Suplemento nutricional para piel, pelaje y bienestar general.",
    price: "$ 7.490",
    original: null,
    rating: 4.7,
    reviews: 25,
    badge: "Nuevo",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=500&fit=crop&auto=format",
    inventory: 14,
    status: "Activo",
    type: "gatos",
    tags: ["Nuevo", "Suplemento"],
    createdAt: "2026-07-02T10:00:00.000Z",
  },
];

export const SEASONS: Record<SeasonKey, SeasonMeta> = {
  winter: {
    label: "Invierno",
    background: "linear-gradient(135deg,#F6F9FC,#EAF2FF)",
    accent: "#5C7AEA",
    secondary: "#A7C7E7",
    accentAlt: "#DDEEFF",
    button: "#4F6DDB",
    text: "#253858",
    icon: <CloudRain size={16} />,
  },
  spring: {
    label: "Primavera",
    background: "linear-gradient(135deg,#FFFDF8,#F3FFE8)",
    accent: "#7BC96F",
    secondary: "#F7B7D2",
    accentAlt: "#FFD166",
    button: "#66BB6A",
    text: "#2F3E46",
    icon: <Flower2 size={16} />,
  },
  summer: {
    label: "Verano",
    background: "linear-gradient(135deg,#FFFBE6,#FFF3CC)",
    accent: "#00B4D8",
    secondary: "#90E0EF",
    accentAlt: "#FFD60A",
    button: "#0096C7",
    text: "#264653",
    icon: <Sun size={16} />,
  },
  autumn: {
    label: "Otoño",
    background: "linear-gradient(135deg,#FFF8F0,#F8E8D6)",
    accent: "#C96A3D",
    secondary: "#D9A441",
    accentAlt: "#8B4513",
    button: "#B85C38",
    text: "#3D2C2E",
    icon: <Leaf size={16} />,
  },
  permanente: {
    label: "Permanente",
    background: "linear-gradient(135deg,#FFFFFF,#F7F9FB)",
    accent: "#2E7D32",
    secondary: "#81C784",
    accentAlt: "#42A5F5",
    button: "#2196F3",
    text: "#37474F",
    icon: <Sun size={16} />,
  },
};
