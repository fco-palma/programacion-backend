export const DisponibilidadValues = [
    "--------",
    "Full-Time",
    "Part-Time",
    "Agenda Abierta",
    "Agenda Cerrada",
    "Solo con cita previa",
    "Invitado / Guest"
] as const;

export type Disponibilidad = (typeof DisponibilidadValues)[number];