import { auth } from "@/auth";
import {
  SiteHeader,
  PublicFooter,
  LoginModalProvider,
  PremiumModalProvider,
  ProfileModalProvider,
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
        <ProfileModalProvider user={session?.user}>
          <SiteHeader user={session?.user} />
          <main className="flex-1 bg-white">{children}</main>
          <PublicFooter />
        </ProfileModalProvider>
      </PremiumModalProvider>
    </LoginModalProvider>
  );
}
