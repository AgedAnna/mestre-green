import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessToken } from "@/lib/session";
import { getOffer } from "@/lib/api";

export default async function PromocaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAccessToken();
  const offer = token ? await getOffer(token, id) : null;

  if (!offer) notFound();

  const gradient =
    offer.gradientStartColor && offer.gradientEndColor
      ? `linear-gradient(135deg, ${offer.gradientStartColor} 0%, ${offer.gradientEndColor} 100%)`
      : undefined;

  return (
    <article className="flex flex-col gap-8 max-w-3xl mx-auto">
      <Link
        href="/promocoes"
        className="text-sm text-[#ACACAC] hover:text-white transition-colors w-fit"
      >
        ← Voltar para Promoções
      </Link>

      <header
        className="rounded-[12px] overflow-hidden border border-[#1F3014]"
        style={gradient ? { background: gradient } : { background: "#111E0C" }}
      >
        {offer.offerImageLink && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.offerImageLink}
            alt=""
            className="w-full h-56 object-cover"
          />
        )}
        <div className="p-6 flex flex-col gap-3">
          <h1 className="text-2xl font-display font-semibold text-white leading-tight">
            {offer.name}
          </h1>
          <p className="text-sm text-white/85">{offer.offerDescription}</p>
          {offer.offerButtonLink && (
            <a
              href={offer.offerButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00] font-semibold text-sm w-fit transition-colors"
            >
              Aproveitar promoção
            </a>
          )}
        </div>
      </header>

      {(offer.rulesTitle || offer.rulesParagraphs?.length) && (
        <section className="flex flex-col gap-3">
          {offer.rulesTitle && (
            <h2 className="text-lg font-display font-semibold text-white">
              {offer.rulesTitle}
            </h2>
          )}
          {offer.rulesSubTitle && (
            <p className="text-sm text-[#ACACAC]">{offer.rulesSubTitle}</p>
          )}
          {offer.rulesParagraphs?.map((rule, i) => (
            <p key={i} className="text-sm text-white/85 leading-relaxed">
              {rule}
            </p>
          ))}
        </section>
      )}
    </article>
  );
}
