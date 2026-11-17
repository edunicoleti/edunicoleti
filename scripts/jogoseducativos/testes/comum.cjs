/*
  Peças comuns dos testes dos jogos (Playwright).

  Endereço testado: 1º argumento, ou a variável BASE, ou o servidor local com
  cabeçalhos de produção (servidor.py, porta 8770). Para testar o site no ar:
    node scripts/jogoseducativos/testes/teste-jogo.cjs https://edunicoleti.com.br
  Capturas de tela vão para a variável SAIDA (padrão: pasta temporária do sistema).
*/
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const BASE = (process.argv[2] || process.env.BASE || 'http://127.0.0.1:8770').replace(/\/$/, '');
const SAIDA = process.env.SAIDA || path.join(os.tmpdir(), 'jogoseducativos-testes');
fs.mkdirSync(SAIDA, { recursive: true });

async function abrirNavegador(extra) {
  const opcoes = Object.assign({}, extra);
  /* Em ambiente com proxy de saída (nuvem), o navegador precisa dele para sair. */
  if (/^https:/.test(BASE) && process.env.HTTPS_PROXY) opcoes.proxy = { server: process.env.HTTPS_PROXY };
  return chromium.launch(opcoes);
}

/* Registra erros de página, de console e respostas 4xx/5xx; os testes falham se houver algum. */
function vigiarErros(pagina) {
  const erros = [];
  pagina.on('pageerror', (e) => erros.push(String(e)));
  pagina.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  pagina.on('response', (r) => { if (r.status() >= 400) erros.push(r.status() + ' ' + r.url()); });
  pagina.on('dialog', (d) => { erros.push('alerta: ' + d.message()); d.dismiss(); });
  return erros;
}

/* Espiona o som: cada palavra tocada entra em window.__falas; cada "plim" soma em window.__plins. */
function espiarSom() {
  window.__falas = []; window.__plins = 0;
  const tocar = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (quando, inicio, duracao) {
    if (this.buffer && this.buffer.duration > 0.3) {
      window.__falas.push({ d: +this.buffer.duration.toFixed(2), inicio: +(inicio || 0).toFixed(2), duracao: duracao ? +duracao.toFixed(2) : null });
    }
    return tocar.apply(this, arguments);
  };
  const osc = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function () { window.__plins++; return osc.apply(this, arguments); };
}

/* Placar simples: confere, imprime e no fim sai com código 1 se algo falhou. */
function placar() {
  let falhas = 0;
  return {
    confere(ok, texto, detalhe) {
      if (!ok) falhas++;
      console.log((ok ? '  ok    ' : '  FALHOU ') + texto + (detalhe !== undefined ? '  (' + detalhe + ')' : ''));
    },
    fim(erros) {
      this.confere(erros.length === 0, 'sem erros na página', erros.join(' | ') || 'nenhum');
      console.log(falhas ? `\n${falhas} verificação(ões) falharam.` : '\nTudo certo.');
      console.log('Capturas em ' + SAIDA);
      process.exitCode = falhas ? 1 : 0;
    },
  };
}

const foto = (nome) => path.join(SAIDA, nome);

module.exports = { BASE, SAIDA, abrirNavegador, vigiarErros, espiarSom, placar, foto };
