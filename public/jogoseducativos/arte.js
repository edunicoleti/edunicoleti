/*
  Ilustrações dos jogos educativos (SVG em texto, sem dependências).

  Estilo: formas chapadas, cores vivas, rostos grandes. Cada figura é um SVG
  solto que o jogo coloca na cena e anima.

  Classes que o motor do jogo procura:
    .je-cabeca  grupo da cabeça desenhada (some quando há foto real)
    .je-olhos   pisca
    .je-sorriso boca fechada      .je-boca boca falando
    .je-braco   braço que acena (só papai e mamãe)
    .je-braco-e / .je-braco-d  braços do bebê, que apontam; .je-dedo é o dedo

  JE_ITENS descreve o que existe na cena. "rosto" diz onde fica a cabeça dentro
  da figura (em % da caixa), para a foto real entrar exatamente no lugar dela.
*/
(function () {
  var PELE = '#F6C7A1';
  var PELE_SOMBRA = '#E5A77F';
  var CABELO = '#5A3825';
  var TINTA = '#2B2D42';
  var BOCHECHA = '#FF7F6E';
  var BOCA = '#B4323F';

  function svg(nome, rotulo, caixa, miolo) {
    return '<svg class="je-figura je-' + nome + '" viewBox="' + caixa + '" role="img" aria-label="' + rotulo +
      '" xmlns="http://www.w3.org/2000/svg">' + miolo + '</svg>';
  }

  function rostoAdulto() {
    return (
      '<ellipse cx="128" cy="240" rx="20" ry="13" fill="' + BOCHECHA + '" opacity=".5"/>' +
      '<ellipse cx="272" cy="240" rx="20" ry="13" fill="' + BOCHECHA + '" opacity=".5"/>' +
      '<g class="je-olhos">' +
        '<circle cx="160" cy="204" r="11" fill="' + TINTA + '"/><circle cx="164" cy="200" r="3.5" fill="#fff"/>' +
        '<circle cx="240" cy="204" r="11" fill="' + TINTA + '"/><circle cx="244" cy="200" r="3.5" fill="#fff"/>' +
      '</g>' +
      '<path class="je-sorriso" d="M166 250 Q200 282 234 250" fill="none" stroke="' + TINTA +
        '" stroke-width="8" stroke-linecap="round"/>' +
      '<ellipse class="je-boca" cx="200" cy="260" rx="22" ry="18" fill="' + BOCA + '"/>'
    );
  }

  /* lado: -1 acena com o braço da esquerda da tela, +1 com o da direita */
  function adulto(nome, rotulo, o) {
    var x = function (v) { return o.lado > 0 ? v : 400 - v; };
    return svg(nome, rotulo, '0 0 400 440',
      '<g class="je-braco" style="transform-origin:' + x(318) + 'px 372px">' +
        '<path d="M' + x(318) + ' 372 L' + x(368) + ' 284" stroke="' + o.roupa + '" stroke-width="48" stroke-linecap="round" fill="none"/>' +
        '<circle cx="' + x(374) + '" cy="258" r="31" fill="' + PELE + '"/>' +
      '</g>' +
      '<path d="M34 440 C34 356 108 322 200 322 C292 322 366 356 366 440 Z" fill="' + o.roupa + '"/>' +
      '<path d="M168 268 H232 V318 C232 338 168 338 168 318 Z" fill="' + PELE_SOMBRA + '"/>' +
      '<g class="je-cabeca">' +
        o.atras +
        '<circle cx="98" cy="206" r="19" fill="' + PELE + '"/>' +
        '<circle cx="302" cy="206" r="19" fill="' + PELE + '"/>' +
        '<ellipse cx="200" cy="194" rx="104" ry="110" fill="' + PELE + '"/>' +
        o.frente +
        rostoAdulto() +
      '</g>'
    );
  }

  var papai = adulto('papai', 'Papai', {
    lado: -1,
    roupa: '#FF7A1A',
    atras: '',
    frente:
      '<path d="M95 186 C84 104 142 62 202 62 C262 62 318 104 305 186 ' +
      'C298 150 276 128 246 124 C214 138 158 140 124 126 C108 140 100 160 95 186 Z" fill="' + CABELO + '"/>' +
      '<path d="M143 178 Q160 170 177 178" fill="none" stroke="' + CABELO + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M223 178 Q240 170 257 178" fill="none" stroke="' + CABELO + '" stroke-width="8" stroke-linecap="round"/>'
  });

  var mamae = adulto('mamae', 'Mamãe', {
    lado: 1,
    roupa: '#E63E8C',
    atras:
      '<path d="M78 210 C62 92 140 44 200 44 C260 44 338 92 322 210 ' +
      'C326 268 338 318 322 352 C300 372 100 372 78 352 C62 318 74 268 78 210 Z" fill="' + CABELO + '"/>',
    frente:
      '<path d="M94 190 C92 112 146 74 204 76 C262 78 304 114 306 190 ' +
      'C290 146 258 118 222 112 C196 150 142 172 94 190 Z" fill="' + CABELO + '"/>'
  });

  /* Bebê sentado, de frente. É ele quem fala as palavras. */
  var ROUPA_BEBE = '#7C4DFF';
  function bracoBebe(lado, ombroX, maoX) {
    var meio = ombroX + (maoX - ombroX) * 0.83;
    var ponta = maoX + (maoX - ombroX) * 0.52;
    return (
      '<g class="je-braco-bebe je-braco-' + lado + '" style="transform-origin:' + ombroX + 'px 318px">' +
        '<path class="je-dedo" opacity="0" d="M' + maoX + ' 360 L' + ponta + ' 382" stroke="' + PELE + '" stroke-width="17" stroke-linecap="round" fill="none"/>' +
        '<path d="M' + ombroX + ' 318 L' + meio + ' 352" stroke="' + ROUPA_BEBE + '" stroke-width="44" stroke-linecap="round" fill="none"/>' +
        '<circle cx="' + maoX + '" cy="360" r="25" fill="' + PELE + '"/>' +
      '</g>'
    );
  }
  var bebe = svg('bebe', 'Bebê', '0 0 400 460',
    /* pernas e pés */
    '<ellipse cx="118" cy="408" rx="74" ry="36" fill="' + ROUPA_BEBE + '" transform="rotate(-10 118 408)"/>' +
    '<ellipse cx="282" cy="408" rx="74" ry="36" fill="' + ROUPA_BEBE + '" transform="rotate(10 282 408)"/>' +
    '<circle cx="52" cy="418" r="30" fill="' + PELE + '"/>' +
    '<circle cx="348" cy="418" r="30" fill="' + PELE + '"/>' +
    /* corpo */
    '<ellipse cx="200" cy="356" rx="102" ry="90" fill="' + ROUPA_BEBE + '"/>' +
    '<circle cx="200" cy="330" r="9" fill="#fff" opacity=".85"/>' +
    '<circle cx="200" cy="366" r="9" fill="#fff" opacity=".85"/>' +
    /* braços: cada um gira no ombro para apontar o que o bebê está falando.
       O dedo (.je-dedo) só aparece enquanto ele aponta. */
    bracoBebe('e', 124, 54) +
    bracoBebe('d', 276, 346) +
    '<g class="je-cabeca">' +
      '<circle cx="82" cy="182" r="23" fill="' + PELE + '"/>' +
      '<circle cx="318" cy="182" r="23" fill="' + PELE + '"/>' +
      '<circle cx="200" cy="170" r="124" fill="' + PELE + '"/>' +
      /* topete */
      '<circle cx="200" cy="50" r="24" fill="' + CABELO + '"/>' +
      '<circle cx="174" cy="62" r="17" fill="' + CABELO + '"/>' +
      '<circle cx="226" cy="62" r="17" fill="' + CABELO + '"/>' +
      '<ellipse cx="116" cy="222" rx="24" ry="16" fill="' + BOCHECHA + '" opacity=".55"/>' +
      '<ellipse cx="284" cy="222" rx="24" ry="16" fill="' + BOCHECHA + '" opacity=".55"/>' +
      '<g class="je-olhos">' +
        '<circle cx="156" cy="180" r="15" fill="' + TINTA + '"/><circle cx="162" cy="174" r="5" fill="#fff"/>' +
        '<circle cx="244" cy="180" r="15" fill="' + TINTA + '"/><circle cx="250" cy="174" r="5" fill="#fff"/>' +
      '</g>' +
      '<path class="je-sorriso" d="M164 226 Q200 262 236 226" fill="none" stroke="' + TINTA +
        '" stroke-width="9" stroke-linecap="round"/>' +
      '<ellipse class="je-boca" cx="200" cy="238" rx="28" ry="24" fill="' + BOCA + '"/>' +
    '</g>'
  );

  var bola = svg('bola', 'Bola', '0 0 200 200',
    '<circle cx="100" cy="100" r="92" fill="#F0443A"/>' +
    '<path d="M100 100 L100 8 A92 92 0 0 1 180 54 Z" fill="#fff"/>' +
    '<path d="M100 100 L180 146 A92 92 0 0 1 100 192 Z" fill="#2D9CDB"/>' +
    '<path d="M100 100 L20 146 A92 92 0 0 1 20 54 Z" fill="#FFD23F"/>' +
    '<circle cx="100" cy="100" r="17" fill="#fff"/>'
  );

  var pato = svg('pato', 'Pato', '0 0 200 200',
    '<path d="M30 124 L4 92 L50 104 Z" fill="#FFC400"/>' +
    '<ellipse cx="96" cy="138" rx="78" ry="52" fill="#FFD23F"/>' +
    '<circle cx="138" cy="70" r="46" fill="#FFD23F"/>' +
    '<ellipse cx="186" cy="80" rx="14" ry="11" fill="#FF8A1F"/>' +
    '<ellipse cx="84" cy="140" rx="36" ry="24" fill="#FFB800"/>' +
    '<circle cx="150" cy="60" r="8" fill="' + TINTA + '"/><circle cx="153" cy="57" r="2.6" fill="#fff"/>'
  );

  var auau = svg('auau', 'Au-au', '0 0 200 200',
    '<ellipse cx="100" cy="162" rx="54" ry="38" fill="#B9743F"/>' +
    '<ellipse cx="70" cy="190" rx="19" ry="10" fill="#D49A5E"/>' +
    '<ellipse cx="130" cy="190" rx="19" ry="10" fill="#D49A5E"/>' +
    '<ellipse cx="40" cy="84" rx="22" ry="46" fill="#7A4A26" transform="rotate(14 40 84)"/>' +
    '<ellipse cx="160" cy="84" rx="22" ry="46" fill="#7A4A26" transform="rotate(-14 160 84)"/>' +
    '<circle cx="100" cy="86" r="62" fill="#D49A5E"/>' +
    '<ellipse cx="100" cy="110" rx="36" ry="27" fill="#F7E3C4"/>' +
    '<ellipse cx="100" cy="132" rx="9" ry="12" fill="#FF6B81"/>' +
    '<path d="M86 118 Q100 132 114 118" fill="none" stroke="' + TINTA + '" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="98" rx="13" ry="10" fill="' + TINTA + '"/>' +
    '<circle cx="76" cy="74" r="9" fill="' + TINTA + '"/><circle cx="79" cy="71" r="3" fill="#fff"/>' +
    '<circle cx="124" cy="74" r="9" fill="' + TINTA + '"/><circle cx="127" cy="71" r="3" fill="#fff"/>'
  );

  var banana = svg('banana', 'Banana', '0 0 200 200',
    '<path d="M26 52 C40 150 124 196 184 154 C192 148 188 134 178 138 C134 152 86 118 64 44 C58 28 22 30 26 52 Z" fill="#FFD23F"/>' +
    '<path d="M44 70 C62 140 122 172 176 148" fill="none" stroke="#F0B400" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M26 52 C22 38 34 26 48 30 L60 38 C50 36 38 42 36 56 Z" fill="#7A4A26"/>' +
    '<circle cx="182" cy="146" r="8" fill="#7A4A26"/>'
  );

  /* Cenário (não fala) */
  var sol =
    '<svg viewBox="0 0 200 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="je-raios" fill="#FFC21A">' +
        '<path d="M100 0 L112 34 H88 Z"/><path d="M100 200 L112 166 H88 Z"/>' +
        '<path d="M0 100 L34 88 V112 Z"/><path d="M200 100 L166 88 V112 Z"/>' +
        '<path d="M29 29 L62 46 L46 62 Z"/><path d="M171 29 L154 62 L138 46 Z"/>' +
        '<path d="M29 171 L46 138 L62 154 Z"/><path d="M171 171 L138 154 L154 138 Z"/>' +
      '</g>' +
      '<circle cx="100" cy="100" r="56" fill="#FFD84A"/>' +
    '</svg>';

  var nuvem =
    '<svg viewBox="0 0 240 110" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#fff">' +
      '<circle cx="62" cy="68" r="38"/><circle cx="112" cy="48" r="46"/><circle cx="168" cy="64" r="40"/>' +
      '<rect x="40" y="62" width="160" height="44" rx="22"/>' +
    '</svg>';

  window.JE_ARTE = {
    papai: papai, mamae: mamae, bebe: bebe,
    bola: bola, pato: pato, auau: auau, banana: banana,
    sol: sol, nuvem: nuvem
  };

  /* rosto: centro (x, y) e diâmetro da cabeça, em % da largura/altura da caixa.
     proporcao: altura da caixa em % da largura. boca: centro da boca no SVG. */
  window.JE_ITENS = [
    { id: 'papai', palavra: 'Papai', tipo: 'pessoa', proporcao: 110, rosto: { x: 50, y: 44.1, d: 60 }, boca: [200, 260], olhos: 204 },
    { id: 'mamae', palavra: 'Mamãe', tipo: 'pessoa', proporcao: 110, rosto: { x: 50, y: 44.1, d: 60 }, boca: [200, 260], olhos: 204 },
    /* bracos: ombro e mão de cada braço no SVG, para o jogo calcular para onde apontar */
    { id: 'bebe', palavra: 'Bebê', tipo: 'pessoa', proporcao: 115, rosto: { x: 50, y: 37, d: 66 }, boca: [200, 238], olhos: 180,
      caixa: [400, 460], bracos: { e: { ombro: [124, 318], mao: [54, 360] }, d: { ombro: [276, 318], mao: [346, 360] } } },
    { id: 'bola', palavra: 'Bola', tipo: 'objeto', proporcao: 100 },
    { id: 'auau', palavra: 'Au-au', tipo: 'objeto', proporcao: 100 },
    { id: 'banana', palavra: 'Banana', tipo: 'objeto', proporcao: 100 },
    { id: 'pato', palavra: 'Pato', tipo: 'objeto', proporcao: 100 }
  ];
})();
