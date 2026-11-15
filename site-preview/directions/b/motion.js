/* MeFlex website, direction B: scroll motion. Plain JavaScript, no libraries.
   - Always (it is layout, not motion): fits the blue line exactly between the first and last face-off spot.
   - Only while the visitor allows motion (not prefers-reduced-motion: reduce, watched for changes mid-visit): adds
     html.motion, then on scroll (one passive listener, work batched into requestAnimationFrame) moves the opening
     photo's layers at different depths, draws the blue line down through the five stretches and lights each one as
     the line reaches it (once drawn, it stays drawn), and lifts the phone onto the ice; the face-off circle draws
     itself once it is in view (IntersectionObserver). With reduced motion or without JavaScript, every line is drawn
     and nothing moves. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var wrap = doc.querySelector('[data-line]');
  var line = wrap && wrap.querySelector('.blue-line');
  var draw = wrap && wrap.querySelector('.bl-draw');
  var stations = wrap ? [].slice.call(wrap.querySelectorAll('.station')) : [];
  var spots = stations.map(function (s) { return s.querySelector('.spot'); });
  var layers = [].slice.call(doc.querySelectorAll('[data-depth]'));
  var hero = doc.querySelector('.open');
  var riser = doc.querySelector('[data-rise]');
  var riseZone = doc.querySelector('.ice');
  var face = doc.querySelector('[data-draw]');
  var geo = { top: 0, len: 1, centres: [] };
  var moving = false, queued = false, lineP = 0, riseT = 0, io = null;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function measure() {
    if (!wrap || !spots.length) return;
    var w = wrap.getBoundingClientRect();
    geo.centres = spots.map(function (s) { var r = s.getBoundingClientRect(); return r.top + r.height / 2 - w.top; });
    geo.top = geo.centres[0];
    geo.len = Math.max(1, geo.centres[geo.centres.length - 1] - geo.top);
    line.style.top = geo.top + 'px';
    line.style.bottom = 'auto';
    line.style.height = geo.len + 'px';
  }

  function update() {
    queued = false;
    if (!moving) return;
    var vh = window.innerHeight;

    // 1. the opening: deeper layers fall behind as you scroll away
    var y = window.pageYOffset;
    if (hero && y < hero.offsetHeight + 200) {
      layers.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * parseFloat(el.getAttribute('data-depth'))).toFixed(1) + 'px,0)'; });
    }

    // 2. the blue line: its head sits a little below the middle of the screen; it only ever moves forward
    if (wrap) {
      var w = wrap.getBoundingClientRect(), head = vh * 0.6 - w.top;
      lineP = Math.max(lineP, clamp((head - geo.top) / geo.len));
      draw.style.strokeDashoffset = (100 * (1 - lineP)).toFixed(2);
      var reach = geo.top + lineP * geo.len;
      for (var i = 0; i < stations.length; i++) stations[i].classList.toggle('is-on', reach >= geo.centres[i] - 2);
    }

    // the phone rises onto the ice as the sheet comes up
    if (riser && riseZone) {
      var r = riseZone.getBoundingClientRect();
      riseT = Math.max(riseT, ease(clamp((vh - r.top) / (vh * 0.95))));
      riser.style.transform = 'translate3d(0,' + ((1 - riseT) * 160).toFixed(1) + 'px,0)';
    }
  }

  function queue() { if (!queued) { queued = true; window.requestAnimationFrame(update); } }
  function relayout() { measure(); queue(); }

  function start() {
    if (moving) return;
    moving = true; root.classList.add('motion');
    window.addEventListener('scroll', queue, { passive: true });
    update();
    if (face && !face.classList.contains('is-drawn')) {
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { face.classList.add('is-drawn'); io.disconnect(); io = null; } });
        }, { threshold: 0.3 });
        io.observe(face);
      } else face.classList.add('is-drawn');
    }
  }

  // reduced motion switched on mid-visit: stop, put everything where it rests, show every line complete
  function stop() {
    moving = false; root.classList.remove('motion');
    window.removeEventListener('scroll', queue);
    if (io) { io.disconnect(); io = null; }
    layers.concat(riser ? [riser] : []).forEach(function (el) { el.style.transform = ''; });
    if (draw) draw.style.strokeDashoffset = '';
    stations.forEach(function (s) { s.classList.add('is-on'); });
    if (face) face.classList.add('is-drawn');
  }

  function decide() { if (reduce && reduce.matches) stop(); else start(); }

  measure();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);
  window.addEventListener('resize', relayout, { passive: true });
  decide();
  if (reduce) {
    if (reduce.addEventListener) reduce.addEventListener('change', decide);
    else if (reduce.addListener) reduce.addListener(decide);
  }
})();
