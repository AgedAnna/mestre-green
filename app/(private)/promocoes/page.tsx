import { getSession } from "@/lib/devAuth";
import { getOffers } from "@/lib/api";

export default async function PromocoesPage() {
  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;

  const offers = token ? await getOffers(token) : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-black">
          Promoções
        </h1>
        <p className="text-sm text-[#ACACAC] mt-1">
          Bônus e ofertas das casas de apostas parceiras
        </p>
      </div>

      {offers.length === 0 ? (
        <p className="text-sm text-[#ACACAC] py-12 text-center">
          Nenhuma promoção disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <a
              key={offer.id}
              href={offer.offerButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl bg-[#58CC02] p-6 hover:bg-[#57CB01] transition-colors"
            >
              <h2 className="font-display font-semibold text-[#040B00] text-lg leading-snug">
                {offer.name}
              </h2>
              <p className="text-sm text-[#040B00]/70 flex-1">
                {offer.offerDescription}
              </p>
              <span className="w-fit text-sm font-semibold text-[#040B00] underline underline-offset-2 transition-opacity group-hover:opacity-80">
                Saiba mais
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
