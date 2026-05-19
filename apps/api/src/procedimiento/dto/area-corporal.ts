export const AreaCorporalValue = [
    "--------",
    "BRAZO (BICEPS O TRICEPS)",
    "ANTEBRAZO",
    "HOMBRO",
    "MUÑECA O MANOS",
    "ESPALDA COMPLETA",
    "PECHO (PECTORALES)",
    "COSTILLAS / LATERALES DEL TORSO",
    "ABDOMEN / ESTOMAGO",
    "MUSLO",
    "PANTORRILLA (GEMELOS)",
    "ESPINILLA (PARTE FRONTAL DE LA PIERNA)",
    "TOBILLO O PIE",
    "CUELLO O NUCA",
    "DETRAS DE LA OREJA",
    "CABEZA",
] as const;

export type AreaCorporal = (typeof AreaCorporalValue)[number];