export interface WisataRaw {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  all_facility: string | string[];
  distance_m: number;
}

export function calculateSAW(rawData: WisataRaw[], weights: { jarak: number, harga: number, fasilitas: number, rating: number }) {
  if (rawData.length === 0) return [];

  // 1. Hitung jumlah fasilitas & cari Nilai Max/Min
  let minDistance = Infinity;
  let minPrice = Infinity;
  let maxFacility = -Infinity;
  let maxRating = -Infinity;

  const processedData = rawData.map((item) => {
    const facilityCount = Array.isArray(item.all_facility)
      ? item.all_facility.length
      : typeof item.all_facility === "string" && item.all_facility.trim() !== ""
        ? item.all_facility.split(",").length
        : 0;

    if (item.distance_m < minDistance) minDistance = item.distance_m;
    if (item.price < minPrice) minPrice = item.price;
    if (facilityCount > maxFacility) maxFacility = facilityCount;
    if (item.rating > maxRating) maxRating = item.rating;

    return { ...item, facilityCount };
  });

  // 2. Normalisasi & Hitung Skor Akhir
  const scoredData = processedData.map((item) => {
    const normJarak = item.distance_m === 0 ? 1 : minDistance / item.distance_m;
    
    let normHarga = 1;
    if (item.price > 0) {
      normHarga = minPrice === 0 ? 1 / item.price : minPrice / item.price;
    }

    const normFasilitas = maxFacility === 0 ? 0 : item.facilityCount / maxFacility;
    const normRating = maxRating === 0 ? 0 : item.rating / maxRating;

    const finalScore =
      normJarak * weights.jarak +
      normHarga * weights.harga +
      normFasilitas * weights.fasilitas +
      normRating * weights.rating;

    return {
      ...item,
      score: parseFloat(finalScore.toFixed(4)),
    };
  });

  return scoredData.sort((a, b) => b.score - a.score);
}
