# Camada de integração (backend) — guia para o frontend

Esta camada foi portada do app mobile (greenzone) para o web, espelhando o
mesmo contrato do backend (`https://api.mestregreen.com`). **Nenhuma UI foi
criada** — só a "tubulação" (`lib/`, `auth.ts`, config). O frontend é seu: estas
funções são o que as telas devem chamar.

Tudo abaixo já está tipado e pronto para consumo. Onde algo não pôde ser
concluído, está marcado como **pendência**.

## Variáveis de ambiente (`.env.local`)

| Var | Para quê |
|---|---|
| `AUTH_SECRET` | sessão NextAuth (já configurada) |
| `API_BASE` | base do backend no **servidor** (`lib/api.ts`); default = produção |
| `NEXT_PUBLIC_API_BASE` | base do backend no **browser** (realtime); default = produção |
| `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Web Client ID **público** do Google (o mesmo que o backend já valida) p/ o botão "Entrar com Google"; preencher uma vez com o valor existente |

Após o `git pull`, rode `npm install` (foi adicionada a dependência
`@stomp/stompjs` para o tempo real).

## Login com MFA + verificação de dispositivo

A action `login` (`lib/actions/auth.ts`) continua compatível com o form atual,
mas agora devolve um `challenge` quando o backend pede segundo passo:

```ts
const [state, action] = useActionState(login, undefined);
// state?.challenge === "mfa_required"               → renderize o input de 2FA,
//   reenvie o form com o campo extra <input name="mfaCode" />
// state?.challenge === "device_verification_required" → peça o código do e-mail,
//   chame confirmDevice(email, code, deviceId) e refaça o login
```

Para acionar a verificação de dispositivo, envie um `deviceId` estável (ex.: um
UUID guardado em cookie) no form. Sem `deviceId`, o backend não desafia o
dispositivo (login direto). Endpoints relacionados, já como actions:
`confirmAccount(email, code)`, `confirmDevice(email, code, deviceId)`,
`resendVerificationCode(email)`.

## Login social (Google / Apple) — web

Versão web simplificada: **sem** OAuth server-side, **sem** client secret e **sem**
projeto novo no Google Cloud — reaproveita o backend, que já valida o token.

**Google (pronto):**
1. A UI renderiza o botão do **Google Identity Services** usando o
   `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` (o Web Client ID público que já existe — o
   mesmo do backend; não é setup novo).
2. O GIS devolve um `idToken`. Chame uma das opções:
   - Client component: `signIn("social", { provider: "google", token: idToken, redirect: false })` (de `next-auth/react`), depois navegue.
   - Server action: `socialLogin({ provider: "google", token: idToken })` → `{ ok }`.
3. O provider `"social"` (em `auth.ts`) manda o token para `/auth/google`, que
   valida e devolve a sessão. Mesmo fluxo para Apple (`provider: "apple"`).

**Apple — um passo a mais:** o "Sign in with Apple" na web usa um **Services ID**
(diferente do bundle do app) + domínio/return URL no Apple Developer, e o backend
hoje valida a audience contra o **bundle do app** (`apple.bundle.id`). Para
Apple-web funcionar é preciso (a) criar o Services ID e (b) o backend aceitar essa
audience. A tubulação web já está pronta; só depende desses dois ajustes.

## Cadastro

`registerUser(payload: RegistrationPayload)` → `{ ok }`. O backend envia um
código de 6 dígitos por e-mail; confirme com `confirmAccount(email, code)`.

## Tempo real (WebSocket / STOMP)

`lib/realtime.ts` espelha o `ticketSocket` do mobile. Use num client component:

```ts
"use client";
import { createRealtimeClient } from "@/lib/realtime";

const client = createRealtimeClient(accessToken, {
  onTicket: (ticket) => { /* atualiza feed de palpites ao vivo */ },
  onNotification: () => { /* refetch do contador de não lidas */ },
});
client.activate();
// cleanup: client.deactivate();
```

Assina `/topic/tickets` (feed público) e `/user/queue/notifications`
(`{ hasUnread: true }` por usuário). O `accessToken` vem da sessão
(`session.accessToken`).

## Notificações

Actions em `lib/actions/notifications.ts`: `fetchMyNotifications({page,size})`,
`fetchUnreadNotificationCount()`, `markNotification(id)`,
`markAllNotifications()`. Combine com o ping de tempo real acima.

## Perfil + foto

`lib/actions/profile.ts`: `updateProfile(payload)` e
`updateProfilePicture(dataUrl)`. A UI faz o picker da imagem e converte para
`data:image/jpeg;base64,…` (igual ao mobile); a action envia no
`PUT /users/{id}`.

## Métodos de pagamento (cartões / PIX)

`lib/actions/payment-methods.ts`: `listPaymentMethods()`, `addCard(payload)`,
`removeCard(id)`, `setDefaultCard(id)`. **A tokenização do cartão é no gateway/UI**
— só o `gatewayToken` + metadados mascarados chegam ao backend (nunca PAN/CVV).

## Dispositivo / MFA enrolment

`lib/actions/device.ts`: `registerDevice(payload)` (push token),
`startMfaSetup()` → `{ secret, qrCodeUrl }`, `verifyMfaSetup(code)`.

## Pendências / fora de escopo

- **MFA no login (testado contra o backend)**: qualquer falha de login (senha
  errada, conta travada OU "MFA exigido") volta como **403 com corpo vazio** —
  indistinguíveis. Logo o challenge `mfa_required` não dispara sozinho (limitação
  do backend, vale para todos os clientes, inclusive o mobile). O que funciona:
  verificação de **dispositivo (202)**, e login **com** o código correto
  (`username`+`password`+`mfaCode`) → 200. Para o MFA-challenge funcionar de fato,
  o backend precisaria sinalizar "MFA exigido" de forma distinta (ex.: 202/um
  status próprio) em vez de lançar `BadCredentialsException`.
- **Google client ID**: preencher `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` com o valor
  existente (público, dos secrets de deploy) — não está no repo.
- **Apple no web**: requer um Services ID (Apple Developer) + o backend aceitar
  essa audience; a tubulação web já está pronta. Google já funciona reusando o
  client ID existente.
- **Recuperar senha**: o backend **não tem** endpoint de reset — não há o que
  integrar até existir um (`/auth/forgot-password` ou similar).
- **Push web (entrega)**: registrar o token funciona (`registerDevice`), mas a
  entrega no browser exige Service Worker + chaves VAPID (não feito).
- **Refresh de token no web**: o access token vive no JWT do NextAuth; o
  refresh-cookie é do domínio da API, então o refresh automático do mobile não
  se aplica diretamente aqui. `apiRefresh()` existe, mas a orquestração ficou de
  fora (decisão de arquitetura da sessão).
</content>
