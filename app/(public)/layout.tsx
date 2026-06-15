import { auth } from "@/auth";
import { SiteHeader } from "@/components/organisms";
import { PublicFooter } from "@/components/organisms";
import { LoginModalProvider } from "@/components/organisms";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <LoginModalProvider>
      <SiteHeader user={session?.user} />
      <main className="flex-1 bg-white">{children}</main>
      <PublicFooter />
    </LoginModalProvider>
  );
}
