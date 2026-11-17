/* ALIVIA — interacciones del tema (vanilla, sin librerías) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Aparición al hacer scroll ---------- */
  var revealObserver = null;
  function initReveal(root) {
    var els = (root || document).querySelectorAll('.al-reveal:not(.al-visible)');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('al-visible'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('al-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    els.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Cifras que cuentan hacia arriba ---------- */
  function initCountUp(root) {
    var els = (root || document).querySelectorAll('[data-al-countup]:not([data-al-done])');
    if (!els.length) return;
    function run(el) {
      el.setAttribute('data-al-done', '1');
      var target = parseFloat(el.getAttribute('data-al-countup')) || 0;
      var prefix = el.getAttribute('data-al-prefix') || '';
      var suffix = el.getAttribute('data-al-suffix') || '';
      if (reduceMotion) { el.textContent = prefix + target.toLocaleString('es-GT') + suffix; return; }
      var start = null;
      var dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('es-GT') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Pasos de la escena fija ---------- */
  function initEscena(root) {
    var scenes = (root || document).querySelectorAll('[data-al-escena]');
    if (!scenes.length || !('IntersectionObserver' in window)) return;
    scenes.forEach(function (scene) {
      var steps = scene.querySelectorAll('.al-step');
      if (!steps.length) return;
      steps[0].classList.add('is-activo');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            steps.forEach(function (s) { s.classList.remove('is-activo'); });
            e.target.classList.add('is-activo');
          }
        });
      }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });
      steps.forEach(function (s) { io.observe(s); });
    });
  }

  /* ---------- Cuenta atrás ---------- */
  function initCountdown(root) {
    var boxes = (root || document).querySelectorAll('[data-al-countdown]');
    boxes.forEach(function (box) {
      if (box.__alTimer) clearInterval(box.__alTimer);
      var raw = box.getAttribute('data-al-countdown');
      var end = new Date(raw);
      if (isNaN(end.getTime())) { box.style.display = 'none'; return; }
      var cells = {
        d: box.querySelector('[data-al-d]'),
        h: box.querySelector('[data-al-h]'),
        m: box.querySelector('[data-al-m]'),
        s: box.querySelector('[data-al-s]')
      };
      function pad(n) { return n < 10 ? '0' + n : String(n); }
      function tick() {
        var diff = Math.max(0, end.getTime() - Date.now());
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        if (cells.d) cells.d.textContent = pad(d);
        if (cells.h) cells.h.textContent = pad(h);
        if (cells.m) cells.m.textContent = pad(m);
        if (cells.s) cells.s.textContent = pad(s);
        if (diff === 0) {
          clearInterval(box.__alTimer);
          var wrap = box.closest('[data-al-countdown-wrap]');
          if (wrap && wrap.getAttribute('data-al-hide-end') === 'true') wrap.style.display = 'none';
        }
      }
      tick();
      box.__alTimer = setInterval(tick, 1000);
    });
  }

  /* ---------- Parallax suave del hero ---------- */
  function initParallax(root) {
    if (reduceMotion) return;
    var els = (root || document).querySelectorAll('[data-al-parallax]');
    if (!els.length) return;
    var ticking = false;
    function update() {
      els.forEach(function (el) {
        var k = parseFloat(el.getAttribute('data-al-parallax')) || 0;
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * k * -0.01;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Página de producto ---------- */
  function formatMoney(cents, format) {
    var value = (cents / 100).toFixed(2);
    var parts = value.split('.');
    var withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    var noDecimals = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    format = format || 'Q{{amount}}';
    return format
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, noDecimals)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, value.replace('.', ','))
      .replace(/\{\{\s*amount\s*\}\}/, withCommas);
  }

  function initProducto(root) {
    var forms = (root || document).querySelectorAll('[data-al-producto]');
    forms.forEach(function (wrap) {
      var dataEl = wrap.querySelector('[data-al-variants]');
      var variants = [];
      try { variants = dataEl ? JSON.parse(dataEl.textContent) : []; } catch (e) { variants = []; }
      var moneyFormat = wrap.getAttribute('data-al-money') || 'Q{{amount}}';
      var idInput = wrap.querySelector('input[name="id"]');
      var priceEl = wrap.querySelector('[data-al-price]');
      var compareEl = wrap.querySelector('[data-al-compare]');
      var saveEl = wrap.querySelector('[data-al-save]');
      var buttons = wrap.querySelectorAll('[data-al-buy]');
      var stickyPrice = document.querySelector('[data-al-sticky-price]');
      var soldOutText = wrap.getAttribute('data-al-soldout') || 'Agotado';

      function currentOptions() {
        var groups = wrap.querySelectorAll('[data-al-option-group]');
        var values = [];
        groups.forEach(function (g) {
          var checked = g.querySelector('input:checked');
          values.push(checked ? checked.value : null);
        });
        return values;
      }

      function update() {
        if (!variants.length) return;
        var opts = currentOptions();
        var v = variants.find(function (x) {
          return x.options.every(function (o, i) { return opts[i] === null || o === opts[i]; });
        });
        if (!v) return;
        if (idInput) idInput.value = v.id;
        if (priceEl) priceEl.textContent = formatMoney(v.price, moneyFormat);
        if (stickyPrice) stickyPrice.textContent = formatMoney(v.price, moneyFormat);
        if (compareEl) {
          if (v.compare_at_price && v.compare_at_price > v.price) {
            compareEl.textContent = formatMoney(v.compare_at_price, moneyFormat);
            compareEl.hidden = false;
            if (saveEl) {
              saveEl.textContent = (saveEl.getAttribute('data-al-save-label') || 'Ahorras') + ' ' + formatMoney(v.compare_at_price - v.price, moneyFormat);
              saveEl.hidden = false;
            }
          } else {
            compareEl.hidden = true;
            if (saveEl) saveEl.hidden = true;
          }
        }
        buttons.forEach(function (b) {
          if (!b.hasAttribute('data-al-label')) b.setAttribute('data-al-label', b.innerHTML);
          if (v.available) {
            b.disabled = false;
            b.innerHTML = b.getAttribute('data-al-label');
          } else {
            b.disabled = true;
            b.textContent = soldOutText;
          }
        });
        if (v.featured_media_id) {
          var thumb = wrap.querySelector('[data-al-thumb][data-media-id="' + v.featured_media_id + '"]');
          if (thumb) thumb.click();
        }
      }

      wrap.querySelectorAll('[data-al-option-group] input').forEach(function (inp) {
        inp.addEventListener('change', update);
      });

      /* Galería */
      var mainImg = wrap.querySelector('[data-al-main-img]');
      wrap.querySelectorAll('[data-al-thumb]').forEach(function (t) {
        t.addEventListener('click', function () {
          if (!mainImg) return;
          wrap.querySelectorAll('[data-al-thumb]').forEach(function (x) { x.classList.remove('is-activo'); });
          t.classList.add('is-activo');
          mainImg.style.opacity = '0.2';
          var src = t.getAttribute('data-src');
          var srcset = t.getAttribute('data-srcset');
          var img = new Image();
          img.onload = function () {
            mainImg.src = src;
            if (srcset) mainImg.srcset = srcset;
            mainImg.alt = t.getAttribute('data-alt') || '';
            mainImg.style.opacity = '1';
          };
          img.src = src;
        });
      });

      /* Cantidad */
      var qty = wrap.querySelector('[data-al-qty]');
      wrap.querySelectorAll('[data-al-qty-btn]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!qty) return;
          var n = parseInt(qty.value, 10) || 1;
          n += b.getAttribute('data-al-qty-btn') === 'mas' ? 1 : -1;
          qty.value = Math.max(1, Math.min(99, n));
        });
      });

      update();
    });

    /* Barra fija de compra en móvil */
    var bar = document.querySelector('[data-al-sticky-bar]');
    var target = document.querySelector('[data-al-buy-zone]');
    if (bar && target && 'IntersectionObserver' in window) {
      document.body.classList.add('al-con-barra');
      var zonaVisible = true;
      function pintarBarra() {
        bar.classList.toggle('is-visible', !zonaVisible && window.scrollY > 320);
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { zonaVisible = e.isIntersecting; });
        pintarBarra();
      }, { threshold: 0 });
      io.observe(target);
      window.addEventListener('scroll', pintarBarra, { passive: true });
      var btn = bar.querySelector('[data-al-sticky-buy]');
      if (btn) {
        btn.addEventListener('click', function () {
          var form = target.querySelector('form[action*="/cart/add"]');
          var submit = form && form.querySelector('[data-al-buy]');
          if (submit && !submit.disabled) { submit.click(); }
          else { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        });
      }
    }
  }

  function initAll(root) {
    initReveal(root);
    initCountUp(root);
    initEscena(root);
    initCountdown(root);
    initParallax(root);
    initProducto(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(document); });
  } else {
    initAll(document);
  }

  /* Editor de Shopify: re-inicializar al cambiar una sección */
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
