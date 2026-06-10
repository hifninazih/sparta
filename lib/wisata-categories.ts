/**
 * Daftar kategori wisata sesuai database.
 * "Semua" adalah nilai sentinel untuk "tidak ada filter kategori".
 */
export const WISATA_CATEGORIES = [
  "Semua",
  "Desa Wisata",
  "Kampung Wisata",
  "Museum",
  "Wisata Alam",
  "Wisata Bahari",
  "Wisata Buatan",
  "Wisata Sejarah Budaya",
] as const;

export type WisataCategory = (typeof WISATA_CATEGORIES)[number];
