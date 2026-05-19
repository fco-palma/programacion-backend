export const EstadoValue = [
    "--------",
    "PAGADO",
    "NO PAGADO",
    "PENDIENTE",
    "HAY QUE LIQUIDARLO AL WON",
] as const;

export type Estado = (typeof EstadoValue)[number];
