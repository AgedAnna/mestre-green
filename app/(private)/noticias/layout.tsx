export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white -mx-6 -my-8 px-6 py-8">
      {children}
    </div>
  );
}
