"use client";

import { useState } from "react";

interface TeamCrestProps {
  name: string;
  logo?: string;
  className?: string;
}

function TeamCrest({ name, logo, className = "" }: TeamCrestProps) {
  const [broken, setBroken] = useState(!logo);

  return (
    <div
      className={[
        "w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden p-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {broken ? (
        <span className="text-sm font-bold text-white/60">
          {name.charAt(0)}
        </span>
      ) : (
        <img
          src={logo}
          alt={name}
          className="w-8 h-8 object-contain"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

export { TeamCrest };
export type { TeamCrestProps };
