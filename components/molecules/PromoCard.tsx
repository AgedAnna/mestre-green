"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
  "group relative flex h-44 w-[340px] max-w-[85vw] shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#5FDD03] to-[#3C9E00] text-left shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md";

function PromoCard({ promo, onSelect }: PromoCardProps) {
  const content = (
    <>
      {/* Brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl"
      />

      {/* Imagem decorativa, ancorada ao canto inferior direito */}
      <Image
        src={promo.image}
        alt=""
        width={180}
        height={180}
        aria-hidden
        className="pointer-events-none absolute -bottom-1 right-1 h-36 w-auto select-none object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex max-w-[64%] flex-col p-6">
        <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          Promoção
        </span>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-white line-clamp-3">
          {promo.title}
        </h3>
        <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-[#040B00] transition-transform group-hover:translate-x-0.5">
          Saiba mais
          <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden />
        </span>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={CARD}>
        {content}
      </button>
    );
  }

  // Rotas internas usam o Link do Next; links externos abrem em nova aba.
  const isExternal = /^https?:\/\//.test(promo.href);

  if (isExternal) {
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

  return (
    <Link href={promo.href} className={CARD}>
      {content}
    </Link>
  );
}

export { PromoCard };
export type { Promo, PromoCardProps };
