/* AI Office Company homepage: animation only. All copy is in index.html; this script toggles
 * state classes on it. Visitors who prefer reduced motion get the final state of every animation.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---- desktop scaling: the desktop design is drawn at 1440px -------------------------------
  var main = $('main');
  function fit() {
    var w = doc.clientWidth;
    if (w >= 1024 && w < 1440) { main.style.width = '1440px'; main.style.zoom = String(w / 1440); }
    else { main.style.width = ''; main.style.zoom = ''; }
  }
  fit();
  window.addEventListener('resize', fit);

  // ---- hero demo: a generic AI gets it wrong twice, then works from the Vault ---------------
  var anim = $('.hero-anim');
  var stories = $$('.story', anim), drawers = $$('.drawer', anim);
  var HUES = ['teal', 'amber', 'violet', 'coral'];  // one per story, tokens in site.css
  var FLAGS = ['q1', 'a1', 't1', 'q2', 't2', 'vault', 'open', 'chip'];
  var STEPS = [470, 870, 1270, 1730, 2130, 2600, 3070, 3470], HOLD = 7470;  // finished chat stays ~4s before the next story
  var timers = [];

  function setHero(sc, ph) {
    stories.forEach(function (s, i) { s.classList.toggle('is-on', i === sc); });
    drawers.forEach(function (d, i) { d.classList.toggle('is-sel', i === sc); });
    anim.style.setProperty('--acc', 'var(--' + HUES[sc] + ')');
    anim.style.setProperty('--accd', 'var(--' + HUES[sc] + '-dark)');
    anim.style.setProperty('--accr', 'var(--' + HUES[sc] + '-rgb)');
    FLAGS.forEach(function (f, i) { anim.classList.toggle(f, ph >= i + 1); });
  }
  function play(sc, delay) {
    timers.push(setTimeout(function () { setHero(sc, 0); }, delay));
    STEPS.forEach(function (t, i) { timers.push(setTimeout(function () { setHero(sc, i + 1); }, delay + t)); });
    timers.push(setTimeout(function () { setHero(sc, 0); }, delay + HOLD));
    timers.push(setTimeout(function () { play((sc + 1) % 4, 0); }, delay + HOLD + 400));
  }
  if (reduced) setHero(0, FLAGS.length);
  else { setHero(0, 0); play(0, 600); }

  // hero photo parallax
  var photo = $('[data-parallax]');
  var raf = 0;
  function parallax() {
    raf = 0;
    if (reduced) return;
    var r = photo.parentElement.getBoundingClientRect();
    var y = Math.max(-r.height * 0.12, Math.min(r.height * 0.12, -r.top * 0.3));
    photo.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
  }

  // ---- section reveal -----------------------------------------------------------------------
  var sections = $$('[data-sec]');
  function inView(el, top, bottom) {
    var r = el.getBoundingClientRect(), h = window.innerHeight;
    return r.height > 0 && r.top < h * top && r.bottom > h * bottom;
  }
  function reveal() {
    sections.forEach(function (s) {
      if (s.classList.contains('is-seen') || !inView(s, 0.88, 0)) return;
      s.classList.add('is-seen');
    });
  }

  // ---- "A day with your AI Office": the clock runs 7 AM to 5 PM while the section is on screen;
  //      each task lights its timeline dot and slides into the live box -----------------------
  var agents = $('#agents');
  var clockEl = $('.day-clock', agents), doneEl = $('.day-done', agents), nowEl = $('.day-now', agents);
  var fillEl = $('.day-fill', agents), knobEl = $('.day-knob', agents), dotEls = $$('.day-dot', agents);
  var ICON = {
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
    cal: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18',
    folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    cash: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    mega: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6',
    check: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3'
  };
  var TASKS = [  // at: share of the day (0 = 7 AM, 1 = 5 PM)
    { at: 0.025, agent: 'Email Agent', task: '41 emails sorted, 3 replies drafted', status: 'Ready for approval', st: 'ready', icon: ICON.mail },
    { at: 0.167, agent: 'Deadline Agent', task: 'Contract renewal due Nov 3 flagged', status: 'Flagged', st: 'flag', icon: ICON.cal },
    { at: 0.4, agent: 'Filing Agent', task: '3 attachments filed', status: 'Done', st: 'done', icon: ICON.folder },
    { at: 0.65, agent: 'Cashflow Manager', task: '2 invoice reminders drafted', status: 'Ready for approval', st: 'ready', icon: ICON.cash },
    { at: 0.875, agent: 'Marketing Agents', task: "Tomorrow's post and Google update drafted", status: 'Ready for approval', st: 'ready', icon: ICON.mega },
    { at: 0.975, agent: 'You', task: '6 approvals, done before you head home', status: 'Done', st: 'done', icon: ICON.check }
  ];
  var day = 0, holdSince = 0, shown = -1;
  function taskRow(t) {
    return '<div class="day-row"><span class="day-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + t.icon + '"/></svg></span>' +
      '<div class="day-txt"><div class="day-agent">' + t.agent + '</div><div class="day-task">' + t.task + '</div></div>' +
      '<span class="day-st st-' + t.st + '">' + t.status + '</span></div>';
  }
  function renderDay() {
    var d = Math.min(day, 1), h = 7 + d * 10, hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
    clockEl.textContent = ((hh + 11) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? ' AM' : ' PM');
    var pct = (d * 100).toFixed(1) + '%';
    fillEl.style.width = pct;
    knobEl.style.left = pct;
    var now = 0, done = 0;
    TASKS.forEach(function (t, i) {
      var on = day >= t.at;
      if (on) { now = i; done++; }
      dotEls[i].classList.toggle('on', on);
    });
    doneEl.textContent = done;
    if (now !== shown) { nowEl.innerHTML = taskRow(TASKS[now]); shown = now; }
  }
  if (reduced) { day = 1.1; renderDay(); }
  else {
    renderDay();
    setInterval(function () {
      if (!inView(agents, 0.85, 0.1)) { holdSince = 0; if (day !== 0) { day = 0; renderDay(); } return; }
      if (day >= 1.1) {
        if (!holdSince) holdSince = Date.now();
        if (Date.now() - holdSince < 5000) return;
        holdSince = 0; day = 0;
      } else day = Math.min(1.1, day + 0.004);
      renderDay();
    }, 60);
  }

  // ---- FAQ: first three questions, then "More questions"; one answer open at a time -------
  var faqList = $('.faq-list'), faqMore = $('.faq-more'), faqs = $$('details', faqList);
  faqList.classList.add('is-short');
  faqMore.hidden = false;
  faqMore.addEventListener('click', function () {
    var short = faqList.classList.toggle('is-short');
    faqMore.textContent = short ? 'More questions' : 'Fewer questions';
    faqs.forEach(function (d) { d.open = false; });
  });
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // ---- scroll / resize wiring ----------------------------------------------------------------
  function onScroll() { if (!raf) raf = requestAnimationFrame(function () { parallax(); reveal(); }); }
  if (reduced) sections.forEach(function (s) { s.classList.add('is-seen'); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // fallback for scrolls that don't fire events (e.g. jump links); stops once every section has shown
  var revealT = setInterval(function () { reveal(); if (sections.every(function (s) { return s.classList.contains('is-seen'); })) clearInterval(revealT); }, 500);
  parallax();
  reveal();
})();
