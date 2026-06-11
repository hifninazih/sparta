"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/core/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      // 1. Otomatis menutup menu ketika halaman di-scroll
      setIsOpen(false);

      // 2. Deteksi seksi aktif (Scrollspy)
      const sections = ["features", "how-it-works", "about", "faq"];
      const scrollPosition = window.scrollY + 120; // offset untuk tinggi header (80px) + buffer

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      // Jika berada di bagian paling atas hero, bersihkan active status
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-black bg-white shadow-[0px_4px_0px_rgba(0,0,0,1)]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-blue-600 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Compass className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-black select-none">
            SPARTA
          </span>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-slate-50 md:hidden active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
        >
          {isOpen ? (
            <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Navigation Menu with Smooth Transition */}
        <nav
          className={cn(
            "absolute top-20 left-0 w-full border-b-2 border-black bg-white p-6 shadow-[0px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-4 transition-all duration-300 ease-out md:static md:w-auto md:border-none md:p-0 md:shadow-none md:flex md:flex-row md:items-center md:gap-8",
            isOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-4 opacity-0 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"
          )}
        >
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black uppercase tracking-wider transition-all hover:text-black",
              activeSection === "features"
                ? "text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-600"
                : "text-slate-600"
            )}
          >
            Fitur
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black uppercase tracking-wider transition-all hover:text-black",
              activeSection === "how-it-works"
                ? "text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-600"
                : "text-slate-600"
            )}
          >
            Cara Kerja
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black uppercase tracking-wider transition-all hover:text-black",
              activeSection === "about"
                ? "text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-600"
                : "text-slate-600"
            )}
          >
            Tentang
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black uppercase tracking-wider transition-all hover:text-black",
              activeSection === "faq"
                ? "text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-600"
                : "text-slate-600"
            )}
          >
            FAQ
          </a>

          {/* Mobile View CTA Button */}
          <div className="md:hidden pt-4 border-t border-slate-200">
            <Link href="/maps" className="block w-full">
              <Button variant="gradient" className="w-full font-black px-6 text-sm h-12 shadow-[2px_3px_0px_rgba(0,0,0,1)]">
                Eksplor Peta <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Desktop View CTA Button */}
        <div className="hidden md:block">
          <Link href="/maps">
            <Button variant="gradient" className="font-black px-6 text-sm">
              Eksplor Peta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
