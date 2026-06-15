"use client";

import { useLoginModal } from "@/components/organisms/LoginModalProvider";

interface LoginTriggerProps {
  className?: string;
  children: React.ReactNode;
}

function LoginTrigger({ className, children }: LoginTriggerProps) {
  const { openLogin } = useLoginModal();
  return (
    <button type="button" onClick={() => openLogin()} className={className}>
      {children}
    </button>
  );
}

export { LoginTrigger };
