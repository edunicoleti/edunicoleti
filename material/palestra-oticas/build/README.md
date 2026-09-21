# Palestra "Marketing no Instagram para óticas" — versão ajustada

`../palestra-oticas-slides-ajustado.pdf` é o deck final: 37 slides, 960×540pt.
Ele foi gerado a partir do PDF original de 44 slides, com os ajustes marcados
no próprio arquivo (realces amarelo, dourado e vermelho).

## O que o build faz

`build.py` abre o PDF original, aplica as edições slide a slide e cola no fim
os três slides novos, que vêm de `novos.html`.

As edições de texto usam **redação real** (`apply_redactions`), não retângulo
por cima: o texto removido sai do arquivo e não aparece mais em busca nem em
seleção.

## Tipografia do deck

O PDF original foi impresso pelo Chrome e traz as fontes como Type3, que não
dá para reaproveitar. As famílias foram identificadas por métrica e conferidas
glifo a glifo:

| uso                          | fonte                    | tamanho | tracking |
|------------------------------|--------------------------|---------|----------|
| títulos (H1)                 | Familjen Grotesk 700     | 24,17pt | +0,0034em |
| faixas de destaque           | Familjen Grotesk 700     | 13,09pt | +0,016em  |
| corpo, subtítulos, rodapés   | Inter 400                | vários  | 0         |
| negrito dentro do corpo      | Inter 700                | vários  | 0         |
| eyebrows em caixa alta       | Inter 700                | 7,35pt  | +0,145em  |

Paleta: fundo `#F7F6F2`, tinta `#16150F`, corpo `#55524A`, rodapé `#8A8577`,
teal `#0B5F6B`, âmbar `#9C580B` sobre `#FBF0E0`, crimson `#B23052`.
Subtítulos quebram em 562pt; subtítulos de capa de bloco, em 445pt.

## Como regerar

```bash
pip install pymupdf segno

# fontes (SIL OFL), a partir do npm
npm pack @fontsource/inter @fontsource/familjen-grotesk
# extraia os .woff de files/ e converta para ttf/ com fontTools:
#   inter-400 inter-600 inter-700 familjen-grotesk-700

# slides novos -> novos.pdf
chromium --headless --no-pdf-header-footer \
  --print-to-pdf=novos.pdf file://$PWD/novos.html

# deck final
python3 build.py
```

`build.py` espera o PDF original no caminho da constante `SRC` e escreve
`palestra-oticas-slides-ajustado.pdf` no diretório atual.

## QR codes

Gerados com `segno` e conferidos no PDF final:

- `qr_form.svg` → https://forms.gle/KXqDzq3fVp2oUsCQ8 (inscrição para a análise)
- `qr_wa.svg` → https://wa.me/5549999352131 (WhatsApp)
