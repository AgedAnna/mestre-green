import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00] font-semibold shadow-[0_0_12px_rgba(88,204,2,0.25)]",
  secondary:
    "bg-[#C9FF93] hover:bg-[#b8f07a] text-[#040B00] font-semibold",
  ghost:
    "bg-transparent hover:bg-white/5 text-white border border-white/15",
  outline:
    "bg-transparent hover:bg-[#58CC02]/10 text-[#58CC02] border border-[#58CC02]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-4 text-sm rounded-[8px]",
  md: "h-11 px-6 text-sm rounded-[9999px]",
  lg: "h-12 px-8 text-base rounded-[9999px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58CC02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040B00]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
