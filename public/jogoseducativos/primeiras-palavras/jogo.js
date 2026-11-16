/*
  Motor do jogo Primeiras palavras: monta a cena, responde ao toque e fala.

  Regras da interação:
  - Tocar ou passar o dedo em uma coisa: ela pula e o bebê da cena fala o nome
    dela, apontando o dedo para ela.
  - Tocar de novo na mesma coisa enquanto a palavra ainda toca não repete o
    som (evita "pa-pa-pa-papai"). Tocar em outra coisa troca na hora.
  - Qualquer toque deixa um pulso; arrastar deixa um rastro de brilho que
    segue o dedo. Toque no fundo faz um "plim".

  ES5 de propósito: precisa rodar em iPad antigo.
*/
(function () {
  'use strict';

  var ARTE = window.JE_ARTE, DEFS = window.JE_ITENS, ARMAZEM = window.JE_ARMAZEM;
  var PASTA_AUDIO = '/jogoseducativos/audio/';
  var ARQUIVOS = { papai: 'papai', mamae: 'mamae', bebe: 'bebe', bola: 'bola', pato: 'pato', auau: 'au-au', banana: 'banana' };
  var AROS = { papai: '#FF7A1A', mamae: '#E63E8C', bebe: '#7C4DFF' };
  var CORES_BALAO = ['#F0443A', '#FFB800', '#7C4DFF', '#FF7A1A'];
  var MAX_CASA = 4;
  var TEMPO_SEGURAR_MS = 1300;

  var cena = document.getElementById('cena');
  var palco = document.getElementById('palco');
  var tela = document.getElementById('brilho');
  var telaInicio = document.getElementById('inicio');
  var botaoSair = document.getElementById('sair');
  var camadas = {
    ceu: document.getElementById('camada-ceu'),
    fundo: document.getElementById('camada-fundo'),
    frente: document.getElementById('camada-frente')
  };

  document.getElementById('sol').innerHTML = ARTE.sol;
  Array.prototype.forEach.call(document.querySelectorAll('.nuvem'), function (n) { n.innerHTML = ARTE.nuvem; });

  var jogando = false;
  var itens = {};      /* id -> peças do DOM de cada coisa da cena */
  var sons = {};       /* id -> som em uso (padrão ou gravado em casa) */
  var padroes = {};    /* id -> som padrão já baixado */

  /* ───────── Palco ───────── */
  function ajustarPalco() {
    var w = window.innerWidth, h = window.innerHeight, paisagem = w >= h;
    /* A cena foi desenhada para 4:3. Aceita uma folga e centraliza o resto. */
    var r = w / h;
    r = paisagem ? Math.max(1.2, Math.min(1.62, r)) : Math.max(0.6, Math.min(0.82, r));
    var pw = Math.min(w, h * r), ph = pw / r;
    palco.style.width = pw + 'px'; palco.style.height = ph + 'px';
    palco.style.marginLeft = (-pw / 2) + 'px'; palco.style.marginTop = (-ph / 2) + 'px';
    palco.className = paisagem ? 'paisagem' : 'retrato';
    tela.width = w; tela.height = h;   /* 1 px por ponto: brilho é difuso e o aparelho agradece */
  }
  window.addEventListener('resize', ajustarPalco);
  window.addEventListener('orientationchange', function () { setTimeout(ajustarPalco, 250); });
  ajustarPalco();

  /* ───────── Montagem da cena ───────── */
  function div(classe) { var d = document.createElement('div'); d.className = classe; return d; }

  var ONDAS = '<svg viewBox="0 0 60 80" aria-hidden="true"><path d="M8 22 Q22 40 8 58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M28 8 Q52 40 28 72" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>';

  function criarItem(def, reg, camada, extra) {
    var el = div('item' + (extra ? ' ' + extra : ''));
    el.setAttribute('data-item', def.id);
    var pulo = div('pulo'), mexe = div('mexe'), caixa = div('caixa');
    caixa.style.paddingTop = def.proporcao + '%';
    var peca = { def: def, el: el, pulo: pulo, caixa: caixa, palavra: (reg && reg.palavra) || def.palavra };

    if (def.tipo === 'pessoa') {
      caixa.innerHTML = ARTE[def.id];
      var foto = div('foto-rosto');
      foto.style.left = def.rosto.x + '%'; foto.style.top = def.rosto.y + '%';
      foto.style.width = def.rosto.d + '%'; foto.style.paddingTop = def.rosto.d + '%';
      caixa.appendChild(foto);
      peca.fotoEl = foto;
      peca.olhos = caixa.querySelector('.je-olhos');
      peca.sorriso = caixa.querySelector('.je-sorriso');
      peca.boca = caixa.querySelector('.je-boca');
      if (reg && reg.foto) {
        foto.style.backgroundImage = 'url(' + reg.foto + ')';
        el.className += ' tem-foto';
        el.style.setProperty('--aro', AROS[def.id]);
        peca.temFoto = true;
      }
      if (def.id === 'bebe') {
        var e = div('ondas e'), d = div('ondas d');
        e.innerHTML = ONDAS; d.innerHTML = ONDAS;
        caixa.appendChild(e); caixa.appendChild(d);
        peca.bracos = { e: caixa.querySelector('.je-braco-e'), d: caixa.querySelector('.je-braco-d') };
      }
      abrirBoca(peca, 0);
    } else if (def.tipo === 'casa') {
      var bola = div('balao-foto');
      bola.style.backgroundImage = 'url(' + reg.foto + ')';
      caixa.appendChild(bola);
      caixa.insertAdjacentHTML('beforeend',
        '<svg class="balao-fio" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="M50 0 L43 9 H57 Z" fill="' + def.cor + '"/>' +
        '<path d="M50 9 C38 24 62 38 50 58" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>');
      el.style.setProperty('--aro', def.cor);
    } else if (reg && reg.foto) {
      var adesivo = div('adesivo');
      adesivo.style.backgroundImage = 'url(' + reg.foto + ')';
      caixa.appendChild(adesivo);
    } else {
      caixa.innerHTML = ARTE[def.id];
    }

    mexe.appendChild(caixa); pulo.appendChild(mexe); el.appendChild(pulo);
    camada.appendChild(el);
    itens[def.id] = peca;
    return peca;
  }

  function montarCena(registros) {
    var porId = {};
    registros.forEach(function (r) { porId[r.id] = r; });
    camadas.ceu.innerHTML = ''; camadas.fundo.innerHTML = ''; camadas.frente.innerHTML = '';
    itens = {}; sons = {};

    var camadaDe = { papai: 'fundo', mamae: 'fundo' };
    ['papai', 'mamae', 'auau', 'banana', 'bola', 'pato', 'bebe'].forEach(function (id) {
      var def = DEFS.filter(function (d) { return d.id === id; })[0];
      criarItem(def, porId[id], camadas[camadaDe[id] || 'frente']);
      ligarSomDoItem(id, porId[id]);
    });

    /* Coisas da casa completas (com foto e voz) viram balões */
    registros.filter(function (r) { return r.casa && r.foto && r.voz; })
      .sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); })
      .slice(0, MAX_CASA)
      .forEach(function (r, i) {
        criarItem({ id: r.id, palavra: r.palavra || '', tipo: 'casa', proporcao: 150, cor: CORES_BALAO[i % CORES_BALAO.length] },
          r, camadas.ceu, 'balao b' + i);
        ligarSomDoItem(r.id, r);
      });
  }

  function carregar() {
    return ARMAZEM.todos().then(montarCena, function () { montarCena([]); });
  }

  /* ───────── Som ───────── */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, analisador = null, amostras = null;

  function ligarSomDoItem(id, reg) {
    if (reg && reg.voz && reg.voz.dados) {
      sons[id] = { bruto: reg.voz.dados, inicio: reg.voz.inicio || 0, fim: reg.voz.fim || 0, ganho: reg.voz.ganho || 1 };
      decodificar(sons[id]);
      return;
    }
    if (!ARQUIVOS[id]) return;
    if (!padroes[id]) {
      var som = padroes[id] = { url: PASTA_AUDIO + ARQUIVOS[id] + '.mp3?v=2', inicio: 0, fim: 0, ganho: 1 };
      var x = new XMLHttpRequest();
      x.open('GET', som.url, true);
      x.responseType = 'arraybuffer';
      x.onload = function () { if (x.status >= 200 && x.status < 300) { som.bruto = x.response; decodificar(som); } };
      x.send();
    }
    sons[id] = padroes[id];
  }

  function decodificar(som) {
    if (!ctx || !som || !som.bruto || som.buffer || som.decodificando) return;
    som.decodificando = true;
    /* decodeAudioData consome o ArrayBuffer: decodifica uma cópia. */
    ctx.decodeAudioData(som.bruto.slice(0), function (buf) {
      som.buffer = buf; som.decodificando = false;
      if (!som.fim || som.fim > buf.duration) som.fim = buf.duration;
    }, function () { som.decodificando = false; });
  }

  function ligarSom() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      analisador = ctx.createAnalyser();
      analisador.fftSize = 256;
      amostras = new Uint8Array(analisador.fftSize);
      analisador.connect(ctx.destination);
      /* Um buffer mudo tocado dentro do gesto destrava o áudio no iOS. */
      try {
        var mudo = ctx.createBufferSource();
        mudo.buffer = ctx.createBuffer(1, 1, 22050);
        mudo.connect(ctx.destination);
        mudo.start(0);
      } catch (e) {}
    }
    Object.keys(sons).forEach(function (id) { decodificar(sons[id]); });
    if (ctx.state !== 'running' && ctx.resume) ctx.resume();
  }
  /* O iOS suspende o áudio ao trocar de app; qualquer toque seguinte retoma. */
  document.addEventListener('touchend', function () {
    if (ctx && ctx.state !== 'running' && ctx.resume) ctx.resume();
  }, true);

  var fonteAtual = null, ganhoAtual = null, reservaAudio = null;
  function pararFala() {
    if (fonteAtual) {
      try {
        ganhoAtual.gain.setValueAtTime(ganhoAtual.gain.value, ctx.currentTime);
        ganhoAtual.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
        fonteAtual.stop(ctx.currentTime + 0.05);
      } catch (e) {}
      fonteAtual = null;
    }
    if (reservaAudio) { try { reservaAudio.pause(); } catch (e) {} reservaAudio = null; }
  }

  /* Devolve { duracao (s), analise (bool) } ou null se a coisa não tem som. */
  function tocar(id) {
    var som = sons[id];
    if (!som) return null;
    pararFala();
    if (ctx && som.buffer) {
      var fonte = ctx.createBufferSource(), ganho = ctx.createGain();
      var dur = Math.max(0.2, som.fim - som.inicio);
      fonte.buffer = som.buffer;
      ganho.gain.value = som.ganho;
      fonte.connect(ganho); ganho.connect(analisador);
      fonte.start(0, som.inicio, dur);
      fonteAtual = fonte; ganhoAtual = ganho;
      return { duracao: dur, analise: true };
    }
    /* Reserva para os sons padrão: elemento <audio>, se o Web Audio falhar. */
    if (som.url) {
      try {
        reservaAudio = new Audio(som.url);
        var p = reservaAudio.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
      return { duracao: 1.5, analise: false };
    }
    return null;
  }

  var NOTAS = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function plim() {
    if (!ctx || ctx.state !== 'running') return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.type = 'sine';
      o.frequency.value = NOTAS[Math.floor(Math.random() * NOTAS.length)];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.4);
    } catch (e) {}
  }

  /* ───────── Fala do bebê ───────── */
  function abrirBoca(p, v) {
    if (!p.boca) return;
    var c = p.def.boca, aberta = v > 0.16;
    /* Atributo SVG em vez de CSS: funciona igual em qualquer Safari antigo. */
    p.boca.setAttribute('transform', 'translate(' + c[0] + ' ' + c[1] + ') scale(1 ' + (aberta ? v.toFixed(3) : '0') +
      ') translate(-' + c[0] + ' -' + c[1] + ')');
    p.sorriso.setAttribute('opacity', aberta ? '0' : '1');
  }

  function soltarBracos() {
    var b = itens.bebe;
    if (!b || !b.bracos) return;
    ['e', 'd'].forEach(function (l) {
      if (!b.bracos[l]) return;
      b.bracos[l].style.transform = ''; b.bracos[l].style.webkitTransform = '';
      b.bracos[l].classList.remove('aponta');
    });
  }

  /* Gira o braço do lado certo até ele mirar o centro da coisa tocada. */
  function apontar(alvo) {
    var b = itens.bebe;
    soltarBracos();
    if (!b || !b.bracos || alvo === b) return;
    var svg = b.caixa.querySelector('svg');
    if (!svg) return;
    var r = svg.getBoundingClientRect(), ra = alvo.caixa.getBoundingClientRect();
    var tx = ra.left + ra.width / 2, ty = ra.top + ra.height * 0.45;
    var lado = tx < r.left + r.width / 2 ? 'e' : 'd';
    var braco = b.def.bracos[lado], el = b.bracos[lado];
    if (!el) return;
    var ex = r.width / b.def.caixa[0], ey = r.height / b.def.caixa[1];
    var ox = r.left + braco.ombro[0] * ex, oy = r.top + braco.ombro[1] * ey;
    var desejado = Math.atan2(ty - oy, tx - ox);
    var parado = Math.atan2(braco.mao[1] - braco.ombro[1], braco.mao[0] - braco.ombro[0]);
    var graus = (desejado - parado) * 180 / Math.PI;
    while (graus > 180) graus -= 360;
    while (graus < -180) graus += 360;
    /* Além de girar, o braço estica um pouco: braço de bebê é curto demais para "apontar". */
    var giro = 'rotate(' + graus.toFixed(1) + 'deg) scale(1.3)';
    el.style.transform = giro;
    el.style.webkitTransform = giro;
    el.classList.add('aponta');
  }

  function reiniciarClasse(el, classe) {
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
  }

  var falandoId = null, fimFala = 0, vezFala = 0;

  function falar(id) {
    var alvo = itens[id];
    if (!alvo) return;
    var agora = Date.now();
    /* Mesma coisa ainda sendo dita: só a animação, sem repetir o som. */
    if (falandoId === id && agora < fimFala) { reiniciarClasse(alvo.pulo, 'pula'); return; }

    var r = alvo.caixa.getBoundingClientRect();
    estouro(r.left + r.width / 2, r.top + r.height * 0.4);
    reiniciarClasse(alvo.pulo, 'pula');
    if (id === 'papai' || id === 'mamae') reiniciarClasse(alvo.el, 'acena');

    var som = tocar(id);
    if (!som) { plim(); return; }

    var orador = itens.bebe, minhaVez = ++vezFala;
    var duracao = som.duracao * 1000, suave = 0;
    falandoId = id; fimFala = agora + duracao;
    orador.el.classList.add('falando');
    apontar(alvo);

    (function quadro() {
      if (minhaVez !== vezFala) return;          /* outra palavra assumiu */
      var t = Date.now() - agora;
      if (t >= duracao || itens.bebe !== orador) {
        abrirBoca(orador, 0);
        if (orador.fotoEl) { orador.fotoEl.style.transform = ''; orador.fotoEl.style.webkitTransform = ''; }
        orador.el.classList.remove('falando');
        soltarBracos();
        falandoId = null;
        return;
      }
      var alvoBoca;
      if (som.analise) {
        analisador.getByteTimeDomainData(amostras);
        var soma = 0, i, d;
        for (i = 0; i < amostras.length; i++) { d = (amostras[i] - 128) / 128; soma += d * d; }
        alvoBoca = Math.min(1, Math.sqrt(soma / amostras.length) * 5.5);
      } else {
        alvoBoca = 0.25 + 0.55 * Math.abs(Math.sin(t / 130));
      }
      suave += (alvoBoca - suave) * 0.4;
      if (orador.temFoto) {
        /* Rosto de foto não tem boca desenhada: a foto pulsa com a voz. */
        var e = 'translate(-50%,-50%) scale(' + (1 + suave * 0.12).toFixed(3) + ')';
        orador.fotoEl.style.transform = e; orador.fotoEl.style.webkitTransform = e;
      } else {
        abrirBoca(orador, suave);
      }
      requestAnimationFrame(quadro);
    })();
  }

  /* ───────── Brilho: pulso, rastro e estouro (canvas) ───────── */
  var g2 = tela.getContext('2d');
  var CORES = [[255, 225, 74], [255, 107, 214], [92, 225, 255], [255, 255, 255], [140, 255, 107], [255, 165, 58]];
  var MAX_PARTICULAS = 260;
  var particulas = [], aneis = [], dedos = {}, rodando = false, ultimoQuadro = 0;

  function fazerSprite(cor, estrela) {
    var c = document.createElement('canvas'), t = 64;
    c.width = c.height = t;
    var g = c.getContext('2d'), rgb = cor.join(',');
    var grad = g.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.22, 'rgba(' + rgb + ',.95)');
    grad.addColorStop(0.55, 'rgba(' + rgb + ',.35)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, t, t);
    if (estrela) {
      g.fillStyle = '#fff';
      g.beginPath();
      var i, a, raio;
      for (i = 0; i < 8; i++) {
        a = Math.PI / 4 * i - Math.PI / 2; raio = i % 2 ? 6 : 26;
        g[i ? 'lineTo' : 'moveTo'](t / 2 + Math.cos(a) * raio, t / 2 + Math.sin(a) * raio);
      }
      g.closePath(); g.fill();
    }
    return c;
  }
  var bolhas = CORES.map(function (c) { return fazerSprite(c, false); });
  var estrelas = CORES.map(function (c) { return fazerSprite(c, true); });
  var luzDedo = fazerSprite([255, 240, 150], false);

  function soltar(x, y, vx, vy, vida, tam, estrela) {
    if (particulas.length >= MAX_PARTICULAS) particulas.shift();
    var i = Math.floor(Math.random() * CORES.length);
    particulas.push({ x: x, y: y, vx: vx, vy: vy, idade: 0, vida: vida, tam: tam, spr: (estrela ? estrelas : bolhas)[i] });
  }

  function pulso(x, y) {
    aneis.push({ x: x, y: y, idade: 0, vida: 0.5, cor: '255,255,255' });
    aneis.push({ x: x, y: y, idade: -0.09, vida: 0.5, cor: '255,225,74' });
    var i, a, v;
    for (i = 0; i < 8; i++) {
      a = Math.random() * Math.PI * 2; v = 90 + Math.random() * 150;
      soltar(x, y, Math.cos(a) * v, Math.sin(a) * v, 0.5 + Math.random() * 0.3, 20 + Math.random() * 18, i % 2 === 0);
    }
    acordar();
  }

  function estouro(x, y) {
    var i, a, v;
    for (i = 0; i < 16; i++) {
      a = Math.PI * 2 * i / 16 + Math.random() * 0.3; v = 200 + Math.random() * 190;
      soltar(x, y, Math.cos(a) * v, Math.sin(a) * v - 60, 0.65 + Math.random() * 0.35, 26 + Math.random() * 22, true);
    }
    acordar();
  }

  function rastro(id, x, y) {
    var d = dedos[id];
    if (!d) { dedos[id] = { x: x, y: y, ux: x, uy: y, forca: 1, solto: false }; acordar(); return; }
    d.x = x; d.y = y; d.solto = false; d.forca = 1;
    var dx = x - d.ux, dy = y - d.uy, dist = Math.sqrt(dx * dx + dy * dy);
    var passos = Math.floor(dist / 14), i, k;
    for (i = 1; i <= passos; i++) {
      k = i / passos;
      soltar(d.ux + dx * k + (Math.random() - 0.5) * 16, d.uy + dy * k + (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 70, -20 - Math.random() * 70, 0.6 + Math.random() * 0.5, 16 + Math.random() * 26, Math.random() < 0.4);
    }
    if (passos) { d.ux = x; d.uy = y; }
    acordar();
  }
  function soltarDedo(id) { if (dedos[id]) dedos[id].solto = true; }

  function acordar() {
    if (rodando) return;
    rodando = true; ultimoQuadro = 0;
    requestAnimationFrame(desenhar);
  }

  function desenhar(agora) {
    var dt = ultimoQuadro ? Math.min(0.05, (agora - ultimoQuadro) / 1000) : 0.016;
    ultimoQuadro = agora;
    g2.clearRect(0, 0, tela.width, tela.height);
    var i, p, a, s, t, vivos = 0;

    for (var id in dedos) {
      p = dedos[id];
      if (p.solto) p.forca -= dt * 4;
      if (p.forca <= 0) { delete dedos[id]; continue; }
      vivos++;
      g2.globalAlpha = 0.85 * p.forca;
      g2.drawImage(luzDedo, p.x - 85, p.y - 85, 170, 170);
    }

    for (i = aneis.length - 1; i >= 0; i--) {
      p = aneis[i]; p.idade += dt;
      if (p.idade >= p.vida) { aneis.splice(i, 1); continue; }
      if (p.idade < 0) continue;
      t = p.idade / p.vida; a = 1 - t;
      g2.globalAlpha = 1;
      g2.strokeStyle = 'rgba(' + p.cor + ',' + (a * 0.95).toFixed(3) + ')';
      g2.lineWidth = 2 + 10 * a;
      g2.beginPath();
      g2.arc(p.x, p.y, 18 + 115 * (1 - a * a), 0, Math.PI * 2);
      g2.stroke();
    }

    for (i = particulas.length - 1; i >= 0; i--) {
      p = particulas[i]; p.idade += dt;
      if (p.idade >= p.vida) { particulas.splice(i, 1); continue; }
      p.vy += 160 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      a = 1 - p.idade / p.vida; s = p.tam * (0.55 + 0.45 * a);
      g2.globalAlpha = a;
      g2.drawImage(p.spr, p.x - s / 2, p.y - s / 2, s, s);
    }
    g2.globalAlpha = 1;

    if (vivos || aneis.length || particulas.length) requestAnimationFrame(desenhar);
    else rodando = false;
  }

  /* ───────── Toques ───────── */
  var ultimoAlvo = {};

  function itemEm(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && el !== cena) {
      if (el.getAttribute && el.getAttribute('data-item')) return el.getAttribute('data-item');
      el = el.parentNode;
    }
    return null;
  }

  function ponto(id, x, y, comeco) {
    if (!jogando) return;
    var alvo = itemEm(x, y);
    if (comeco) { delete dedos[id]; pulso(x, y); if (!alvo) plim(); }
    rastro(id, x, y);
    /* Entrou em uma coisa nova (no toque ou arrastando): ela é dita. */
    if (alvo && (comeco || alvo !== ultimoAlvo[id])) falar(alvo);
    ultimoAlvo[id] = alvo;
  }
  function fim(id) { soltarDedo(id); delete ultimoAlvo[id]; }

  function porToque(e, fn) {
    var i, t;
    for (i = 0; i < e.changedTouches.length; i++) { t = e.changedTouches[i]; fn(t); }
  }
  cena.addEventListener('touchstart', function (e) {
    e.preventDefault();
    porToque(e, function (t) { ponto('t' + t.identifier, t.clientX, t.clientY, true); });
  }, { passive: false });
  cena.addEventListener('touchmove', function (e) {
    e.preventDefault();
    porToque(e, function (t) { ponto('t' + t.identifier, t.clientX, t.clientY, false); });
  }, { passive: false });
  ['touchend', 'touchcancel'].forEach(function (ev) {
    cena.addEventListener(ev, function (e) { porToque(e, function (t) { fim('t' + t.identifier); }); });
  });
  var mouseApertado = false;
  cena.addEventListener('mousedown', function (e) { mouseApertado = true; ponto('m', e.clientX, e.clientY, true); });
  window.addEventListener('mousemove', function (e) { if (mouseApertado) ponto('m', e.clientX, e.clientY, false); });
  window.addEventListener('mouseup', function () { if (mouseApertado) { mouseApertado = false; fim('m'); } });

  /* Sem zoom, menu de contexto ou seleção: nada tira o bebê da cena. */
  ['gesturestart', 'gesturechange', 'contextmenu', 'dblclick'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
  });

  /* ───────── Piscar ───────── */
  (function piscar() {
    setTimeout(function () {
      Object.keys(itens).forEach(function (id) {
        var p = itens[id];
        if (!p.olhos || p.temFoto) return;
        var y = p.def.olhos;
        p.olhos.setAttribute('transform', 'translate(0 ' + y + ') scale(1 .12) translate(0 -' + y + ')');
        setTimeout(function () { p.olhos.removeAttribute('transform'); }, 140);
      });
      piscar();
    }, 2600 + Math.random() * 2200);
  })();

  /* ───────── Botões de adulto ───────── */
  function aoSegurar(botao, acao) {
    var relogio = null;
    function soltar() { clearTimeout(relogio); relogio = null; botao.classList.remove('segurando'); }
    function apertar(e) {
      if (e.type === 'touchstart') e.preventDefault();
      if (relogio) return;
      botao.classList.add('segurando');
      relogio = setTimeout(function () { soltar(); acao(); }, TEMPO_SEGURAR_MS);
    }
    botao.addEventListener('touchstart', apertar, { passive: false });
    botao.addEventListener('mousedown', apertar);
    ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(function (ev) { botao.addEventListener(ev, soltar); });
    /* Teclado é coisa de adulto: Enter ou Espaço agem direto. */
    botao.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); acao(); }
    });
  }

  function comecar() {
    ligarSom();
    jogando = true;
    telaInicio.classList.add('some');
    botaoSair.hidden = false;
  }
  function parar() {
    jogando = false;
    pararFala();
    vezFala++; falandoId = null;
    if (itens.bebe) { itens.bebe.el.classList.remove('falando'); abrirBoca(itens.bebe, 0); }
    soltarBracos();
    botaoSair.hidden = true;
    telaInicio.classList.remove('some');
  }

  document.getElementById('comecar').addEventListener('click', comecar);
  aoSegurar(botaoSair, parar);

  window.JE_JOGO = {
    recarregar: carregar,
    maxCasa: MAX_CASA,
    urlPadrao: function (id) { return ARQUIVOS[id] ? PASTA_AUDIO + ARQUIVOS[id] + '.mp3?v=2' : null; }
  };
  carregar();
})();
