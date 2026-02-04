// Liste des départements français avec numéro et nom
export interface Department {
  code: string;
  name: string;
  label: string; // Format "Code - Nom"
}

export const FRENCH_DEPARTMENTS: Department[] = [
  { code: "01", name: "Ain", label: "01 - Ain" },
  { code: "02", name: "Aisne", label: "02 - Aisne" },
  { code: "03", name: "Allier", label: "03 - Allier" },
  { code: "04", name: "Alpes-de-Haute-Provence", label: "04 - Alpes-de-Haute-Provence" },
  { code: "05", name: "Hautes-Alpes", label: "05 - Hautes-Alpes" },
  { code: "06", name: "Alpes-Maritimes", label: "06 - Alpes-Maritimes" },
  { code: "07", name: "Ardèche", label: "07 - Ardèche" },
  { code: "08", name: "Ardennes", label: "08 - Ardennes" },
  { code: "09", name: "Ariège", label: "09 - Ariège" },
  { code: "10", name: "Aube", label: "10 - Aube" },
  { code: "11", name: "Aude", label: "11 - Aude" },
  { code: "12", name: "Aveyron", label: "12 - Aveyron" },
  { code: "13", name: "Bouches-du-Rhône", label: "13 - Bouches-du-Rhône" },
  { code: "14", name: "Calvados", label: "14 - Calvados" },
  { code: "15", name: "Cantal", label: "15 - Cantal" },
  { code: "16", name: "Charente", label: "16 - Charente" },
  { code: "17", name: "Charente-Maritime", label: "17 - Charente-Maritime" },
  { code: "18", name: "Cher", label: "18 - Cher" },
  { code: "19", name: "Corrèze", label: "19 - Corrèze" },
  { code: "2A", name: "Corse-du-Sud", label: "2A - Corse-du-Sud" },
  { code: "2B", name: "Haute-Corse", label: "2B - Haute-Corse" },
  { code: "21", name: "Côte-d'Or", label: "21 - Côte-d'Or" },
  { code: "22", name: "Côtes-d'Armor", label: "22 - Côtes-d'Armor" },
  { code: "23", name: "Creuse", label: "23 - Creuse" },
  { code: "24", name: "Dordogne", label: "24 - Dordogne" },
  { code: "25", name: "Doubs", label: "25 - Doubs" },
  { code: "26", name: "Drôme", label: "26 - Drôme" },
  { code: "27", name: "Eure", label: "27 - Eure" },
  { code: "28", name: "Eure-et-Loir", label: "28 - Eure-et-Loir" },
  { code: "29", name: "Finistère", label: "29 - Finistère" },
  { code: "30", name: "Gard", label: "30 - Gard" },
  { code: "31", name: "Haute-Garonne", label: "31 - Haute-Garonne" },
  { code: "32", name: "Gers", label: "32 - Gers" },
  { code: "33", name: "Gironde", label: "33 - Gironde" },
  { code: "34", name: "Hérault", label: "34 - Hérault" },
  { code: "35", name: "Ille-et-Vilaine", label: "35 - Ille-et-Vilaine" },
  { code: "36", name: "Indre", label: "36 - Indre" },
  { code: "37", name: "Indre-et-Loire", label: "37 - Indre-et-Loire" },
  { code: "38", name: "Isère", label: "38 - Isère" },
  { code: "39", name: "Jura", label: "39 - Jura" },
  { code: "40", name: "Landes", label: "40 - Landes" },
  { code: "41", name: "Loir-et-Cher", label: "41 - Loir-et-Cher" },
  { code: "42", name: "Loire", label: "42 - Loire" },
  { code: "43", name: "Haute-Loire", label: "43 - Haute-Loire" },
  { code: "44", name: "Loire-Atlantique", label: "44 - Loire-Atlantique" },
  { code: "45", name: "Loiret", label: "45 - Loiret" },
  { code: "46", name: "Lot", label: "46 - Lot" },
  { code: "47", name: "Lot-et-Garonne", label: "47 - Lot-et-Garonne" },
  { code: "48", name: "Lozère", label: "48 - Lozère" },
  { code: "49", name: "Maine-et-Loire", label: "49 - Maine-et-Loire" },
  { code: "50", name: "Manche", label: "50 - Manche" },
  { code: "51", name: "Marne", label: "51 - Marne" },
  { code: "52", name: "Haute-Marne", label: "52 - Haute-Marne" },
  { code: "53", name: "Mayenne", label: "53 - Mayenne" },
  { code: "54", name: "Meurthe-et-Moselle", label: "54 - Meurthe-et-Moselle" },
  { code: "55", name: "Meuse", label: "55 - Meuse" },
  { code: "56", name: "Morbihan", label: "56 - Morbihan" },
  { code: "57", name: "Moselle", label: "57 - Moselle" },
  { code: "58", name: "Nièvre", label: "58 - Nièvre" },
  { code: "59", name: "Nord", label: "59 - Nord" },
  { code: "60", name: "Oise", label: "60 - Oise" },
  { code: "61", name: "Orne", label: "61 - Orne" },
  { code: "62", name: "Pas-de-Calais", label: "62 - Pas-de-Calais" },
  { code: "63", name: "Puy-de-Dôme", label: "63 - Puy-de-Dôme" },
  { code: "64", name: "Pyrénées-Atlantiques", label: "64 - Pyrénées-Atlantiques" },
  { code: "65", name: "Hautes-Pyrénées", label: "65 - Hautes-Pyrénées" },
  { code: "66", name: "Pyrénées-Orientales", label: "66 - Pyrénées-Orientales" },
  { code: "67", name: "Bas-Rhin", label: "67 - Bas-Rhin" },
  { code: "68", name: "Haut-Rhin", label: "68 - Haut-Rhin" },
  { code: "69", name: "Rhône", label: "69 - Rhône" },
  { code: "70", name: "Haute-Saône", label: "70 - Haute-Saône" },
  { code: "71", name: "Saône-et-Loire", label: "71 - Saône-et-Loire" },
  { code: "72", name: "Sarthe", label: "72 - Sarthe" },
  { code: "73", name: "Savoie", label: "73 - Savoie" },
  { code: "74", name: "Haute-Savoie", label: "74 - Haute-Savoie" },
  { code: "75", name: "Paris", label: "75 - Paris" },
  { code: "76", name: "Seine-Maritime", label: "76 - Seine-Maritime" },
  { code: "77", name: "Seine-et-Marne", label: "77 - Seine-et-Marne" },
  { code: "78", name: "Yvelines", label: "78 - Yvelines" },
  { code: "79", name: "Deux-Sèvres", label: "79 - Deux-Sèvres" },
  { code: "80", name: "Somme", label: "80 - Somme" },
  { code: "81", name: "Tarn", label: "81 - Tarn" },
  { code: "82", name: "Tarn-et-Garonne", label: "82 - Tarn-et-Garonne" },
  { code: "83", name: "Var", label: "83 - Var" },
  { code: "84", name: "Vaucluse", label: "84 - Vaucluse" },
  { code: "85", name: "Vendée", label: "85 - Vendée" },
  { code: "86", name: "Vienne", label: "86 - Vienne" },
  { code: "87", name: "Haute-Vienne", label: "87 - Haute-Vienne" },
  { code: "88", name: "Vosges", label: "88 - Vosges" },
  { code: "89", name: "Yonne", label: "89 - Yonne" },
  { code: "90", name: "Territoire de Belfort", label: "90 - Territoire de Belfort" },
  { code: "91", name: "Essonne", label: "91 - Essonne" },
  { code: "92", name: "Hauts-de-Seine", label: "92 - Hauts-de-Seine" },
  { code: "93", name: "Seine-Saint-Denis", label: "93 - Seine-Saint-Denis" },
  { code: "94", name: "Val-de-Marne", label: "94 - Val-de-Marne" },
  { code: "95", name: "Val-d'Oise", label: "95 - Val-d'Oise" },
  { code: "971", name: "Guadeloupe", label: "971 - Guadeloupe" },
  { code: "972", name: "Martinique", label: "972 - Martinique" },
  { code: "973", name: "Guyane", label: "973 - Guyane" },
  { code: "974", name: "La Réunion", label: "974 - La Réunion" },
  { code: "976", name: "Mayotte", label: "976 - Mayotte" },
];

// Helper pour obtenir un département par son code
export function getDepartmentByCode(code: string): Department | undefined {
  return FRENCH_DEPARTMENTS.find((d) => d.code === code);
}

// Helper pour obtenir le label formaté (ex: "75 - Paris")
export function getDepartmentLabel(code: string): string {
  const dept = getDepartmentByCode(code);
  return dept ? dept.label : code;
}

// Helper pour obtenir le nom seul
export function getDepartmentName(code: string): string {
  const dept = getDepartmentByCode(code);
  return dept ? dept.name : "";
}
