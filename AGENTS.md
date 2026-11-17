# edunicoleti.com.br: guia para agentes

Site pessoal e ferramentas de trabalho do Eduardo Nicoleti (webdesigner, UX/UI). Um
repositório só, publicado na Hostinger. Este arquivo vale para qualquer tarefa aqui; cada
área tem o seu documento em `docs/` (mapa no fim).

## Regras que valem sempre

- **O repositório é público.** Nada de preço, margem, estratégia comercial, dado pessoal de
  cliente, chave ou senha em arquivo versionado. Dossiês de clientes ficam em `clientes/`,
  que está no `.gitignore`.
- **Texto em português do Brasil.** Não use travessão em nada que você escrever (páginas,
  documentos, commits, respostas), a não ser que o Eduardo peça. Troque por vírgula, dois
  pontos, parênteses ou ponto.
- **Commits** em português e sem acento, no padrão do histórico: título `Área: o que mudou`
  e um corpo que explica o porquê.
- **Memória do projeto.** O próximo agente não vê a sua conversa. Ao terminar, registre no
  documento da área o que foi decidido, o que o Eduardo achou e o que ficou pendente.

## Como o site é montado

- **SPA React 19 + Vite + TypeScript** em `src/`. Rotas em `src/App.tsx`:

  | Rota | O que é |
  | --- | --- |
  | `/` | site público (portfólio) |
  | `/mentoria` | landing page da mentoria |
  | `/proposta/:slug` e `/proposta/:slug/pdf` | propostas comerciais (`src/data/propostas.ts`), noindex |
  | `/propostas` | painel de propostas, com senha (`src/components/AuthGate.tsx`) |
  | `/financeiro` | painel financeiro pessoal, com senha, Supabase |
  | `/crm` | funil de vendas, com senha |

- **Páginas estáticas** em `public/`, copiadas como estão para o build (sem bundler, sem
  TypeScript, sem lint): propostas e materiais de cliente em `public/proposta/<nome>/` e
  `public/material/<nome>/`, e os jogos em `public/jogoseducativos/`. O `.htaccess` só manda
  para a SPA o que não existe como arquivo ou pasta, então a página estática sempre vence.
- Páginas estáticas de cliente costumam abrir com um comentário no HTML explicando o
  contexto e as decisões. Leia antes de mexer.

## Comandos

```bash
npm ci
npm run dev      # respeita a variável PORT
npm run lint     # ESLint, só em .ts/.tsx
npm run build    # tsc -b + vite build, saída em dist/
```

Variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` vêm dos secrets do GitHub no
deploy; sem elas o financeiro roda em modo local. `GEMINI_API_KEY` serve só para gerar as
vozes dos jogos na sua máquina; nunca vai para o repositório nem para o navegador.

## Publicar

- Push na `main` dispara `.github/workflows/deploy.yml`: lint e `tsc`; se passarem, build e
  `rsync --delete` do `dist/` para `public_html` na Hostinger. Leva uns 2 minutos.
- O servidor fica idêntico ao `dist/`: o que não está no build é apagado.
- Antes de levar algo para a `main`, rode `npm run lint` e `npm run build`. Publicar é
  visível para todo mundo; confirme com o Eduardo, a não ser que ele tenha pedido a entrega
  já publicada.
- Depois do deploy, confira no ar (por exemplo, `curl` do arquivo novo procurando um trecho
  que só existe na versão nova). Não dê por publicado sem ver.

## Regras do servidor que pegam desprevenido (`public/.htaccess`)

- **CSP** `default-src 'self'`, com estas consequências práticas:
  - imagem só do próprio site ou `data:`. Um `blob:` em `<img>` é bloqueado (leia arquivo
    com `FileReader.readAsDataURL`, não com `URL.createObjectURL`);
  - script só do próprio site ou inline: CDN não carrega;
  - `connect-src` só o próprio site e o Supabase: o navegador não chama outras APIs;
  - mídia (`<audio>`, `<video>`) só do próprio site: `blob:` também não toca. Para som
    gravado na hora, use Web Audio (`decodeAudioData`);
  - fontes só do Google Fonts ou locais.
- **Permissions-Policy** desliga microfone, câmera e localização no site inteiro. Uma pasta
  pode reabrir o que precisa com o próprio `.htaccess` (exemplo:
  `public/jogoseducativos/primeiras-palavras/.htaccess` libera o microfone só ali).
- **Cache de 1 ano** para `.js`, `.css`, `.png`, `.svg`, `.ico` e fontes. O build do React
  tem hash no nome, mas os arquivos de `public/` não: a cada mudança, troque o `?v=` de quem
  os referencia, senão o navegador continua com a versão velha. `index.html` não tem cache.
- Para testar com esses cabeçalhos, use `scripts/jogoseducativos/testes/servidor.py`: ele
  serve qualquer pasta aplicando os `.htaccess`. Um servidor comum (vite, `http.server`)
  esconde erros que só aparecem em produção.

## Documentos por área

| Área | Leia |
| --- | --- |
| Jogos educativos (`public/jogoseducativos`, `scripts/jogoseducativos`) | `docs/jogoseducativos-guia.md` (como funciona e como mexer) e `docs/jogoseducativos-plano.md` (decisões, feedback, pendências) |
| Hub e CRM | `docs/plano-hub-crm-2026-07.md` |
| Financeiro | `docs/financeiro-supabase-setup.md`, `docs/superpowers/specs/2026-07-15-financeiro-design.md`, `docs/ciclo1-supabase.sql` |
| Landing page da mentoria | `docs/plano-lp-mentoria-v4.md` (a v3 é a anterior) |
