"use client";

import { PromoCard, type Promo } from "@/components/molecules";
import { usePremiumModal } from "@/components/organisms/PremiumModalProvider";

/** Carrossel de promoções premium da home — cada card abre o modal premium. */
function PremiumPromos({ promos }: { promos: Promo[] }) {
  const { openPremium } = usePremiumModal();

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {promos.map((promo) => (
        <PromoCard key={promo.id} promo={promo} onSelect={openPremium} />
      ))}
    </div>
  );
}

export { PremiumPromos };
