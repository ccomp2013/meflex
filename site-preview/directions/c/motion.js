/* MeFlex, direction C: the page's quiet motion. Plain JavaScript, no libraries.
   1. Light: layers marked data-depth drift a little as you scroll: the opening photograph inside its frame, and
      the broad shafts of light crossing the wall behind each story (data-axis="x" drifts sideways).
   2. The dial: as you scroll into the live demo, a thin ring draws itself once around the real timer, then settles,
      and the timer inside takes over. It only ever draws forward.
   With prefers-reduced-motion: reduce, none of this runs: the layers stay put and the ring is shown complete. */
(function () {
  'use strict';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var layers = [].slice.call(document.querySelectorAll('[data-depth]'));
  var stage = document.querySelector('[data-ring]');
  var arc = stage && stage.querySelector('.dial-arc');
  var dot = stage && stage.querySelector('.dial-dot');
  var drawn = 0, ticking = false, on = false, MAX = 40;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function frame() {
    ticking = false;
    if (!on) return;
    var vh = window.innerHeight;
    for (var i = 0; i < layers.length; i++) {
      var el = layers[i], k = parseFloat(el.getAttribute('data-depth')) || 0;
      /* measure the untransformed parent, so the layer's own offset never feeds back into itself */
      var host = el.ownerSVGElement ? el.ownerSVGElement : el.parentNode;
      var r = host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var lim = parseFloat(el.getAttribute('data-max')) || MAX;
      var y = clamp(((r.top + r.height / 2) - vh / 2) * k, -lim, lim);
      if (el.ownerSVGElement) el.setAttribute('transform', 'translate(0 ' + (y * 2).toFixed(1) + ')');
      else if (el.getAttribute('data-axis') === 'x') el.style.transform = 'translate3d(' + (y * 2).toFixed(1) + 'px,0,0)';
      else el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }
    if (stage && drawn < 1) {
      var s = stage.getBoundingClientRect();
      var svg = stage.querySelector('.dial').getBoundingClientRect();
      var centre = svg.top + svg.height / 2;
      /* 0 when the stage enters at the bottom of the screen, 1 when the ring's centre reaches the middle */
      var p = clamp((vh - s.top) / Math.max(1, (vh - s.top) + (centre - vh / 2)), 0, 1);
      if (centre <= vh / 2) p = 1;
      if (p > drawn) {
        drawn = p;
        arc.style.strokeDashoffset = (1 - drawn).toFixed(4);
        var a = drawn * Math.PI * 2;
        dot.setAttribute('cx', (100 + 99 * Math.sin(a)).toFixed(2));
        dot.setAttribute('cy', (100 - 99 * Math.cos(a)).toFixed(2));
        stage.classList.toggle('is-drawing', drawn > 0.001);
        if (drawn >= 1) stage.classList.add('is-drawn');
      }
    }
  }

  function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }

  function start() {
    on = true; root.classList.add('motion');
    request();
  }
  function stop() {
    on = false; root.classList.remove('motion');
    layers.forEach(function (el) { if (el.ownerSVGElement) el.removeAttribute('transform'); else el.style.transform = ''; });
    if (arc) { arc.style.strokeDashoffset = ''; dot.setAttribute('cx', '100'); dot.setAttribute('cy', '1'); }
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  if (mq && mq.matches) stop(); else start();
  if (mq) {
    var onChange = function () { if (mq.matches) stop(); else { drawn = 0; start(); } };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
})();
