import Link from "next/link";

function PublicFooter() {
  return (
    <footer className="bg-[#040B00] border-t border-[#1F3014] mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + legal links */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#58CC02] flex items-center justify-center">
              <span className="text-[#040B00] font-bold text-sm">MG</span>
            </div>
            <div className="leading-none">
              <p className="font-display font-semibold text-white text-xs tracking-widest">MESTRE</p>
              <p className="font-display font-semibold text-[#58CC02] text-xs tracking-widest">GREEN</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/termos" className="text-sm text-[#ACACAC] hover:text-white transition-colors">
              Termos e Condições
            </Link>
            <Link href="/faq" className="text-sm text-[#ACACAC] hover:text-white transition-colors">
              FAQ&apos;s
            </Link>
            <Link href="/privacidade" className="text-sm text-[#ACACAC] hover:text-white transition-colors">
              Política de Privacidade
            </Link>
          </nav>
        </div>

        {/* App stores */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Aplicativos Móveis</h3>
          <p className="text-sm text-[#ACACAC]">
            Baixe nosso aplicativo e acesse muito mais funções e recursos exclusivos.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3014] border border-[#1F3014] hover:border-[#58CC02]/30 transition-colors"
            >
              <span className="text-xs text-white leading-tight">
                <span className="block text-[10px] text-[#ACACAC]">Download on the</span>
                App Store
              </span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3014] border border-[#1F3014] hover:border-[#58CC02]/30 transition-colors"
            >
              <span className="text-xs text-white leading-tight">
                <span className="block text-[10px] text-[#ACACAC]">Get it on</span>
                Google Play
              </span>
            </Link>
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Nos acompanhem</h3>
          <p className="text-xs text-[#ACACAC]">
            Copyright © Mestre Green todos os direitos reservados e recursos exclusivos.
          </p>
          <div className="flex items-center gap-3">
            {["IG", "TK", "X", "YT"].map((s) => (
              <Link
                key={s}
                href="#"
                className="w-9 h-9 rounded-full bg-[#1F3014] flex items-center justify-center text-xs text-[#ACACAC] hover:bg-[#58CC02]/20 hover:text-[#58CC02] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { PublicFooter };
