import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/news";

export const revalidate = 300;

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleBySlug(id);

  if (!article) notFound();

  const content = article.content ?? "";
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
      {article.category ? (
        <span className="text-xs text-[#ACACAC] uppercase tracking-wide">
          {article.category}
        </span>
      ) : null}

      <h1 className="text-4xl font-display font-semibold text-black leading-tight">
        {article.title}
      </h1>

      {article.excerpt ? (
        <p className="text-xl text-gray-500 leading-relaxed">{article.excerpt}</p>
      ) : null}

      {article.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full aspect-video rounded-xl object-cover mt-2 bg-gray-200"
        />
      ) : (
        <div className="w-full aspect-video rounded-xl bg-gray-200 mt-2" />
      )}

      <div className="rounded-xl bg-gray-50 border border-gray-100 p-8">
        {content ? (
          isHtml ? (
            <div
              className="text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_a]:text-[#58CC02] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:rounded-lg [&_img]:my-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {content.split(/\n\n+/).map((paragraph, i) => (
                <p
                  key={i}
                  className="text-gray-700 text-lg leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )
        ) : (
          <p className="text-gray-300 text-sm">Conteúdo indisponível.</p>
        )}
      </div>
    </div>
  );
}
