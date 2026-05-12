import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrivateHeader } from "@/components/organisms/PrivateHeader";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <PrivateHeader user={session.user} />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </>
  );
}
