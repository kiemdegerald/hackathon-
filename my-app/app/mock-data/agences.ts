export interface Agence {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  ville: string;
}

export const agences: Agence[] = [
  {
    id: 1,
    nom: "TSR",
    telephone: "+22670000001",
    email: "contact@tsr.bf",
    ville: "Ouagadougou",
  },
  {
    id: 2,
    nom: "Rakieta",
    telephone: "+22670000002",
    email: "info@rakieta.bf",
    ville: "Bobo-Dioulasso",
  },
  {
    id: 3,
    nom: "STAF",
    telephone: "+22670000003",
    email: "support@staf.bf",
    ville: "Ouagadougou",
  }
];
