/*
  Gera os ícones da Tela de Início (icone-180.png e icone-512.png) a partir do
  desenho do bebê em arte.js. Rode de novo sempre que mudar o bebê, e troque o
  ?v= dos ícones nos HTML e no manifest (o servidor guarda png por 1 ano).

  Uso: node scripts/jogoseducativos/gerar-icone.cjs
*/
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const pasta = path.join(__dirname, '..', '..', 'public', 'jogoseducativos');
const arte = fs.readFileSync(path.join(pasta, 'arte.js'), 'utf8');
const html = `<body style="margin:0"><div id="i" style="width:512px;height:512px;position:relative;overflow:hidden;background:linear-gradient(#2FA8F0,#8FDCFF 80%)">
<div style="position:absolute;left:-30%;width:160%;top:72%;height:100%;border-radius:50%/16%;background:#46B93A"></div>
<div id="a" style="position:absolute;left:11%;width:78%;bottom:1%"></div></div>
<script>${arte}
const e = document.getElementById('a'); e.innerHTML = JE_ARTE.bebe;
e.querySelector('svg').style.display = 'block'; e.querySelector('.je-boca').setAttribute('transform', 'scale(0)');
</script></body>`;

(async () => {
  const b = await chromium.launch();
  for (const lado of [512, 180]) {
    const p = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: lado / 512 });
    await p.setContent(html);
    await p.locator('#i').screenshot({ path: path.join(pasta, `icone-${lado}.png`) });
    await p.close();
  }
  console.log('Ícones gerados em ' + pasta);
  await b.close();
})();
