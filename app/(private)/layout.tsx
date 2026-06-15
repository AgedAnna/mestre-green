import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/organisms";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <>
      <SiteHeader user={session.user} />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </>
  );
}
