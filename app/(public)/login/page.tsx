import { LoginForm } from "@/components/organisms/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Mestre Green",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col sm:flex-row">
        {/* Left panel — brand */}
        <div className="sm:w-[45%] bg-[#58CC02] flex flex-col items-center justify-center p-8 gap-4 min-h-[260px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#040B00]/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <div className="leading-none">
              <p className="font-display font-semibold text-white text-sm tracking-widest">MESTRE</p>
              <p className="font-display font-semibold text-[#040B00] text-sm tracking-widest">GREEN</p>
            </div>
          </div>
          {/* Mascot placeholder */}
          <div className="w-32 h-32 rounded-2xl bg-[#57CB01] flex items-center justify-center">
            <span className="text-6xl">🧢</span>
          </div>
          <p className="font-display font-semibold text-[#040B00] text-xl text-center leading-tight">
            HOJE É DIA DE<br />GREEEEN!
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-white flex flex-col justify-center p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
