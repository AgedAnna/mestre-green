"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoginCard, type AuthMode } from "@/components/organisms/LoginCard";

interface LoginModalContextValue {
  open: boolean;
  openLogin: (mode?: AuthMode) => void;
  closeLogin: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue>({
  open: false,
  openLogin: () => {},
  closeLogin: () => {},
});

function useLoginModal() {
  return useContext(LoginModalContext);
}

function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const openLogin = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setOpen(true);
  }, []);
  const closeLogin = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") !== "1") return;
    openLogin();
    params.delete("login");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : "")
    );
  }, [openLogin]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <LoginModalContext.Provider value={{ open, openLogin, closeLogin }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={closeLogin}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
            aria-hidden
          />
          <div className="relative z-10 my-auto w-full max-w-3xl">
            <LoginCard key={mode} onClose={closeLogin} initialMode={mode} />
          </div>
        </div>
      )}
    </LoginModalContext.Provider>
  );
}

export { LoginModalProvider, useLoginModal };
