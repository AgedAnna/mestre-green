import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={[
            "w-full h-12 px-4 rounded-lg bg-white/8 border text-white text-sm placeholder:text-[#ACACAC]",
            "transition-colors duration-150 outline-none",
            "focus:border-[#58CC02] focus:bg-white/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus:border-red-400"
              : "border-white/10 hover:border-white/20",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-400">{error}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
