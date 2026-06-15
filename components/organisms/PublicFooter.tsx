import Link from "next/link";
import Image from "next/image";
import {
  FaApple,
  FaGooglePlay,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import logo from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_3.webp";

const LEGAL_LINKS = [
  { href: "/termos", label: "Termos e Condições" },
  { href: "/faq", label: "FAQ's" },
  { href: "/privacidade", label: "Política de Privacidade" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", icon: FaInstagram },
  { href: "#", label: "TikTok", icon: FaTiktok },
  { href: "#", label: "X", icon: FaXTwitter },
  { href: "#", label: "YouTube", icon: FaYoutube },
];

function PublicFooter() {
  return (
    <footer className="bg-white border-t border-[#E2E1DF] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Logo + legal links */}
        <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
          <Image src={logo} alt="Mestre Green" className="h-10 w-auto" />
          <nav className="flex flex-col gap-2.5 items-center lg:items-start">
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#6B6B6B] underline underline-offset-4 hover:text-[#131313] transition-colors w-fit"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* App stores */}
        <div className="flex flex-col gap-4 items-center text-center lg:items-start lg:text-left">
          <h3 className="text-base font-semibold text-[#131313]">
            Aplicativos Móveis
          </h3>
          <p className="text-sm text-[#8A8A8A] max-w-xs">
            Baixe nosso aplicativo e acesse muito mais funções e recursos
            exclusivos
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <Link
              href="#"
              aria-label="Baixar na App Store"
              className="flex items-center justify-center gap-2 w-44 lg:w-auto h-12 px-4 rounded-xl bg-black text-white hover:opacity-90 transition-opacity"
            >
              <FaApple size={26} />
              <span className="flex flex-col leading-none text-left">
                <span className="text-[10px] font-light">Download on the</span>
                <span className="text-base font-semibold -mt-0.5">
                  App Store
                </span>
              </span>
            </Link>
            <Link
              href="#"
              aria-label="Disponível no Google Play"
              className="flex items-center justify-center gap-2 w-44 lg:w-auto h-12 px-4 rounded-xl bg-black text-white hover:opacity-90 transition-opacity"
            >
              <FaGooglePlay size={22} />
              <span className="flex flex-col leading-none text-left">
                <span className="text-[10px] font-light tracking-wide">
                  GET IT ON
                </span>
                <span className="text-base font-semibold -mt-0.5">
                  Google Play
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center text-center lg:items-start lg:text-left">
          <h3 className="text-base font-semibold text-[#131313]">
            Nos acompanhem
          </h3>
          <p className="text-sm text-[#8A8A8A] max-w-xs">
            Copyright © Mestre Green todos os direitos reservados e recursos
            exclusivos
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full bg-[#ACACAC] flex items-center justify-center text-white hover:bg-[#58CC02] transition-colors"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { PublicFooter };
