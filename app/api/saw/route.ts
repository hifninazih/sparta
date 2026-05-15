import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Interface untuk tipe data wisata dari database
interface Wisata {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  all_facility: string | string[];
  lng: number;
  lat: number;
  distance_m: number;
}

export async function POST(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 1. Tangkap parameter dari Body Request
    const body = await request.json();
    const {
      lng,
      lat,
      w_jarak = 50,
      w_harga = 50,
      w_fasilitas = 50,
      w_rating = 50,
    } = body;

    if (!lng || !lat) {
      return NextResponse.json(
        {
          success: false,
          message: "Koordinat lokasi asal (lng, lat) wajib diisi.",
        },
        { status: 400 },
      );
    }

    // 2. Tarik Data & Hitung Jarak Fisik (PostGIS)
    const dataQuery = `
      SELECT 
        id, 
        name, 
        category, 
        price, 
        rating, 
        all_facility,
        ST_X(geom) as lng, 
        ST_Y(geom) as lat,
        ST_DistanceSphere(geom, ST_MakePoint($1, $2)) as distance_m
      FROM wisata_diy 
    `;

    const client = await pool.connect();
    let rawData: Wisata[] = [];
    try {
      const result = await client.query(dataQuery, [
        parseFloat(lng),
        parseFloat(lat),
      ]);
      rawData = result.rows;
    } finally {
      client.release();
    }

    if (rawData.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // ==========================================
    // FASE 3: PROSES ALGORITMA SAW
    // ==========================================

    // A. Normalisasi Bobot Preferensi (Agar totalnya menjadi 1 atau 100%)
    const totalWeight = w_jarak + w_harga + w_fasilitas + w_rating;
    // Cegah pembagian dengan 0 jika user entah bagaimana menggeser semua slider ke 0
    const safeTotalWeight = totalWeight === 0 ? 1 : totalWeight;

    const weight = {
      jarak: w_jarak / safeTotalWeight,
      harga: w_harga / safeTotalWeight,
      fasilitas: w_fasilitas / safeTotalWeight,
      rating: w_rating / safeTotalWeight,
    };

    // B. Cari Nilai Max dan Min untuk Normalisasi Matriks
    let minDistance = Infinity;
    let minPrice = Infinity;
    let maxFacility = -Infinity;
    let maxRating = -Infinity;

    // Persiapkan data dengan menghitung jumlah fasilitas terlebih dahulu
    const processedData = rawData.map((item) => {
      // Asumsi: all_facility berupa string dipisah koma ATAU array JSON
      const facilityCount = Array.isArray(item.all_facility)
        ? item.all_facility.length
        : typeof item.all_facility === "string" &&
            item.all_facility.trim() !== ""
          ? item.all_facility.split(",").length
          : 0;

      // Update nilai Max / Min
      if (item.distance_m < minDistance) minDistance = item.distance_m;
      if (item.price < minPrice) minPrice = item.price;
      if (facilityCount > maxFacility) maxFacility = facilityCount;
      if (item.rating > maxRating) maxRating = item.rating;

      return { ...item, facilityCount };
    });

    // C. Hitung Matriks Ternormalisasi (R) & Skor Akhir (V)
    const scoredData = processedData.map((item) => {
      // 1. Kriteria Jarak (COST - Semakin dekat semakin baik)
      // Jika jarak 0 (user sedang di lokasi), berikan nilai absolut 1
      const normJarak =
        item.distance_m === 0 ? 1 : minDistance / item.distance_m;

      // 2. Kriteria Harga (COST - Semakin murah semakin baik)
      // Jika harga 0 (Gratis), berikan nilai absolut 1
      let normHarga = 1;
      if (item.price > 0) {
        normHarga = minPrice === 0 ? 1 / item.price : minPrice / item.price;
      }

      // 3. Kriteria Fasilitas (BENEFIT - Semakin banyak semakin baik)
      const normFasilitas =
        maxFacility === 0 ? 0 : item.facilityCount / maxFacility;

      // 4. Kriteria Rating (BENEFIT - Semakin tinggi semakin baik)
      const normRating = maxRating === 0 ? 0 : item.rating / maxRating;

      // 5. PENJUMLAHAN AKHIR (Skor SAW)
      const finalScore =
        normJarak * weight.jarak +
        normHarga * weight.harga +
        normFasilitas * weight.fasilitas +
        normRating * weight.rating;

      return {
        ...item,
        score: parseFloat(finalScore.toFixed(4)), // Bulatkan 4 angka di belakang koma
        details: { normJarak, normHarga, normFasilitas, normRating }, // Opsional: Untuk debugging
      };
    });

    // 4. Urutkan berdasarkan Skor Tertinggi dan ambil Top 10 Rekomendasi
    scoredData.sort((a, b) => b.score - a.score);
    const topRecommendations = scoredData.slice(0, 10);

    return NextResponse.json({
      success: true,
      data: topRecommendations,
    });
  } catch (error) {
    console.error("SAW Calculation Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghitung rekomendasi SAW" },
      { status: 500 },
    );
  }
}
