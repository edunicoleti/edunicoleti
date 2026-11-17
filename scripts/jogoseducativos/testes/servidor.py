"""Servidor local que imita a Hostinger: aplica os 'Header always set' de cada
.htaccess no caminho do arquivo pedido (o mais fundo vence), inclusive a CSP e
a Permissions-Policy do site.

Por que existe: um teste em servidor comum (python -m http.server, vite) não
tem esses cabeçalhos e deixa passar erros que só aparecem em produção. Foi
assim que o envio de foto quebrou no ar (a CSP bloqueava blob:) com os testes
todos verdes.

Uso: python3 scripts/jogoseducativos/testes/servidor.py [pasta] [porta]
     padrão: pasta public, porta 8770
"""
import http.server
import os
import re
import sys

RAIZ = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else 'public')
PORTA = int(sys.argv[2]) if len(sys.argv) > 2 else 8770
PADRAO = re.compile(r'^\s*Header\s+always\s+set\s+(\S+)\s+"(.*)"\s*$')


def cabecalhos(caminho_arquivo):
    h, pasta, pastas = {}, os.path.dirname(caminho_arquivo), []
    while pasta.startswith(RAIZ):
        pastas.append(pasta)
        if pasta == RAIZ:
            break
        pasta = os.path.dirname(pasta)
    for pasta in reversed(pastas):
        f = os.path.join(pasta, '.htaccess')
        if os.path.exists(f):
            for linha in open(f, encoding='utf8'):
                m = PADRAO.match(linha)
                if m and 'env=' not in linha:
                    h[m.group(1)] = m.group(2)
    return h


class Pedido(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def end_headers(self):
        p = self.translate_path(self.path)
        if os.path.isdir(p):
            p = os.path.join(p, 'index.html')
        for k, v in cabecalhos(p).items():
            self.send_header(k, v)
        super().end_headers()

    def log_message(self, *a):
        pass


print(f'Servindo {RAIZ} em http://127.0.0.1:{PORTA} com os cabeçalhos dos .htaccess')
http.server.ThreadingHTTPServer(('127.0.0.1', PORTA), Pedido).serve_forever()
