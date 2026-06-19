import { getSession } from "@/lib/devAuth";
import { redirect } from "next/navigation";
import {
  SiteHeader,
  LoginModalProvider,
  PremiumModalProvider,
  PublicFooter,
} from "@/components/organisms";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/?login=1");

  return (
    <LoginModalProvider>
      <PremiumModalProvider>
        <SiteHeader user={session.user} />
        <main className="flex-1 bg-white">
          <div className="max-w-7xl mx-auto w-full px-6 py-8">{children}</div>
        </main>
        <PublicFooter />
      </PremiumModalProvider>
    </LoginModalProvider>
  );
}
