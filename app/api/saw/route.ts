import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { calculateSAW } from "@/lib/saw";

// Interface untuk tipe data wisata dari database
interface Wisata {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  all_facility: string;
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
    // FASE 3: PROSES ALGORITMA SAW (DARI UTILITAS)
    // ==========================================
    const totalWeight = w_jarak + w_harga + w_fasilitas + w_rating;
    const safeTotalWeight = totalWeight === 0 ? 1 : totalWeight;

    const weights = {
      jarak: w_jarak / safeTotalWeight,
      harga: w_harga / safeTotalWeight,
      fasilitas: w_fasilitas / safeTotalWeight,
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
