/*
  Testa a cena do jogo Primeiras palavras como um bebê usaria: toque em cada
  coisa, rajada de toques, troca no meio da fala, toque no fundo, arrasto e o
  botão de sair que exige segurar.

  Uso: node scripts/jogoseducativos/testes/teste-jogo.cjs [endereço]
*/
const { BASE, abrirNavegador, vigiarErros, espiarSom, placar, foto } = require('./comum.cjs');

const PALAVRAS = ['papai', 'mamae', 'bebe', 'bola', 'auau', 'banana', 'pato'];

(async () => {
  const b = await abrirNavegador();
  const p = await (await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true })).newPage();
  const erros = vigiarErros(p);
  const t = placar();
  await p.addInitScript(espiarSom);
  await p.goto(BASE + '/jogoseducativos/primeiras-palavras/?t=' + Date.now());
  await p.waitForTimeout(700);

  const falas = () => p.evaluate(() => window.__falas.length);
  const centro = async (id) => { const r = await p.locator(`[data-item="${id}"]`).boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };

  console.log('Jogo em ' + BASE);
  await p.touchscreen.tap(200, 200); await p.waitForTimeout(200);
  t.confere(await falas() === 0, 'antes de Começar, tocar não faz nada');

  await p.tap('#comecar'); await p.waitForTimeout(900);
  await p.screenshot({ path: foto('jogo-cena.png') });

  for (const id of PALAVRAS) {
    const antes = await falas();
    const [x, y] = await centro(id);
    await p.touchscreen.tap(x, y); await p.waitForTimeout(320);
    const st = await p.evaluate(() => ({
      falando: document.querySelector('[data-item="bebe"]').classList.contains('falando'),
      aponta: !!document.querySelector('.je-braco-bebe.aponta'),
    }));
    if (id === 'mamae') await p.screenshot({ path: foto('jogo-falando.png') });
    t.confere(await falas() === antes + 1, `${id}: toca a palavra`);
    t.confere(st.falando, `${id}: o bebê da cena fala`);
    /* O bebê não aponta para si mesmo; aponta para todo o resto. */
    t.confere(st.aponta === (id !== 'bebe'), `${id}: ${id === 'bebe' ? 'não aponta' : 'aponta'}`);
    await p.waitForTimeout(2100);
  }

  let antes = await falas();
  const [bx, by] = await centro('bola');
  for (let i = 0; i < 6; i++) { await p.touchscreen.tap(bx, by); await p.waitForTimeout(110); }
  t.confere(await falas() - antes === 1, 'rajada na mesma coisa fala uma vez só', await falas() - antes);
  await p.waitForTimeout(1600);

  antes = await falas();
  const [px, py] = await centro('papai'); const [mx, my] = await centro('mamae');
  await p.touchscreen.tap(px, py); await p.waitForTimeout(300); await p.touchscreen.tap(mx, my); await p.waitForTimeout(300);
  t.confere(await falas() - antes === 2, 'tocar outra coisa no meio troca a palavra na hora');
  await p.waitForTimeout(2100);

  antes = await falas(); const plins = await p.evaluate(() => window.__plins);
  await p.touchscreen.tap(480, 110); await p.waitForTimeout(250);
  t.confere(await falas() === antes && await p.evaluate(() => window.__plins) === plins + 1, 'toque no céu faz plim, sem palavra');

  antes = await falas();
  const [ax, ay] = await centro('auau'); const [dx, dy] = await centro('pato');
  await p.mouse.move(ax, ay); await p.mouse.down();
  for (let i = 1; i <= 40; i++) {
    await p.mouse.move(ax + (dx - ax) * i / 40, ay + (dy - ay) * i / 40 - Math.sin(i / 40 * Math.PI) * 60);
    await p.waitForTimeout(45);
    if (i === 22) await p.screenshot({ path: foto('jogo-arrasto.png') });
  }
  await p.mouse.up(); await p.waitForTimeout(300);
  t.confere(await falas() - antes >= 3, 'arrastar o dedo pela cena fala o que passa por baixo', await falas() - antes);
  await p.waitForTimeout(1600);

  await p.tap('#sair'); await p.waitForTimeout(300);
  t.confere(await p.evaluate(() => document.getElementById('inicio').classList.contains('some')), 'toque rápido no botão de sair não sai');
  const s = await p.locator('#sair').boundingBox();
  await p.mouse.move(s.x + 20, s.y + 20); await p.mouse.down(); await p.waitForTimeout(1600); await p.mouse.up(); await p.waitForTimeout(500);
  t.confere(await p.evaluate(() => !document.getElementById('inicio').classList.contains('some')), 'segurar o botão de sair volta ao início');

  /* Retrato: tudo dentro da tela */
  await p.setViewportSize({ width: 768, height: 1024 }); await p.waitForTimeout(600);
  const fora = await p.evaluate(() => Array.from(document.querySelectorAll('[data-item]')).filter((e) => {
    const r = e.getBoundingClientRect(); return r.left < -2 || r.right > innerWidth + 2 || r.bottom > innerHeight + 2;
  }).map((e) => e.getAttribute('data-item')));
  t.confere(fora.length === 0, 'iPad em pé: nada sai da tela', fora.join(', ') || 'ok');
  await p.screenshot({ path: foto('jogo-retrato.png') });

  t.fim(erros);
  await b.close();
})();
