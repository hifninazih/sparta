import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { calculateSAW } from "@/lib/saw";

// Interface untuk tipe data wisata dari database
interface Wisata {
  gid: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  lng: number;
  lat: number;
  distance_m: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Tangkap parameter dari Body Request
    const body = await request.json();
    const {
      lng,
      lat,
      w_jarak = 50,
      w_harga = 50,
      w_reviews = 50,
      w_rating = 50,
      categories = [], // Array kategori yang dipilih user. Kosong = semua.
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

    // 2. Bangun filter kategori (jika ada)
    // categories adalah array string dari client, misal: ["Alam", "Budaya"]
    // Jika kosong → tidak ada filter (semua kategori diikutsertakan)
    const categoryList: string[] = Array.isArray(categories)
      ? categories.filter((c: unknown) => typeof c === "string")
      : [];

    const hasCategoryFilter = categoryList.length > 0;

    // 3. Tarik Data & Hitung Jarak Fisik (PostGIS)
    // Gunakan ANY($3) untuk filter kategori yang efisien di PostgreSQL
    const queryParams: (number | string[])[] = [
      parseFloat(lng),
      parseFloat(lat),
    ];

    let categoryClause = "";
    if (hasCategoryFilter) {
      categoryClause = "AND c.name = ANY($3)";
      queryParams.push(categoryList);
    }

    const dataQuery = `
      SELECT 
        w.gid::text, 
        w.name, 
        c.name as category, 
        w.price, 
        w.rating, 
        w.reviews,
        w.address,
        w.phone,
        w.link,
        w.maps_link,
        ST_X(w.geom) as lng, 
        ST_Y(w.geom) as lat,
        ST_DistanceSphere(w.geom, ST_MakePoint($1, $2)) as distance_m
      FROM wisata w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE 1=1 ${categoryClause}
    `;

    const client = await pool.connect();
    let rawData: Wisata[] = [];
    try {
      const result = await client.query(dataQuery, queryParams);
      rawData = result.rows;
    } finally {
      client.release();
    }

    if (rawData.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // ==========================================
    // FASE 4: PROSES ALGORITMA SAW (DARI UTILITAS)
    // Data yang masuk sudah terfilter per kategori.
    // SAW hanya bersaing di dalam kategori terpilih.
    // ==========================================
    const totalWeight = w_jarak + w_harga + w_reviews + w_rating;
    const safeTotalWeight = totalWeight === 0 ? 1 : totalWeight;

    const weights = {
      jarak: w_jarak / safeTotalWeight,
      harga: w_harga / safeTotalWeight,
      reviews: w_reviews / safeTotalWeight,
      rating: w_rating / safeTotalWeight,
    };

    const scoredData = calculateSAW(rawData, weights);
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
