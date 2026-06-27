import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import * as xlsx from "xlsx";

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lng = searchParams.get("lng");
    const lat = searchParams.get("lat");
    const w_jarak = parseFloat(searchParams.get("w_jarak") || "50");
    const w_harga = parseFloat(searchParams.get("w_harga") || "50");
    const w_reviews = parseFloat(searchParams.get("w_reviews") || "50");
    const w_rating = parseFloat(searchParams.get("w_rating") || "50");
    const categoriesParam = searchParams.get("categories");

    const format = searchParams.get("format") || "xlsx";

    if (!lng || !lat) {
      return NextResponse.json(
        { success: false, message: "Koordinat lokasi asal (lng, lat) wajib diisi." },
        { status: 400 }
      );
    }

    const categoryList: string[] = categoriesParam
      ? categoriesParam.split(",").map(c => c.trim()).filter(c => c.length > 0)
      : [];

    const hasCategoryFilter = categoryList.length > 0;

    const queryParams: (number | string[])[] = [
      parseFloat(lng),
      parseFloat(lat),
    ];

    let categoryClause = "";
    if (hasCategoryFilter) {
      categoryClause = "AND c.nama = ANY($3)";
      queryParams.push(categoryList);
    }

    const dataQuery = `
      SELECT 
        w.gid::text, 
        w.nama_destinasi as name, 
        c.nama as category, 
        sk.nama as sub_kategori,
        w.harga as price, 
        w.rating_gmaps as rating, 
        w.jumlah_ulasan as reviews,
        w.alamat as address,
        w.web as link,
        w.link_gmaps as maps_link,
        w.username_instagram,
        w.daya_tarik_utama,
        w.daya_tarik_pendukung,
        ST_X(w.geom) as lng, 
        ST_Y(w.geom) as lat,
        ad.namobj as desa,
        ad.wadmkc as kecamatan,
        ad.wadmkk as kabupaten,
        ST_DistanceSphere(w.geom, ST_MakePoint($1, $2)) as distance_m
      FROM destinasi w
      LEFT JOIN kategori c ON w.kategori_id = c.id
      LEFT JOIN sub_kategori sk ON w.sub_kategori_id = sk.id
      LEFT JOIN LATERAL (
        SELECT namobj, wadmkc, wadmkk 
        FROM administrasi_desa 
        WHERE ST_Intersects(w.geom, geom) 
        LIMIT 1
      ) ad ON true
      WHERE c.is_active = true 
        AND (sk.is_active = true OR w.sub_kategori_id IS NULL)
        AND w.harga IS NOT NULL 
        AND w.rating_gmaps IS NOT NULL 
        AND w.jumlah_ulasan IS NOT NULL
        ${categoryClause}
    `;

    const client = await pool.connect();
    let rawData: Wisata[] = [];
    try {
      const result = await client.query(dataQuery, queryParams);
      rawData = result.rows.map(r => ({
        ...r,
        price: parseFloat(r.price),
        rating: parseFloat(r.rating),
        reviews: parseFloat(r.reviews),
        distance_m: parseFloat(r.distance_m)
      }));
    } finally {
      client.release();
    }

    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada data wisata yang memenuhi kriteria." },
        { status: 404 }
      );
    }

    // Kalkulasi SAW (seperti di simulasi)
    const totalWeight = w_jarak + w_harga + w_reviews + w_rating;
    const safeTotalWeight = totalWeight === 0 ? 1 : totalWeight;

    const weights = {
      jarak: w_jarak / safeTotalWeight,
      harga: w_harga / safeTotalWeight,
      reviews: w_reviews / safeTotalWeight,
      rating: w_rating / safeTotalWeight,
    };

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

    const sheetMentah = rawData.map((item, i) => ({
      "No": i + 1,
      "Nama Destinasi": item.name,
      "Kategori": item.category,
      "Jarak (m) [Cost]": item.distance_m,
      "Harga (Rp) [Cost]": item.price,
      "Rating [Benefit]": item.rating,
      "Ulasan [Benefit]": item.reviews
    }));

    const scoredData = rawData.map(item => {
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
        normJarak,
        normHarga,
        normReviews,
        normRating,
        score: parseFloat(finalScore.toFixed(4)),
      };
    });

    const sheetNormalisasi = scoredData.map((item, i) => ({
      "No": i + 1,
      "Nama Destinasi": item.name,
      "Norm Jarak": item.normJarak,
      "Norm Harga": item.normHarga,
      "Norm Rating": item.normRating,
      "Norm Ulasan": item.normReviews
    }));

    scoredData.sort((a, b) => b.score - a.score);

    const sheetHasil = scoredData.map((item, index) => ({
      "Peringkat": index + 1,
      "Nama Destinasi": item.name,
      "Kategori": item.category,
      "Skor Akhir": item.score
    }));

    const nilaiMinMax = {
      "Min Jarak": minDistance,
      "Min Harga": minPrice,
      "Max Rating": maxRating,
      "Max Ulasan": maxReviews
    };

    if (format === "json") {
      return NextResponse.json({
        success: true,
        data: {
          mentah: sheetMentah,
          min_max: nilaiMinMax,
          normalisasi: sheetNormalisasi,
          hasil_akhir: sheetHasil
        }
      });
    }

    const wsMinMax = xlsx.utils.json_to_sheet([nilaiMinMax]);

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(sheetMentah), "1. Data Asli");
    xlsx.utils.book_append_sheet(wb, wsMinMax, "Nilai Max Min");
    xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(sheetNormalisasi), "2. Normalisasi");
    xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(sheetHasil), "3. Hasil Akhir");

    if (format === "csv") {
      // CSV format can only contain one sheet. We will export the Hasil Akhir sheet.
      const buf = xlsx.write(wb, { type: "buffer", bookType: "csv", sheet: "3. Hasil Akhir" });
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Disposition": 'attachment; filename="simulasi_saw.csv"',
          "Content-Type": "text/csv",
        },
      });
    }

    // Default: xlsx
    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="simulasi_saw.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("Export SAW Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat membuat file excel." },
      { status: 500 }
    );
  }
}
