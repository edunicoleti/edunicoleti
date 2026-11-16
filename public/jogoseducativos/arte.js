/*
  Ilustrações dos jogos educativos (SVG em texto, sem dependências).

  Estilo de baixo estímulo para 12 meses:
  - formas chapadas e grandes, sem contorno, sem textura, sem gradiente;
  - rosto grande e simples (olhos, bochechas, boca), que é o que o bebê procura;
  - paleta dessaturada, com fundos de luminância parecida entre as cenas,
    para a troca de cena nunca virar um clarão.

  Cada figura expõe as mesmas classes para o motor do jogo animar:
    .je-olhos  (pisca)   .je-sorriso (boca fechada)   .je-boca (boca falando)
*/
(function () {
  var PELE = '#E3B798';
  var PELE_SOMBRA = '#D3A283';
  var CABELO = '#4B382F';
  var TINTA = '#2F3A40';
  var BOCHECHA = '#D98B7C';
  var BOCA = '#7C3F3C';

  function rosto() {
    return (
      '<ellipse cx="128" cy="240" rx="19" ry="12" fill="' + BOCHECHA + '" opacity=".42"/>' +
      '<ellipse cx="272" cy="240" rx="19" ry="12" fill="' + BOCHECHA + '" opacity=".42"/>' +
      '<g class="je-olhos">' +
        '<circle cx="160" cy="204" r="9.5" fill="' + TINTA + '"/>' +
        '<circle cx="240" cy="204" r="9.5" fill="' + TINTA + '"/>' +
      '</g>' +
      '<path class="je-sorriso" d="M170 252 Q200 276 230 252" fill="none" stroke="' + TINTA +
        '" stroke-width="7" stroke-linecap="round"/>' +
      '<ellipse class="je-boca" cx="200" cy="260" rx="21" ry="17" fill="' + BOCA + '"/>'
    );
  }

  function figura(nome, rotulo, partes) {
    return (
      '<svg class="je-figura je-' + nome + '" viewBox="0 0 400 440" role="img" aria-label="' + rotulo +
      '" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">' +
        partes.atras +
        '<path d="M34 440 C34 356 108 322 200 322 C292 322 366 356 366 440 Z" fill="' + partes.roupa + '"/>' +
        '<path d="M168 268 H232 V318 C232 338 168 338 168 318 Z" fill="' + PELE_SOMBRA + '"/>' +
        '<circle cx="98" cy="206" r="19" fill="' + PELE + '"/>' +
        '<circle cx="302" cy="206" r="19" fill="' + PELE + '"/>' +
        '<ellipse cx="200" cy="194" rx="104" ry="110" fill="' + PELE + '"/>' +
        partes.frente +
        rosto() +
      '</svg>'
    );
  }

  var papai = figura('papai', 'Papai', {
    roupa: '#5E8A88',
    atras: '',
    frente:
      /* cabelo curto, com a linha da testa bem alta para deixar o rosto livre */
      '<path d="M95 186 C84 104 142 62 202 62 C262 62 318 104 305 186 ' +
      'C298 150 276 128 246 124 C214 138 158 140 124 126 C108 140 100 160 95 186 Z" fill="' + CABELO + '"/>' +
      /* sobrancelhas grossas: o traço que distingue o papai além do cabelo */
      '<path d="M143 178 Q160 170 177 178" fill="none" stroke="' + CABELO + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M223 178 Q240 170 257 178" fill="none" stroke="' + CABELO + '" stroke-width="8" stroke-linecap="round"/>'
  });

  var mamae = figura('mamae', 'Mamãe', {
    roupa: '#C4897A',
    atras:
      /* cabelo comprido atrás da cabeça, caindo até os ombros */
      '<path d="M78 210 C62 92 140 44 200 44 C260 44 338 92 322 210 ' +
      'C326 268 338 318 322 352 C300 372 100 372 78 352 C62 318 74 268 78 210 Z" fill="' + CABELO + '"/>',
    frente:
      /* franja de lado */
      '<path d="M94 190 C92 112 146 74 204 76 C262 78 304 114 306 190 ' +
      'C290 146 258 118 222 112 C196 150 142 172 94 190 Z" fill="' + CABELO + '"/>'
  });

  window.JE_ARTE = { papai: papai, mamae: mamae };
})();
