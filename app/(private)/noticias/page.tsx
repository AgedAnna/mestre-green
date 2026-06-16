import Link from "next/link";

interface NewsArticle {
  id: string;
  category: string;
  title: string;
  href: string;
}

const NEWS: NewsArticle[] = [
  {
    id: "1",
    category: "Futebol Internacional",
    title: "Buffon pede demissão da federação após Itália ficar fora da Copa do Mundo",
    href: "/noticias/1",
  },
  {
    id: "2",
    category: "Futebol Internacional",
    title: "Qual o grupo mais forte da Copa do Mundo? Veja lista com base no ranking da Fifa",
    href: "/noticias/2",
  },
  {
    id: "3",
    category: "Futebol Brasileiro",
    title: "Flamengo confirma contratação e apresenta novo reforço para a temporada",
    href: "/noticias/3",
  },
  {
    id: "4",
    category: "Champions League",
    title: "Real Madrid vence nos pênaltis e avança às semifinais da Champions League",
    href: "/noticias/4",
  },
  {
    id: "5",
    category: "Futebol Internacional",
    title: "Messi marca dois e lidera Argentina em amistoso preparatório para a Copa",
    href: "/noticias/5",
  },
];

export default function NoticiasPage() {
  return (
    <div className="w-full px-6 py-8 md:w-3/5 md:px-0 mx-auto">
      <ul className="divide-y divide-gray-100">
        {NEWS.map((article) => (
          <li
            key={article.id}
            className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-center md:min-h-[calc((100dvh-12rem)/2)] py-6"
          >
            <Link href={article.href} className="w-full h-52 md:shrink-0 md:w-64 md:h-44 rounded-xl bg-gray-200 hover:opacity-90 transition-opacity" />

            <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden justify-center">
              <span className="text-xs text-[#ACACAC] uppercase tracking-wide">
                {article.category}
              </span>
              <Link href={article.href} className="group">
                <h2 className="text-xl md:text-3xl font-display font-semibold text-black leading-snug w-full break-words group-hover:text-[#58CC02] transition-colors">
                  {article.title}
                </h2>
              </Link>
              <Link
                href={article.href}
                className="text-sm text-[#58CC02] hover:text-[#C9FF93] transition-colors mt-1"
              >
                Saiba mais...
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
