import { auth } from "@/auth";
import {
  SiteHeader,
  PublicFooter,
  LoginModalProvider,
  PremiumModalProvider,
} from "@/components/organisms";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <LoginModalProvider>
      <PremiumModalProvider>
        <SiteHeader user={session?.user} />
        <main className="flex-1 bg-white">{children}</main>
        <PublicFooter />
      </PremiumModalProvider>
    </LoginModalProvider>
  );
}
