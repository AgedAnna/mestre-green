"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";

interface PrivateHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Ao vivo", icon: "🔴" },
  { href: "/noticias", label: "Notícias", icon: "📋" },
  { href: "/promocoes", label: "Promoções", icon: "🎁" },
  { href: "/favoritos", label: "Favoritos", icon: "⭐" },
];

function PrivateHeader({ user }: PrivateHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#040B00] border-b border-[#1F3014]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-16 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#58CC02] flex items-center justify-center">
            <span className="text-[#040B00] font-bold text-sm">MG</span>
          </div>
          <div className="leading-none">
            <p className="font-display font-semibold text-white text-xs tracking-widest">MESTRE</p>
            <p className="font-display font-semibold text-[#58CC02] text-xs tracking-widest">GREEN</p>
          </div>
        </Link>

        {/* User actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/premium"
            className="inline-flex items-center h-8 px-4 text-sm rounded-full border border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 transition-colors"
          >
            Seja premium
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1F3014] flex items-center justify-center text-xs font-semibold text-[#58CC02]">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-[#ACACAC] hover:text-white transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center border-t border-[#1F3014] px-6 max-w-screen-xl mx-auto overflow-x-auto">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                "hover:text-white",
                isActive
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#58CC02] after:rounded-t"
                  : "text-[#ACACAC]",
              ].join(" ")}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export { PrivateHeader };
