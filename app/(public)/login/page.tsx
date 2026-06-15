import { LoginCard } from "@/components/organisms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Mestre Green",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-12">
      <LoginCard />
    </div>
  );
}
