/**
 * Z-Index System untuk halaman /maps
 *
 * Layer hierarchy (dari bawah ke atas):
 * 1. Map Canvas (0) — layer peta itu sendiri
 * 2. Map Controls (10) — tombol zoom, basemap, compass, recommend button
 * 3. Recommendation Panel (20) — sidebar desktop / drawer mobile
 * 4. Search Area Button (30) — tombol "Telusuri area ini" di tengah atas
 * 5. Search Dropdown (40) — dropdown hasil pencarian (di atas panel)
 * 6. Search Input (50) — input bar pencarian (di atas dropdown)
 * 7. Dialog / Modal (60) — preferensi wizard, modal lainnya
 */
export const Z = {
  /** Layer peta dasar */
  mapCanvas: 0,

  /** Kontrol peta: zoom, basemap toggle, compass, tombol rekomendasi */
  mapControls: 10,

  /** Panel hasil rekomendasi (sidebar desktop, drawer handle mobile) */
  recommendationPanel: 20,

  /** Tombol "Telusuri area ini" di tengah atas */
  searchAreaBtn: 30,

  /** Dropdown autocomplete hasil pencarian */
  searchDropdown: 40,

  /** Input bar pencarian (harus di atas dropdown) */
  searchInput: 50,

  /** Dialog modal (preferensi wizard, dll.) — tertinggi di halaman */
  dialog: 60,
} as const;

export type ZIndexKey = keyof typeof Z;
