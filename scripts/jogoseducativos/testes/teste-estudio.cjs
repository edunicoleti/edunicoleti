/*
  Testa a tela "Fotos e vozes": enviar foto, enquadrar, gravar voz (microfone
  simulado), criar uma coisa da casa, ver tudo na cena, recarregar e voltar ao
  desenho. Usa fotos falsas geradas na hora.

  Rode contra o servidor.py ou contra o site no ar: sem os cabeçalhos de
  produção (CSP, Permissions-Policy) este teste não prova nada.

  Uso: node scripts/jogoseducativos/testes/teste-estudio.cjs [endereço]
*/
const path = require('path');
const { BASE, SAIDA, abrirNavegador, vigiarErros, espiarSom, placar, foto } = require('./comum.cjs');

async function gerarFotos(b) {
  const lista = { pai: [1200, 1600, '#8a6', '#c99b78', '#221'], mae: [1600, 1200, '#a68', '#e8c4a4', '#632'], ursinho: [1200, 1200, '#d8c9a8', '#b5793f', '#7a4a1e'] };
  const caminhos = {};
  for (const [nome, [w, h, fundo, rosto, cabelo]] of Object.entries(lista)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const m = Math.min(w, h);
    await p.setContent(`<body style="margin:0;background:linear-gradient(135deg,${fundo},#444)"><svg width="${w}" height="${h}">
      <ellipse cx="${w / 2}" cy="${h * 0.45}" rx="${m * 0.27}" ry="${m * 0.33}" fill="${rosto}"/>
      <path d="M${w / 2 - m * 0.27} ${h * 0.4} Q${w / 2} ${h * 0.05} ${w / 2 + m * 0.27} ${h * 0.4}Z" fill="${cabelo}"/>
      <circle cx="${w / 2 - 90}" cy="${h * 0.44}" r="26" fill="#222"/><circle cx="${w / 2 + 90}" cy="${h * 0.44}" r="26" fill="#222"/>
      <path d="M${w / 2 - 110} ${h * 0.54} Q${w / 2} ${h * 0.62} ${w / 2 + 110} ${h * 0.54}" stroke="#a33" stroke-width="22" fill="none"/></svg></body>`);
    caminhos[nome] = path.join(SAIDA, 'foto-' + nome + '.jpg');
    await p.screenshot({ path: caminhos[nome], type: 'jpeg', quality: 85 });
    await p.close();
  }
  return caminhos;
}

(async () => {
  const b = await abrirNavegador({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
  const fotos = await gerarFotos(b);
  const p = await (await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, permissions: ['microphone'] })).newPage();
  const erros = vigiarErros(p);
  const t = placar();
  await p.addInitScript(espiarSom);
  await p.goto(BASE + '/jogoseducativos/primeiras-palavras/?t=' + Date.now());
  console.log('Fotos e vozes em ' + BASE);

  await p.click('#abrir-estudio'); await p.waitForTimeout(400);

  async function enviarFoto(ficha, arquivo, ajustar) {
    const [seletor] = await Promise.all([
      p.waitForEvent('filechooser'),
      p.locator(ficha).locator('button', { hasText: /^(Foto|Trocar foto)$/ }).click(),
    ]);
    await seletor.setFiles(arquivo);
    const abriu = await p.waitForSelector('#modal-foto:not([hidden])', { timeout: 5000 }).then(() => true, () => false);
    t.confere(abriu, 'foto abre o enquadramento: ' + path.basename(arquivo));
    if (!abriu) return;
    if (ajustar) {
      await p.locator('#zoom').fill('1.7'); await p.locator('#zoom').dispatchEvent('input');
      const r = await p.locator('#recorte').boundingBox();
      await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await p.mouse.down();
      await p.mouse.move(r.x + r.width / 2 + 10, r.y + r.height / 2 + 60, { steps: 5 }); await p.mouse.up();
      await p.screenshot({ path: foto('estudio-recorte.png') });
    }
    await p.click('#foto-usar'); await p.waitForTimeout(350);
  }

  async function gravarVoz(ficha) {
    await p.locator(ficha).locator('button', { hasText: /Gravar voz|Regravar voz/ }).click();
    await p.waitForSelector('#modal-voz:not([hidden])');
    await p.click('#gravar'); await p.waitForTimeout(3900);
    const pronto = await p.locator('#voz-usar').isEnabled();
    t.confere(pronto, 'gravação de voz pronta para usar', await p.locator('#voz-texto').textContent());
    await p.click(pronto ? '#voz-usar' : '#voz-cancelar'); await p.waitForTimeout(350);
  }

  await enviarFoto('#est-pessoas .ficha >> nth=0', fotos.pai, true);
  await enviarFoto('#est-pessoas .ficha >> nth=1', fotos.mae, false);
  await enviarFoto('#est-objetos .ficha >> nth=0', fotos.ursinho, false);
  await gravarVoz('#est-pessoas .ficha >> nth=0');
  await p.click('#est-nova'); await p.waitForTimeout(300);
  await p.locator('#est-casa input.nome').fill('ursinho'); await p.locator('#est-casa input.nome').dispatchEvent('change');
  await enviarFoto('#est-casa .ficha >> nth=0', fotos.ursinho, false);
  await gravarVoz('#est-casa .ficha >> nth=0');
  await p.evaluate(() => document.getElementById('estudio').scrollTo(0, 0));
  await p.screenshot({ path: foto('estudio-lista.png') });

  await p.click('#est-pronto'); await p.waitForTimeout(500);
  await p.tap('#comecar'); await p.waitForTimeout(900);
  const cena = await p.evaluate(() => ({
    fotos: document.querySelectorAll('.item.tem-foto').length,
    baloes: document.querySelectorAll('.item.balao').length,
    adesivos: document.querySelectorAll('.adesivo').length,
  }));
  t.confere(cena.fotos === 2 && cena.baloes === 1 && cena.adesivos === 1, 'cena com 2 rostos de foto, 1 adesivo e 1 balão', JSON.stringify(cena));

  await p.evaluate(() => { window.__falas.length = 0; });
  for (const sel of ['.balao', '[data-item="papai"]']) {
    const r = await p.locator(sel).first().boundingBox();
    await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height * 0.35); await p.waitForTimeout(2000);
  }
  const f = await p.evaluate(() => window.__falas);
  /* Voz gravada toca recortada (inicio > 0); a do jogo começa do zero. */
  t.confere(f.length === 2 && f.every((x) => x.inicio > 0), 'balão e papai tocam a voz gravada, já recortada', JSON.stringify(f));
  await p.screenshot({ path: foto('estudio-cena.png') });

  await p.reload(); await p.waitForTimeout(800);
  const depois = await p.evaluate(() => document.querySelectorAll('.item.tem-foto').length + document.querySelectorAll('.item.balao').length);
  t.confere(depois === 3, 'fotos e balão continuam depois de recarregar');

  await p.click('#abrir-estudio'); await p.waitForTimeout(300);
  await p.locator('#est-pessoas .ficha >> nth=1').locator('button', { hasText: 'Voltar ao desenho' }).click(); await p.waitForTimeout(300);
  await p.click('#est-pronto'); await p.waitForTimeout(400);
  t.confere(await p.evaluate(() => !document.querySelector('[data-item="mamae"]').classList.contains('tem-foto')), 'Voltar ao desenho tira a foto da mamãe');

  t.fim(erros);
  await b.close();
})();
