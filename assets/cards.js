// Garante que o título de cada card de projeto caiba inteiro dentro do retângulo:
// se passar da altura ou da largura, diminui a letra aos poucos.
(function () {
  function ajustar() {
    var titulos = document.querySelectorAll('.titulo-card');
    for (var i = 0; i < titulos.length; i++) {
      var t = titulos[i], card = t.parentElement;
      t.style.fontSize = '';
      var cs = getComputedStyle(card);
      var altura = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      var largura = card.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var tam = parseFloat(getComputedStyle(t).fontSize), limite = 0;
      while ((t.scrollHeight > altura * 0.9 || t.scrollWidth > largura) && tam > 10 && limite++ < 40) {
        tam *= 0.94;
        t.style.fontSize = tam + 'px';
      }
    }
  }
  var espera;
  ajustar();
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(ajustar, 100); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
})();
