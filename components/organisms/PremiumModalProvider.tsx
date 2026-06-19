"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { PremiumModal } from "@/components/organisms/PremiumModal";

interface PremiumModalContextValue {
  open: boolean;
  openPremium: () => void;
  closePremium: () => void;
}

const PremiumModalContext = createContext<PremiumModalContextValue>({
  open: false,
  openPremium: () => {},
  closePremium: () => {},
});

function usePremiumModal() {
  return useContext(PremiumModalContext);
}

function PremiumModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPremium = useCallback(() => setOpen(true), []);
  const closePremium = useCallback(() => setOpen(false), []);

  return (
    <PremiumModalContext.Provider value={{ open, openPremium, closePremium }}>
      {children}
      {open && <PremiumModal onClose={closePremium} />}
    </PremiumModalContext.Provider>
  );
}

export { PremiumModalProvider, usePremiumModal };
