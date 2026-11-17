/*
  Confere as vozes dos jogos "de ouvido", pedindo a um modelo do Gemini que
  transcreva e avalie cada mp3. Serve porque o agente que mexe aqui não escuta:
  foi assim que se descobriu que "Bebê." saía como "vevê".

  Uso:
    GEMINI_API_KEY=... node scripts/jogoseducativos/conferir-audio.mjs              # todos os mp3
    GEMINI_API_KEY=... node scripts/jogoseducativos/conferir-audio.mjs bebe bola    # só estes

  Em ambiente com proxy de saída (nuvem do Claude), rode com NODE_USE_ENV_PROXY=1.
  O modelo de escuta às vezes responde 503 (sobrecarga); o script tenta os outros.
*/
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODELOS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash'];
const pasta = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'jogoseducativos', 'audio');

const pedidos = process.argv.slice(2);
const arquivos = readdirSync(pasta).filter((f) => f.endsWith('.mp3'))
  .filter((f) => !pedidos.length || pedidos.includes(basename(f, '.mp3'))).sort();
if (!arquivos.length) { console.error('Nenhum mp3 encontrado em ' + pasta); process.exit(1); }
if (!process.env.GEMINI_API_KEY) { console.error('Defina GEMINI_API_KEY no ambiente.'); process.exit(1); }

const conteudo = [];
arquivos.forEach((f, i) => {
  conteudo.push({ type: 'text', text: `Áudio ${i + 1} (${basename(f, '.mp3')}):` });
  conteudo.push({ type: 'audio', data: readFileSync(join(pasta, f)).toString('base64'), mime_type: 'audio/mp3' });
});
conteudo.push({
  type: 'text',
  text: 'Você é fonoaudióloga. Para CADA áudio, uma linha: número | o que se ouve, sem corrigir ' +
    '(diga a consoante que ouviu se houver dúvida, como B ou V) | palavra completa? | sotaque | ritmo | ' +
    'tom | clareza 0 a 10 | ruído ou artefato. No fim: todos soam como a mesma voz? Algum destoa?',
});

/* Até 4 rodadas pelos modelos, esperando entre elas: o 503 costuma passar em minutos. */
for (let rodada = 1; rodada <= 4; rodada++) {
  for (const modelo of MODELOS) {
    const resposta = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelo, input: [{ type: 'user_input', content: conteudo }] }),
    });
    const corpo = await resposta.json();
    if (!resposta.ok) { console.error(`${modelo}: ${resposta.status} ${corpo?.error?.message ?? ''}`); continue; }
    const texto = (corpo.steps ?? []).flatMap((s) => s.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
    console.log(`== ${modelo}\n${texto}`);
    process.exit(0);
  }
  if (rodada < 4) { console.error(`Rodada ${rodada} sem resposta; nova tentativa em ${rodada * 30} s.`); await new Promise((r) => setTimeout(r, rodada * 30000)); }
}
process.exit(1);
