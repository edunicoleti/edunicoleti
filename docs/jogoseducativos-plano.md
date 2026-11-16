# Jogos educativos: plano e decisões

Página: `edunicoleti.com.br/jogoseducativos`. Arquivos em `public/jogoseducativos/`.
Público: bebê de 12 meses, jogando no colo de um adulto, em um iPad de 6ª geração.

## Histórico de direção

**Versão 1 (descartada).** Papai e Mamãe em telas separadas, estilo de baixo estímulo:
tons pastel, movimentos lentos, sem efeitos, sessão que terminava sozinha. Na prática ficou
exagerado e pouco divertido.

**Versão 2 (atual).** Uma cena só, cores vivas, resposta rápida e chamativa a cada toque,
fotos e vozes reais da família. A decisão foi do Eduardo, depois de ver a versão 1.

O que ficou da pesquisa da versão 1 e continua valendo:

- **Jogar junto.** A Sociedade Brasileira de Pediatria e a OMS recomendam evitar telas antes
  dos 2 anos, e estudos do grupo de Patricia Kuhl mostram que bebês aprendem palavras com
  uma pessoa ao vivo, não com a tela sozinha. O jogo é um apoio para o adulto falar com o
  bebê. A tela de escolha de jogos diz isso.
- **Fala dirigida ao bebê.** Palavra isolada, dita devagar e com melodia, ajuda (Ramírez-
  Esparza, García-Sierra e Kuhl, 2014; Ferjan Ramírez, Lytle e Kuhl, 2020). A voz do jogo
  segue esse estilo.
- **Motricidade.** Aos 12 meses o bebê bate com a mão inteira e arrasta, não aponta com
  precisão. Alvos grandes, qualquer toque vale, arrastar também dispara.
- **Referente real.** A palavra cola melhor na pessoa e no objeto de verdade. Daí as fotos
  e vozes de casa.
- **Sem estrobo.** Efeitos vivos, mas nada de tela inteira piscando.

## Como funciona

1. Tela de adulto com Começar (o primeiro toque libera o som no iPad) e Fotos e vozes.
2. Cena única: papai e mamãe atrás, bebê na frente, bola, pato, au-au e banana ao redor,
   céu com sol e nuvens.
3. Tocar ou arrastar o dedo sobre uma coisa: ela pula, solta estrelas, e o **bebê da cena
   aponta o dedo para ela e fala o nome**, com a boca acompanhando o volume da voz.
   Papai e mamãe acenam.
4. Todo toque responde: um pulso onde o dedo encostou e um rastro de brilho que segue o
   dedo. Toque no fundo faz um "plim".
5. Tocar de novo na mesma coisa enquanto a palavra ainda toca não repete o som. Tocar em
   outra coisa troca na hora.
6. Sair exige segurar o botão do canto por 1,3 s.

## Fotos e vozes de casa

Tela `Fotos e vozes`, dentro do jogo. Tudo fica no IndexedDB do aparelho; nada é enviado.

| O quê | Como a foto entra na cena |
| --- | --- |
| Papai, Mamãe, Bebê | O rosto recortado em círculo vira a cabeça do corpo desenhado, com um aro da cor da roupa. O corpo continua acenando e apontando. Quando o bebê tem foto, o rosto pulsa com a voz no lugar da boca desenhada. |
| Bola, pato, au-au, banana | A foto vira um adesivo redondo no lugar do desenho. |
| Coisas da casa (até 4) | Cada uma vira um balão flutuando no céu. Precisa de foto e de voz gravada. |

- A foto vem da câmera ou da galeria, é enquadrada em um recorte redondo (arrastar e
  aproximar) e guardada em 480 x 480 px.
- A voz é gravada pelo microfone (até 3 s). O jogo corta o silêncio das pontas e nivela o
  volume sozinho. Exige iPadOS 14.3 ou mais novo.
- Cuidado: o Safari e o atalho da Tela de Início guardam dados separados. As fotos devem
  ser enviadas por onde o bebê vai jogar.

## Voz do jogo

Gerada uma vez com a API do Gemini e publicada como mp3 estático. O iPad nunca chama a API
e a chave não entra no repositório. Script: `scripts/jogoseducativos/gerar-audio.mjs`.
Originais em `scripts/jogoseducativos/vozes/`.

- Voz Sulafat, estilo de mãe falando devagar com o bebê.
- Papai e Mamãe: `gemini-3.8-flash-tts`. Bebê, bola, pato, au-au e banana:
  `gemini-3.8-flash-lite-tts` (cota gratuita separada). Conferidas por transcrição
  automática: soam como a mesma voz.
- Cota gratuita: 10 pedidos por dia no primeiro modelo, 3 por minuto no lite.
- "Bebê." saiu como "vevê" e "Bebê!" como "pepê". O texto que funcionou foi "Bê-bê.".

## Palavras

No jogo: papai, mamãe, bebê, bola, au-au, pato, banana.

Próximas, pelo mesmo critério (rotina do bebê, presentes nos inventários de primeiras
palavras, sons que surgem cedo: p, b, m, t, d, n com vogais abertas): água, miau, pé, mão,
pão. Palavras sociais (oi, tchau, não, dá) pedem uma ação e não um objeto; ficam para um
jogo próprio.

## Arquivos

- `index.html`: tela de escolha de jogos.
- `arte.js`: desenhos em SVG e a lista de coisas da cena.
- `primeiras-palavras/index.html`: marcação e estilos do jogo.
- `primeiras-palavras/jogo.js`: cena, toque, brilho, som.
- `primeiras-palavras/estudio.js`: tela Fotos e vozes.
- `primeiras-palavras/armazem.js`: guarda fotos e vozes no aparelho.

## Ideias para depois

- Funcionar sem internet depois da primeira visita.
- Mais cenas (hora do banho, hora de comer) com outras palavras.
- Exportar e importar as fotos e vozes, para não perder ao trocar de aparelho.

## Fontes

- SBP, Manual de Orientação "Saúde de Crianças e Adolescentes na Era Digital".
- Ramírez-Esparza, García-Sierra, Kuhl (2014): https://pmc.ncbi.nlm.nih.gov/articles/PMC4188803
- Ferjan Ramírez, Lytle, Kuhl (2020): https://pmc.ncbi.nlm.nih.gov/articles/PMC7035517
- Toque em crianças pequenas: https://www.nngroup.com/articles/children-ux-physical-development/
  e https://developers.google.com/building-for-kids/designing-engaging-apps
- CDI em português brasileiro (Palavras e Gestos):
  https://periodicos.ufes.br/contextoslinguisticos/article/download/5230/3906/10610
- API de voz do Gemini: https://aistudio.google.com/docs/speech-generation
