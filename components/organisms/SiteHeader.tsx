"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Newspaper,
  BadgePercent,
  CalendarDays,
  Crown,
  UserRound,
  LogOut,
} from "lucide-react";
import { NavItem } from "@/components/molecules";
import { MobileNav } from "@/components/organisms/MobileNav";
import { useLoginModal } from "@/components/organisms/LoginModalProvider";
import { usePremiumModal } from "@/components/organisms/PremiumModalProvider";
import { logout } from "@/lib/actions/auth";
import logo from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_VERDE_BRANCO.webp";

interface SiteHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accountType?: string | null;
  } | null;
}

const PROFILE_HREF = "/";
const PREMIUM_BTN =
  "inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full bg-[#C9FF93] hover:bg-[#C9FF93]/90 text-black font-semibold transition-colors";

function SiteHeader({ user }: SiteHeaderProps) {
  const isLoggedIn = !!user;
  const { openLogin } = useLoginModal();
  const { openPremium } = usePremiumModal();

  const navLinks = [
    { href: "/ao-vivo", label: "Ao vivo", icon: Flame },
    { href: "/noticias", label: "Notícias", icon: Newspaper },
    { href: "/promocoes", label: "Promoções", icon: BadgePercent },
    { href: "/jogos", label: "Jogos", icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#040B00] border-b border-border">
      <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src={logo}
            alt="Mestre Green"
            fetchPriority="high"
            className="h-15 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <button type="button" onClick={() => openPremium()} className={PREMIUM_BTN}>
            <Crown size={16} strokeWidth={2.5} aria-hidden color="#58CC02" />
            Seja premium
          </button>

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
                  aria-label="Sair"
                  title="Sair"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#ACACAC] hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut size={18} strokeWidth={2} aria-hidden />
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
          <NavItem
            key={item.href}
            {...item}
            onSelect={isLoggedIn ? undefined : () => openLogin()}
          />
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
