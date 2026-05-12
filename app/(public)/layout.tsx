import { PublicHeader } from "@/components/organisms";
import { PublicFooter } from "@/components/organisms";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
