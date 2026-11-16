// Ajusta o texto de cada estrela (slide 4) para caber dentro do desenho dela.
// Mede cada linha de texto e diminui a letra até todas ficarem dentro da estrela,
// funcionando em qualquer tamanho de tela e com qualquer fonte.
(function () {
  // Pontas da estrela (mesmos pontos do desenho), um pouco encolhidas para dar folga da borda
  var BASE = [[50,6],[61.4,36.4],[93.7,37.8],[68.4,58],[77,89.2],[50,71.3],[23,89.2],[31.6,58],[6.3,37.8],[38.6,36.4]];
  var FOLGA = 0.9, CX = 50, CY = 52;
  var PONTOS = BASE.map(function (p) { return [CX + (p[0] - CX) * FOLGA, CY + (p[1] - CY) * FOLGA]; });

  function dentro(x, y) {
    var c = false;
    for (var i = 0, j = PONTOS.length - 1; i < PONTOS.length; j = i++) {
      var xi = PONTOS[i][0], yi = PONTOS[i][1], xj = PONTOS[j][0], yj = PONTOS[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  function cabe(link, texto) {
    var a = link.getBoundingClientRect();
    if (!a.width) return true;
    var r = document.createRange();
    r.selectNodeContents(texto);
    var linhas = r.getClientRects();
    for (var k = 0; k < linhas.length; k++) {
      var q = linhas[k];
      if (q.width < 1) continue;
      var cantos = [[q.left, q.top], [q.right, q.top], [q.left, q.bottom], [q.right, q.bottom]];
      for (var m = 0; m < 4; m++) {
        var x = (cantos[m][0] - a.left) / a.width * 100;
        var y = (cantos[m][1] - a.top) / a.height * 100;
        if (!dentro(x, y)) return false;
      }
    }
    return true;
  }

  // Testa o texto em algumas alturas dentro da estrela e fica com a primeira que cabe
  var ALTURAS = [46, 44, 48, 42, 50, 40];
  function posicionar(link, texto) {
    for (var h = 0; h < ALTURAS.length; h++) {
      texto.style.top = ALTURAS[h] + '%';
      if (cabe(link, texto)) return true;
    }
    texto.style.top = '';
    return false;
  }

  function ajustar() {
    var links = document.querySelectorAll('.estrela-link');
    var menor = Infinity;
    for (var i = 0; i < links.length; i++) {
      var link = links[i], texto = link.querySelector('span');
      if (!texto) continue;
      link.style.transform = 'none';           // mede sem o efeito de passar o mouse
      texto.style.fontSize = '';               // volta ao tamanho do CSS
      texto.style.top = '';
      var tam = parseFloat(getComputedStyle(texto).fontSize);
      var limite = 0;
      while (!posicionar(link, texto) && tam > 6 && limite++ < 40) {
        tam *= 0.95;
        texto.style.fontSize = tam + 'px';
      }
      link.style.transform = '';
      menor = Math.min(menor, tam);
    }
    // todas as estrelas com o mesmo tamanho de letra (o menor que coube)
    for (var n = 0; n < links.length; n++) {
      var t = links[n].querySelector('span');
      if (t && isFinite(menor)) { t.style.fontSize = menor + 'px'; posicionar(links[n], t); }
    }
  }

  var espera;
  function agendar() { clearTimeout(espera); espera = setTimeout(ajustar, 100); }

  ajustar();
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', agendar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
})();
