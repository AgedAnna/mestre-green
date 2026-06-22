import { PromoCard, type Promo } from "@/components/molecules";

/** Carrossel de promoções da home — cada card abre a tela da promoção (promo.href). */
function PremiumPromos({ promos }: { promos: Promo[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {promos.map((promo) => (
        <PromoCard key={promo.id} promo={promo} />
      ))}
    </div>
  );
}

export { PremiumPromos };
