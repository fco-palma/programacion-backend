import type { BadgeColor } from "../app/data/shopData";

export const badgeClasses: Record<BadgeColor, string> = {
  blue: "bg-primary text-primary-foreground",
  orange: "bg-accent text-accent-foreground",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
  gray: "bg-secondary text-secondary-foreground",
};

export const badgeOptions: Array<{ value: BadgeColor; label: string }> = [
  { value: "blue", label: "🔵 Azul" },
  { value: "orange", label: "🟠 Naranja" },
  { value: "green", label: "🟢 Verde" },
  { value: "red", label: "🔴 Rojo" },
  { value: "gray", label: "⚪ Gris" },
];
