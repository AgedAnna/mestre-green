"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, UserRound, type LucideIcon } from "lucide-react";
import { useLoginModal } from "@/components/organisms/LoginModalProvider";
import { logout } from "@/lib/actions/auth";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  links: NavLink[];
  isLoggedIn?: boolean;
  profileHref?: string;
}

function MobileNav({
  links,
  isLoggedIn = false,
  profileHref = "/dashboard",
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openLogin } = useLoginModal();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      data-navigation-status={open ? "active" : "not-active"}
      className="navigation md:hidden"
    >
      <div
        className="navigation__dark-bg"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <div className="hamburger-nav">
        <div className="hamburger-nav__bg" />

        <div className="hamburger-nav__group">
          <p className="hamburger-nav__menu-p">Menu</p>

          <ul className="hamburger-nav__ul">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              const inner = (
                <>
                  <span className="hamburger-nav__label">
                    <Icon size={22} strokeWidth={2} aria-hidden />
                    <span className="hamburger-nav__p">{label}</span>
                  </span>
                  <span className="hamburger-nav__dot" />
                </>
              );
              return (
                <li key={href} className="hamburger-nav__li">
                  {isLoggedIn ? (
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="hamburger-nav__a"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openLogin();
                      }}
                      className="hamburger-nav__a"
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hamburger-nav__cta">
            {isLoggedIn ? (
              <Link
                href="/premium"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full bg-[#C9FF93] hover:bg-[#C9FF93]/90 text-black font-semibold transition-colors"
              >
                <Crown size={16} strokeWidth={2.5} aria-hidden color="#58CC02" />
                Seja premium
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLogin();
                }}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full bg-[#C9FF93] hover:bg-[#C9FF93]/90 text-black font-semibold transition-colors"
              >
                <Crown size={16} strokeWidth={2.5} aria-hidden color="#58CC02" />
                Seja premium
              </button>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  href={profileHref}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
                >
                  <UserRound size={16} strokeWidth={2.5} aria-hidden />
                  Acessar meu perfil
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full text-sm text-[#ACACAC] hover:text-white transition-colors py-1"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLogin();
                }}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
              >
                <UserRound size={16} strokeWidth={2.5} aria-hidden />
                Acessar conta
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="hamburger-nav__toggle"
        >
          <span className="hamburger-nav__toggle-bar" />
          <span className="hamburger-nav__toggle-bar" />
        </button>
      </div>
    </nav>
  );
}

export { MobileNav };
export type { NavLink };
