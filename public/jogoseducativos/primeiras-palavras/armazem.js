/*
  Guarda as fotos e vozes de casa no próprio aparelho (IndexedDB).
  Nada sai do iPad: não existe servidor por trás disso.

  Um registro por coisa da cena:
    { id, palavra?, casa?, ordem?, foto?, voz? }
      foto: dataURL JPEG já recortado (quadrado)
      voz:  { dados: ArrayBuffer, tipo, inicio, fim, ganho }
            inicio/fim (s) cortam o silêncio das pontas; ganho nivela o volume
      casa: true para as "coisas da casa" criadas pelo adulto (viram balões)

  Atenção: no iPad, o Safari e o atalho da Tela de Início guardam dados em
  lugares separados. Fotos enviadas em um não aparecem no outro.

  Se o IndexedDB não estiver disponível (aba privada, por exemplo), cai para a
  memória: funciona até fechar a página.
*/
(function () {
  'use strict';

  var NOME = 'jogoseducativos', LOJA = 'itens';
  var memoria = {}, usarMemoria = false, promessaBanco = null;

  function banco() {
    if (promessaBanco) return promessaBanco;
    promessaBanco = new Promise(function (ok, erro) {
      if (!window.indexedDB) { erro(new Error('sem IndexedDB')); return; }
      var pedido;
      try { pedido = window.indexedDB.open(NOME, 1); } catch (e) { erro(e); return; }
      pedido.onupgradeneeded = function () { pedido.result.createObjectStore(LOJA, { keyPath: 'id' }); };
      pedido.onsuccess = function () { ok(pedido.result); };
      pedido.onerror = function () { erro(pedido.error); };
      pedido.onblocked = function () { erro(new Error('banco bloqueado')); };
    }).catch(function () { usarMemoria = true; return null; });
    return promessaBanco;
  }

  function operar(modo, fazer) {
    return banco().then(function (bd) {
      if (!bd) return fazer(null);
      return new Promise(function (ok, erro) {
        var t = bd.transaction(LOJA, modo), resposta;
        var pedido = fazer(t.objectStore(LOJA));
        if (pedido) pedido.onsuccess = function () { resposta = pedido.result; };
        t.oncomplete = function () { ok(resposta); };
        t.onerror = t.onabort = function () { erro(t.error); };
      });
    });
  }

  function todos() {
    return operar('readonly', function (loja) {
      if (!loja) return Object.keys(memoria).map(function (k) { return memoria[k]; });
      return loja.getAll ? loja.getAll() : null;
    }).then(function (lista) { return lista || []; }).catch(function () { return []; });
  }

  function salvar(registro) {
    /* Pede ao navegador para não apagar estes dados quando faltar espaço. */
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    return operar('readwrite', function (loja) {
      if (!loja) { memoria[registro.id] = registro; return null; }
      return loja.put(registro);
    });
  }

  function apagar(id) {
    return operar('readwrite', function (loja) {
      if (!loja) { delete memoria[id]; return null; }
      return loja.delete(id);
    });
  }

  window.JE_ARMAZEM = {
    todos: todos, salvar: salvar, apagar: apagar,
    soMemoria: function () { return usarMemoria; }
  };
})();
