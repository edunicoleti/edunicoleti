# Jogos educativos: decisões, feedback e pendências

Memória do projeto. O agente seguinte não vê as conversas anteriores: o que foi decidido,
o que o Eduardo achou e o que ficou em aberto mora aqui. Atualize ao fim de cada trabalho.
Para o funcionamento técnico, veja `docs/jogoseducativos-guia.md`.

## Estado atual (17/11/2026)

- No ar em `edunicoleti.com.br/jogoseducativos`: tela de escolha de jogos e o jogo
  Primeiras palavras (papai, mamãe, bebê, bola, au-au, pato, banana).
- Cena única colorida; o bebê da cena fala o nome e aponta para o que foi tocado; brilho e
  pulso em todo toque; tela Fotos e vozes funcionando (foto da câmera ou galeria, voz
  gravada, coisas da casa como balões).
- Testes automáticos passando no servidor local com cabeçalhos de produção e no site no ar.
- **Nunca testado em iPad real.** Todo teste foi em navegador com toque simulado.

## Linha do tempo

**16/11/2026: MVP (versão 1).** Pedido do Eduardo: jogo para o filho de 1 ano aprender as
primeiras palavras no iPad de 6ª geração, voz do Gemini, ilustração em SVG, design de baixo
estímulo, tela de escolha de jogos, publicado no site sem pedir autorização. Saiu: Papai e
Mamãe em telas separadas, tons pastel, animação lenta, sessão que terminava sozinha.

**16/11/2026: feedback 1, versão 2.** O Eduardo achou ruim e pediu:
- uma cena só com bebê, papai e mamãe; tocar em cada um fala o nome;
- **o bebê desenhado é quem fala** as palavras, com animação de fala; tocar nele fala o
  nome dele ("Bê" ou alternativa; ficou "Bebê", e dá para gravar o apelido real em Fotos e
  vozes);
- brilho seguindo o dedo, pulso de resposta a cada toque, objetos ao redor (bola etc.);
- **descartar o baixo estímulo**: "muito exagerado, tons pastéis demais, animações lentas,
  não será divertido pra ele";
- enviar fotos dos pais e de objetos de casa pelo iPad, **inseridas de forma criativa na
  cena**, não só coladas.
No meio do trabalho acrescentou: **quando o bebê fala, ele aponta o dedo para a pessoa ou o
objeto.**
Decisão de como usar as fotos: rosto vira a cabeça do corpo desenhado (que continua
acenando e apontando), objeto vira adesivo redondo, coisa nova da casa vira balão no céu.

**16/11/2026: feedback 2, versão 3.** "Desenhos muito básicos e mal feitos", pediu
ilustração mais polida e profissional. Tudo foi redesenhado em cartoon acabado (contorno,
sombra, luz, olhos com brilho, mãos com dedos, roupas com estampa) e o cenário ganhou
profundidade. Ficou em SVG para manter o apontar e a boca sincronizada. Oferecemos arte por
IA de imagem ou ilustrador como próximo degrau (mais rica, mas perde o apontar preciso e
pesa mais); **o Eduardo não respondeu a essa oferta**.

**16/11/2026: feedback 3, correção.** Enviar foto dava "Não consegui abrir essa imagem" no
site publicado. Causa: a CSP do site bloqueia `blob:` em imagens. Corrigido para `data:`. No
mesmo lugar: a Permissions-Policy do site desligava o microfone; liberado só na pasta do
jogo. Lição: testar sempre com os cabeçalhos de produção (`testes/servidor.py`).

**17/11/2026.** Guias para agentes (`AGENTS.md`, este documento, o guia técnico) e os testes
levados para o repositório.

## O que sabemos sobre o Eduardo e o uso

- Quer o jogo **divertido e vivo** para um bebê de 1 ano: cores fortes, resposta imediata,
  efeitos de brilho. Recusou pastel e lentidão.
- Exige **acabamento profissional** na ilustração. Formas geométricas simples foram
  recusadas.
- Valoriza **fotos e coisas reais da casa** e quer que entrem na cena de um jeito criativo.
- Testa no computador (Chrome no Windows, pelo print que mandou) e o bebê usa o iPad.
- Manda feedback com print e frases curtas; pede entrega **publicada e funcionando**.
- Não use travessão em texto gerado (regra geral dele, ver `AGENTS.md`).

## Pesquisa que embasa (continua valendo)

- **Jogar junto.** A SBP e a OMS recomendam evitar telas antes dos 2 anos; o grupo de
  Patricia Kuhl mostra que bebês aprendem palavras com uma pessoa ao vivo, não com a tela
  sozinha. O jogo é apoio para o adulto falar com o bebê, e a tela de escolha diz isso.
- **Fala dirigida ao bebê.** Palavra isolada, dita devagar e com melodia, ajuda
  (Ramírez-Esparza, García-Sierra e Kuhl, 2014; Ferjan Ramírez, Lytle e Kuhl, 2020).
- **Motricidade aos 12 meses.** Bate com a mão inteira e arrasta, não aponta com precisão:
  alvos grandes, qualquer toque vale, arrastar também dispara.
- **Referente real.** A palavra cola melhor na pessoa e no objeto de verdade: daí as fotos.
- **Sem estrobo.** Efeitos vivos, mas nada de tela inteira piscando.

## Palavras

No jogo: papai, mamãe, bebê, bola, au-au, pato, banana.

Próximas, pelo mesmo critério (rotina do bebê, presentes nos inventários de primeiras
palavras, sons que surgem cedo: p, b, m, t, d, n com vogais abertas): água, miau, pé, mão,
pão. Palavras sociais (oi, tchau, não, dá) pedem uma ação, não um objeto; ficam para um
jogo próprio.

## Pendências

- Esperando o Eduardo dizer, depois de jogar com o filho, se o brilho e os pulos estão na
  medida e se o rosto de foto no corpo desenhado ficou bom com fotos reais.
- Testar em iPad real (som, gravação de voz, Tela de Início, Acesso Guiado).
- Foto HEIC de iPhone não abre no Chrome do Windows (o Chrome não lê HEIC). No iPad abre.
- As cores do aro da foto (`AROS` em `jogo.js`) são da paleta antiga e não batem exatamente
  com as roupas novas.
- Próximas palavras ainda sem voz do jogo nem desenho.
- Oferta de arte por IA ou ilustrador sem resposta.

## Ideias para depois

- Funcionar sem internet depois da primeira visita.
- Mais cenas (hora do banho, hora de comer) com outras palavras.
- Exportar e importar as fotos e vozes, para não perder ao trocar de aparelho ou de navegador.

## Fontes

- SBP, Manual de Orientação "Saúde de Crianças e Adolescentes na Era Digital".
- Ramírez-Esparza, García-Sierra, Kuhl (2014): https://pmc.ncbi.nlm.nih.gov/articles/PMC4188803
- Ferjan Ramírez, Lytle, Kuhl (2020): https://pmc.ncbi.nlm.nih.gov/articles/PMC7035517
- Toque em crianças pequenas: https://www.nngroup.com/articles/children-ux-physical-development/
  e https://developers.google.com/building-for-kids/designing-engaging-apps
- CDI em português brasileiro (Palavras e Gestos):
  https://periodicos.ufes.br/contextoslinguisticos/article/download/5230/3906/10610
- API de voz do Gemini: https://aistudio.google.com/docs/speech-generation
