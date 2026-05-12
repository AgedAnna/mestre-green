import Link from "next/link";
import { getAccessToken } from "@/lib/session";
import { getBlogPosts } from "@/lib/api";

function formatRelative(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `Há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Ontem";
  if (diffD < 7) return `Há ${diffD} dias`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function NoticiasPage() {
  const token = await getAccessToken();
  const posts = token ? await getBlogPosts(token) : [];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-display font-semibold text-white">Notícias</h1>
        <p className="text-sm text-[#ACACAC] mt-1">
          Análises, atualizações e novidades do Mestre Green.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-[#ACACAC] py-12 text-center">
          Nenhuma notícia publicada por enquanto.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/noticias/${post.id}`}
              className="group flex flex-col rounded-[12px] overflow-hidden bg-[#111E0C] border border-[#1F3014] hover:border-[#58CC02]/40 transition-colors"
            >
              {post.imageLink ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageLink}
                  alt=""
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 w-full bg-[#1F3014]" />
              )}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <p className="text-[10px] uppercase tracking-wide text-[#ACACAC]">
                  {formatRelative(post.publishedAt)}
                </p>
                <h2 className="text-base font-semibold text-white leading-snug group-hover:text-[#58CC02] transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-[#ACACAC] line-clamp-3">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
