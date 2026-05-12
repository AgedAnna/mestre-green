import Link from "next/link";
import { getAccessToken } from "@/lib/session";
import { getOffers } from "@/lib/api";

export default async function PromocoesPage() {
  const token = await getAccessToken();
  const offers = token ? await getOffers(token) : [];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-display font-semibold text-white">Promoções</h1>
        <p className="text-sm text-[#ACACAC] mt-1">
          Ofertas e bônus das casas parceiras.
        </p>
      </header>

      {offers.length === 0 ? (
        <p className="text-sm text-[#ACACAC] py-12 text-center">
          Nenhuma promoção ativa no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer) => {
            const gradient =
              offer.gradientStartColor && offer.gradientEndColor
                ? `linear-gradient(135deg, ${offer.gradientStartColor} 0%, ${offer.gradientEndColor} 100%)`
                : undefined;

            return (
              <Link
                key={offer.id}
                href={`/promocoes/${offer.id}`}
                className="group rounded-[12px] overflow-hidden border border-[#1F3014] hover:border-[#58CC02]/40 transition-colors flex flex-col"
                style={gradient ? { background: gradient } : { background: "#111E0C" }}
              >
                {offer.offerImageLink && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={offer.offerImageLink}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h2 className="text-base font-semibold text-white leading-snug">
                    {offer.name}
                  </h2>
                  <p className="text-sm text-white/80 line-clamp-3">
                    {offer.offerDescription}
                  </p>
                  <span className="mt-auto pt-3 text-xs font-semibold text-[#58CC02] group-hover:underline">
                    Ver detalhes →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
