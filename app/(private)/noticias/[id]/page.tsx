import { notFound } from "next/navigation";

interface NewsArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  content?: string;
}

const NEWS: NewsArticle[] = [
  {
    id: "1",
    category: "Futebol Internacional",
    title: "Buffon pede demissão da federação após Itália ficar fora da Copa do Mundo",
    subtitle: "Ex-goleiro e ídolo histórico da Azzurra era o chefe de delegação da seleção",
    content:
      "Gianluigi Buffon pediu demissão do cargo de chefe de delegação da seleção italiana após a Azzurra ser eliminada nas eliminatórias e ficar de fora da Copa do Mundo pela segunda vez consecutiva. Em carta aberta à Federação Italiana de Futebol (FIGC), o ex-goleiro assumiu responsabilidade moral pelo fracasso e afirmou que não seria justo continuar no posto diante de um resultado tão decepcionante para o futebol do país.\n\nA eliminação italiana causou comoção na Europa. Buffon, que encerrou a carreira de jogador em 2023 após passagem pela seleção por mais de duas décadas, havia assumido o cargo administrativo com o objetivo de renovar a cultura do futebol nacional. A FIGC ainda não confirmou se aceitará ou não o pedido de demissão.",
  },
  {
    id: "2",
    category: "Futebol Internacional",
    title: "Qual o grupo mais forte da Copa do Mundo? Veja lista com base no ranking da Fifa",
    subtitle: "Levantamento considera o ranking atual da Fifa para determinar os grupos mais competitivos do torneio",
  },
  {
    id: "3",
    category: "Futebol Brasileiro",
    title: "Flamengo confirma contratação e apresenta novo reforço para a temporada",
    subtitle: "Jogador assinou contrato de dois anos e reforça o meio-campo do clube carioca",
  },
  {
    id: "4",
    category: "Champions League",
    title: "Real Madrid vence nos pênaltis e avança às semifinais da Champions League",
    subtitle: "Merengues sofrem mas superam o adversário e garantem vaga na próxima fase do torneio europeu",
  },
  {
    id: "5",
    category: "Futebol Internacional",
    title: "Messi marca dois e lidera Argentina em amistoso preparatório para a Copa",
    subtitle: "Camisa 10 mostrou estar em grande fase e deixou sua marca em vitória convincente da Albiceleste",
  },
];

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = NEWS.find((n) => n.id === id);

  if (!article) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
      <h1 className="text-4xl font-display font-semibold text-black leading-tight">
        {article.title}
      </h1>

      <p className="text-xl text-gray-500 leading-relaxed">
        {article.subtitle}
      </p>

      <div className="w-full aspect-video rounded-xl bg-gray-200 mt-2" />

      <div className="rounded-xl bg-gray-50 border border-gray-100 p-8">
        {article.content ? (
          <div className="flex flex-col gap-4">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-gray-700 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-sm">Conteúdo da notícia...</p>
        )}
      </div>
    </div>
  );
}
