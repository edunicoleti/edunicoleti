/*
  Estúdio: a tela de adulto "Fotos e vozes".

  Aqui o pai ou a mãe:
  - troca o desenho de qualquer coisa da cena por uma foto tirada na hora ou
    escolhida da galeria, enquadrando em um recorte redondo;
  - grava a própria voz dizendo a palavra (a gravação tem o silêncio das
    pontas cortado e o volume nivelado sozinha);
  - cria até quatro "coisas da casa", que aparecem como balões no céu.

  Nada sai do aparelho: foto e voz vão para o IndexedDB (ver armazem.js).
  ES5 de propósito: precisa rodar em iPad antigo.
*/
(function () {
  'use strict';

  var ARTE = window.JE_ARTE, DEFS = window.JE_ITENS, ARMAZEM = window.JE_ARMAZEM, JOGO = window.JE_JOGO;
  var LADO_FOTO = 480;          /* a foto recortada é guardada com 480 x 480 px */
  var TEMPO_GRAVACAO_MS = 3000;

  function $(id) { return document.getElementById(id); }
  function novo(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  var estudio = $('estudio');
  var registros = {};

  function registro(id) { return registros[id] || (registros[id] = { id: id }); }
  function guardar(reg) {
    /* Coisa padrão sem foto nem voz volta a ser só o desenho: não precisa de registro. */
    if (!reg.casa && !reg.foto && !reg.voz) { delete registros[reg.id]; return ARMAZEM.apagar(reg.id); }
    return ARMAZEM.salvar(reg);
  }

  /* ───────── Lista ───────── */
  function ficha(def, reg, casa) {
    reg = reg || {};
    var f = novo('div', 'ficha');
    var mini = novo('div', 'mini');
    if (reg.foto) mini.style.backgroundImage = 'url(' + reg.foto + ')';
    else if (ARTE[def.id]) mini.innerHTML = ARTE[def.id];
    else mini.className += ' vazia';
    var bocaMini = mini.querySelector('.je-boca');
    if (bocaMini) bocaMini.setAttribute('transform', 'scale(0)');
    f.appendChild(mini);

    var corpo = novo('div', 'corpo');
    if (casa) {
      var campo = novo('input', 'nome');
      campo.type = 'text'; campo.maxLength = 18; campo.placeholder = 'Nome, por exemplo: mamadeira';
      campo.value = reg.palavra || '';
      campo.setAttribute('aria-label', 'Nome da coisa');
      campo.addEventListener('change', function () {
        var r = registro(def.id); r.palavra = campo.value.trim(); guardar(r);
      });
      corpo.appendChild(campo);
    } else {
      corpo.appendChild(novo('div', 'nome', def.palavra));
    }

    var estado;
    if (casa) {
      estado = reg.foto && reg.voz ? 'Pronto: aparece como balão no céu.'
        : !reg.foto && !reg.voz ? 'Falta a foto e a voz.' : !reg.foto ? 'Falta a foto.' : 'Falta a voz.';
    } else {
      estado = (reg.foto ? 'Foto de casa' : 'Desenho') + ', ' + (reg.voz ? 'voz gravada' : 'voz do jogo') + '.';
    }
    corpo.appendChild(novo('div', 'estado', estado));

    var acoes = novo('div', 'acoes');
    function botao(texto, acao, classe) {
      var b = novo('button', 'mb' + (classe ? ' ' + classe : ''), texto);
      b.type = 'button';
      b.addEventListener('click', acao);
      acoes.appendChild(b);
      return b;
    }
    botao(reg.foto ? 'Trocar foto' : 'Foto', function () { escolherFoto(def.id); });
    botao(reg.voz ? 'Regravar voz' : 'Gravar voz', function () { abrirVoz(def.id, casa ? (registro(def.id).palavra || '') : def.palavra); });
    var ouvirB = botao('Ouvir', function () { ouvir(def.id); });
    if (casa && !reg.voz) ouvirB.disabled = true;
    if (casa) {
      botao('Apagar', function () {
        delete registros[def.id];
        ARMAZEM.apagar(def.id).then(desenhar, desenhar);
      }, 'perigo');
    } else {
      if (reg.foto) botao('Voltar ao desenho', function () { var r = registro(def.id); delete r.foto; guardar(r).then(desenhar, desenhar); }, 'perigo');
      if (reg.voz) botao('Voltar à voz do jogo', function () { var r = registro(def.id); delete r.voz; guardar(r).then(desenhar, desenhar); }, 'perigo');
    }
    corpo.appendChild(acoes);
    f.appendChild(corpo);
    return f;
  }

  function coisasDaCasa() {
    return Object.keys(registros).map(function (k) { return registros[k]; })
      .filter(function (r) { return r.casa; })
      .sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); });
  }

  function desenhar() {
    var pessoas = $('est-pessoas'), objetos = $('est-objetos'), casa = $('est-casa');
    pessoas.innerHTML = ''; objetos.innerHTML = ''; casa.innerHTML = '';
    DEFS.forEach(function (def) {
      (def.tipo === 'pessoa' ? pessoas : objetos).appendChild(ficha(def, registros[def.id], false));
    });
    var lista = coisasDaCasa();
    lista.forEach(function (r) { casa.appendChild(ficha({ id: r.id, palavra: r.palavra || '' }, r, true)); });
    $('est-nova').hidden = lista.length >= JOGO.maxCasa;
    $('est-aviso').hidden = !ARMAZEM.soMemoria();
  }

  function abrir() {
    ARMAZEM.todos().then(function (lista) {
      registros = {};
      lista.forEach(function (r) { registros[r.id] = r; });
      desenhar();
      estudio.hidden = false;
      estudio.scrollTop = 0;
    });
  }
  function fechar() {
    estudio.hidden = true;
    JOGO.recarregar();
  }

  $('abrir-estudio').addEventListener('click', abrir);
  $('est-pronto').addEventListener('click', fechar);
  $('est-nova').addEventListener('click', function () {
    var agora = Date.now(), r = { id: 'casa-' + agora, casa: true, palavra: '', ordem: agora };
    registros[r.id] = r;
    ARMAZEM.salvar(r).then(function () {
      desenhar();
      var campos = $('est-casa').querySelectorAll('input.nome');
      if (campos.length) campos[campos.length - 1].focus();
    });
  });

  /* ───────── Foto: escolher e enquadrar ───────── */
  var arquivo = $('arquivo'), modalFoto = $('modal-foto'), recorte = $('recorte'), imgRecorte = $('recorte-img'), zoom = $('zoom');
  var fotoDe = null, urlFoto = null;
  var corte = { w: 1, h: 1, lado: 300, base: 1, z: 1, ox: 0, oy: 0 };

  function escolherFoto(id) { fotoDe = id; arquivo.value = ''; arquivo.click(); }

  arquivo.addEventListener('change', function () {
    var f = arquivo.files && arquivo.files[0];
    if (!f || !fotoDe) return;
    if (urlFoto) URL.revokeObjectURL(urlFoto);
    urlFoto = URL.createObjectURL(f);
    imgRecorte.onload = function () {
      corte.w = imgRecorte.naturalWidth; corte.h = imgRecorte.naturalHeight;
      corte.lado = Math.max(180, Math.min(360, window.innerWidth - 80, window.innerHeight - 330));
      corte.base = corte.lado / Math.min(corte.w, corte.h);   /* zoom 1 = a foto cobre o quadro */
      corte.z = 1; corte.ox = 0; corte.oy = 0;
      zoom.value = 1;
      recorte.style.width = recorte.style.height = corte.lado + 'px';
      modalFoto.hidden = false;
      posicionar();
    };
    imgRecorte.onerror = function () { window.alert('Não consegui abrir essa imagem. Tente outra foto.'); };
    imgRecorte.src = urlFoto;
  });

  function posicionar() {
    var e = corte.base * corte.z, lw = corte.w * e, lh = corte.h * e;
    var mx = Math.max(0, (lw - corte.lado) / 2), my = Math.max(0, (lh - corte.lado) / 2);
    corte.ox = Math.max(-mx, Math.min(mx, corte.ox));
    corte.oy = Math.max(-my, Math.min(my, corte.oy));
    imgRecorte.style.width = lw + 'px'; imgRecorte.style.height = lh + 'px';
    imgRecorte.style.marginLeft = (-lw / 2 + corte.ox) + 'px';
    imgRecorte.style.marginTop = (-lh / 2 + corte.oy) + 'px';
  }

  zoom.addEventListener('input', function () { corte.z = parseFloat(zoom.value) || 1; posicionar(); });

  (function arrastar() {
    var ultimo = null, pinca = 0;
    function dist(e) {
      var a = e.touches[0], b = e.touches[1];
      return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
    }
    function mover(x, y) {
      if (ultimo) { corte.ox += x - ultimo.x; corte.oy += y - ultimo.y; posicionar(); }
      ultimo = { x: x, y: y };
    }
    recorte.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (e.touches.length === 2) { pinca = dist(e); ultimo = null; }
      else ultimo = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: false });
    recorte.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (e.touches.length === 2 && pinca) {
        var d = dist(e);
        corte.z = Math.max(1, Math.min(4, corte.z * d / pinca));
        pinca = d; zoom.value = corte.z; posicionar();
      } else if (e.touches.length === 1) mover(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    recorte.addEventListener('touchend', function () { ultimo = null; pinca = 0; });
    var apertado = false;
    recorte.addEventListener('mousedown', function (e) { apertado = true; ultimo = { x: e.clientX, y: e.clientY }; e.preventDefault(); });
    window.addEventListener('mousemove', function (e) { if (apertado) mover(e.clientX, e.clientY); });
    window.addEventListener('mouseup', function () { apertado = false; ultimo = null; });
  })();

  function fecharFoto() {
    modalFoto.hidden = true;
    imgRecorte.removeAttribute('src');
    if (urlFoto) { URL.revokeObjectURL(urlFoto); urlFoto = null; }
    fotoDe = null;
  }
  $('foto-cancelar').addEventListener('click', fecharFoto);
  $('foto-usar').addEventListener('click', function () {
    var e = corte.base * corte.z, lado = corte.lado / e;
    var sx = corte.w / 2 - corte.ox / e - lado / 2, sy = corte.h / 2 - corte.oy / e - lado / 2;
    var c = document.createElement('canvas');
    c.width = c.height = LADO_FOTO;
    var g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, LADO_FOTO, LADO_FOTO);
    g.drawImage(imgRecorte, sx, sy, lado, lado, 0, 0, LADO_FOTO, LADO_FOTO);
    var r = registro(fotoDe);
    r.foto = c.toDataURL('image/jpeg', 0.86);
    fecharFoto();
    guardar(r).then(desenhar, desenhar);
  });

  /* ───────── Voz: gravar, conferir, usar ───────── */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  function contexto() {
    if (!ctx && AC) ctx = new AC();
    if (ctx && ctx.state !== 'running' && ctx.resume) ctx.resume();
    return ctx;
  }

  var modalVoz = $('modal-voz'), botaoGravar = $('gravar'), textoVoz = $('voz-texto'), barra = $('voz-barra');
  var vozDe = null, fluxo = null, gravador = null, pedacos = [], pronto = null, relogioVoz = null, gravando = false, inicioGravacao = 0;
  var podeGravar = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && AC);

  function sessaoDeAudio(tipo) { try { if (navigator.audioSession) navigator.audioSession.type = tipo; } catch (e) {} }

  function abrirVoz(id, palavra) {
    vozDe = id; pronto = null;
    $('voz-titulo').textContent = palavra ? 'Grave: ' + palavra : 'Grave a palavra';
    textoVoz.textContent = podeGravar
      ? 'Toque em Gravar e diga a palavra perto do aparelho, devagar e sorrindo. A gravação para sozinha em 3 segundos.'
      : 'Este navegador não grava voz. No iPad, atualize o iPadOS para a versão 14.3 ou mais nova.';
    botaoGravar.disabled = !podeGravar;
    botaoGravar.textContent = 'Gravar';
    botaoGravar.className = '';
    barra.style.width = '0';
    $('voz-ouvir').disabled = true; $('voz-usar').disabled = true;
    modalVoz.hidden = false;
  }

  function fecharVoz() {
    if (gravando) { try { gravador.onstop = null; gravador.stop(); } catch (e) {} gravando = false; }
    clearTimeout(relogioVoz);
    if (fluxo) { fluxo.getTracks().forEach(function (t) { t.stop(); }); fluxo = null; }
    sessaoDeAudio('playback');
    modalVoz.hidden = true;
    vozDe = null; pronto = null;
  }

  function comecarGravacao() {
    pedacos = []; pronto = null;
    $('voz-ouvir').disabled = true; $('voz-usar').disabled = true;
    try { gravador = new MediaRecorder(fluxo); } catch (e) { textoVoz.textContent = 'Não consegui iniciar a gravação neste aparelho.'; return; }
    gravador.ondataavailable = function (e) { if (e.data && e.data.size) pedacos.push(e.data); };
    gravador.onstop = processar;
    gravador.start();
    gravando = true; inicioGravacao = Date.now();
    botaoGravar.textContent = 'Parar'; botaoGravar.className = 'gravando';
    textoVoz.textContent = 'Gravando. Diga a palavra agora.';
    (function andar() {
      if (!gravando) return;
      barra.style.width = Math.min(100, (Date.now() - inicioGravacao) / TEMPO_GRAVACAO_MS * 100) + '%';
      requestAnimationFrame(andar);
    })();
    relogioVoz = setTimeout(pararGravacao, TEMPO_GRAVACAO_MS);
  }
  function pararGravacao() {
    clearTimeout(relogioVoz);
    if (!gravando) return;
    gravando = false;
    botaoGravar.textContent = 'Gravar de novo'; botaoGravar.className = '';
    try { gravador.stop(); } catch (e) {}
  }

  botaoGravar.addEventListener('click', function () {
    if (gravando) { pararGravacao(); return; }
    contexto();
    if (fluxo) { comecarGravacao(); return; }
    sessaoDeAudio('play-and-record');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      fluxo = s;
      if (!modalVoz.hidden) comecarGravacao(); else fecharVoz();
    }, function () {
      textoVoz.textContent = 'O microfone está bloqueado. Libere em Ajustes, Safari, Microfone e tente de novo.';
    });
  });

  /* Lê a gravação, acha onde a fala começa e termina e calcula o ganho. */
  function processar() {
    var tipo = (gravador && gravador.mimeType) || (pedacos[0] && pedacos[0].type) || 'audio/mp4';
    var blob = new Blob(pedacos, { type: tipo });
    var leitor = new FileReader();
    leitor.onload = function () {
      var dados = leitor.result;
      contexto().decodeAudioData(dados.slice(0), function (buf) {
        var canal = buf.getChannelData(0), n = canal.length, taxa = buf.sampleRate, i, v, pico = 0;
        for (i = 0; i < n; i++) { v = canal[i] < 0 ? -canal[i] : canal[i]; if (v > pico) pico = v; }
        if (pico < 0.015) { textoVoz.textContent = 'Não ouvi nada. Tente de novo, mais perto do aparelho.'; return; }
        var limiar = Math.max(0.02, pico * 0.12), primeiro = 0, ultimo = n - 1;
        for (i = 0; i < n; i++) { v = canal[i] < 0 ? -canal[i] : canal[i]; if (v > limiar) { primeiro = i; break; } }
        for (i = n - 1; i >= 0; i--) { v = canal[i] < 0 ? -canal[i] : canal[i]; if (v > limiar) { ultimo = i; break; } }
        pronto = {
          dados: dados, tipo: tipo, buffer: buf,
          inicio: Math.max(0, primeiro / taxa - 0.05),
          fim: Math.min(buf.duration, ultimo / taxa + 0.14),
          ganho: Math.min(8, 0.8 / pico)
        };
        textoVoz.textContent = 'Gravado. Ouça para conferir e toque em Usar.';
        $('voz-ouvir').disabled = false; $('voz-usar').disabled = false;
        tocarBuffer(buf, pronto.inicio, pronto.fim, pronto.ganho);
      }, function () { textoVoz.textContent = 'Não consegui ler a gravação. Tente de novo.'; });
    };
    leitor.readAsArrayBuffer(blob);
  }

  var fontePrevia = null;
  function tocarBuffer(buf, inicio, fim, ganho) {
    var c = contexto();
    if (!c) return;
    if (fontePrevia) { try { fontePrevia.stop(); } catch (e) {} }
    var fonte = c.createBufferSource(), g = c.createGain();
    fonte.buffer = buf; g.gain.value = ganho || 1;
    fonte.connect(g); g.connect(c.destination);
    fonte.start(0, inicio || 0, Math.max(0.2, (fim || buf.duration) - (inicio || 0)));
    fontePrevia = fonte;
  }

  $('voz-ouvir').addEventListener('click', function () { if (pronto) tocarBuffer(pronto.buffer, pronto.inicio, pronto.fim, pronto.ganho); });
  $('voz-cancelar').addEventListener('click', fecharVoz);
  $('voz-usar').addEventListener('click', function () {
    if (!pronto || !vozDe) return;
    var r = registro(vozDe);
    r.voz = { dados: pronto.dados, tipo: pronto.tipo, inicio: pronto.inicio, fim: pronto.fim, ganho: pronto.ganho };
    fecharVoz();
    guardar(r).then(desenhar, desenhar);
  });

  /* Botão Ouvir de cada ficha: a voz gravada, ou a voz do jogo. */
  var audioPadrao = null;
  function ouvir(id) {
    var r = registros[id];
    if (r && r.voz) {
      var c = contexto();
      if (!c) return;
      c.decodeAudioData(r.voz.dados.slice(0), function (buf) { tocarBuffer(buf, r.voz.inicio, r.voz.fim, r.voz.ganho); }, function () {});
      return;
    }
    var url = JOGO.urlPadrao(id);
    if (!url) return;
    try {
      if (audioPadrao) audioPadrao.pause();
      audioPadrao = new Audio(url);
      var p = audioPadrao.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
})();
