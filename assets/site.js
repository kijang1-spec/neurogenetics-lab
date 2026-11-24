/* ============================================================
   Neurogenetics Lab — shared shell
   header / footer injection, KO-EN toggle, tweaks, reveal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- chrome strings (EN side) ---------- */
  var CHROME_EN = {
    'nav.research': 'Research',
    'nav.people': 'People',
    'nav.pubs': 'Publications',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.recruit': 'Open positions',
    'brand.em': 'Korea Brain Research Institute',
    'foot.ko': 'Neurogenetics Lab · Korea Brain Research Institute',
    'foot.pages': 'Pages',
    'foot.links': 'Links',
    'foot.addr': '61 Cheomdan-ro, Dong-gu, Daegu 41062, Republic of Korea',
    'foot.tel': 'Tel. +82 53 980 8380',
    'foot.kbri': 'Korea Brain Research Institute',
    'foot.jobs': 'KBRI recruitment announcements',
    'foot.rights': 'All rights reserved.',
    'foot.loc': 'Daegu, Republic of Korea'
  };

  var NAV = [
    { href: 'Research.html', ko: '연구', en: 'Research', key: 'research' },
    { href: 'People.html', ko: '구성원', en: 'People', key: 'people' },
    { href: 'Publications.html', ko: '논문', en: 'Publications', key: 'pubs' },
    { href: 'News.html', ko: '소식', en: 'News', key: 'news' },
    { href: 'Gallery.html', ko: '갤러리', en: 'Gallery', key: 'gallery' },
    { href: 'Contact.html', ko: '연락처', en: 'Contact', key: 'contact' }
  ];

  var LANG_KEY = 'nl-lang';
  var TWK_KEY = 'nl-tweaks-v2';

  /* ---------- tweak state ---------- */
  var D = window.__TWEAK_DEFAULTS || {};
  var saved = {};
  /* Public build ignores any tweak state left in this browser — a visitor
     who previously poked the controls (or an author testing them) should see
     the authored design, not their own leftovers. */
  if (!window.__PUBLIC_BUILD) {
    try { saved = JSON.parse(localStorage.getItem(TWK_KEY) || '{}'); } catch (e) {}
  }
  var KNOWN = ['blue', 'azure', 'ink', 'steel', 'teal'];
  if (saved.palette && KNOWN.indexOf(saved.palette) === -1) saved.palette = 'blue';
  var ATLAS = ['off', 'subtle', 'on', 'strong'];
  if (saved.atlas && ATLAS.indexOf(saved.atlas) === -1) saved.atlas = 'on';
  var state = {
    palette: saved.palette || D.palette || 'blue',
    type: saved.type || D.type || 'serif',
    atlas: saved.atlas || D.atlas || 'on'
  };

  var PALETTES = [
    { id: 'blue',  sw: 'oklch(0.515 0.148 254)', name: 'Blue' },
    { id: 'azure', sw: 'oklch(0.570 0.128 232)', name: 'Azure' },
    { id: 'ink',   sw: 'oklch(0.390 0.098 262)', name: 'Deep navy' },
    { id: 'steel', sw: 'oklch(0.470 0.052 250)', name: 'Steel' },
    { id: 'teal',  sw: 'oklch(0.505 0.086 205)', name: 'Blue-teal' }
  ];
  var TYPES = [
    { id: 'serif',   name: 'Serif' },
    { id: 'sans',    name: 'Sans' },
    { id: 'krserif', name: 'KR serif' }
  ];

  function applyTweaks() {
    document.body.dataset.palette = state.palette;
    document.body.dataset.type = state.type;
    document.body.dataset.atlas = state.atlas;
    if (!window.__PUBLIC_BUILD) {
      try { localStorage.setItem(TWK_KEY, JSON.stringify(state)); } catch (e) {}
    }
    var panel = document.getElementById('twk');
    if (panel) {
      panel.querySelectorAll('[data-pal]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.pal === state.palette));
      });
      panel.querySelectorAll('[data-typ]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.typ === state.type));
      });
      panel.querySelectorAll('[data-atl]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.atl === state.atlas));
      });
    }
  }

  function setTweak(k, v) {
    state[k] = v;
    applyTweaks();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: {
        palette: state.palette, type: state.type, atlas: state.atlas
      } }, '*');
    } catch (e) {}
  }

  /* ---------- chrome ---------- */
  function isCurrent(href) {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return here === href.toLowerCase() || (here === '' && href === 'index.html');
  }

  function injectHeader() {
    var host = document.getElementById('site-head');
    if (!host) return;
    var lang = readLang();
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.key + '"' +
        (isCurrent(n.href) ? ' aria-current="page"' : '') + '>' +
        (lang === 'en' ? n.en : n.ko) + '</a>';
    }).join('');

    host.className = 'site-head';
    host.innerHTML =
      '<div class="head-inner">' +
        '<a class="brand" href="index.html" aria-label="Neurogenetics Lab, home">' +
          '<span class="brand-mark">NL</span>' +
          '<span class="brand-txt">' +
            '<strong>Neurogenetics Lab</strong>' +
            '<em data-t="brand.em">한국뇌연구원 신경유전학 연구실</em>' +
          '</span>' +
        '</a>' +
        '<nav class="nav" aria-label="Primary">' + links + '</nav>' +
        '<a class="head-recruit" href="People.html#openings">' +
          '<span class="dot" aria-hidden="true"></span>' +
          '<span data-t="nav.recruit">대학원생·연수연구원 모집 중</span>' +
        '</a>' +
        '<div class="lang-sw" role="group" aria-label="Language">' +
          '<button type="button" data-lang="ko" aria-pressed="' + (lang !== 'en') + '">KO</button>' +
          '<button type="button" data-lang="en" aria-pressed="' + (lang === 'en') + '">EN</button>' +
        '</div>' +
      '</div>';

    host.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
  }

  function injectFooter() {
    var host = document.getElementById('site-foot');
    if (!host) return;
    var links = NAV.map(function (n) {
      return '<li><a href="' + n.href + '" data-nav="' + n.key + '">' + n.ko + '</a></li>';
    }).join('');

    host.className = 'site-foot';
    host.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-top">' +
          '<div class="foot-brand">' +
            '<a class="brand" href="index.html">' +
              '<span class="brand-mark">NL</span>' +
              '<span class="brand-txt">' +
                '<strong>Neurogenetics Lab</strong>' +
                '<em data-t="brand.em">한국뇌연구원 신경유전학 연구실</em>' +
              '</span>' +
            '</a>' +
            '<p class="small" data-t="foot.ko">신경유전학 연구실 · 한국뇌연구원</p>' +
            '<p class="small" data-t="foot.addr">대구광역시 동구 첨단로 61 (41062)</p>' +
            '<p class="small" data-t="foot.tel">Tel. 053-980-8380</p>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4 data-t="foot.pages">페이지</h4>' +
            '<ul>' + links + '</ul>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4 data-t="foot.links">관련 링크</h4>' +
            '<ul>' +
              '<li><a href="https://www.kbri.re.kr/" target="_blank" rel="noopener" data-t="foot.kbri">한국뇌연구원</a></li>' +
              '<li><a href="https://www.kbri.re.kr/new/pages/sub/page.html?mc=0635" target="_blank" rel="noopener" data-t="foot.jobs">KBRI 채용공고</a></li>' +
              '<li><a href="People.html#openings" data-t="nav.recruit">대학원생·연수연구원 모집 중</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="foot-bot">' +
          '<span>© 2026 Neurogenetics Lab · Korea Brain Research Institute</span>' +
          '<span data-t="foot.loc">대한민국 대구</span>' +
        '</div>' +
      '</div>';
  }

  /* ---------- language ---------- */
  var EN = {};
  function readLang() {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ko'; }
    catch (e) { return 'ko'; }
  }

  function setLang(lang) {
    lang = lang === 'en' ? 'en' : 'ko';
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    document.querySelectorAll('[data-t]').forEach(function (el) {
      if (el.__ko === undefined) el.__ko = el.innerHTML;
      var k = el.dataset.t;
      el.innerHTML = (lang === 'en' && EN[k] !== undefined) ? EN[k] : el.__ko;
    });

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var n = NAV.filter(function (x) { return x.key === a.dataset.nav; })[0];
      if (n) a.textContent = lang === 'en' ? n.en : n.ko;
    });

    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    document.body.dataset.lang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* ---------- tweaks panel ----------
     Public build (window.__PUBLIC_BUILD, set by each page in dist/) never
     mounts the panel and never announces edit-mode availability: a visitor
     should not be offered accent/typeface/background controls. The stored
     preferences still apply, so the design keeps its authored look. */
  function buildPanel() {
    if (window.__PUBLIC_BUILD) return;
    var el = document.createElement('aside');
    el.id = 'twk';
    el.className = 'twk';
    el.setAttribute('aria-label', 'Tweaks');
    el.innerHTML =
      '<div class="twk-head"><strong>Tweaks</strong>' +
        '<button class="twk-close" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="twk-body">' +
        '<div class="twk-group"><span>Accent</span><div class="twk-row" data-row="pal"></div></div>' +
        '<div class="twk-group"><span>Display typeface</span><div class="twk-row" data-row="typ"></div></div>' +
        '<div class="twk-group"><span>Background figure</span><div class="twk-row" data-row="atl"></div></div>' +
        '<div class="twk-group"><span>Language</span><div class="twk-row" data-row="lang"></div></div>' +
        '<p class="twk-note">All settings persist across pages in this browser.</p>' +
      '</div>';
    document.body.appendChild(el);

    var palRow = el.querySelector('[data-row="pal"]');
    PALETTES.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'twk-sw';
      b.dataset.pal = p.id;
      b.title = p.name;
      b.setAttribute('aria-label', p.name);
      b.innerHTML = '<i style="background:' + p.sw + '"></i>';
      b.addEventListener('click', function () { setTweak('palette', p.id); });
      palRow.appendChild(b);
    });

    var typRow = el.querySelector('[data-row="typ"]');
    TYPES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'twk-opt';
      b.dataset.typ = t.id;
      b.textContent = t.name;
      b.addEventListener('click', function () { setTweak('type', t.id); });
      typRow.appendChild(b);
    });

    var ATLAS_OPTS = [['off', 'Off'], ['subtle', 'Faint'], ['on', 'Default'], ['strong', 'Strong']];
    var atlRow = el.querySelector('[data-row="atl"]');
    ATLAS_OPTS.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'twk-opt';
      b.dataset.atl = p[0];
      b.textContent = p[1];
      b.addEventListener('click', function () { setTweak('atlas', p[0]); });
      atlRow.appendChild(b);
    });

    var langRow = el.querySelector('[data-row="lang"]');
    [['ko', '한국어'], ['en', 'English']].forEach(function (pair) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'twk-opt';
      b.textContent = pair[1];
      b.dataset.tlang = pair[0];
      b.addEventListener('click', function () {
        setLang(pair[0]);
        syncLangRow();
      });
      langRow.appendChild(b);
    });
    function syncLangRow() {
      var l = readLang();
      langRow.querySelectorAll('[data-tlang]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.tlang === l));
      });
    }
    syncLangRow();
    document.addEventListener('langchange', syncLangRow);

    el.querySelector('.twk-close').addEventListener('click', function () {
      el.classList.remove('open');
    });

    /* protocol: listener first, then announce */
    window.addEventListener('message', function (e) {
      var t = e.data && e.data.type;
      if (t === '__activate_edit_mode') el.classList.add('open');
      else if (t === '__deactivate_edit_mode') el.classList.remove('open');
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  }

  /* ---------- reveal (opt-in, position-driven, fail-open) ----------
     Nothing on screen is ever hidden. Only elements that start below the
     viewport get .pre (invisible), and a scroll+timer check removes it as
     they come into view. IntersectionObserver is used as an accelerator, not
     as the sole trigger, so a silent observer cannot blank the page. */
  function watchReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var pending = [];

    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      /* already at least partly on screen -> visible immediately, no animation */
      if (r.top < vh * 0.92) { el.classList.add('in'); return; }
      el.classList.add('pre');
      pending.push(el);
    });

    function check() {
      if (!pending.length) return;
      var h = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.94 && r.bottom > -80) {
          el.classList.remove('pre');
          return false;
        }
        return true;
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; check(); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onScroll);

    /* Belt and braces: nothing near the viewport may stay hidden, and after
       6s nothing at all may. Scroll + getBoundingClientRect always work, so
       these timers should never be the only thing keeping content visible. */
    function clearNearby(mult) {
      var h = (window.innerHeight || 800) * mult;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h) { el.classList.remove('pre'); return false; }
        return true;
      });
    }
    setTimeout(function () { clearNearby(2.5); check(); }, 1200);
    setTimeout(function () {
      pending.forEach(function (el) { el.classList.remove('pre'); });
      pending = [];
    }, 6000);
    check();
  }

  /* ---------- ambient atlas plate ----------
     One research figure (neuron, astrocyte, fly, blood/CSF tubes, proteomic
     scatter) sitting behind the first screen at very low opacity. Injected
     here rather than hand-written into seven files, so every page gets the
     same treatment and a later swap touches one place. */
  function injectAtlas() {
    var hero = document.querySelector('.hero, .page-hero');
    if (!hero || hero.querySelector('.hero-atlas')) return;
    var img = document.createElement('img');
    img.className = 'hero-atlas';
    img.src = 'assets/art/atlas-plate.webp';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    hero.insertBefore(img, hero.firstChild);
  }

  /* ---------- boot ---------- */
  function boot() {
    EN = Object.assign({}, CHROME_EN, window.PAGE_EN || {});
    injectHeader();
    injectFooter();
    injectAtlas();
    applyTweaks();
    setLang(readLang());
    buildPanel();
    watchReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
