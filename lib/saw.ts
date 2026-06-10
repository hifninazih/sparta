export interface WisataRaw {
  gid: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  distance_m: number;
}

export function calculateSAW(rawData: WisataRaw[], weights: { jarak: number, harga: number, reviews: number, rating: number }) {
  if (rawData.length === 0) return [];

  // 1. Cari Nilai Max/Min
  let minDistance = Infinity;
  let minPrice = Infinity;
  let maxReviews = -Infinity;
  let maxRating = -Infinity;

  rawData.forEach((item) => {
    if (item.distance_m < minDistance) minDistance = item.distance_m;
    if (item.price < minPrice) minPrice = item.price;
    if (item.reviews > maxReviews) maxReviews = item.reviews;
    if (item.rating > maxRating) maxRating = item.rating;
  });

  // 2. Normalisasi & Hitung Skor Akhir
  const scoredData = rawData.map((item) => {
    const normJarak = item.distance_m === 0 ? 1 : minDistance / item.distance_m;
    
    let normHarga = 1;
    if (item.price > 0) {
      normHarga = minPrice === 0 ? 1 / item.price : minPrice / item.price;
    }

    const normReviews = maxReviews === 0 ? 0 : item.reviews / maxReviews;
    const normRating = maxRating === 0 ? 0 : item.rating / maxRating;

    const finalScore =
      normJarak * weights.jarak +
      normHarga * weights.harga +
      normReviews * weights.reviews +
      normRating * weights.rating;

    return {
      ...item,
      score: parseFloat(finalScore.toFixed(4)),
    };
  });

  return scoredData.sort((a, b) => b.score - a.score);
}
