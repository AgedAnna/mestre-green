"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors relative whitespace-nowrap first:pl-0 last:pr-0",
        isActive
          ? "text-[#58CC02] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#58CC02] after:rounded-t"
          : "text-white hover:text-[#58CC02]",
      ].join(" ")}
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}

export { NavItem };
export type { NavItemProps };
