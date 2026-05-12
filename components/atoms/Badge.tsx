import { HTMLAttributes } from "react";

type BadgeVariant = "green" | "light-green" | "dark" | "gray";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-[#58CC02] text-[#040B00]",
  "light-green": "bg-[#C9FF93] text-[#040B00]",
  dark: "bg-[#1F3014] text-white",
  gray: "bg-[#ACACAC]/20 text-[#ACACAC]",
};

function Badge({
  variant = "green",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
