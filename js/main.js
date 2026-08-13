/* Universal Marine Service — main.js */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  (function highlightActiveNav() {
    var current = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".nav-list a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 6px 20px rgba(0,0,0,0.25)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Image fallback: gracefully handle missing photography ---------- */
  document.querySelectorAll(".media img").forEach(function (img) {
    var wrapper = img.closest(".media");
    if (!wrapper) return;
    img.addEventListener("error", function () {
      wrapper.classList.add("img-fallback");
    });
    if (img.complete && img.naturalWidth === 0) {
      wrapper.classList.add("img-fallback");
    }
  });

  /* ---------- Contact / Request-Service form (PHP mail handler) ---------- */
  var form = document.getElementById("service-request-form");
  if (form) {
    var successBox = document.getElementById("form-success");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return /^[0-9()+\-.\s]{7,20}$/.test(v.trim()); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      issue: function (v) { return v.trim().length >= 10; }
    };

    function setError(field, show) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", show);
      field.setAttribute("aria-invalid", show ? "true" : "false");
    }

    function validateField(field) {
      var rule = validators[field.name];
      if (!rule) {
        if (field.hasAttribute("required")) {
          var ok = field.value.trim().length > 0;
          setError(field, !ok);
          return ok;
        }
        return true;
      }
      var ok = rule(field.value);
      setError(field, !ok);
      return ok;
    }

    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name) return;
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || field.type === "submit") return;
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      var submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Submitting…"; }

      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form)
      })
        .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
        .then(function (result) {
          if (!result.ok || !result.data.success) throw new Error("Submission failed");
          form.style.display = "none";
          if (successBox) {
            successBox.classList.add("show");
            successBox.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Service Request"; }
          alert("Sorry, something went wrong submitting your request. Please call or email us directly.");
        });
    });
  }

  /* ---------- Gallery filters ---------- */
  var filterBar = document.querySelector(".gallery-filters");
  if (filterBar) {
    var items = document.querySelectorAll(".gallery-item");
    filterBar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-category") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var lbMedia = lightbox.querySelector(".media");

    document.querySelectorAll(".gallery-item .media").forEach(function (media) {
      media.addEventListener("click", function () {
        var img = media.querySelector("img");
        var label = media.getAttribute("data-label") || "";
        lightbox.classList.add("open");
        lbMedia.classList.toggle("img-fallback", media.classList.contains("img-fallback"));
        lbMedia.setAttribute("data-label", label);
        if (lbImg && img) {
          lbImg.src = img.getAttribute("src");
          lbImg.alt = img.getAttribute("alt") || "";
        }
        if (lbCaption) lbCaption.textContent = label;
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    var closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Auto-update copyright year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
