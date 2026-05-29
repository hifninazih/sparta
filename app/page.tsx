import React from "react";
import Link from "next/link";
import { 
  Compass, 
  Map as MapIcon, 
  Zap, 
  Layers, 
  ArrowRight,
  Navigation,
  Globe,
  MapPin,
  Map
} from "lucide-react";
import { Button } from "@/components/core/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-black selection:bg-[#DCFFBC]">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b-2 border-black bg-white shadow-[0px_4px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-blue-600 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-black">SPARTA</span>
          </div>
          <nav className="hidden space-x-8 md:flex">
            <a href="#features" className="text-sm font-bold text-slate-600 hover:text-black hover:underline hover:underline-offset-4 decoration-2 decoration-blue-600 transition-all">Fitur</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-black hover:underline hover:underline-offset-4 decoration-2 decoration-blue-600 transition-all">Cara Kerja</a>
            <a href="#about" className="text-sm font-bold text-slate-600 hover:text-black hover:underline hover:underline-offset-4 decoration-2 decoration-blue-600 transition-all">Tentang</a>
          </nav>
          <Link href="/maps">
            <Button variant="gradient" className="font-black px-6 text-sm">
              Eksplor Peta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-[#f8fafc] to-[#f8fafc]">
          {/* Decorative Grid Pattern (Neo-Brutalism staple) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center rounded-full border-2 border-black bg-[#DCFFBC] px-4 py-1.5 text-sm font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2 hover:rotate-0 transition-transform">
                <Zap className="mr-2 h-4 w-4 text-blue-600 fill-blue-600" />
                <span>Rekomendasi Wisata Cerdas</span>
              </div>
              
              <h1 className="max-w-4xl text-5xl font-black tracking-tighter text-black sm:text-7xl lg:leading-[1.1] drop-shadow-sm">
                Temukan Destinasi Wisata <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-white bg-blue-600 px-4 py-1 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Terbaik di Yogyakarta
                  </span>
                </span>
              </h1>
              
              <p className="mt-10 max-w-2xl text-lg font-medium text-slate-700 sm:text-xl border-l-4 border-blue-600 pl-6 text-left mx-auto">
                SPARTA menggunakan algoritma <strong className="text-black bg-[#DCFFBC] px-1">Simple Additive Weighting (SAW)</strong> untuk memberikan rekomendasi wisata yang paling akurat berdasarkan prioritas jarak, harga, dan fasilitas Anda.
              </p>
              
              <div className="mt-12 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                <Link href="/maps">
                  <Button size="lg" variant="gradient" className="h-16 px-10 text-xl border-4 shadow-[4px_6px_0px_rgba(0,0,0,1)] hover:shadow-[2px_3px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-0.5">
                    Buka Peta Interaktif
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-4 shadow-[4px_6px_0px_rgba(0,0,0,1)] bg-white hover:bg-slate-100 hover:shadow-[2px_3px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-0.5">
                  Pelajari Metodologi
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t-4 border-black bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-black tracking-tighter text-black sm:text-5xl uppercase inline-block border-b-4 border-blue-600 pb-2">Fitur Utama SPARTA</h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Analisis SAW",
                  desc: "Algoritma pengambilan keputusan multi-kriteria untuk hasil yang sangat personal dan akurat.",
                  icon: <Navigation className="h-10 w-10 text-white" />,
                  color: "bg-blue-600"
                },
                {
                  title: "Visualisasi Spasial",
                  desc: "Pemetaan interaktif dengan data geografis akurat dari seluruh wilayah Daerah Istimewa Yogyakarta.",
                  icon: <Globe className="h-10 w-10 text-black" />,
                  color: "bg-[#DCFFBC]"
                },
                {
                  title: "Filter Dinamis",
                  desc: "Sesuaikan bobot prioritas sesuka Anda. Harga murah? Jarak dekat? Anda yang tentukan.",
                  icon: <Layers className="h-10 w-10 text-black" />,
                  color: "bg-[#6FD1D7]"
                },
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                  <div className={`mb-6 inline-flex rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-black">{feature.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 border-y-4 border-black bg-[#DCFFBC]">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="rounded-3xl border-4 border-black bg-white px-6 py-20 text-center shadow-[16px_16px_0px_rgba(0,0,0,1)] sm:px-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
                <Map className="w-64 h-64" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-black sm:text-6xl relative z-10">Mulai Eksplorasi Sekarang</h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-slate-600 relative z-10">
                Jangan habiskan waktu untuk bingung mencari tujuan. Biarkan SPARTA yang menghitung destinasi terbaik untuk Anda.
              </p>
              <div className="mt-12 flex justify-center relative z-10">
                <Link href="/maps">
                  <Button size="lg" className="bg-black text-white hover:bg-slate-800 h-16 px-12 text-xl font-black rounded-full border-4 border-transparent hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
                    <MapPin className="mr-3 h-6 w-6" /> Cari Wisata
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-blue-600">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">SPARTA</span>
            </div>
            <p className="text-sm font-bold text-slate-400">
              © 2026 SPARTA Project. Neo-Brutalism Edition.
            </p>
            <div className="flex space-x-6">
              <Link href="/admin" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
