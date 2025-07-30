"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background/80"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            BukuTamu
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Fitur
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              Tentang
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Mulai Sekarang</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-3 mt-4">
            <Link
              href="#features"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
              onClick={closeMenu}
            >
              Fitur
            </Link>
            <Link
              href="#about"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
              onClick={closeMenu}
            >
              Tentang
            </Link>
            <Link
              href="#faq"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard" onClick={closeMenu}>
                  Masuk
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard" onClick={closeMenu}>
                  Mulai Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
