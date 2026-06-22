# Guia de Teste Local — Integrações do Front (Mestre Green)

Este front (consumidor) já está apontando para o **backend ativo no VPS**
(`http://2.24.116.68:8080`) via `.env.local`. É só rodar e testar — **nada foi
pushado**, está tudo local pra você revisar.

## 1. Subir o front
```bash
cd mestregreen/mestre-green
npm install        # se ainda não rodou
npm run dev        # abre em http://localhost:3000
```
> O `.env.local` já tem `API_BASE=http://2.24.116.68:8080` (backend real, com dados
> reais). Os mocks ficam **DESLIGADOS** por padrão — só ligam se você setar
> `DEV_FAKE_AUTH=true` no `.env.local`.

## Conta de teste (consumidor premium)
| | |
|---|---|
| **Login** | `qauser` |
| **Senha** | `TestPass123!@` |

É **PREMIUM + empresa Receba** → enxerga todos os palpites/ofertas.
*(Para o backoffice depois, use o **LuizAdmin** com a senha que você definiu — não está escrita aqui de propósito.)*

---

## 2. Integrações — passo a passo

### a) Login  ✅
1. http://localhost:3000 → abrir o modal de login.
2. `qauser` / `TestPass123!@`.
- **Esperado:** loga (NextAuth → `/auth/login` + `/auth/me` no backend). Sessão criada.

### b) Cadastro (registro simples, sem MFA)  ✅
1. Abrir o cadastro → criar usuário (nome, e-mail, senha).
- **Esperado:** conta criada já **habilitada + PREMIUM + Receba** (sem gate de e-mail por enquanto) e você consegue logar com ela.
- *Obs.: SMTP está desligado — não chega e-mail, mas o cadastro funciona.*

### c) Jogos / Ao Vivo (palpites)  ✅
1. Logado como `qauser`, abrir **Jogos** e **Ao Vivo**.
- **Esperado:** aparece o palpite **Flamengo × Palmeiras**, casa **Receba** (odd 1.85), com brasões dos times.
- *Palpites ao vivo são PREMIUM — uma conta FREEMIUM veria vazio (gate proposital).*

### d) Promoções  ✅
1. Abrir **Promoções**.
- **Esperado:** aparece a oferta "Bônus de Boas-Vindas QA".

### e) Notificações  ✅
- **Esperado:** `qauser` tem notificações (boas-vindas do cadastro + a de CRM "Palpite do dia!"). O front sinaliza (sino/título da aba).

### f) Notícias  ⚠️
- A página de **notícias é ESTÁTICA** (lista fixa no código, não puxa do backend). Ainda não é integração — se quiser dinâmica, dá pra wirar no endpoint `/blog-posts` (me avisa que eu faço).

---

## 3. Dados que já existem no backend (pra testar)
- **236 times** (Premier, La Liga, Serie A, Bundesliga, Ligue 1, Primeira Liga, Eredivisie, Saudi, Liga MX, Argentina, Brasileirão A/B, + 36 seleções) com brasões.
- **1 casa de aposta:** Receba.
- **1 partida** (Flamengo × Palmeiras) + **bilhetes/palpites**, **1 oferta**, **notificações**.
- Para criar mais (partidas, bilhetes, ofertas, notificações de CRM): use o **backoffice** (`tabela-sports-office`) logado como **LuizAdmin**.

### g) Realtime / atualizações ao vivo (WebSocket)  ✅
- O `.env.local` aponta `NEXT_PUBLIC_API_BASE` pro VPS, então o cliente realtime do
  browser conecta no `ws://2.24.116.68:8080/ws` (e não na produção morta). Atualizações
  ao vivo de bilhetes/notificações devem chegar sozinhas com você logado.

---

## 4. Se algo não aparecer
- Confirme no `.env.local`: `API_BASE=http://2.24.116.68:8080` **e** `NEXT_PUBLIC_API_BASE=http://2.24.116.68:8080`, e **sem** `DEV_FAKE_AUTH=true` (senão liga os mocks).
- O backend responde direto: `http://2.24.116.68:8080/teams` (deve listar os 236 times).
- Lembrando: `API_BASE` (HTTP, server-side) e `NEXT_PUBLIC_API_BASE` (realtime, browser) são lidos no **start** do `npm run dev` — se mudar, reinicie o dev server.
