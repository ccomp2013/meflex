/* MeFlex website, all three directions: the live demo. One real 30-second Low Lunge hold with the app's timer ring
   and traced figure. Plain JavaScript, no libraries. Behaves like the app's player:
   - wall-clock timing (Date.now), so a busy page or a locked phone never slows the clock;
   - the ring starts empty and fills as the hold goes on (the app's decided look);
   - one row of controls like the app's player: Start again (icon), Start / Pause / Resume / Other side, Sound (icon);
     after the hold, the main button switches to the other side (the figure is mirrored, as in the app);
   - no sound until the visitor turns it on; then a soft chime at the start and the end, made like the app's "Soft" chime;
   - VoiceOver hears the start, pause (with the time left), the last 10 seconds and the finish, not every second, and can
     read the time left at any moment from a hidden line that isn't a live region (review, Nov 15);
   - with Reduce Motion the figure doesn't ease in; with JavaScript off the still version in the page stays as it is.
   Markup contract: an element with [data-mf-demo] holding .mf-ring-fill (an SVG circle with pathLength="1000"),
   .mf-time, .mf-left, .mf-side, .mf-figure, .mf-controls (hidden in the page until this script shows it), .mf-live and .mf-still.
*/
(function () {
  'use strict';
  var root = document.querySelector('[data-mf-demo]');
  if (!root) return;
  var SECONDS = 30, SIDES = ['Left leg forward', 'Right leg forward'];
  var $ = function (s) { return root.querySelector(s); };
  var fill = $('.mf-ring-fill'), timeEl = $('.mf-time'), leftEl = $('.mf-left'), sideEl = $('.mf-side'), fig = $('.mf-figure');
  var controls = $('.mf-controls'), live = $('.mf-live'), still = $('.mf-still');
  var playBtn = $('.mf-play'), againBtn = $('.mf-again'), soundBtn = $('.mf-sound');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  var state = 'ready', side = 0, startAt = 0, heldMs = 0, raf = 0, lastShown = -1, said10 = false, sayTimer = 0, sayQueue = [];
  var soundOn = false, audio = null;

  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function secsWord(n) { return n === 1 ? '1 second' : n + ' seconds'; }
  /* messages said close together are joined, never lost (review, Nov 15) */
  function say(text) {
    sayQueue.push(text); window.clearTimeout(sayTimer); live.textContent = '';
    sayTimer = window.setTimeout(function () { live.textContent = sayQueue.join(' '); sayQueue = []; }, 60);
  }

  function chime() {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      var t = audio.currentTime, base = 523.25, parts = [[1, 1], [2, 0.22], [3.01, 0.06]];
      parts.forEach(function (p) {
        var o = audio.createOscillator(), g = audio.createGain();
        o.type = 'sine'; o.frequency.value = base * p[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4 * p[1], t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
        o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + 1);
      });
    } catch (e) { /* no audio on this device: the demo works silently */ }
  }

  function heldNow() { return state === 'running' ? heldMs + (Date.now() - startAt) : heldMs; }

  function draw() {
    var ms = Math.min(heldNow(), SECONDS * 1000);
    fill.style.strokeDashoffset = String(1000 - Math.round(1000 * ms / (SECONDS * 1000)));
    var left = Math.ceil((SECONDS * 1000 - ms) / 1000);
    if (left !== lastShown) { timeEl.textContent = fmt(left); if (leftEl) leftEl.textContent = secsWord(left) + ' left'; lastShown = left; }
    if (state === 'running' && left <= 10 && !said10) { said10 = true; say('10 seconds left.'); }
    if (state === 'running' && ms >= SECONDS * 1000) finish();
  }

  function loop() { draw(); if (state === 'running') raf = window.requestAnimationFrame(loop); }

  function setPlay(label) { playBtn.querySelector('.mf-play-label').textContent = label; }
  function leftNow() { return Math.ceil((SECONDS * 1000 - Math.min(heldNow(), SECONDS * 1000)) / 1000); }

  function start() {
    if (state === 'done') reset(side);
    state = 'running'; startAt = Date.now(); root.classList.add('is-running'); root.classList.remove('is-paused', 'is-done');
    if (heldMs === 0) {
      root.classList.remove('is-moving'); void fig.offsetWidth;
      if (!(reduce && reduce.matches)) root.classList.add('is-moving');
      chime(); say('Started. ' + SIDES[side] + '. 30 seconds.');
    } else { var l = leftNow(); if (l <= 10) said10 = true; say('Resumed, ' + secsWord(l) + ' left.'); }
    setPlay('Pause');
    loop();
  }

  function pause() {
    heldMs = heldNow(); state = 'paused'; window.cancelAnimationFrame(raf);
    root.classList.remove('is-running'); root.classList.add('is-paused');
    sideEl.textContent = 'Paused, ' + SIDES[side].charAt(0).toLowerCase() + SIDES[side].slice(1);
    setPlay('Resume'); say('Paused, ' + secsWord(leftNow()) + ' left.');
  }

  function finish() {
    heldMs = SECONDS * 1000; state = 'done'; window.cancelAnimationFrame(raf); draw();
    root.classList.remove('is-running', 'is-paused'); root.classList.add('is-done');
    sideEl.textContent = 'Nice work!'; setPlay('Other side');
    chime(); say('Nice work! 30 seconds done. The main button now starts the other side.');
  }

  function reset(toSide) {
    window.cancelAnimationFrame(raf); state = 'ready'; heldMs = 0; lastShown = -1; said10 = false; side = toSide;
    root.classList.remove('is-running', 'is-paused', 'is-done', 'is-moving');
    root.classList.toggle('is-mirrored', side === 1);
    sideEl.textContent = SIDES[side]; setPlay('Start'); draw();
  }

  playBtn.addEventListener('click', function () {
    if (state === 'running') pause();
    else if (state === 'done') { reset(side === 0 ? 1 : 0); start(); }
    else { if (state === 'paused') sideEl.textContent = SIDES[side]; start(); }
  });
  againBtn.addEventListener('click', function () { reset(side); say('Ready. ' + SIDES[side] + '.'); playBtn.focus(); });
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn; soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    if (soundOn) chime();
  });

  /* show the working demo in place of the still */
  controls.hidden = false; if (still) still.hidden = true; root.classList.add('is-live');
  reset(0);
})();
