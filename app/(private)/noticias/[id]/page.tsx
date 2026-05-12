import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessToken } from "@/lib/session";
import { getBlogPost } from "@/lib/api";

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAccessToken();
  const post = token ? await getBlogPost(token, id) : null;

  if (!post) notFound();

  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="flex flex-col gap-8 max-w-3xl mx-auto">
      <Link
        href="/noticias"
        className="text-sm text-[#ACACAC] hover:text-white transition-colors w-fit"
      >
        ← Voltar para Notícias
      </Link>

      <header className="flex flex-col gap-3">
        {publishedAt && (
          <p className="text-[10px] uppercase tracking-wide text-[#ACACAC]">
            {publishedAt}
            {post.ownerUsername ? ` • por ${post.ownerUsername}` : ""}
          </p>
        )}
        <h1 className="text-3xl font-display font-semibold text-white leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-base text-[#ACACAC]">{post.excerpt}</p>
        )}
      </header>

      {post.imageLink && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageLink}
          alt=""
          className="w-full rounded-[12px] border border-[#1F3014]"
        />
      )}

      <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-white/90">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
