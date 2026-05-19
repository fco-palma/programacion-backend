export const MetodoPagoValues = [
    "--------",
    "Debito",
    "Transferencia",
    "Credito",
    "Efectivo",
    "OTRO TIPO DE PAGO XD",
] as const;

export type MetodoPago = (typeof MetodoPagoValues)[number];

