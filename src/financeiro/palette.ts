/*
 * Paleta categórica validada (scripts/validate_palette.js, --pairs all,
 * surface #FFFFFF): com os 7 slots usados pelas categorias padrão o pior par
 * fica em ΔE 12.9 sob deuteranopia — acima do alvo 12. O 8º slot (laranja)
 * baixa para 11.2, ainda legal porque o gráfico traz rótulo direto + legenda.
 *
 * Checagem all-pairs (e não só adjacentes) porque as fatias do donut são
 * ordenadas por valor: qualquer par pode virar vizinho conforme o mês.
 *
 * Slot 1 é o azul da marca; os demais vêm da paleta de referência.
 */
export const CATEGORY_PALETTE: readonly string[] = [
  '#2047C9', // 1 azul (marca)
  '#1baf7a', // 2 aqua
  '#eda100', // 3 amarelo
  '#008300', // 4 verde
  '#4a3aa7', // 5 violeta
  '#e34948', // 6 vermelho
  '#e87ba4', // 7 magenta
  '#eb6834', // 8 laranja
] as const

/* Cor da fatia "Outras" quando a cauda é agrupada — cinza, nunca um 9º hue */
export const OTHER_COLOR = '#898781'

/*
 * Aqua, amarelo e magenta ficam abaixo de 3:1 no branco. A regra de alívio
 * exige rótulo visível — atendida pela legenda, que traz nome, valor e
 * percentual de cada fatia em texto.
 */
