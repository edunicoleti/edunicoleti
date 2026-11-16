# Jogos educativos: plano e decisões do MVP

Página: `edunicoleti.com.br/jogoseducativos`. Arquivos em `public/jogoseducativos/`.
Público: bebê de 12 meses, jogando no colo de um adulto, em um iPad de 6ª geração.

## O que a pesquisa diz (e o que fizemos com isso)

**Tela antes dos 2 anos.** A Sociedade Brasileira de Pediatria e a OMS recomendam evitar
telas antes dos 2 anos, com exceção de videochamada com a família e sempre com um adulto
presente. Estudos do grupo de Patricia Kuhl mostram que bebês aprendem sons e palavras com
uma pessoa ao vivo, e não com o mesmo conteúdo em vídeo. Consequência no produto: o jogo
não tenta ensinar sozinho. Ele é um roteiro para o adulto falar com o bebê. Por isso a
sessão é curta, termina sozinha e a tela final manda de volta para o papai e a mamãe de
verdade.

**Fala dirigida ao bebê (manhês).** Fala lenta, melódica e com vogais alongadas, em
situação um a um, está associada a mais balbucio e mais palavras aos 14 meses
(Ramírez-Esparza, García-Sierra e Kuhl, 2014; Ferjan Ramírez, Lytle e Kuhl, 2020).
Consequência: uma palavra isolada por toque, dita devagar por uma voz só, e um silêncio de
0,7 s depois para o adulto repetir.

**Baixo estímulo.** "Low stimulation" é um termo de pais, não uma categoria estudada pela
ciência do desenvolvimento, então as regras vêm por analogia com estudos sobre ritmo de
vídeo: cenas longas, poucos cortes, paleta dessaturada, som suave, enredo simples.
Consequência: nada pisca, não há música nem efeito sonoro, os movimentos de corpo levam
mais de 1 s, as cenas trocam por fade de mais de 2 s e os fundos têm luminância parecida, para a
troca nunca virar um clarão.

**Motricidade aos 12 meses.** O bebê bate com a mão inteira e ainda não aponta com
precisão. Não há medidas publicadas de alvo de toque para essa idade, então a regra é a
mais tolerante possível: a tela inteira é o alvo (ou meia tela, na cena com os dois),
qualquer toque vale, vários dedos contam como um toque e nenhum gesto é exigido.

**Rosto.** Bebês dessa idade olham para rostos e, perto de 1 ano, para a boca de quem
fala. Consequência: figura em busto, rosto grande, boca que abre no ritmo real da voz
(medido do próprio áudio).

## Como funciona a fase 1 (Papai e Mamãe)

1. Tela de adulto com o botão Começar. É o adulto que dá o primeiro toque (isso também
   libera o som no iPad).
2. Papai sozinho, depois Mamãe sozinha, depois os dois juntos. O ciclo repete uma vez.
   Uma palavra por rosto antes de comparar os dois.
3. A cada toque a figura fala o próprio nome, balança devagar e a boca acompanha a voz.
   Enquanto ela fala, novos toques só deixam uma marca suave na tela: o som não empilha.
4. Depois de 26 falas ou 5 minutos, a cena some devagar e aparece "Tchau, tchau!".
5. Sair e jogar de novo exigem segurar o botão por 1,3 s. Toque rápido de bebê não faz nada.

Não tem: texto na tela do bebê, placar, estrelas, música, confete, anúncio, cadastro.

## Voz

Gerada uma vez com a API do Gemini (`gemini-3.8-flash-tts`, voz Sulafat) e publicada como
mp3 estático. O iPad nunca chama a API e a chave não entra no repositório.
Script: `scripts/jogoseducativos/gerar-audio.mjs`. Originais em `scripts/jogoseducativos/vozes/`.

Limite conhecido: no plano gratuito são 10 pedidos de voz por dia. No dia do MVP testamos
4 vozes; Sulafat foi a mais lenta, calma e clara nas duas palavras.

## Próximas palavras

Critério: fazem parte da rotina do bebê, aparecem nos inventários de primeiras palavras
(CDI) e usam os sons que surgem primeiro (p, b, m, t, d, n com vogais abertas, de
preferência com sílaba repetida).

| Palavra | Por quê |
| --- | --- |
| bola | objeto favorito, duas sílabas simples |
| água | pedido diário, vogais abertas |
| bebê | sílaba repetida, ele se reconhece |
| au-au | onomatopeia vem antes de "cachorro" |
| miau | idem para gato |
| pé | uma sílaba, parte do corpo que ele vê |
| mão | uma sílaba, usada em "dá a mão" |
| pão | uma sílaba, rotina de comida |
| pato | brinquedo de banho, sílabas simples |
| banana | comida comum, costuma virar "nana" |

Palavras sociais (oi, tchau, não, dá) também estão entre as primeiras, mas pedem uma ação
e não um objeto. Ficam para um jogo próprio.

## Ideias para depois

- Foto real do papai e da mamãe no lugar da ilustração (guardada só no aparelho). É a
  mudança com mais chance de ajudar a palavra a colar na pessoa certa.
- Gravar a voz dos próprios pais.
- Funcionar sem internet depois da primeira visita.

## Fontes

- SBP, Manual de Orientação "Saúde de Crianças e Adolescentes na Era Digital" e
  atualização "Menos Telas, Mais Saúde".
- Ramírez-Esparza, García-Sierra, Kuhl (2014), Developmental Science:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC4188803
- Ferjan Ramírez, Lytle, Kuhl (2020), PNAS: https://pmc.ncbi.nlm.nih.gov/articles/PMC7035517
- Sobre "low stimulation" e os limites da evidência:
  https://thoughtfulparent.com/low-stimulation-shows.html
- Toque em crianças pequenas: https://www.nngroup.com/articles/children-ux-physical-development/
  e https://developers.google.com/building-for-kids/designing-engaging-apps
- CDI em português brasileiro (Palavras e Gestos):
  https://periodicos.ufes.br/contextoslinguisticos/article/download/5230/3906/10610
