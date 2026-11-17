# Jogos educativos: guia técnico

Como os jogos funcionam por dentro e como mexer neles sem quebrar nada. Para o porquê das
decisões, o feedback do Eduardo e o que está pendente, leia `docs/jogoseducativos-plano.md`.

No ar em `https://edunicoleti.com.br/jogoseducativos`. Hoje há um jogo, Primeiras palavras
(`/jogoseducativos/primeiras-palavras/`), feito para o filho do Eduardo, de 1 ano, jogar no
colo de um adulto em um **iPad de 6ª geração**.

## Mapa de arquivos

| Arquivo | Papel |
| --- | --- |
| `public/jogoseducativos/index.html` | tela de escolha de jogos (tela de adulto) |
| `public/jogoseducativos/arte.js` | todas as ilustrações em SVG (`JE_ARTE`) e a lista de coisas da cena (`JE_ITENS`) |
| `public/jogoseducativos/audio/*.mp3` | voz do jogo, uma palavra por arquivo |
| `public/jogoseducativos/icone-*.png`, `manifest.webmanifest` | atalho na Tela de Início |
| `public/jogoseducativos/primeiras-palavras/index.html` | marcação, estilos e posições da cena |
| `public/jogoseducativos/primeiras-palavras/jogo.js` | monta a cena, trata o toque, brilho e som, faz o bebê falar e apontar |
| `public/jogoseducativos/primeiras-palavras/estudio.js` | tela "Fotos e vozes": foto, recorte, gravação de voz |
| `public/jogoseducativos/primeiras-palavras/armazem.js` | guarda fotos e vozes no aparelho (IndexedDB) |
| `public/jogoseducativos/primeiras-palavras/.htaccess` | libera o microfone só nesta pasta |
| `scripts/jogoseducativos/gerar-audio.mjs` | gera as vozes com o Gemini e trata os mp3 |
| `scripts/jogoseducativos/conferir-audio.mjs` | pede ao Gemini para transcrever e avaliar os mp3 |
| `scripts/jogoseducativos/vozes/*.wav` | originais do Gemini (versionados porque a cota é pequena) |
| `scripts/jogoseducativos/gerar-icone.cjs` | gera os ícones a partir do desenho do bebê |
| `scripts/jogoseducativos/testes/` | servidor com cabeçalhos de produção, testes e folha de arte |

## Restrições que mandam em tudo

**Aparelho antigo (iPad 6ª geração, Safari).**
- JavaScript **ES5**: `var`, `function`, sem arrow function, sem `class`, sem módulos. Os
  arquivos em `public/` não passam por build nem por lint.
- Sem framework, sem fontes externas, sem biblioteca. Peso total hoje: uns 290 KB.
- Animação de SVG por **atributo** (`setAttribute('transform', ...)`), não por CSS: é o que
  funciona igual em qualquer Safari. CSS com prefixo `-webkit-` junto do normal.
- Som: o iOS só toca depois de um toque. O botão Começar cria o `AudioContext`, toca um
  buffer mudo e define `navigator.audioSession.type`. Todo `touchend` tenta `resume()`.
- `touch-action:none` na cena, `manipulation` no resto; gestos de zoom e menu de contexto
  são bloqueados para o bebê não sair do jogo.

**Servidor** (detalhes em `AGENTS.md`, seção do servidor):
- foto lida com `FileReader.readAsDataURL`. **Nunca `URL.createObjectURL` em `<img>`**: a CSP
  bloqueia `blob:`. Foi o bug do envio de foto em produção;
- voz gravada toca por Web Audio (`decodeAudioData`), não por `<audio src="blob:">`;
- nada de chamada a API externa pelo navegador. As vozes do Gemini são geradas antes e
  publicadas como mp3;
- `.js` e `.png` ficam 1 ano em cache. **A cada mudança, troque o `?v=`** em todos os
  `<script>` das duas páginas (hoje `?v=4`) e, se mexer nos ícones, nos `href` dos ícones e
  no `manifest.webmanifest`. Os mp3 usam `?v=2` em `jogo.js` (`ARQUIVOS` e `urlPadrao`).

## Como a cena funciona

- **Palco.** `#palco` é desenhado para 4:3 e se ajusta entre 1,2 e 1,62 deitado ou 0,6 e
  0,82 em pé (`ajustarPalco` em `jogo.js`). A classe `paisagem` ou `retrato` escolhe as
  posições.
- **Camadas**, de trás para a frente: céu (sol, nuvens, arco-íris), morros de longe e
  árvores, `#camada-ceu` (balões), morro do meio e flores, `#camada-fundo` (papai e mamãe),
  morro da frente, `#camada-frente` (objetos e bebê). Enfeites do cenário são
  `<div class="decor" data-arte="nome">` e não respondem ao toque.
- **Posições** ficam no CSS de `primeiras-palavras/index.html`, por variáveis
  `--x`, `--y` (de baixo) e `--w`, em porcentagem do palco, uma regra para `.paisagem` e outra
  para `.retrato`. Toda coisa nova precisa das duas.
- **Toque.** `elementFromPoint` acha a coisa sob o dedo. Entrar em uma coisa (tocando ou
  arrastando) faz ela pular e o **bebê da cena falar o nome e apontar** para ela (`apontar`
  gira o braço do lado certo pelo ângulo até o alvo). Repetir a mesma coisa durante a fala
  não repete o som; outra coisa interrompe e troca. Fundo faz "plim" (oscilador).
- **Brilho.** Um `<canvas id="brilho">` por cima de tudo, sem receber toque: pulso, rastro
  que segue o dedo e estouro de estrelas. Teto de 260 partículas e o laço para quando não há
  nada vivo, para poupar o aparelho.
- **Boca.** Durante a fala, um `AnalyserNode` mede o volume e abre a boca do bebê na mesma
  medida. Se o bebê tem foto, a foto pulsa no lugar da boca.
- **Sair.** Botões de adulto exigem segurar 1,3 s (`aoSegurar`).

## Contrato entre `arte.js` e o jogo

Cada figura é um SVG em texto em `window.JE_ARTE`. O jogo procura estas classes:

| Classe | Uso |
| --- | --- |
| `.je-cabeca` | cabeça desenhada; some quando há foto (inclui o cabelo comprido da mamãe) |
| `.je-olhos` | pisca |
| `.je-sorriso`, `.je-boca` | boca fechada e aberta; a aberta escala a partir do ponto `boca` |
| `.je-braco` | braço que acena (papai e mamãe) |
| `.je-braco-e`, `.je-braco-d`, `.je-dedo` | braços do bebê que apontam e o dedo que aparece |
| `.je-rabo`, `.je-asa`, `.je-raios` | animações de enfeite |

`window.JE_ITENS` descreve cada coisa tocável: `id`, `palavra`, `tipo` (`pessoa` ou
`objeto`), `proporcao` (altura da caixa em % da largura). Pessoas têm ainda `rosto`
(centro e diâmetro da cabeça em %, para a foto cair no lugar certo), `boca` e `olhos` (pontos
no SVG). O bebê tem `caixa` e `bracos` (ombro e mão de cada braço) para calcular a mira.
**Se mexer no desenho, ajuste esses números**, senão a foto e o dedo saem do lugar.

Degradês e recortes ficam num SVG de definições (`#je-defs`) que `arte.js` injeta no começo
do `<body>`. Por isso **`arte.js` precisa ser carregado dentro do `<body>`**, não no `<head>`.

Estilo das ilustrações (versão atual, aprovada pelo Eduardo depois de recusar formas
chapadas): cartoon infantil acabado, contorno na versão escura da própria cor, uma sombra
e um ponto de luz por forma, olhos com dois brilhos, bochecha em degradê, mãos com dedos.

## Fotos e vozes de casa

- `armazem.js` grava no IndexedDB `jogoseducativos`, loja `itens`, um registro por coisa:
  `{ id, palavra?, casa?, ordem?, foto?, voz? }`. `foto` é um JPEG 480 x 480 em `data:`;
  `voz` é `{ dados: ArrayBuffer, tipo, inicio, fim, ganho }`. Sem IndexedDB (aba privada),
  cai para a memória e avisa na tela.
- Coisas da casa (`casa: true`, id `casa-<data>`) viram balões; até 4, e só com foto e voz.
- A gravação dura até 3 s; `estudio.js` corta o silêncio das pontas e calcula o ganho.
- **Safari e atalho da Tela de Início guardam dados separados.** Fotos enviadas em um não
  aparecem no outro. A tela de escolha de jogos explica isso.
- Um jogo novo que use `armazem.js` divide a mesma loja: use ids com prefixo próprio.

## Vozes do jogo

Geradas uma vez e publicadas como mp3. O navegador nunca fala com o Gemini.

```bash
GEMINI_API_KEY=... node scripts/jogoseducativos/gerar-audio.mjs agua miau   # gera o que falta
node scripts/jogoseducativos/gerar-audio.mjs --tratar                       # só refaz os mp3 dos wav
GEMINI_API_KEY=... node scripts/jogoseducativos/conferir-audio.mjs agua     # "escuta" e avalia
```

- Endpoint `v1beta/interactions`, voz **Sulafat**, estilo de mãe falando devagar com o bebê.
  O estilo vai em `speech_metadata.style`, separado do texto. Se a instrução for no texto, o
  modelo lê a instrução em voz alta (e o áudio vira 15 s).
- Modelo padrão `gemini-3.8-flash-lite-tts` (cota grátis de 3 pedidos por minuto). Papai e
  Mamãe saíram do `gemini-3.8-flash-tts` (10 por dia). A conferência diz que soam iguais.
- O tratamento (ffmpeg) corta silêncio, normaliza a -17 LUFS e suaviza as pontas.
- **Sempre confira o resultado com `conferir-audio.mjs`.** "Bebê." saiu "vevê" e "Bebê!"
  saiu "pepê"; o texto que funcionou foi "Bê-bê.". O modelo de escuta às vezes dá 503 por
  minutos; o script espera e tenta de novo.
- Na nuvem do Claude, o `fetch` do Node precisa de `NODE_USE_ENV_PROXY=1` para sair.

## Receitas

**Acrescentar uma palavra com objeto na cena** (exemplo: água)
1. Voz: descomente em `PALAVRAS` de `gerar-audio.mjs`, gere, confira.
2. Desenho: nova figura em `arte.js` (`JE_ARTE.agua`) no mesmo estilo; revise com
   `folha-arte.cjs` (acrescente o nome na lista da folha 2).
3. `JE_ITENS`: `{ id: 'agua', palavra: 'Água', tipo: 'objeto', proporcao: 100 }`.
4. `jogo.js`: o arquivo em `ARQUIVOS` e o id na lista de `montarCena` (a ordem define quem
   fica na frente).
5. Posição: regras `.paisagem [data-item="agua"]` e `.retrato [data-item="agua"]`.
6. A tela Fotos e vozes lista sozinha tudo o que está em `JE_ITENS`.
7. `teste-jogo.cjs`: o id em `PALAVRAS`. Tela de escolha: a palavra em "Palavras do jogo".
8. Troque o `?v=` dos scripts e rode os testes.

**Criar um jogo novo**
1. Pasta `public/jogoseducativos/<nome>/` com `index.html` próprio; reaproveite `arte.js`.
2. Cartão novo em `public/jogoseducativos/index.html` (copie o bloco `<a class="jogo">`).
3. Precisou de microfone? Copie o `.htaccess` de `primeiras-palavras`.
4. `<meta name="robots" content="noindex, nofollow">`, como as outras páginas.

## Como verificar

O agente não escuta nem tem iPad. A verificação é por testes no navegador (Playwright, que
já vem na nuvem do Claude; na sua máquina: `npm install --no-save playwright` e
`npx playwright install chromium`).

```bash
python3 scripts/jogoseducativos/testes/servidor.py &              # public/ com os cabeçalhos de produção, porta 8770
node scripts/jogoseducativos/testes/teste-jogo.cjs                # cena, toque, fala, arrasto, sair
node scripts/jogoseducativos/testes/teste-estudio.cjs             # foto, recorte, voz, persistência
node scripts/jogoseducativos/testes/folha-arte.cjs                # PNG de todas as ilustrações
node scripts/jogoseducativos/testes/teste-jogo.cjs https://edunicoleti.com.br   # o mesmo, no ar
```

Os testes dizem `ok` ou `FALHOU` em cada item e saem com código 1 se algo falhar. As
capturas vão para a pasta temporária (ou para `SAIDA`). **Olhe as capturas**: os testes
provam que a interação funciona, não que o desenho está bonito.

Antes de publicar: os dois testes no servidor local, `npm run lint`, `npm run build`, `?v=`
trocado. Depois do deploy: os dois testes de novo contra `https://edunicoleti.com.br`.
