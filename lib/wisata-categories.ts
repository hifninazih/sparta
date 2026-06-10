/**
 * Daftar kategori wisata sesuai database.
 * "Semua" adalah nilai sentinel untuk "tidak ada filter kategori".
 */
export const WISATA_CATEGORIES = [
  "Desa Wisata",
  "Kampung Wisata",
  "Museum",
  "Wisata Alam",
  "Wisata Bahari",
  "Wisata Buatan",
  "Wisata Sejarah Budaya",
] as const;

export type WisataCategory = (typeof WISATA_CATEGORIES)[number];

export function getCategoryColor(category: string): string {
  switch (category) {
    case "Desa Wisata": return "#FCD34D"; // Kuning (Amber-300)
    case "Kampung Wisata": return "#FDBA74"; // Oranye (Orange-300)
    case "Museum": return "#C084FC"; // Ungu (Purple-400)
    case "Wisata Alam": return "#86EFAC"; // Hijau (Green-300)
    case "Wisata Bahari": return "#93C5FD"; // Biru (Blue-300)
    case "Wisata Buatan": return "#F9A8D4"; // Pink (Pink-300)
    case "Wisata Sejarah Budaya": return "#FCA5A5"; // Merah/Terracotta (Red-300)
    default: return "#E2E8F0"; // Slate-200
  }
}
