/*
  Folha de contato das ilustrações: desenha cada figura de arte.js em tamanho
  grande, de boca fechada e falando, para revisar o desenho antes de pôr na cena.

  Uso: node scripts/jogoseducativos/testes/folha-arte.cjs
  Saída: folha-arte-1.png (personagens) e folha-arte-2.png (objetos e cenário) em SAIDA.
*/
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { foto } = require('./comum.cjs');

const arte = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'public', 'jogoseducativos', 'arte.js'), 'utf8');

function pagina(lista) {
  return `<body style="margin:0"><div id="a" style="display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px;padding:12px;
    background:linear-gradient(#2FA8F0,#8FDCFF 55%,#6FD14B 55%)"></div><script>${arte}
    const lista = ${JSON.stringify(lista)}, a = document.getElementById('a');
    for (const [nome, largura, falando] of lista) {
      const d = document.createElement('div'); d.style.width = largura + 'px'; d.innerHTML = JE_ARTE[nome];
      d.querySelector('svg').style.cssText = 'display:block;width:100%;height:auto;overflow:visible';
      const boca = d.querySelector('.je-boca'), sorriso = d.querySelector('.je-sorriso'), dedo = d.querySelector('.je-dedo');
      if (falando) { if (sorriso) sorriso.setAttribute('opacity', '0'); if (dedo) dedo.setAttribute('opacity', '1'); }
      else if (boca) boca.setAttribute('transform', 'scale(0)');
      a.appendChild(d);
    }</script></body>`;
}

(async () => {
  const b = await chromium.launch();
  const folhas = [
    [['papai', 460], ['mamae', 460], ['bebe', 460], ['bebe', 300, true], ['papai', 240, true], ['mamae', 240, true]],
    [['bola', 300], ['pato', 300], ['auau', 300], ['banana', 300], ['sol', 240], ['nuvem', 240], ['arvore', 200],
      ['flor', 100], ['flor-rosa', 100], ['flor-roxa', 100], ['flor-vermelha', 100], ['moita', 180], ['borboleta', 180], ['arcoiris', 400]],
  ];
  for (let i = 0; i < folhas.length; i++) {
    const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
    const erros = []; p.on('pageerror', (e) => erros.push(String(e)));
    await p.setContent(pagina(folhas[i]));
    await p.screenshot({ path: foto(`folha-arte-${i + 1}.png`), fullPage: true });
    if (erros.length) { console.log('erros:', erros); process.exitCode = 1; }
    await p.close();
  }
  console.log('Folhas em ' + foto(''));
  await b.close();
})();
