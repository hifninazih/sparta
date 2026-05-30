import React from "react";
import Link from "next/link";
import { 
  Compass, 
  Map as MapIcon, 
  Zap, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Navigation,
  Star,
  Globe
} from "lucide-react";
import { Button } from "@/components/core/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">SPARTA</span>
          </div>
          <nav className="hidden space-x-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Cara Kerja</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tentang</a>
          </nav>
          <Link href="/maps">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6">
              Mulai Eksplorasi
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-50 blur-3xl opacity-70" />
          <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-indigo-50 blur-3xl opacity-70" />
          
          <div className="container relative mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
                <Zap className="mr-2 h-4 w-4" />
                <span>Rekomendasi Wisata Berbasis Spasial</span>
              </div>
              <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:leading-[1.1]">
                Temukan Destinasi Wisata <br />
                <span className="text-blue-600">Terbaik di Yogyakarta</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
                SPARTA menggunakan algoritma Simple Additive Weighting (SAW) untuk memberikan rekomendasi wisata yang paling sesuai dengan preferensi jarak, harga, dan fasilitas Anda.
              </p>
              <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link href="/maps">
                  <Button size="lg" className="h-14 bg-blue-600 px-8 text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-200">
                    Buka Peta Interaktif <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-slate-200 hover:bg-slate-50">
                  Pelajari Metodologi
                </Button>
              </div>
              
              {/* Mockup / Image Preview */}
              <div className="mt-20 relative w-full max-w-5xl mx-auto">
                <div className="rounded-2xl border-8 border-slate-100 bg-slate-200 shadow-2xl overflow-hidden aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="flex flex-col items-center opacity-40">
                      <MapIcon className="h-20 w-20 text-slate-400 mb-4" />
                      <p className="font-mono text-slate-500">Preview SPARTA WebGIS</p>
                    </div>
                  </div>
                  {/* Decorative map elements */}
                  <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  <div className="absolute top-1/2 left-1/2 h-4 w-4 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <div className="absolute bottom-1/3 right-1/4 h-4 w-4 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-50 py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Fitur Utama SPARTA</h2>
              <p className="mt-4 text-lg text-slate-600">Teknologi GIS modern untuk kemudahan perencanaan wisata Anda.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Analisis SAW",
                  desc: "Algoritma pengambilan keputusan multi-kriteria untuk hasil yang personal.",
                  icon: <Navigation className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: "Visualisasi Spasial",
                  desc: "Pemetaan interaktif dengan data geografis akurat dari seluruh wilayah DIY.",
                  icon: <Globe className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: "Filter Dinamis",
                  desc: "Sesuaikan bobot prioritas antara harga, fasilitas, rating, dan jarak rute.",
                  icon: <Layers className="h-8 w-8 text-blue-600" />,
                },
              ].map((feature, i) => (
                <div key={i} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="mb-4 inline-block rounded-xl bg-blue-50 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-blue-600 px-6 py-16 text-center text-white shadow-2xl shadow-blue-200 sm:px-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Siap Mencari Wisata?</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                Gunakan alat bantu analisis kami untuk merencanakan perjalanan terbaik Anda di Yogyakarta hari ini.
              </p>
              <div className="mt-10 flex justify-center">
                <Link href="/maps">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 text-lg font-bold rounded-full">
                    Mulai Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-black tracking-tighter text-slate-800">SPARTA</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 SPARTA Project. Dibuat untuk optimasi pariwisata daerah.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-slate-600"><Star className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-slate-600"><MapIcon className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
