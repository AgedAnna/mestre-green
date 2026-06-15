import type { Metadata } from "next";
import "./globals.css";
import { TabTitleNotifier } from "@/components/TabTitleNotifier";

const ICON = "/logos/LOGO_MESTREGREEN_ICONE_VERDE_PRETO.webp";

export const metadata: Metadata = {
  title: "Mestre Green — Palpites e Dicas",
  description: "Os melhores palpites e dicas de apostas esportivas.",
  icons: {
    icon: { url: ICON, type: "image/webp" },
    shortcut: ICON,
    apple: ICON,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh flex flex-col antialiased">
        <TabTitleNotifier />
        {children}
      </body>
    </html>
  );
}
