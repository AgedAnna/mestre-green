"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Newspaper,
  BadgePercent,
  Star,
  Crown,
  UserRound,
} from "lucide-react";
import { NavItem } from "@/components/molecules";
import { MobileNav } from "@/components/organisms/MobileNav";
import { useLoginModal } from "@/components/organisms/LoginModalProvider";
import { logout } from "@/lib/actions/auth";
import logo from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_VERDE_BRANCO.webp";

interface SiteHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const PROFILE_HREF = "/dashboard";

function SiteHeader({ user }: SiteHeaderProps) {
  const isLoggedIn = !!user;
  const { openLogin } = useLoginModal();

  const navLinks = [
    {
      href: isLoggedIn ? "/dashboard" : "/ao-vivo",
      label: "Ao vivo",
      icon: Flame,
    },
    { href: "/noticias", label: "Notícias", icon: Newspaper },
    { href: "/promocoes", label: "Promoções", icon: BadgePercent },
    { href: "/favoritos", label: "Favoritos", icon: Star },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#040B00] border-b border-border">
      <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center shrink-0"
        >
          <Image
            src={logo}
            alt="Mestre Green"
            fetchPriority="high"
            className="h-15 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full bg-[#C9FF93] hover:bg-[#C9FF93]/90 text-black font-semibold transition-colors"
          >
            <Crown size={16} strokeWidth={2.5} aria-hidden color="#58CC02" />
            Seja premium
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={PROFILE_HREF}
                className="inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
              >
                <UserRound size={16} strokeWidth={2.5} aria-hidden />
                Acessar meu perfil
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs text-[#ACACAC] hover:text-white transition-colors"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openLogin()}
              className="inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
            >
              <UserRound size={16} strokeWidth={2.5} aria-hidden />
              Acessar conta
            </button>
          )}
        </div>
      </div>

      <nav className="hidden md:flex items-center justify-between px-6 max-w-7xl mx-auto overflow-x-auto">
        {navLinks.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <MobileNav
        links={navLinks}
        isLoggedIn={isLoggedIn}
        profileHref={PROFILE_HREF}
      />
    </header>
  );
}

export { SiteHeader };
