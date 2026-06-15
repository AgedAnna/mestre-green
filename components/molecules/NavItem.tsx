"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Quando definido, o item vira botão e dispara isso em vez de navegar (ex.: abrir o modal de login). */
  onSelect?: () => void;
}

function NavItem({ href, label, icon: Icon, onSelect }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const className = [
    "flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors relative whitespace-nowrap first:pl-0 last:pr-0",
    isActive
      ? "text-[#58CC02] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#58CC02] after:rounded-t"
      : "text-white hover:text-[#58CC02]",
  ].join(" ");

  const content = (
    <>
      <Icon size={18} strokeWidth={2} aria-hidden />
      {label}
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export { NavItem };
export type { NavItemProps };
