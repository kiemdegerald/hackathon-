export interface Voyage {
  id: number;
  agenceId: number;
  depart: string;
  arrivee: string;
  date: string; // ISO format : '2025-06-20'
  heure: string;
  prix: number;
}

export const voyages: Voyage[] = [
  {
    id: 1,
    agenceId: 1, // TSR
    depart: "Ouagadougou",
    arrivee: "Bobo-Dioulasso",
    date: "2025-06-20",
    heure: "07:30",
    prix: 7500
  },
  {
    id: 2,
    agenceId: 2, // Rakieta
    depart: "Bobo-Dioulasso",
    arrivee: "Koudougou",
    date: "2025-06-20",
    heure: "10:00",
    prix: 5000
  },
  {
    id: 3,
    agenceId: 3, // STAF
    depart: "Ouagadougou",
    arrivee: "Ouahigouya",
    date: "2025-06-21",
    heure: "08:00",
    prix: 8000
  }
];
