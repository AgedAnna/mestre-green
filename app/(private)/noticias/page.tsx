import Link from "next/link";
import { getFeed } from "@/lib/news";

export const revalidate = 300;

export default async function NoticiasPage() {
  const articles = await getFeed({ full: false, limit: 20 });

  return (
    <div className="w-full px-6 py-8 md:w-3/5 md:px-0 mx-auto">
      {articles.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#ACACAC]">
          Nenhuma notícia disponível no momento.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {articles.map((article) => (
            <li
              key={article.slug}
              className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-center md:min-h-[calc((100dvh-12rem)/2)] py-6"
            >
              <Link
                href={`/noticias/${article.slug}`}
                className="w-full h-52 md:shrink-0 md:w-64 md:h-44 rounded-xl bg-gray-200 hover:opacity-90 transition-opacity overflow-hidden"
              >
                {article.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </Link>

              <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden justify-center">
                {article.category ? (
                  <span className="text-xs text-[#ACACAC] uppercase tracking-wide">
                    {article.category}
                  </span>
                ) : null}
                <Link href={`/noticias/${article.slug}`} className="group">
                  <h2 className="text-xl md:text-3xl font-display font-semibold text-black leading-snug w-full wrap-break-word group-hover:text-[#58CC02] transition-colors">
                    {article.title}
                  </h2>
                </Link>
                {article.excerpt ? (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                ) : null}
                <Link
                  href={`/noticias/${article.slug}`}
                  className="text-sm text-[#58CC02] hover:text-[#C9FF93] transition-colors mt-1"
                >
                  Saiba mais...
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
