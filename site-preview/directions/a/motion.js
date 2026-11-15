/* MeFlex website, direction A: scroll-driven motion. Plain JavaScript, no libraries.
   1. The opening: the full-bleed photograph pulls back into a framed plate as you scroll. The plate is laid out by CSS
      at its final size; here it is scaled (non-uniformly) to cover the stage, and its inner picture is counter-scaled so
      it never stretches: a crop animated with transforms alone. The scrim, frame, shadow and caption rule follow --e.
   2. Quiet depth: elements with data-depth drift a little against the page as it scrolls.
   Only transforms and opacity change. A passive scroll listener schedules one requestAnimationFrame per frame.
   Nothing runs with prefers-reduced-motion: reduce (the page never gets html.motion then). */
(function () {
  'use strict';
  var html = document.documentElement;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var hero = document.querySelector('.opening');
  var stage = hero && hero.querySelector('.stage');
  var plate = hero && hero.querySelector('.plate');
  var inner = plate && plate.querySelector('.plate-in');
  var depthEls = [].slice.call(document.querySelectorAll('[data-depth]'));
  var geo = null, queued = false, active = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function clearStyles() {
    if (plate) { plate.style.transform = ''; inner.style.transform = ''; }
    if (stage) { stage.style.removeProperty('--e'); stage.style.removeProperty('--r'); stage.style.removeProperty('--b'); }
    depthEls.forEach(function (el) { el.style.transform = ''; });
  }

  /* Decide whether the moving opening fits this screen; measure the plate at its resting size. */
  function measure() {
    if (reduce.matches || !stage || !plate) { html.classList.remove('motion'); clearStyles(); active = false; return; }
    html.classList.add('motion'); clearStyles();
    var fits = window.innerHeight >= 600 && stage.scrollHeight <= stage.clientHeight + 1;
    if (!fits) { html.classList.remove('motion'); active = false; geo = null; return; }
    var s = stage.getBoundingClientRect(), p = plate.getBoundingClientRect();
    var words0 = hero.querySelector('.opening-text').getBoundingClientRect();
    /* on a narrow screen the words sit above the plate: they must never overlap it */
    if (window.matchMedia('(max-width: 59.99rem)').matches && words0.bottom + 16 > p.top) { html.classList.remove('motion'); active = false; geo = null; return; }
    /* The picture starts by covering a target: the whole stage on wide screens; on phones, an edge-to-edge band
       from just under the words to the plate's foot, so the words never sit on the photograph. */
    var t = { left: s.left, right: s.right, top: s.top, bottom: s.bottom };
    if (window.matchMedia('(max-width: 59.99rem)').matches) {
      var words = hero.querySelector('.opening-text').getBoundingClientRect();
      t = { left: s.left, right: s.right, top: Math.min(p.top, words.bottom + 24), bottom: p.bottom };
    }
    var tw = t.right - t.left, th = t.bottom - t.top;
    geo = {
      sx: tw / p.width, sy: th / p.height,
      tx: (t.left + tw / 2) - (p.left + p.width / 2),
      ty: (t.top + th / 2) - (p.top + p.height / 2),
      span: Math.max(1, hero.offsetHeight - stage.offsetHeight)
    };
    active = true;
  }

  function frame() {
    queued = false;
    if (!active) return;
    var vh = window.innerHeight;
    if (geo) {
      var top = hero.getBoundingClientRect().top;
      var e = ease(clamp(-top / (geo.span * .9), 0, 1)), k = 1 - e;
      var sx = geo.sx + (1 - geo.sx) * e, sy = geo.sy + (1 - geo.sy) * e, c = Math.max(sx, sy);
      plate.style.transform = 'translate3d(' + (geo.tx * k).toFixed(2) + 'px,' + (geo.ty * k).toFixed(2) + 'px,0) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
      inner.style.transform = 'scale(' + (c / sx).toFixed(4) + ',' + (c / sy).toFixed(4) + ')';
      stage.style.setProperty('--e', e.toFixed(3));
      stage.style.setProperty('--b', (1 - e * e * e).toFixed(3));
      stage.style.setProperty('--r', clamp(-top / (geo.span * .9) * 1.6 - .5, 0, 1).toFixed(3));
    }
    depthEls.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var d = parseFloat(el.getAttribute('data-depth')) || 0;
      var y = clamp(((r.top + r.height / 2) - vh / 2) * -d, -60, 60);
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }

  function request() { if (!queued) { queued = true; window.requestAnimationFrame(frame); } }

  function setup() { measure(); request(); }

  /* If the words in the pinned opening change size after load (text-spacing tools, zoom, late fonts), check again.
     The pinned stage must never clip its own text: when it no longer fits, the static opening takes over, and it is
     only tried again on a window resize, so the two layouts can never flip back and forth. */
  if (window.ResizeObserver && stage) {
    var watched = [hero.querySelector('.opening-text'), hero.querySelector('.plate-fig .cap')].filter(Boolean);
    var ro = new ResizeObserver(function () {
      if (!html.classList.contains('motion')) return;
      if (stage.scrollHeight > stage.clientHeight + 2) {
        html.classList.remove('motion'); clearStyles(); active = false; geo = null;
      }
    });
    watched.forEach(function (el) { ro.observe(el); });
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { window.requestAnimationFrame(setup); }, { passive: true });
  if (reduce.addEventListener) reduce.addEventListener('change', setup);
  setup();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
})();
