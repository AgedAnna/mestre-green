"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
        "hover:text-white",
        isActive
          ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#58CC02] after:rounded-t"
          : "text-[#ACACAC]",
      ].join(" ")}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </Link>
  );
}

export { NavItem };
export type { NavItemProps };
