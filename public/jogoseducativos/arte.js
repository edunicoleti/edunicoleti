/*
  Ilustrações dos jogos educativos (SVG em texto, sem dependências).

  Estilo: cartoon infantil acabado. Toda forma tem contorno na versão escura
  da própria cor, uma sombra e um ponto de luz; rostos grandes, olhos com
  brilho, mãos com dedos.

  Classes que o motor do jogo procura:
    .je-cabeca  grupo da cabeça desenhada (some quando há foto real)
    .je-olhos   pisca
    .je-sorriso boca fechada      .je-boca boca falando (abre de cima para baixo)
    .je-braco   braço que acena (só papai e mamãe)
    .je-braco-e / .je-braco-d  braços do bebê, que apontam; .je-dedo é o dedo
    .je-rabo    rabo do cachorro; .je-raios raios do sol; .je-asa asas da borboleta

  Degradês e recortes ficam em um único SVG de definições, injetado uma vez no
  começo do <body>. Assim os ids não se repetem e continuam valendo mesmo
  quando uma figura é escondida (cabeça trocada por foto, por exemplo).
*/
(function () {
  var PELE = '#FBD0AC', PELE_S = '#F0B089', PELE_L = '#B8704A';
  var TINTA = '#2A2238', BLUSH = '#FF7E94';
  var BOCA = '#8E2B3A', LINGUA = '#FF7B8E';

  function svg(nome, rotulo, caixa, miolo) {
    return '<svg class="je-figura je-' + nome + '" viewBox="' + caixa + '" ' +
      (rotulo ? 'role="img" aria-label="' + rotulo + '"' : 'aria-hidden="true"') +
      ' xmlns="http://www.w3.org/2000/svg">' + miolo + '</svg>';
  }
  /* forma com preenchimento e contorno */
  function f(d, cor, linha, w, extra) {
    return '<path d="' + d + '" fill="' + cor + '"' +
      (linha ? ' stroke="' + linha + '" stroke-width="' + (w || 5) + '" stroke-linejoin="round" stroke-linecap="round"' : '') +
      (extra ? ' ' + extra : '') + '/>';
  }
  /* traço solto */
  function t(d, cor, w, extra) {
    return '<path d="' + d + '" fill="none" stroke="' + cor + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' +
      (extra ? ' ' + extra : '') + '/>';
  }
  function olho(x, y, rx, ry) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + TINTA + '"/>' +
      '<circle cx="' + (x + rx * 0.36) + '" cy="' + (y - ry * 0.4) + '" r="' + (rx * 0.4) + '" fill="#fff"/>' +
      '<circle cx="' + (x - rx * 0.36) + '" cy="' + (y + ry * 0.42) + '" r="' + (rx * 0.19) + '" fill="#fff" opacity=".75"/>';
  }
  function blush(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#je-blush)"/>';
  }

  /* Mão aberta acenando: palma, quatro dedos e o polegar. */
  function maoAberta(cx, cy, giro, lado) {
    var dedos = [-40, -14, 12, 38], contorno = '', miolo = '', i, a, x1, y1, x2, y2;
    for (i = 0; i < dedos.length; i++) {
      a = (dedos[i] - 90) * Math.PI / 180;
      x1 = cx + Math.cos(a) * 14; y1 = cy + Math.sin(a) * 14;
      x2 = cx + Math.cos(a) * (i === 0 || i === 3 ? 44 : 50); y2 = cy + Math.sin(a) * (i === 0 || i === 3 ? 44 : 50);
      contorno += t('M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1), PELE_L, 25);
      miolo += t('M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1), PELE, 15.5);
    }
    a = (lado * 88 - 90) * Math.PI / 180;
    x2 = cx + Math.cos(a) * 40; y2 = cy + Math.sin(a) * 40 + 8;
    contorno += t('M' + cx + ' ' + (cy + 6) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1), PELE_L, 26);
    miolo += t('M' + cx + ' ' + (cy + 6) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1), PELE, 16.5);
    return '<g transform="rotate(' + giro + ' ' + cx + ' ' + cy + ')">' + contorno +
      '<circle cx="' + cx + '" cy="' + cy + '" r="28" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
      miolo +
      '<circle cx="' + cx + '" cy="' + cy + '" r="25.5" fill="' + PELE + '"/>' +
      t('M' + (cx - 12) + ' ' + (cy + 6) + ' Q' + cx + ' ' + (cy + 15) + ' ' + (cx + 12) + ' ' + (cy + 6), PELE_S, 3.5) +
      '</g>';
  }

  /* ───────── Papai e mamãe (busto, um braço acenando) ───────── */
  function adulto(nome, rotulo, o) {
    var x = function (v) { return o.lado > 0 ? v : 400 - v; };
    var tronco = 'M28 444 C28 366 92 330 150 322 C172 344 228 344 250 322 C308 330 372 366 372 444 Z';
    return svg(nome, rotulo, '0 0 400 440',
      /* cabelo de trás: faz parte da cabeça, então também some quando entra a foto */
      (o.atras ? '<g class="je-cabeca">' + o.atras + '</g>' : '') +
      /* braço que acena */
      '<g class="je-braco" style="transform-origin:' + x(320) + 'px 374px">' +
        t('M' + x(320) + ' 374 L' + x(366) + ' 296', o.linha, 58) +
        t('M' + x(320) + ' 374 L' + x(366) + ' 296', o.roupa, 48) +
        t('M' + x(348) + ' 300 L' + x(384) + ' 318', o.punho, 13) +
        maoAberta(x(378), 262, o.lado * 18, o.lado) +
      '</g>' +
      /* tronco */
      f(tronco, o.roupa, null) +
      '<g clip-path="url(#je-clip-tronco)">' + o.estampa +
        f('M28 444 C28 400 48 372 78 352 C62 386 60 416 64 444 Z', o.sombra, null) +
        f('M372 444 C372 400 352 372 322 352 C338 386 340 416 336 444 Z', o.sombra, null, 0, 'opacity=".55"') +
      '</g>' +
      f(tronco, 'none', o.linha, 5) +
      /* pescoço */
      f('M170 262 H230 V318 C230 342 170 342 170 318 Z', PELE, PELE_L, 5) +
      f('M172 268 H228 V286 C212 300 188 300 172 286 Z', PELE_S, null) +
      o.gola +
      '<g class="je-cabeca">' +
        /* orelhas */
        '<ellipse cx="97" cy="208" rx="20" ry="25" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
        '<ellipse cx="303" cy="208" rx="20" ry="25" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
        t('M92 200 Q84 208 92 218', PELE_S, 4) + t('M308 200 Q316 208 308 218', PELE_S, 4) +
        (o.brincos || '') +
        '<ellipse cx="200" cy="196" rx="104" ry="108" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
        (o.barba || '') +
        /* sombra do cabelo na testa, depois o cabelo */
        f(o.franja, PELE_S, null, 0, 'transform="translate(0 9)" opacity=".7"') +
        f(o.franja, o.cabelo, o.cabeloL, 5) +
        o.luzCabelo +
        (o.enfeite || '') +
        /* rosto */
        blush(132, 244, 26) + blush(268, 244, 26) +
        o.sobrancelhas +
        '<g class="je-olhos">' + olho(160, 208, 11.5, 14) + olho(240, 208, 11.5, 14) + (o.cilios || '') + '</g>' +
        t('M193 228 Q200 238 207 228', PELE_L, 4.5) +
        t('M170 250 Q200 280 230 250', o.labio || TINTA, 6.5, 'class="je-sorriso"') +
        '<g class="je-boca">' +
          f('M174 250 Q200 244 226 250 Q230 288 200 290 Q170 288 174 250 Z', BOCA, TINTA, 4.5) +
          '<ellipse cx="200" cy="279" rx="15" ry="8" fill="' + LINGUA + '"/>' +
          '<path d="M184 250 Q200 246 216 250 V257 Q200 261 184 257 Z" fill="#fff"/>' +
        '</g>' +
      '</g>'
    );
  }

  var papai = adulto('papai', 'Papai', {
    lado: -1,
    roupa: '#FF8A2B', sombra: '#E86C12', linha: '#A8480A', punho: '#FFC98F',
    estampa:
      t('M20 392 C110 366 290 366 380 392', '#FFC98F', 17) +
      t('M20 430 C110 404 290 404 380 430', '#FFC98F', 17),
    gola: t('M152 324 C174 348 226 348 248 324', '#FFC98F', 13) + t('M152 324 C174 348 226 348 248 324', '#A8480A', 3, 'transform="translate(0 8)" opacity=".35"'),
    cabelo: '#4A2F20', cabeloL: '#2C1A10',
    franja: 'M93 200 C80 118 124 58 200 56 C278 54 322 118 307 200 C302 172 292 150 276 138 ' +
      'C252 152 214 152 190 134 C172 150 138 154 118 142 C106 158 98 176 93 200 Z',
    luzCabelo: f('M136 96 C166 74 222 72 256 90 C224 84 178 88 150 108 Z', '#7A5238', null, 0, 'opacity=".8"'),
    sobrancelhas: t('M142 180 Q160 170 178 179', '#2C1A10', 8) + t('M222 179 Q240 170 258 180', '#2C1A10', 8)
  });

  var mamae = adulto('mamae', 'Mamãe', {
    lado: 1,
    roupa: '#F0508E', sombra: '#D2346F', linha: '#9C1F52', punho: '#FFB3CF',
    estampa:
      '<circle cx="92" cy="404" r="9" fill="#FFB3CF"/><circle cx="150" cy="384" r="9" fill="#FFB3CF"/>' +
      '<circle cx="250" cy="384" r="9" fill="#FFB3CF"/><circle cx="308" cy="404" r="9" fill="#FFB3CF"/>' +
      '<circle cx="200" cy="412" r="9" fill="#FFB3CF"/><circle cx="130" cy="430" r="9" fill="#FFB3CF"/><circle cx="270" cy="430" r="9" fill="#FFB3CF"/>',
    gola: f('M150 322 C166 366 234 366 250 322 C228 344 172 344 150 322 Z', PELE, PELE_L, 5) +
      t('M172 338 Q200 362 228 338', '#FFD23F', 3.5) + '<circle cx="200" cy="352" r="6" fill="#FFD23F" stroke="#C99700" stroke-width="2.5"/>',
    cabelo: '#8A4A28', cabeloL: '#5A2C14',
    atras: f('M74 216 C54 94 134 36 200 36 C266 36 346 94 326 216 C330 272 348 322 332 360 ' +
      'C306 386 94 386 68 360 C52 322 70 272 74 216 Z', '#8A4A28', '#5A2C14', 5) +
      t('M96 270 C92 310 96 340 104 366', '#6E3A1E', 5) + t('M304 270 C308 310 304 340 296 366', '#6E3A1E', 5),
    franja: 'M91 202 C86 116 140 68 204 70 C266 72 310 116 309 202 C296 154 262 122 226 114 ' +
      'C202 158 142 184 91 202 Z',
    luzCabelo: f('M146 100 C178 80 228 80 260 102 C228 92 186 96 158 116 Z', '#B36A3E', null, 0, 'opacity=".85"'),
    enfeite:
      '<g transform="translate(288 150)">' +
        '<circle cx="0" cy="-11" r="8" fill="#FFD23F"/><circle cx="10" cy="-3" r="8" fill="#FFD23F"/><circle cx="6" cy="9" r="8" fill="#FFD23F"/>' +
        '<circle cx="-6" cy="9" r="8" fill="#FFD23F"/><circle cx="-10" cy="-3" r="8" fill="#FFD23F"/><circle cx="0" cy="0" r="6.5" fill="#FF7A1A"/>' +
      '</g>',
    brincos: '<circle cx="93" cy="236" r="6.5" fill="#FFD23F" stroke="#C99700" stroke-width="2.5"/>' +
      '<circle cx="307" cy="236" r="6.5" fill="#FFD23F" stroke="#C99700" stroke-width="2.5"/>',
    sobrancelhas: t('M144 182 Q160 173 176 180', '#5A2C14', 5.5) + t('M224 180 Q240 173 256 182', '#5A2C14', 5.5),
    cilios: t('M149 199 L141 193', TINTA, 4) + t('M146 206 L137 204', TINTA, 4) + t('M251 199 L259 193', TINTA, 4) + t('M254 206 L263 204', TINTA, 4),
    labio: '#C23A57'
  });

  /* ───────── Bebê sentado, de frente. É ele quem fala. ───────── */
  var RB = '#8C5CFF', RB_S = '#6B3FE0', RB_L = '#4A27A8';

  function pe(cx, cy, giro) {
    var dedos = '', i, xs = [-21, -8, 6, 19], ys = [-27, -35, -36, -30];
    for (i = 0; i < 4; i++) dedos += '<circle cx="' + (cx + xs[i]) + '" cy="' + (cy + ys[i]) + '" r="8.5" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="4.5"/>';
    return '<g transform="rotate(' + giro + ' ' + cx + ' ' + cy + ')">' + dedos +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="31" ry="34" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
      '<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="17" ry="18" fill="' + PELE_S + '" opacity=".55"/></g>';
  }

  function bracoBebe(lado, ombroX, maoX) {
    var meioX = ombroX + (maoX - ombroX) * 0.8, meioY = 318 + 42 * 0.8;
    var pontaX = maoX + (maoX - ombroX) * 0.56, pontaY = 360 + 42 * 0.56;
    var polegarX = maoX + (maoX < ombroX ? 12 : -12);
    return (
      '<g class="je-braco-bebe je-braco-' + lado + '" style="transform-origin:' + ombroX + 'px 318px">' +
        t('M' + ombroX + ' 318 L' + meioX + ' ' + meioY, RB_L, 56) +
        '<g class="je-dedo" opacity="0">' +
          t('M' + maoX + ' 360 L' + pontaX + ' ' + pontaY, PELE_L, 25) +
          t('M' + maoX + ' 360 L' + pontaX + ' ' + pontaY, PELE, 15.5) +
        '</g>' +
        t('M' + ombroX + ' 318 L' + meioX + ' ' + meioY, RB, 46) +
        '<circle cx="' + polegarX + '" cy="340" r="11" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
        '<circle cx="' + maoX + '" cy="360" r="26" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="5"/>' +
        '<circle cx="' + polegarX + '" cy="342" r="8.5" fill="' + PELE + '"/>' +
      '</g>'
    );
  }

  var estrela = (function () {
    var p = '', i, a, r;
    for (i = 0; i < 10; i++) {
      a = Math.PI / 5 * i - Math.PI / 2; r = i % 2 ? 12 : 27;
      p += (i ? 'L' : 'M') + (200 + Math.cos(a) * r).toFixed(1) + ' ' + (366 + Math.sin(a) * r).toFixed(1);
    }
    return p + 'Z';
  })();

  var bebe = svg('bebe', 'Bebê', '0 0 400 460',
    '<ellipse cx="200" cy="446" rx="158" ry="13" fill="#17521C" opacity=".28"/>' +
    /* pernas */
    '<ellipse cx="116" cy="410" rx="72" ry="38" fill="' + RB + '" stroke="' + RB_L + '" stroke-width="6" transform="rotate(-9 116 410)"/>' +
    '<ellipse cx="284" cy="410" rx="72" ry="38" fill="' + RB + '" stroke="' + RB_L + '" stroke-width="6" transform="rotate(9 284 410)"/>' +
    pe(54, 412, -14) + pe(346, 412, 14) +
    /* corpo */
    '<ellipse cx="200" cy="352" rx="100" ry="92" fill="' + RB + '" stroke="' + RB_L + '" stroke-width="6"/>' +
    f('M106 372 C122 436 278 436 294 372 C272 418 128 418 106 372 Z', RB_S, null) +
    f(estrela, '#FFD84A', '#E0A800', 4) +
    t('M146 290 Q200 330 254 290', '#F4EEFF', 15) + t('M146 290 Q200 330 254 290', RB_L, 3, 'transform="translate(0 9)" opacity=".3"') +
    /* braços: giram no ombro para apontar o que o bebê está falando */
    bracoBebe('e', 124, 54) + bracoBebe('d', 276, 346) +
    '<g class="je-cabeca">' +
      '<ellipse cx="79" cy="180" rx="22" ry="25" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="6"/>' +
      '<ellipse cx="321" cy="180" rx="22" ry="25" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="6"/>' +
      t('M73 172 Q64 180 73 190', PELE_S, 4.5) + t('M327 172 Q336 180 327 190', PELE_S, 4.5) +
      '<circle cx="200" cy="166" r="123" fill="' + PELE + '" stroke="' + PELE_L + '" stroke-width="6"/>' +
      /* topete enrolado */
      f('M170 62 C162 32 192 14 212 30 C228 16 252 34 240 56 C258 58 256 86 232 86 C208 94 178 90 170 62 Z', '#9A5B34', '#693A1C', 5.5) +
      t('M192 44 C200 36 214 40 212 52 C210 62 196 62 196 54', '#C07E4E', 5) +
      blush(112, 222, 30) + blush(288, 222, 30) +
      t('M138 148 Q154 139 170 147', '#8A5230', 5.5) + t('M230 147 Q246 139 262 148', '#8A5230', 5.5) +
      '<g class="je-olhos">' + olho(154, 184, 16, 19) + olho(246, 184, 16, 19) + '</g>' +
      t('M194 208 Q200 215 206 208', PELE_L, 4.5) +
      t('M166 224 Q200 258 234 224', TINTA, 7.5, 'class="je-sorriso"') +
      '<g class="je-boca">' +
        f('M168 224 Q200 216 232 224 Q238 268 200 272 Q162 268 168 224 Z', BOCA, TINTA, 5) +
        '<ellipse cx="200" cy="259" rx="19" ry="10" fill="' + LINGUA + '"/>' +
        '<rect x="187" y="222" width="12" height="11" rx="3.5" fill="#fff"/><rect x="201" y="222" width="12" height="11" rx="3.5" fill="#fff"/>' +
      '</g>' +
    '</g>'
  );

  /* ───────── Objetos ───────── */
  var gomos = (function () {
    var cores = ['#F23D3D', '#fff', '#FFD23F', '#fff', '#2D9CDB', '#fff'], s = '', i, a1, a2;
    for (i = 0; i < 6; i++) {
      a1 = (i * 60 + 8) * Math.PI / 180; a2 = (i * 60 + 68) * Math.PI / 180;
      s += '<path d="M84 76 L' + (84 + Math.cos(a1) * 320).toFixed(0) + ' ' + (76 + Math.sin(a1) * 320).toFixed(0) +
        ' L' + (84 + Math.cos(a2) * 320).toFixed(0) + ' ' + (76 + Math.sin(a2) * 320).toFixed(0) + ' Z" fill="' + cores[i] + '"/>';
    }
    return s;
  })();
  var bola = svg('bola', 'Bola', '0 0 200 200',
    '<ellipse cx="100" cy="191" rx="72" ry="8" fill="#17521C" opacity=".28"/>' +
    '<g clip-path="url(#je-clip-bola)">' + gomos + '<circle cx="100" cy="98" r="90" fill="url(#je-esfera)"/></g>' +
    '<circle cx="84" cy="76" r="12" fill="#fff" stroke="#7A2A2A" stroke-width="3.5"/>' +
    '<circle cx="100" cy="98" r="88" fill="none" stroke="#7A2A2A" stroke-width="5.5"/>' +
    '<ellipse cx="58" cy="44" rx="24" ry="11" fill="#fff" opacity=".45" transform="rotate(-38 58 44)"/>'
  );

  var PT = '#FFD43B', PT_S = '#F2B200', PT_L = '#B87F00';
  var pato = svg('pato', 'Pato', '0 0 200 200',
    '<ellipse cx="98" cy="191" rx="76" ry="8" fill="#17521C" opacity=".28"/>' +
    f('M30 126 C12 114 4 96 8 82 C26 88 44 98 58 112 Z', PT, PT_L, 5.5) +
    '<ellipse cx="96" cy="138" rx="78" ry="51" fill="' + PT + '" stroke="' + PT_L + '" stroke-width="5.5"/>' +
    f('M24 150 C40 196 152 196 168 150 C146 180 46 180 24 150 Z', PT_S, null) +
    '<circle cx="140" cy="68" r="47" fill="' + PT + '" stroke="' + PT_L + '" stroke-width="5.5"/>' +
    '<ellipse cx="124" cy="108" rx="34" ry="18" fill="' + PT + '"/>' +
    f('M50 134 C58 106 112 106 124 134 C112 164 64 166 50 134 Z', '#FFBE1A', PT_L, 5) +
    t('M70 140 Q86 152 104 140', PT_L, 3.5) + t('M78 126 Q88 134 100 126', PT_L, 3.5) +
    f('M176 60 C196 54 208 66 200 78 C192 84 182 82 174 80 Z', '#FF8A1F', '#B85000', 5) +
    f('M176 82 C190 84 196 88 190 95 C184 98 178 92 174 88 Z', '#F06A00', '#B85000', 5) +
    olho(152, 56, 8.5, 11) +
    '<circle cx="162" cy="82" r="11" fill="url(#je-blush)"/>' +
    '<ellipse cx="120" cy="42" rx="17" ry="8" fill="#fff" opacity=".55" transform="rotate(-32 120 42)"/>' +
    f('M132 22 C130 10 142 6 146 16 C152 10 160 18 152 26 Z', PT, PT_L, 4.5)
  );

  var CA = '#DFA96B', CA_S = '#C58A4A', CA_L = '#7A4A1E', CREME = '#FBEBD0';
  var auau = svg('auau', 'Au-au', '0 0 200 200',
    '<ellipse cx="100" cy="192" rx="70" ry="7.5" fill="#17521C" opacity=".28"/>' +
    '<g class="je-rabo" style="transform-origin:146px 164px">' + f('M144 168 C174 158 190 132 182 108 C172 124 158 140 138 150 Z', CA, CA_L, 5.5) + '</g>' +
    f('M54 194 C44 150 66 114 100 114 C134 114 156 150 146 194 Z', CA, CA_L, 5.5) +
    '<ellipse cx="100" cy="166" rx="27" ry="31" fill="' + CREME + '"/>' +
    '<ellipse cx="74" cy="188" rx="21" ry="12" fill="' + CREME + '" stroke="' + CA_L + '" stroke-width="5"/>' +
    '<ellipse cx="126" cy="188" rx="21" ry="12" fill="' + CREME + '" stroke="' + CA_L + '" stroke-width="5"/>' +
    t('M68 184 V192 M78 184 V192 M122 184 V192 M132 184 V192', CA_L, 2.8) +
    t('M66 122 Q100 142 134 122', '#E53935', 12) + t('M66 122 Q100 142 134 122', '#9C1F1F', 2.5, 'transform="translate(0 7)" opacity=".5"') +
    '<circle cx="100" cy="139" r="8.5" fill="#FFD23F" stroke="#B88A00" stroke-width="3"/>' +
    f('M46 36 C12 40 4 92 22 118 C42 114 54 84 58 54 Z', '#9A5F2C', '#5E3614', 5.5) +
    f('M154 36 C188 40 196 92 178 118 C158 114 146 84 142 54 Z', '#9A5F2C', '#5E3614', 5.5) +
    '<ellipse cx="100" cy="72" rx="61" ry="57" fill="' + CA + '" stroke="' + CA_L + '" stroke-width="5.5"/>' +
    '<ellipse cx="127" cy="60" rx="23" ry="26" fill="' + CA_S + '"/>' +
    '<ellipse cx="100" cy="96" rx="33" ry="25" fill="' + CREME + '"/>' +
    f('M93 110 Q100 130 107 110 Z', LINGUA, '#B03A52', 3.5) +
    t('M100 92 V104 M85 102 Q92 112 100 104 Q108 112 115 102', TINTA, 3.8) +
    f('M88 82 Q100 76 112 82 Q110 94 100 96 Q90 94 88 82 Z', TINTA, null) +
    '<ellipse cx="96" cy="83" rx="4" ry="2.4" fill="#fff" opacity=".8"/>' +
    olho(75, 62, 8.5, 11) + olho(125, 62, 8.5, 11) +
    t('M64 44 Q74 38 84 43', CA_L, 3.5) + t('M116 43 Q126 38 136 44', CA_L, 3.5) +
    '<circle cx="62" cy="86" r="11" fill="url(#je-blush)"/>'
  );

  var banana = svg('banana', 'Banana', '0 0 200 200',
    '<ellipse cx="104" cy="188" rx="70" ry="7" fill="#17521C" opacity=".28"/>' +
    f('M22 56 C20 42 32 32 44 36 C54 40 56 48 58 58 C72 112 112 146 172 138 C186 136 192 148 184 156 C122 200 32 152 22 56 Z', '#FFDA3D', '#A87A00', 5.5) +
    f('M26 78 C40 148 110 184 180 158 C120 190 46 152 26 78 Z', '#F2B200', null) +
    t('M46 64 C62 122 108 156 168 150', '#FFF0A0', 9, 'opacity=".9"') +
    f('M22 56 C18 40 30 26 46 30 L50 42 C42 40 34 46 34 58 Z', '#8A5A2B', '#5A3814', 4.5) +
    '<circle cx="184" cy="150" r="7.5" fill="#8A5A2B" stroke="#5A3814" stroke-width="4"/>'
  );

  /* ───────── Cenário (não fala) ───────── */
  var raios = (function () {
    var s = '', i;
    for (i = 0; i < 12; i++) {
      s += '<path d="M100 ' + (i % 2 ? 22 : 6) + ' L112 46 H88 Z" transform="rotate(' + (i * 30) + ' 100 100)" ' +
        'fill="#FFC21A" stroke="#F09A00" stroke-width="3" stroke-linejoin="round"/>';
    }
    return s;
  })();
  var sol = svg('sol', '', '0 0 200 200',
    '<circle cx="100" cy="100" r="100" fill="url(#je-luz-sol)"/>' +
    '<g class="je-raios">' + raios + '</g>' +
    '<circle cx="100" cy="100" r="50" fill="#FFD84A" stroke="#F09A00" stroke-width="4"/>' +
    '<circle cx="78" cy="110" r="11" fill="#FF9F6B" opacity=".55"/><circle cx="122" cy="110" r="11" fill="#FF9F6B" opacity=".55"/>' +
    t('M76 94 Q83 86 90 94', '#8A5200', 4) + t('M110 94 Q117 86 124 94', '#8A5200', 4) +
    t('M84 110 Q100 126 116 110', '#8A5200', 4.5)
  );

  var nuvem = svg('nuvem', '', '0 0 240 120',
    '<g fill="#C9E4F8"><circle cx="62" cy="76" r="38"/><circle cx="114" cy="56" r="46"/><circle cx="172" cy="72" r="40"/><rect x="40" y="70" width="162" height="44" rx="22"/></g>' +
    '<g fill="#fff"><circle cx="62" cy="68" r="36"/><circle cx="114" cy="48" r="44"/><circle cx="172" cy="64" r="38"/><rect x="42" y="60" width="158" height="40" rx="20"/></g>'
  );

  var arcoiris = (function () {
    var cores = ['#F23D3D', '#FF9A2B', '#FFD93B', '#5CCB4D', '#2D9CDB', '#8C5CFF'], s = '', i, r;
    for (i = 0; i < cores.length; i++) {
      r = 190 - i * 17;
      s += '<path d="M' + (200 - r) + ' 200 A' + r + ' ' + r + ' 0 0 1 ' + (200 + r) + ' 200" fill="none" stroke="' + cores[i] + '" stroke-width="17.5"/>';
    }
    return svg('arcoiris', '', '0 0 400 200', s);
  })();

  var arvore = svg('arvore', '', '0 0 160 200',
    f('M68 194 C72 160 70 130 66 110 H94 C90 130 88 160 92 194 Z', '#9A6234', '#5E3614', 5) +
    t('M80 150 L96 132', '#5E3614', 5) +
    '<g fill="#2FA84F" stroke="#17752F" stroke-width="5"><circle cx="48" cy="92" r="38"/><circle cx="112" cy="92" r="38"/><circle cx="80" cy="56" r="46"/></g>' +
    '<g fill="#2FA84F"><circle cx="48" cy="92" r="35.5"/><circle cx="112" cy="92" r="35.5"/><circle cx="80" cy="76" r="40"/></g>' +
    '<g fill="#5FCB6E" opacity=".8"><circle cx="66" cy="40" r="20"/><circle cx="36" cy="80" r="14"/><circle cx="104" cy="74" r="13"/></g>' +
    '<g fill="#F23D3D" stroke="#9C1F1F" stroke-width="2.5"><circle cx="52" cy="104" r="8"/><circle cx="98" cy="50" r="8"/><circle cx="120" cy="100" r="8"/></g>'
  );

  function flor(cor, miolo) {
    var p = '', i, a;
    for (i = 0; i < 5; i++) {
      a = (i * 72 - 90) * Math.PI / 180;
      p += '<circle cx="' + (40 + Math.cos(a) * 17).toFixed(1) + '" cy="' + (34 + Math.sin(a) * 17).toFixed(1) + '" r="13"/>';
    }
    return svg('flor', '', '0 0 80 120',
      t('M40 46 C38 76 42 96 40 116', '#1F8A3A', 6) +
      f('M40 92 C24 84 14 90 10 100 C24 104 34 100 40 92 Z', '#3DBB55', '#1F8A3A', 3) +
      f('M41 80 C56 70 66 76 70 84 C58 90 48 88 41 80 Z', '#3DBB55', '#1F8A3A', 3) +
      '<g fill="' + cor + '" stroke="rgba(60,20,40,.35)" stroke-width="3">' + p + '</g>' +
      '<circle cx="40" cy="34" r="10" fill="' + (miolo || '#FFD23F') + '" stroke="rgba(120,70,0,.5)" stroke-width="3"/>'
    );
  }

  var moita = svg('moita', '', '0 0 120 60',
    f('M6 58 C8 34 18 16 26 6 C30 24 32 40 34 58 Z', '#2FA84F', '#17752F', 3.5) +
    f('M30 58 C36 30 50 10 62 0 C62 22 60 40 60 58 Z', '#3DBB55', '#17752F', 3.5) +
    f('M58 58 C62 36 76 20 90 12 C88 30 84 44 84 58 Z', '#2FA84F', '#17752F', 3.5) +
    f('M82 58 C86 44 98 32 112 28 C110 40 106 50 106 58 Z', '#3DBB55', '#17752F', 3.5)
  );

  var borboleta = svg('borboleta', '', '0 0 120 100',
    '<g class="je-asa" style="transform-origin:60px 50px">' +
      f('M58 48 C40 8 6 6 8 34 C10 52 34 56 58 52 Z', '#FF6BD6', '#A8278A', 4) +
      f('M58 54 C36 56 14 66 20 84 C28 98 50 84 58 60 Z', '#FFB02E', '#B86A00', 4) +
      f('M62 48 C80 8 114 6 112 34 C110 52 86 56 62 52 Z', '#FF6BD6', '#A8278A', 4) +
      f('M62 54 C84 56 106 66 100 84 C92 98 70 84 62 60 Z', '#FFB02E', '#B86A00', 4) +
      '<circle cx="30" cy="30" r="7" fill="#fff" opacity=".8"/><circle cx="90" cy="30" r="7" fill="#fff" opacity=".8"/>' +
    '</g>' +
    t('M56 30 Q50 16 42 14 M64 30 Q70 16 78 14', TINTA, 3) +
    '<ellipse cx="60" cy="54" rx="6.5" ry="26" fill="' + TINTA + '"/>'
  );

  /* Definições compartilhadas: um SVG invisível (mas não display:none) no começo do body. */
  var DEFS =
    '<svg id="je-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg"><defs>' +
      '<radialGradient id="je-blush"><stop offset="0" stop-color="' + BLUSH + '" stop-opacity=".62"/><stop offset=".6" stop-color="' + BLUSH + '" stop-opacity=".28"/><stop offset="1" stop-color="' + BLUSH + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="je-esfera" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></radialGradient>' +
      '<radialGradient id="je-luz-sol"><stop offset=".45" stop-color="#FFF3A6" stop-opacity=".7"/><stop offset="1" stop-color="#FFF3A6" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="je-clip-bola"><circle cx="100" cy="98" r="88"/></clipPath>' +
      '<clipPath id="je-clip-tronco"><path d="M28 444 C28 366 92 330 150 322 C172 344 228 344 250 322 C308 330 372 366 372 444 Z"/></clipPath>' +
    '</defs></svg>';
  if (typeof document !== 'undefined' && document.body && !document.getElementById('je-defs')) {
    document.body.insertAdjacentHTML('afterbegin', DEFS);
  }

  window.JE_ARTE = {
    papai: papai, mamae: mamae, bebe: bebe,
    bola: bola, pato: pato, auau: auau, banana: banana,
    sol: sol, nuvem: nuvem, arcoiris: arcoiris, arvore: arvore, moita: moita, borboleta: borboleta,
    flor: flor('#fff'), 'flor-rosa': flor('#FF8FC7'), 'flor-roxa': flor('#B79BFF'), 'flor-vermelha': flor('#FF5A5A', '#FFE14A'),
    defs: DEFS
  };

  /* rosto: centro (x, y) e diâmetro da cabeça, em % da largura/altura da caixa.
     proporcao: altura da caixa em % da largura. boca: ponto de onde a boca abre. */
  window.JE_ITENS = [
    { id: 'papai', palavra: 'Papai', tipo: 'pessoa', proporcao: 110, rosto: { x: 50, y: 44.5, d: 61 }, boca: [200, 250], olhos: 208 },
    { id: 'mamae', palavra: 'Mamãe', tipo: 'pessoa', proporcao: 110, rosto: { x: 50, y: 44.5, d: 61 }, boca: [200, 250], olhos: 208 },
    /* bracos: ombro e mão de cada braço no SVG, para o jogo calcular para onde apontar */
    { id: 'bebe', palavra: 'Bebê', tipo: 'pessoa', proporcao: 115, rosto: { x: 50, y: 36.4, d: 67 }, boca: [200, 224], olhos: 184,
      caixa: [400, 460], bracos: { e: { ombro: [124, 318], mao: [54, 360] }, d: { ombro: [276, 318], mao: [346, 360] } } },
    { id: 'bola', palavra: 'Bola', tipo: 'objeto', proporcao: 100 },
    { id: 'auau', palavra: 'Au-au', tipo: 'objeto', proporcao: 100 },
    { id: 'banana', palavra: 'Banana', tipo: 'objeto', proporcao: 100 },
    { id: 'pato', palavra: 'Pato', tipo: 'objeto', proporcao: 100 }
  ];
})();
