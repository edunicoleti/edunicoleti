/*
  Gera as vozes dos jogos educativos com a API do Gemini (texto para fala).

  Uso:
    GEMINI_API_KEY=... node scripts/jogoseducativos/gerar-audio.mjs            # gera o que falta
    GEMINI_API_KEY=... node scripts/jogoseducativos/gerar-audio.mjs bola agua  # só estas
    node scripts/jogoseducativos/gerar-audio.mjs --tratar                      # só refaz os mp3 a partir dos wav

  O que ele faz, por palavra:
    1. pede a fala ao Gemini e guarda o original em scripts/jogoseducativos/vozes/<id>.wav
    2. corta o silêncio das pontas, nivela o volume e grava
       public/jogoseducativos/audio/<id>.mp3 (precisa do ffmpeg instalado)

  Cuidados:
  - A chave NUNCA entra no repositório (ele é público). O site só usa os mp3
    prontos; nenhuma chamada ao Gemini acontece no iPad.
  - No plano gratuito cada modelo de voz tem cota própria e pequena (10 pedidos
    por dia no gemini-3.8-flash-tts; 3 por minuto no lite). Por isso o script
    pula o que já tem wav e o original fica versionado.
  - O estilo vai em speech_metadata.style, separado do texto. Se a instrução
    for escrita junto do texto, o modelo lê a instrução em voz alta.
*/
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* Papai e Mamãe saíram do gemini-3.8-flash-tts; as demais, do lite, que tem
   cota gratuita separada. Mesma voz e mesmo estilo: soam iguais. */
const MODELO = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';
const VOZ = 'Sulafat'; // "warm": a mais calma e clara no teste com Papai e Mamãe
const ESTILO =
  'mãe brasileira carinhosa falando com seu bebê de um ano: bem devagar, voz doce, calma e sorridente, melodia suave, sílabas bem claras';

/* Uma palavra isolada por arquivo. O id vira o nome do arquivo.
   Confira sempre o resultado: "Bebê." saiu como "vevê" e "Bebê!" como "pepê";
   só "Bê-bê." deu os dois B claros. */
const PALAVRAS = [
  { id: 'papai', texto: 'Papai.' },
  { id: 'mamae', texto: 'Mamãe.' },
  { id: 'bebe', texto: 'Bê-bê.' },
  { id: 'bola', texto: 'Bola.' },
  { id: 'pato', texto: 'Pato.' },
  { id: 'au-au', texto: 'Au-au.' },
  { id: 'banana', texto: 'Banana.' },
  // Próximas (ver docs/jogoseducativos-plano.md):
  // { id: 'agua', texto: 'Água.' },
  // { id: 'miau', texto: 'Miau.' },
  // { id: 'pe', texto: 'Pé.' },
  // { id: 'mao', texto: 'Mão.' },
  // { id: 'pao', texto: 'Pão.' },
];

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pastaWav = join(raiz, 'scripts', 'jogoseducativos', 'vozes');
const pastaMp3 = join(raiz, 'public', 'jogoseducativos', 'audio');
mkdirSync(pastaWav, { recursive: true });
mkdirSync(pastaMp3, { recursive: true });

async function pedirFala(texto) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) throw new Error('Defina GEMINI_API_KEY no ambiente.');
  const resposta = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': chave, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO,
      input: [{
        type: 'user_input',
        content: [{ type: 'text', text: texto, annotations: [{ type: 'speech_metadata', style: ESTILO }] }],
      }],
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice: VOZ }] },
    }),
  });
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(`Gemini respondeu ${resposta.status}: ${corpo?.error?.message ?? 'sem mensagem'}`);
  for (const passo of corpo.steps ?? []) {
    for (const parte of passo.content ?? []) {
      if (parte.type === 'audio') return Buffer.from(parte.data, 'base64'); // WAV 24 kHz mono
    }
  }
  throw new Error('A resposta do Gemini veio sem áudio.');
}

/* Corta silêncio no começo e no fim, nivela o pico e suaviza as pontas. */
function tratar(wav, mp3) {
  const corte = 'silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.04';
  const filtro = [
    corte, 'areverse', corte, 'areverse',
    'apad=pad_dur=0.12',
    'loudnorm=I=-17:TP=-1.5:LRA=11',
    'afade=t=in:d=0.012',
    'areverse', 'afade=t=in:d=0.12', 'areverse',
  ].join(',');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-af', filtro, '-ar', '24000', '-ac', '1',
    '-c:a', 'libmp3lame', '-q:a', '2', mp3]);
}

const args = process.argv.slice(2);
const soTratar = args.includes('--tratar');
const pedidas = args.filter((a) => !a.startsWith('--'));
const lista = pedidas.length ? PALAVRAS.filter((p) => pedidas.includes(p.id)) : PALAVRAS;
if (!lista.length) {
  console.error('Nenhuma palavra encontrada. Ids disponíveis:', PALAVRAS.map((p) => p.id).join(', '));
  process.exit(1);
}

for (const { id, texto } of lista) {
  const wav = join(pastaWav, `${id}.wav`);
  const mp3 = join(pastaMp3, `${id}.mp3`);
  if (!existsSync(wav)) {
    if (soTratar) { console.log(`${id}: sem wav original, pulei`); continue; }
    writeFileSync(wav, await pedirFala(texto));
    console.log(`${id}: voz gerada`);
  }
  tratar(wav, mp3);
  console.log(`${id}: ${mp3}`);
}
