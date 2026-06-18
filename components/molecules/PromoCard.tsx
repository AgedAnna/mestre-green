"use client";

import Image, { type StaticImageData } from "next/image";

interface Promo {
  id: string | number;
  title: string;
  href: string;
  image: string | StaticImageData;
}

interface PromoCardProps {
  promo: Promo;
  /** Quando definido, o card vira botão e dispara isso em vez de navegar. */
  onSelect?: () => void;
}

const CARD =
  "group relative shrink-0 w-[440px] max-w-[85vw] overflow-hidden rounded-2xl bg-[#58CC02]";

function PromoCard({ promo, onSelect }: PromoCardProps) {
  const content = (
    <>
      {/* Imagem decorativa, ancorada à direita */}
      <Image
        src={promo.image}
        alt=""
        width={240}
        height={240}
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 h-[115%] w-auto object-contain"
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col gap-6 p-7 max-w-[65%]">
        <h3 className="font-display font-semibold text-white text-2xl leading-tight">
          {promo.title}
        </h3>
        <span className="w-fit text-sm text-white underline underline-offset-2 transition-opacity group-hover:opacity-80">
          Saiba mais
        </span>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={`${CARD} text-left`}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={promo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={CARD}
    >
      {content}
    </a>
  );
}

export { PromoCard };
export type { Promo, PromoCardProps };
