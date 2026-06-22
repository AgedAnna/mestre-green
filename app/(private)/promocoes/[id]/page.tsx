import { notFound } from "next/navigation";
import { getSession } from "@/lib/devAuth";
import { getOffer } from "@/lib/api";

export default async function PromocaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;

  const offer = token ? await getOffer(token, id) : null;

  if (!offer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
      <span className="text-xs text-[#ACACAC] uppercase tracking-wide">
        Promoção
      </span>

      <h1 className="text-4xl font-display font-semibold text-black leading-tight">
        {offer.name}
      </h1>

      {offer.offerDescription ? (
        <p className="text-xl text-gray-500 leading-relaxed">
          {offer.offerDescription}
        </p>
      ) : null}

      {offer.offerImageLink ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={offer.offerImageLink}
          alt={offer.name}
          className="w-full aspect-video rounded-xl object-cover mt-2 bg-gray-200"
        />
      ) : (
        <div className="w-full aspect-video rounded-xl bg-gray-200 mt-2" />
      )}

      {offer.offerButtonLink ? (
        <a
          href={offer.offerButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-2xl bg-[#58CC02] px-8 py-4 font-display font-semibold text-[#040B00] hover:bg-[#57CB01] transition-colors mt-2"
        >
          Aproveitar oferta
        </a>
      ) : null}
    </div>
  );
}
