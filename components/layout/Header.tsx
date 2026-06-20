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
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-linear-to-tr from-[#DCFFBC] to-[#6FD1D7] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Compass className="h-7 w-7 text-black" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-black select-none">
            SPARTA
          </span>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:bg-slate-50 active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)] lg:hidden"
        >
          {isOpen ? (
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Navigation Menu with Smooth Transition */}
        <nav
          className={cn(
            "absolute top-20 left-0 flex w-full flex-col gap-4 border-b-2 border-black bg-white p-6 shadow-[0px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-8 lg:border-none lg:p-0 lg:shadow-none",
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100",
          )}
        >
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black tracking-wider uppercase transition-all hover:text-black",
              activeSection === "features"
                ? "text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-4"
                : "text-slate-600",
            )}
          >
            Fitur
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black tracking-wider uppercase transition-all hover:text-black",
              activeSection === "how-it-works"
                ? "text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-4"
                : "text-slate-600",
            )}
          >
            Cara Kerja
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black tracking-wider uppercase transition-all hover:text-black",
              activeSection === "about"
                ? "text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-4"
                : "text-slate-600",
            )}
          >
            Tentang
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-sm font-black tracking-wider uppercase transition-all hover:text-black",
              activeSection === "faq"
                ? "text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-4"
                : "text-slate-600",
            )}
          >
            FAQ
          </a>

          {/* Mobile View CTA Button */}
          <div className="border-t border-slate-200 pt-4 lg:hidden">
            <Link href="/maps" className="block w-full">
              <Button
                variant="gradient"
                className="h-12 w-full px-6 text-sm font-black shadow-[2px_3px_0px_rgba(0,0,0,1)]"
              >
                Eksplor Peta <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Desktop View CTA Button */}
        <div className="hidden lg:block">
          <Link href="/maps">
            <Button variant="gradient" className="px-6 text-sm font-black">
              Eksplor Peta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
