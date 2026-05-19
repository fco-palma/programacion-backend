export const EstadoValue = [
    "--------",
    "ACEPTADO",
    "EN CURSO",
    "PENDIENTE",
    "RECHAZADO",
] as const;

export type Estado = (typeof EstadoValue)[number];