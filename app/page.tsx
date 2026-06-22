import Link from "next/link";
import {
  Compass,
  Zap,
  Layers,
  Navigation,
  Globe,
  MapPin,
  Map,
} from "lucide-react";
import { Button } from "@/components/core/button";
import Header from "@/components/layout/Header";
import LandingMapWrapper from "@/components/map/LandingMapWrapper";

export const metadata = {
  title: "SPARTA - Rekomendasi Pariwisata Yogyakarta Cerdas (SAW)",
  description:
    "Temukan pariwisata terbaik di Yogyakarta secara spasial dengan sistem rekomendasi multi-kriteria Simple Additive Weighting (SAW).",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-black selection:bg-[#DCFFBC]">
      {/* Navigation */}
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-[#f8fafc] to-[#f8fafc] py-16 lg:py-28">
          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="relative container mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column (Hero Title & Actions) */}
              <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
                <div className="mb-6 inline-flex -rotate-1 transform items-center rounded-full border-2 border-black bg-[#DCFFBC] px-4 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 sm:text-sm">
                  <Zap className="mr-2 h-4 w-4 fill-blue-600 text-blue-600" />
                  <span>SISTEM REKOMENDASI WISATA</span>
                </div>

                <h1 className="max-w-xl text-4xl font-black tracking-tighter text-black drop-shadow-sm sm:text-6xl lg:text-7xl lg:leading-[1.05]">
                  Temukan Wisata <br className="hidden sm:inline" />
                  <span className="relative mt-2 inline-block">
                    <span className="relative z-10 rounded-xl border-2 border-black bg-blue-600 px-3 py-0.5 text-2xl text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:border-4 sm:px-6 sm:py-2 sm:text-5xl sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] lg:text-6xl">
                      Terbaik di Jogja
                    </span>
                  </span>
                </h1>

                <p className="mx-auto mt-8 max-w-2xl border-l-4 border-blue-600 pl-4 text-left text-base font-medium text-slate-700 sm:pl-6 sm:text-lg lg:mx-0">
                  SPARTA mengintegrasikan visualisasi peta WebGIS dengan
                  algoritma{" "}
                  <strong className="bg-[#DCFFBC] px-1 text-black">
                    Simple Additive Weighting (SAW)
                  </strong>{" "}
                  untuk memberikan rekomendasi wisata yang disesuaikan
                  berdasarkan kriteria Jarak, Harga, Rating, dan Ulasan.
                </p>

                <div className="mt-8 flex w-full max-w-sm flex-col space-y-4 sm:max-w-none sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:justify-start">
                  <Link href="/maps" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="gradient"
                      className="h-14 w-full border-2 px-8 text-base shadow-[1px_2px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[3px_4px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] sm:text-lg"
                    >
                      Buka Peta
                    </Button>
                  </Link>
                  <a href="#how-it-works" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full border-2 bg-white px-8 text-base shadow-[1px_2px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-[3px_4px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] sm:text-lg"
                    >
                      Pelajari Metodologi
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Column (CSS Browser Map Mockup) */}
              <div className="w-full lg:col-span-5">
                <div className="animate-in fade-in slide-in-from-bottom-8 relative mx-auto mt-6 w-full max-w-md duration-500 md:max-w-lg lg:mt-0 lg:max-w-none">
                  {/* Mockup shadow background */}
                  <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-4 border-black bg-black"></div>

                  {/* Mockup window */}
                  <div className="relative flex h-80 flex-col overflow-hidden rounded-2xl border-4 border-black bg-white sm:h-[400px]">
                    {/* Browser header bar */}
                    <div className="flex items-center justify-between border-b-2 border-black bg-[#DCFFBC] px-4 py-3 select-none">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full border border-black bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full border border-black bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full border border-black bg-green-500"></div>
                      </div>
                      <div className="xs:block w-48 truncate rounded-md border border-black bg-white px-3 py-0.5 text-center text-[9px] font-bold tracking-wide">
                        sparta.maps
                      </div>
                      <div className="h-3 w-3"></div>
                    </div>

                    {/* Real Map Canvas (Non-interactive) */}
                    <div className="relative h-full flex-1 overflow-hidden bg-slate-100">
                      <LandingMapWrapper />

                      {/* Floating Search Bar */}
                      <div className="absolute top-3 left-3 z-10 flex w-44 items-center gap-2 rounded-lg border-2 border-black bg-white p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none sm:w-64">
                        <div className="h-3 w-3 animate-pulse rounded-full border border-black bg-[#DCFFBC]"></div>
                        <div className="h-2.5 w-24 rounded bg-slate-200"></div>
                      </div>

                      {/* Floating Recommendation Panel */}
                      <div className="absolute right-3 bottom-3 z-10 flex max-w-[120px] flex-col gap-1 rounded-xl border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none sm:max-w-[160px]">
                        <span className="text-[7px] font-black tracking-wider text-slate-400 uppercase">
                          Rekomendasi Teratas
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-600 text-[7px] font-black text-white">
                            1
                          </div>
                          <span className="truncate text-[9px] font-black text-black">
                            Malioboro
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-black text-[7px] font-black text-white">
                            2
                          </div>
                          <span className="truncate text-[9px] font-bold text-slate-700">
                            Kaliurang
                          </span>
                        </div>
                      </div>

                      {/* Map Compass */}
                      <div className="absolute bottom-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none">
                        <div className="relative flex h-5 w-1.5 rotate-[35deg] transform flex-col">
                          <div className="h-2.5 w-full rounded-t-full bg-red-500"></div>
                          <div className="h-2.5 w-full rounded-b-full bg-slate-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-t-4 border-black bg-white py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-20 text-center">
              <h2 className="inline-block border-b-4 border-blue-600 pb-2 text-4xl font-black tracking-tighter text-black uppercase select-none sm:text-5xl">
                Fitur Utama SPARTA
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Sistem Rekomendasi SAW",
                  desc: "Algoritma yang merangking destinasi terbaik berdasarkan perhitungan bobot prioritas Anda (Harga, Jarak, Rating, Ulasan).",
                  icon: <Navigation className="h-10 w-10 text-white" />,
                  color: "bg-blue-600",
                },
                {
                  title: "Integrasi Data Hybrid",
                  desc: "Menggabungkan validitas lokasi wisata resmi dari Dinas Pariwisata dengan data rating dan ulasan publik dari Google Maps.",
                  icon: <Layers className="h-10 w-10 text-black" />,
                  color: "bg-[#DCFFBC]",
                },
                {
                  title: "Visualisasi Peta WebGIS",
                  desc: "Eksplorasi pariwisata lebih mudah melalui antarmuka peta interaktif berbasis spasial yang memetakan ratusan titik lokasi wisata.",
                  icon: <Globe className="h-10 w-10 text-black" />,
                  color: "bg-[#6FD1D7]",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border-4 border-black bg-white p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)]"
                >
                  <div
                    className={`mb-6 inline-flex rounded-xl border-2 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-black">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed font-medium text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAW Methodology Section */}
        <section
          id="how-it-works"
          className="border-t-4 border-black bg-[#f8fafc] py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-20 text-center">
              <h2 className="inline-block border-b-4 border-blue-600 pb-2 text-4xl font-black tracking-tighter text-black uppercase select-none sm:text-5xl">
                Bagaimana SAW Bekerja?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm font-bold text-slate-600 sm:text-base">
                Metode Simple Additive Weighting (SAW) mencari penjumlahan
                terbobot dari kinerja setiap alternatif pada semua kriteria.
                Berikut adalah 4 tahapan di SPARTA:
              </p>
            </div>

            {/* Steps Layout */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Kriteria Preferensi",
                  desc: "Anda memasukkan bobot kepentingan untuk empat kriteria utama: Jarak (Cost), Harga Tiket (Cost), Rating (Benefit), dan Jumlah Ulasan (Benefit).",
                  color: "bg-[#FFF59D]",
                },
                {
                  step: "02",
                  title: "Normalisasi Nilai",
                  desc: "Kriteria Benefit (rating, ulasan) dibagi dengan nilai maksimal. Untuk Kriteria Cost (harga, jarak), nilai minimal dibagi dengan nilai destinasi tersebut, sehingga skala terselaraskan.",
                  color: "bg-[#DCFFBC]",
                },
                {
                  step: "03",
                  title: "Matriks Terbobot",
                  desc: "Setiap nilai ternormalisasi dikalikan dengan bobot kriteria yang telah Anda atur sebelumnya pada panel input.",
                  color: "bg-[#6FD1D7]",
                },
                {
                  step: "04",
                  title: "Skor Akhir & Ranking",
                  desc: "Semua hasil perkalian kriteria dijumlahkan menjadi total skor. Wisata diurutkan dari skor tertinggi untuk direkomendasikan.",
                  color: "bg-blue-600 text-white border-blue-600",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <div
                      className={`mb-6 inline-block rounded-xl border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] ${step.color}`}
                    >
                      Langkah {step.step}
                    </div>
                    <h3 className="mb-3 text-xl leading-tight font-black text-black">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed font-semibold text-slate-600">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formula Visual Card */}
            <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-8 rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] sm:p-8 md:flex-row">
              <div className="w-full flex-1">
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                  Rumus Matematika SAW
                </span>
                <h3 className="mt-1 text-2xl font-black text-black">
                  Sederhana & Objektif
                </h3>
                <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
                  Skor akhir rekomendasi diperoleh dengan menjumlahkan hasil
                  perkalian bobot kriteria dengan nilai normalisasi pariwisata:
                </p>

                {/* Visual Block Formula */}
                <div className="mt-6 flex flex-nowrap items-center justify-center gap-1 rounded-xl border-2 border-black bg-slate-50 p-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] select-none sm:gap-2 sm:p-4">
                  {/* V_i */}
                  <div className="flex shrink-0 flex-col items-center rounded-lg border-2 border-black bg-[#6FD1D7] px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] sm:px-2.5 sm:py-1 sm:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="hidden text-[8px] font-black tracking-wider text-black/60 uppercase sm:block">
                      Skor Akhir
                    </span>
                    <span className="font-mono text-xs font-black sm:text-sm">
                      V<sub>i</sub>
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-black text-black sm:text-lg">
                    =
                  </span>

                  {/* Sigma */}
                  <span
                    className="shrink-0 px-0.5 font-serif text-xl font-black sm:text-3xl"
                    title="Jumlahkan seluruh kriteria"
                  >
                    Σ
                  </span>

                  <span className="shrink-0 font-mono text-xs font-black text-slate-400 sm:text-lg">
                    (
                  </span>

                  {/* w_j */}
                  <div className="flex shrink-0 flex-col items-center rounded-lg border-2 border-black bg-[#FFF59D] px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] sm:px-2.5 sm:py-1 sm:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="hidden text-[8px] font-black tracking-wider text-black/60 uppercase sm:block">
                      Bobot
                    </span>
                    <span className="font-mono text-xs font-black sm:text-sm">
                      w<sub>j</sub>
                    </span>
                  </div>

                  <span className="shrink-0 text-[8px] font-black text-slate-400 sm:text-xs">
                    ×
                  </span>

                  {/* r_ij */}
                  <div className="flex shrink-0 flex-col items-center rounded-lg border-2 border-black bg-[#DCFFBC] px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] sm:px-2.5 sm:py-1 sm:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="hidden text-[8px] font-black tracking-wider text-black/60 uppercase sm:block">
                      Normalisasi
                    </span>
                    <span className="font-mono text-xs font-black sm:text-sm">
                      r<sub>ij</sub>
                    </span>
                  </div>

                  <span className="shrink-0 font-mono text-xs font-black text-slate-400 sm:text-lg">
                    )
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-1 flex-col gap-2 border-t-2 border-black pt-6 md:border-t-0 md:border-l-2 md:pt-0 md:pl-8">
                <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  4 Kriteria SPARTA:
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-black">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-red-400"></span>{" "}
                  <strong>Harga Tiket</strong> (Cost - Semakin murah)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-black">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-blue-400"></span>{" "}
                  <strong>Jarak Tempuh</strong> (Cost - Semakin dekat)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-black">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-yellow-300"></span>{" "}
                  <strong>Rating Wisata</strong> (Benefit - Semakin tinggi)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-black">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black bg-green-400"></span>{" "}
                  <strong>Jumlah Ulasan</strong> (Benefit - Semakin banyak)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="border-t-4 border-black bg-white py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="flex flex-col items-center gap-16 lg:flex-row">
              {/* Left Text */}
              <div className="flex-1">
                <div className="mb-4 inline-block rounded-full border-2 border-black bg-[#6FD1D7] px-3.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  SISTEM PENDUKUNG KEPUTUSAN PARIWISATA
                </div>
                <h2 className="text-4xl leading-none font-black tracking-tighter text-black uppercase select-none sm:text-5xl">
                  Daerah Istimewa Yogyakarta
                </h2>
                <p className="mt-6 leading-relaxed font-semibold text-slate-600">
                  Yogyakarta merupakan salah satu pusat kebudayaan dan
                  pariwisata terbesar di Indonesia dengan ratusan destinasi
                  mulai dari sejarah keraton, peninggalan candi megah, keragaman
                  alam, hingga deretan pantai eksotis.
                </p>
                <p className="mt-4 leading-relaxed font-medium text-slate-600">
                  Menghadapi pilihan destinasi pariwisata yang sangat banyak,
                  wisatawan sering kali kesulitan menetapkan prioritas
                  perjalanan.{" "}
                  <strong>
                    SPARTA (Sistem Pemetaan dan Rekomendasi Wisata di
                    Yogyakarta)
                  </strong>{" "}
                  dirancang untuk menyatukan parameter spasial dengan keputusan
                  logis matematika. Dengan memadukan data resmi dari{" "}
                  <strong>Dinas Pariwisata</strong> dan data sentimen riil dari{" "}
                  <strong>Google Maps</strong>, perencanaan liburan Anda menjadi
                  objektif, efisien, dan sangat terpersonalisasi.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-xl border-2 border-black bg-blue-600 px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    #TugasSkripsiGeodesiUGM
                  </div>
                  <div className="rounded-xl border-2 border-black bg-[#DCFFBC] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    #WisataJogja
                  </div>
                  <div className="rounded-xl border-2 border-black bg-[#FFF59D] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    #WebGISYogyakarta
                  </div>
                  <div className="rounded-xl border-2 border-black bg-[#6FD1D7] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    #DecisionSupportSystem
                  </div>
                </div>
              </div>

              {/* Right Graphical Stat Cards */}
              <div className="grid w-full flex-1 grid-cols-2 gap-4">
                <div className="rounded-2xl border-4 border-black bg-white p-6 text-center shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                  <span className="block text-5xl font-black text-blue-600">
                    320+
                  </span>
                  <span className="mt-2 block text-xs font-black tracking-wider text-black uppercase">
                    Destinasi Wisata
                  </span>
                </div>
                <div className="rounded-2xl border-4 border-black bg-[#FFF59D] p-6 text-center shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                  <span className="block text-5xl font-black text-black">
                    4
                  </span>
                  <span className="mt-2 block text-xs font-black tracking-wider text-slate-800 uppercase">
                    Kategori Utama
                  </span>
                </div>
                <div className="col-span-2 rounded-2xl border-4 border-black bg-[#DCFFBC] p-6 text-center shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                  <span className="block text-2xl font-black text-black">
                    Matriks Keputusan
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-slate-700">
                    Menghilangkan subjektivitas pariwisata dengan
                    mengkalkulasikan data ulasan Google Maps, jarak spasial, dan
                    harga tiket masuk.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="border-t-4 border-black bg-[#f8fafc] py-24"
        >
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="inline-block border-b-4 border-blue-600 pb-2 text-4xl font-black tracking-tighter text-black uppercase select-none sm:text-5xl">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Bagaimana cara SPARTA mengukur jarak?",
                  a: "Jarak diukur secara langsung (garis lurus) antara titik koordinat awal yang Anda tetapkan di peta (atau dari lokasi sensor GPS Anda) dengan koordinat lokasi wisata yang tersimpan di dalam basis data PostGIS.",
                },
                {
                  q: "Apakah data harga tiket masuk selalu ter-update?",
                  a: "Data harga tiket dan operasional wisata di database kami merujuk pada data sekunder pariwisata Yogyakarta. Estimasi harga tiket dapat bervariasi bergantung hari libur atau kebijakan pengelola pariwisata setempat.",
                },
                {
                  q: "Mengapa saya disarankan menggunakan sistem SAW ini?",
                  a: "Ketika merencanakan pariwisata dengan rombongan atau budget tertentu, Anda sering kali memiliki batasan tersendiri (misal: mencari yang termurah namun dengan rating ulasan yang sangat baik). SAW membantu mengkombinasikan keinginan yang kontradiktif ini ke dalam satu nilai skor matematis mutlak.",
                },
                {
                  q: "Darimana sumber data wisata dan rating di SPARTA?",
                  a: "SPARTA menggunakan pendekatan data hybrid. Titik koordinat dan profil wisata bersumber dari data resmi Dinas Pariwisata DIY, sedangkan data rating, jumlah ulasan, dan harga tiket diambil dari publik/komunitas melalui Google Maps untuk menjamin objektivitas.",
                },
                {
                  q: "Apakah data di SPARTA mencakup seluruh kabupaten di DIY?",
                  a: "Ya, basis data kami memetakan lebih dari 320 destinasi wisata unggulan yang tersebar di Kota Yogyakarta, Kabupaten Sleman, Kabupaten Bantul, Kabupaten Kulon Progo, hingga Kabupaten Gunungkidul.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all open:shadow-[6px_6px_0px_rgba(0,0,0,1)] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-base font-black text-black outline-none select-none sm:text-lg">
                    <span>{faq.q}</span>
                    <span className="ml-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#DCFFBC] shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-transform group-open:rotate-180">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 border-t-2 border-dashed border-black pt-4 text-xs leading-relaxed font-semibold text-slate-600 sm:text-sm">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t-4 border-black bg-[#DCFFBC] py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="relative overflow-hidden rounded-3xl border-4 border-black bg-white px-4 py-16 text-center shadow-[8px_8px_0px_rgba(0,0,0,1)] sm:px-12 sm:py-20 sm:shadow-[16px_16px_0px_rgba(0,0,0,1)]">
              <div className="pointer-events-none absolute -top-10 -right-10 rotate-12 opacity-10 select-none">
                <Map className="h-64 w-64" />
              </div>
              <h2 className="relative z-10 text-3xl leading-tight font-black tracking-tighter text-black sm:text-6xl">
                Mulai Rencanakan <br className="sm:hidden" /> Perjalanan Anda
              </h2>
              <p className="relative z-10 mx-auto mt-6 max-w-xl text-base font-medium text-slate-600 sm:text-lg">
                Lupakan kebingungan dalam memilih tempat berlibur. Gunakan
                visualisasi peta cerdas kami dan biarkan algoritma SAW
                merekomendasikannya.
              </p>
              <div className="relative z-10 mt-10 flex w-full justify-center">
                <Link href="/maps" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-16 w-full rounded-full border-4 border-transparent bg-black px-12 text-lg font-black text-white transition-all hover:border-blue-600 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] sm:w-auto sm:text-xl"
                  >
                    <MapPin className="mr-3 h-5 w-5 animate-bounce sm:h-6 sm:w-6" />{" "}
                    Eksplor Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-blue-600">
                <Compass className="animate-spin-slow h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter">
                  SPARTA
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Tugas Skripsi Teknik Geodesi UGM
                </span>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-slate-400 sm:text-sm md:text-left">
              © 2026 SPARTA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/admin"
                className="text-xs font-black text-slate-400 transition-all hover:text-[#DCFFBC] hover:underline sm:text-sm"
              >
                Login Dashboard Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
