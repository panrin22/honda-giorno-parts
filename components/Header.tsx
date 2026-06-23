'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, ShoppingCart } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { href: '/shop?sort=popular', label: 'ขายดี' },
    { href: 'https://s.shopee.co.th/1LdAlLLo60', label: 'โปรโมชั่น' },
  ]

  return (
    <>
      {/* Top Bar */}
      <header className="top-bar bg-[#12121A] border-b border-[rgba(255,255,255,0.06)] py-3.5 sticky top-0 z-50">
        <div className="container flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="logo flex flex-col">
            <h1 className="font-display text-2xl md:text-[26px] font-black italic tracking-[-0.5px] uppercase text-white leading-none">
              GIORNO<span className="text-[#FF5722]">PARTS</span>
            </h1>
            <p className="text-[8px] text-[#9CA3AF] tracking-[2px] uppercase font-bold mt-0.5">ศูนย์รวมอะไหล่ Giorno+</p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 flex-1 max-w-[480px] justify-center">
            {navLinks.map((link, i) => (
              <a 
                key={i}
                href={link.href} 
                className="px-4.5 py-2 text-sm font-semibold text-[#B0B8C8] rounded-full hover:text-white hover:bg-white/5 transition"
              >
                {link.label}
              </a>
            ))}
            <Link href="/shop" className="px-4.5 py-2 text-sm font-semibold text-[#B0B8C8] rounded-full hover:text-white hover:bg-white/5 transition">
              สินค้าทั้งหมด
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center text-[#B0B8C8] hover:text-[#FF5722] transition text-xs font-semibold"
              aria-label="ค้นหา"
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span className="hidden md:inline">ค้นหา</span>
            </button>

            {/* Shopee Cart / Shop Now */}
            <a 
              href="https://s.shopee.co.th/1gG19oW9Ev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="shopee-cart flex items-center gap-2 bg-gradient-to-br from-[#FF5722] to-[#E64A19] text-white px-4.5 py-2.5 rounded-full text-xs md:text-sm font-bold shadow hover:shadow-lg transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>ช้อปเลย</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#B0B8C8] hover:text-white p-1"
              aria-label="เมนู"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur z-[100] flex items-start justify-center pt-28" onClick={() => setIsSearchOpen(false)}>
          <div className="w-full max-w-xl px-6" onClick={e => e.stopPropagation()}>
            <form action="/shop" method="get" className="relative">
              <input 
                type="text" 
                name="q"
                placeholder="ค้นหาอะไหล่ Giorno+ ที่นี่..." 
                className="w-full bg-[#12121A] border-2 border-[#FF5722] rounded-full py-4 px-6 text-lg focus:outline-none text-white placeholder:text-[#9CA3AF]"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF5722] text-white w-10 h-10 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-xs text-[#9CA3AF] mt-3">กด ESC เพื่อปิด</p>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/80 z-[90] pt-16" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="bg-[#12121A] p-6 text-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-4">
              <Link href="/shop" className="py-2 text-[#B0B8C8] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>สินค้าทั้งหมด</Link>
              <a href="/shop?sort=popular" className="py-2 text-[#B0B8C8] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>ขายดี</a>
              <a href="https://s.shopee.co.th/1LdAlLLo60" target="_blank" className="py-2 text-[#B0B8C8] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>โปรโมชั่น</a>
              <Link href="/articles" className="py-2 text-[#B0B8C8] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Giorno Magazine</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
