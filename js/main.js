/* Universal Marine Service — site scripts
   Mobile nav, image fallbacks, scroll reveal, gallery filters/lightbox, request form. */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* ---------- Current-page nav link ---------- */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(function (link) {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Smooth scroll for same-page anchors ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });

  /* ---------- Image fallback (styled placeholder when a photo is missing) ---------- */
  function markFallback(img) {
    var media = img.closest('.media');
    if (media) media.classList.add('img-fallback');
  }
  function clearFallback(img) {
    var media = img.closest('.media');
    if (media) media.classList.remove('img-fallback');
  }
  document.querySelectorAll('.media img').forEach(function (img) {
    img.addEventListener('error', function () { markFallback(img); });
    img.addEventListener('load', function () { clearFallback(img); });
    if (img.getAttribute('src') && img.complete && img.naturalWidth === 0) markFallback(img);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      galleryItems.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    var lbMedia = lightbox.querySelector('.media');
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lastFocus = null;

    var openLightbox = function (item) {
      var media = item.querySelector('.media');
      var img = item.querySelector('img');
      var label = media ? media.getAttribute('data-label') || '' : '';
      lbMedia.classList.remove('img-fallback');
      lbMedia.setAttribute('data-label', label);
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt') || label;
      lbCaption.textContent = label;
      lastFocus = document.activeElement;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };

    var closeLightbox = function () {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    galleryItems.forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () { openLightbox(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- Request Service form ---------- */
  // Rules mirror the server-side checks in send-request.php.
  var validators = {
    customerName: function (v) { return v.length >= 2; },
    phone: function (v) { return /^[0-9()+\-.\s]{7,20}$/.test(v); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
    issue: function (v) { return v.length >= 10; }
  };

  var form = document.getElementById('service-request-form');
  if (form) {
    var success = document.getElementById('form-success');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    var serverError = document.createElement('p');
    serverError.className = 'form-note';
    serverError.style.color = '#d64545';
    serverError.setAttribute('role', 'alert');
    serverError.hidden = true;
    if (submitBtn) submitBtn.insertAdjacentElement('afterend', serverError);

    var setFieldError = function (input, hasError) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('has-error', hasError);
      input.classList.toggle('invalid', hasError);
      input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    };

    var validateField = function (name) {
      var input = form.elements[name];
      if (!input) return true;
      var ok = validators[name](input.value.trim());
      setFieldError(input, !ok);
      return ok;
    };

    Object.keys(validators).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () { validateField(name); });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) validateField(name);
      });
    });

    var showServerError = function () {
      serverError.textContent = 'Sorry, something went wrong sending your request. Please try again or call us at 239-246-1618.';
      serverError.hidden = false;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      serverError.hidden = true;
      if (success) success.classList.remove('show');

      var firstInvalid = null;
      Object.keys(validators).forEach(function (name) {
        if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form) })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            form.reset();
            if (success) {
              success.classList.add('show');
              success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            }
            return;
          }
          var fields = (result.data.errors || []).filter(function (name) { return validators[name]; });
          if (!fields.length) {
            showServerError();
            return;
          }
          fields.forEach(function (name) {
            if (form.elements[name]) setFieldError(form.elements[name], true);
          });
          form.elements[fields[0]].focus();
        })
        .catch(showServerError)
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });
  }
})();
