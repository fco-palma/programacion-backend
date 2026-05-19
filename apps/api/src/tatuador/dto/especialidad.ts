export const EspecialidadValues = [
    "--------",
    "Tradicional (Old School)",
    "Neotradicional (Neo-trad)",
    "Tradicional Japonés (Irezumi)",
    "Realismo / Hiperrealismo",
    "Microrealismo",
    "Fine Line (Línea Fina)",
    "Geométrico / Dotwork (Puntillismo)",
    "Blackwork",
    "Acuarela (Watercolor)",
    "New School / Ilustrativo",
    "Trash Polka",
    "Cover-Up (Coverturas)",
] as const;

export type Especialidad = (typeof EspecialidadValues)[number];