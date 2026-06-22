// Integração com o feed público de notícias (app externo).
// Configurar no .env.local: NEWS_API_BASE (host do app) e NEWS_API_KEY.
// Endpoint: GET {NEWS_API_BASE}/api/public/feed  (auth via header x-api-key)

// Defaults apontam pro feed ativo (valem quando nao ha .env.local, ex: clone do GitHub).
// As envs NEWS_API_BASE / NEWS_API_KEY sobrescrevem. Trocar quando o app de noticias
// sair do preview do Lovable para um dominio de producao.
const BASE = (
  process.env.NEWS_API_BASE ??
  "https://project--b198a0dd-9e79-4f96-a67b-87856e54d036-dev.lovable.app"
).replace(/\/$/, "");
const KEY = process.env.NEWS_API_KEY ?? "chave_api_key";

export type FeedItem = {
  title: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  content?: string;
  published_at: string;
  /** url canônica no blog de origem (/noticia/{slug}) */
  url: string;
  /** slug derivado (usado na rota /noticias/[id]) */
  slug: string;
};

export type FeedOptions = {
  limit?: number;
  offset?: number;
  categoria?: string;
  since?: string;
  /** false => omite o content (lista) */
  full?: boolean;
};

function slugFromUrl(url: string): string {
  const m = (url ?? "").match(/\/noticias?\/([^/?#]+)/i);
  return m ? m[1] : (url ?? "");
}

/** Busca o feed de notícias. Retorna [] se não configurado ou em erro (degrada gracioso). */
export async function getFeed(opts: FeedOptions = {}): Promise<FeedItem[]> {
  if (!BASE || !KEY) return [];

  const qs = new URLSearchParams();
  qs.set("limit", String(opts.limit ?? 20));
  if (opts.offset) qs.set("offset", String(opts.offset));
  if (opts.categoria) qs.set("categoria", opts.categoria);
  if (opts.since) qs.set("since", opts.since);
  if (opts.full === false) qs.set("full", "false");

  try {
    const res = await fetch(`${BASE}/api/public/feed?${qs.toString()}`, {
      headers: { "x-api-key": KEY },
      next: { revalidate: 300 }, // cache de 5 min
    });
    if (!res.ok) return [];

    const data = await res.json();
    const raw: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : ((data?.items ?? data?.data ?? data?.results ?? []) as Record<
          string,
          unknown
        >[]);

    return raw.map((it) => {
      const url = (it.url as string) ?? "";
      return {
        title: (it.title as string) ?? "",
        excerpt: (it.excerpt as string) ?? "",
        image_url: (it.image_url as string) ?? null,
        category:
          typeof it.category === "string"
            ? it.category
            : ((it.category as { name?: string })?.name ?? ""),
        content: it.content as string | undefined,
        published_at: (it.published_at as string) ?? "",
        url,
        slug: (it.slug as string) ?? slugFromUrl(url),
      };
    });
  } catch {
    return [];
  }
}

/** Busca um artigo pelo slug. O feed não tem get-by-slug, então puxa a lista cheia e filtra. */
export async function getArticleBySlug(slug: string): Promise<FeedItem | null> {
  const items = await getFeed({ limit: 100, full: true });
  return items.find((it) => it.slug === slug) ?? null;
}
