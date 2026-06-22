import Link from "next/link";
import { getSession } from "@/lib/devAuth";
import { getOffers } from "@/lib/api";

export default async function PromocoesPage() {
  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;

  const offers = token ? await getOffers(token) : [];

  return (
    <div className="w-full px-6 py-8 md:w-3/5 md:px-0 mx-auto">
      {offers.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#ACACAC]">
          Nenhuma promoção disponível no momento.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-center md:min-h-[calc((100dvh-12rem)/2)] py-6"
            >
              <Link
                href={`/promocoes/${offer.id}`}
                className="w-full h-52 md:shrink-0 md:w-64 md:h-44 rounded-xl bg-gray-200 hover:opacity-90 transition-opacity overflow-hidden"
              >
                {offer.offerImageLink ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={offer.offerImageLink}
                    alt={offer.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </Link>

              <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden justify-center">
                <span className="text-xs text-[#ACACAC] uppercase tracking-wide">
                  Promoção
                </span>
                <Link href={`/promocoes/${offer.id}`} className="group">
                  <h2 className="text-xl md:text-3xl font-display font-semibold text-black leading-snug w-full wrap-break-word group-hover:text-[#58CC02] transition-colors">
                    {offer.name}
                  </h2>
                </Link>
                {offer.offerDescription ? (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {offer.offerDescription}
                  </p>
                ) : null}
                <Link
                  href={`/promocoes/${offer.id}`}
                  className="text-sm text-[#58CC02] hover:text-[#C9FF93] transition-colors mt-1"
                >
                  Saiba mais...
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
