"use client";

import Link from "next/link";
import { NavItem } from "@/components/molecules";

const NAV_LINKS = [
  { href: "/ao-vivo", label: "Ao vivo", icon: "🔴" },
  { href: "/noticias", label: "Notícias", icon: "📋" },
  { href: "/promocoes", label: "Promoções", icon: "🎁" },
  { href: "/favoritos", label: "Favoritos", icon: "⭐" },
];

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#040B00] border-b border-[#1F3014]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-16 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#58CC02] flex items-center justify-center">
            <span className="text-[#040B00] font-bold text-sm">MG</span>
          </div>
          <div className="leading-none">
            <p className="font-display font-semibold text-white text-xs tracking-widest">
              MESTRE
            </p>
            <p className="font-display font-semibold text-[#58CC02] text-xs tracking-widest">
              GREEN
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/premium"
            className="inline-flex items-center h-8 px-4 text-sm rounded-[8px] border border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 transition-colors"
          >
            Seja premium
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center h-8 px-4 text-sm rounded-[8px] bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00] font-semibold transition-colors"
          >
            Acessar conta
          </Link>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="flex items-center border-t border-[#1F3014] px-6 max-w-screen-xl mx-auto overflow-x-auto">
        {NAV_LINKS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </header>
  );
}

export { PublicHeader };
