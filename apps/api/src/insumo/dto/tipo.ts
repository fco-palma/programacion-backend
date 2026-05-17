export const TipoValues = [
    "--------",
    "Agujas/Cartuchos",
    "Tintas",
    "Diluyentes de tinta",
    "Cups",
    "Papel hectografico",
    "Liquido transfer",
    "Rasuradoras",
    "Guantes",
    "Jabon",
    "Alcohol/Antisepticos",
    "Bajalenguas",
    "Apositos/Gasas",
] as const;

export type Tipo = (typeof TipoValues)[number];
