# -*- coding: utf-8 -*-
"""Aplica os ajustes pedidos no PDF da palestra."""
import pymupdf

SRC = "/root/.claude/uploads/c3329ad9-3d24-5490-833a-072be13a737b/91402f35-palestra-oticas-slides.pdf"
OUT = "palestra-oticas-slides-ajustado.pdf"

BG      = (0.969, 0.965, 0.949)
INK     = (0.086, 0.082, 0.059)
BODY    = (0.333, 0.322, 0.290)
MUTED   = (0.541, 0.522, 0.467)
TEAL    = (0.043, 0.372, 0.420)
AMBER   = (0.612, 0.345, 0.023)
CRIMSON = (0.698, 0.188, 0.322)
ROSEBG  = (0.984, 0.929, 0.941)
WHITE   = (1, 1, 1)

FONTS = {"i4": "ttf/inter-400.ttf", "i6": "ttf/inter-600.ttf", "i7": "ttf/inter-700.ttf",
         "fg": "ttf/familjen-grotesk-700.ttf"}
MEAS = {k: pymupdf.Font(fontfile=v) for k, v in FONTS.items()}

LS_FG  = 0.0034    # titulos Familjen Grotesk
LS_BAN = 0.016     # faixas de destaque
LS_EYE = 0.145     # eyebrows em caixa alta


def width(text, key, size, ls=0.0):
    n = max(len(text) - 1, 0)
    return MEAS[key].text_length(text, size) + ls * size * n


def prep(page):
    for a, p in FONTS.items():
        page.insert_font(fontname=a, fontfile=p)


_BGCACHE = {}


def page_bg(page):
    """Le a cor exata do fundo da pagina (varia 1/255 entre slides)."""
    k = id(page.parent), page.number
    if k not in _BGCACHE:
        col = BG
        for d in page.get_drawings():
            r = d["rect"]
            if d.get("fill") and r.width > 940 and r.height > 520:
                col = d["fill"]
                break
        _BGCACHE[k] = col
    return _BGCACHE[k]


def clear(page, x0, y0, x1, y1, fill=None):
    """Apaga de verdade: o texto sai do PDF, nao fica escondido sob um retangulo."""
    page.add_redact_annot(pymupdf.Rect(x0, y0, x1, y1), fill=False)
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE,
                          graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                          text=pymupdf.PDF_REDACT_TEXT_REMOVE)


def put(page, x, y, text, key, size, color, ls=0.0, center=None):
    prep(page)
    if center is not None:
        x = center - width(text, key, size, ls) / 2
    if ls == 0:
        page.insert_text((x, y), text, fontname=key, fontsize=size, color=color)
        return x + width(text, key, size)
    cx = x
    for ch in text:
        page.insert_text((cx, y), ch, fontname=key, fontsize=size, color=color)
        cx += MEAS[key].text_length(ch, size) + ls * size
    return cx


def wrap(text, key, size, maxw, ls=0.0):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if cur and width(t, key, size, ls) > maxw:
            lines.append(cur); cur = w
        else:
            cur = t
    if cur:
        lines.append(cur)
    return lines


def para(page, x, y0, text, key, size, color, maxw, lead, ls=0.0):
    ls_lines = wrap(text, key, size, maxw, ls)
    for i, ln in enumerate(ls_lines):
        put(page, x, y0 + i * lead, ln, key, size, color, ls)
    return len(ls_lines)


def rich(page, x, y0, chunks, size, maxw, lead):
    prep(page)
    """chunks = [(texto, key, cor)] fluindo como um paragrafo unico."""
    toks = []
    for txt, key, col in chunks:
        parts = txt.split(" ")
        for i, p in enumerate(parts):
            if p == "" and i: continue
            toks.append((p, key, col))
    cx, cy = x, y0
    space = {k: MEAS[k].text_length(" ", size) for k in FONTS}
    for i, (w, key, col) in enumerate(toks):
        ww = MEAS[key].text_length(w, size)
        if cx > x and cx + ww > x + maxw:
            cx, cy = x, cy + lead
        page.insert_text((cx, cy), w, fontname=key, fontsize=size, color=col)
        cx += ww + space[key]
    return cy


def note(page, x0, x1, top, chunks, size=9.87, lead=14.25,
         bar=CRIMSON, bg=ROSEBG, pad=9.0, maxw=None):
    """Caixa de nota no padrao do deck: barra colorida a esquerda + fundo claro."""
    key0 = chunks[0][1]
    asc = 0.906 * size
    inner_x = x0 + 12.06
    maxw = maxw or (x1 - inner_x - 12.0)
    # mede quantas linhas
    flat = " ".join(c[0] for c in chunks)
    nlines = len(wrap(flat, "i4", size, maxw))
    h = pad * 2 + asc + (nlines - 1) * lead + 0.216 * size
    bot = top + h
    rr = 6.0 / min(x1 - (x0 + 1.1), h) * 2      # draw_rect usa raio relativo
    page.draw_rect(pymupdf.Rect(x0 + 1.1, top, x1, bot), color=None, fill=bg,
                   width=0, radius=min(rr, 0.5))
    page.draw_rect(pymupdf.Rect(x0 + 1.1, top, x0 + 12, bot), color=None, fill=bg, width=0)
    page.draw_rect(pymupdf.Rect(x0, top, x0 + 2.3, top + h), color=None, fill=bar, width=0)
    rich(page, inner_x, top + pad + asc, chunks, size, maxw, lead)
    return h


def collapse(doc, tmp, idx, y_a, y_b, shift):
    """Remove a faixa vertical [y_a, y_b) da pagina e sobe o que esta abaixo."""
    doc.delete_page(idx)
    pg = doc.new_page(pno=idx, width=960, height=540)
    pg.draw_rect(pymupdf.Rect(0, 0, 960, 540), color=None, fill=page_bg(tmp[idx]), width=0)
    top = pymupdf.Rect(0, 0, 960, y_a)
    pg.show_pdf_page(top, tmp, idx, clip=top)
    bot = pymupdf.Rect(0, y_b, 960, 540)
    pg.show_pdf_page(pymupdf.Rect(0, y_b - shift, 960, 540 - shift), tmp, idx, clip=bot)


# ----------------------------------------------------------------------------
def main():
    doc = pymupdf.open(SRC)
    for p in doc:
        p.delete_annot  # noqa
        for a in list(p.annots()):
            p.delete_annot(a)
        prep(p)

    P = lambda n: doc[n - 1]

    # ===== AMARELO: remover =========================================
    clear(P(1), 32.5, 301.5, 512, 347)
    clear(P(2), 32.5, 165.5, 586, 204)

    pg = P(3)                                   # "de plaqueta" sai da frase
    clear(pg, 140, 391.0, 295, 405)
    put(pg, 0, 400.50, "para fazer um ajuste.", "i4", 9.26, BODY, center=216.1)

    # ===== DOURADO: reescrever ======================================
    pg = P(20)
    clear(pg, 32.5, 130.5, 930, 168)
    para(pg, 34.24, 144.75,
         "Vocês perguntaram como usar a identidade visual na prática. Ela aparece em cinco "
         "lugares do seu perfil, e ajustar esses cinco já muda a impressão que a pessoa tem da loja.",
         "i4", 11.48, BODY, 562, 18)

    pg = P(21)
    clear(pg, 32.5, 157.5, 930, 195)
    para(pg, 34.24, 171.75,
         "Os dois lados custaram o mesmo e deram o mesmo trabalho. A diferença é que, no lado "
         "direito, alguém escolheu as cores e a fonte uma vez e repetiu em todos os posts.",
         "i4", 11.48, BODY, 562, 18)

    pg = P(30)
    clear(pg, 32.5, 152, 930, 187)
    put(pg, 34.24, 177.75,
        "Quatro números importam. Os outros não mudam a sua semana.",
        "fg", 24.17, INK, LS_FG)

    pg = P(33)                                   # faixa preta
    clear(pg, 40, 393, 921, 421, fill=INK)
    put(pg, 45.82, 410.25,
        "Não corra atrás de atualização. Quem entende o que o Instagram premia aprende a "
        "novidade em dez minutos.", "fg", 13.09, WHITE, LS_BAN)

    pg = P(34)
    clear(pg, 162, 245.5, 620, 292)
    para(pg, 164.60, 263.25,
         "A pergunta mais difícil do briefing: até onde o dono deve aparecer no perfil da loja.",
         "i4", 14.30, BODY, 445, 21.75)

    pg = P(35)
    clear(pg, 51.5, 297.5, 320, 312.5, fill=WHITE)
    put(pg, 53.40, 308.25, "Pergunta enviada no briefing do Núcleo de Ótica da ACIC",
        "i4", 8.06, MUTED)

    pg = P(38)
    clear(pg, 32.5, 164.5, 930, 201)
    para(pg, 34.24, 178.50,
         "Duas colunas, com situações reais de loja. A da esquerda é onde nasce a fidelização "
         "que vocês perguntaram. A da direita tira o foco do negócio, às vezes sem ninguém perceber.",
         "i4", 11.48, BODY, 562, 18)

    pg = P(40)                                   # faixa teal
    clear(pg, 40, 381, 921, 408, fill=TEAL)
    put(pg, 45.82, 398.25,
        "Em trinta dias a sua ótica já fica à frente da maior parte dos perfis da cidade. "
        "Não por ser genial: por ser constante.", "fg", 13.09, WHITE, LS_BAN)

    pg = P(42)
    clear(pg, 32.5, 377.5, 930, 392)
    put(pg, 34.24, 387.75,
        "É gestão mensal de redes sociais no tamanho da sua loja: sem contrato de agência "
        "grande e sem relatório que ninguém lê.", "i4", 8.06, MUTED)
    clear(pg, 268.5, 317.5, 474, 361, fill=WHITE)
    para(pg, 270.10, 330.00,
         "As cores, a fonte e as capas definidas uma vez e usadas sempre iguais, para a grade "
         "parar de parecer improviso.", "i4", 9.06, BODY, 195, 13.5)
    clear(pg, 493.5, 317.5, 699, 361, fill=WHITE)
    para(pg, 495.10, 330.00,
         "Anúncio só para quem está perto, começando por quem já conhece a loja. "
         "Verba acompanhada de perto.", "i4", 9.06, BODY, 195, 13.5)

    # ===== VERMELHO: dar destaque ===================================
    pg = P(19)     # negrito + tinta no trecho marcado, dentro da caixa ambar
    clear(pg, 873.5, 390, 921, 403)
    put(pg, 875.42, 399.75, "Então", "i7", 9.87, INK)
    clear(pg, 44, 404, 921, 418, fill=(0.984, 0.941, 0.878))
    put(pg, 46.56, 414.00,
        "ele julga o que consegue ver: a vitrine, o atendimento e o seu perfil. "
        "Perfil organizado parece loja organizada, e loja organizada parece confiável.",
        "i7", 9.87, INK)

    pg = P(27)     # rodape minusculo vira caixa de destaque
    clear(pg, 32.5, 408, 930, 428)
    note(pg, 34.5, 925.5, 412.5,
         [("E o objetivo do anúncio, sempre.", "i7", CRIMSON),
          ("Mensagem no WhatsApp, chamada no Direct ou visita ao perfil. "
           "Nunca “mais curtidas”.", "i4", INK)])

    pg = P(33)
    clear(pg, 32.5, 428, 930, 448)
    note(pg, 34.5, 925.5, 432.0,
         [("Como acompanhar as mudanças.", "i7", CRIMSON),
          ("O próprio aplicativo avisa das novidades no painel profissional. Uma olhada por "
           "mês resolve, e é mais confiável que vídeo de guru anunciando que o Instagram "
           "mudou tudo de novo.", "i4", INK)])

    # ===== renumeracao das regras (o slide 26 saiu) =================
    pg = P(23)
    clear(pg, 163, 235, 618, 303)
    para(pg, 165.88, 252.75,
         "Três regras de bolso. Elas não substituem um profissional, mas evitam a maior parte "
         "do dinheiro que se perde apertando o botão azul.",
         "i4", 14.30, BODY, 445, 21.75)

    pg = P(27)
    clear(pg, 32.5, 129, 630, 163)
    put(pg, 34.24, 154.50, "Regra 2: comece pelo público quente, não pelo frio.",
        "fg", 24.17, INK, LS_FG)
    clear(pg, 204.8, 113.5, 213.5, 126.5)
    put(pg, 205.67, 123.00, "2", "i7", 7.35, TEAL)

    pg = P(28)
    clear(pg, 32.5, 137, 665, 171)
    put(pg, 34.24, 162.75, "Regra 3: pouco por vários dias vence muito em um dia.",
        "fg", 24.17, INK, LS_FG)
    clear(pg, 204.8, 121.5, 213.5, 134.5)
    put(pg, 205.67, 131.25, "3", "i7", 7.35, TEAL)

    # ===== fecha os buracos deixados pelas frases removidas =========
    tmp = pymupdf.open("pdf", doc.tobytes())
    collapse(doc, tmp, 0, 298, 356, 46)     # capa
    collapse(doc, tmp, 1, 166, 205, 24)     # abertura

    # ===== remocao de slides + slides novos =========================
    drop = [14, 16, 22, 26, 31, 37, 39, 41, 43, 44]
    doc.delete_pages([n - 1 for n in drop])

    novos = pymupdf.open("novos.pdf")
    doc.insert_pdf(novos)
    doc.set_metadata({"title": "Marketing no Instagram para óticas | Núcleo de Ótica ACIC",
                      "author": "Marina Oliveira"})
    doc.save(OUT, garbage=4, deflate=True)
    print("paginas finais:", doc.page_count)


if __name__ == "__main__":
    main()
