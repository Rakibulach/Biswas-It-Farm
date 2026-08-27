/* =============================================================
   BISWAS IT FARM — Interactions
   ============================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. Scroll progress bar + sticky navbar shrink
  --------------------------------------------------------- */
  var progressBar = document.querySelector(".scroll-progress");
  var navbar = document.querySelector(".navbar");

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";

    if (navbar) {
      if (scrollTop > 30) navbar.classList.add("is-scrolled");
      else navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     2. Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  var navScrim = document.querySelector(".nav-scrim");

  function closeNav() {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
    navScrim.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navScrim.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navScrim.addEventListener("click", closeNav);
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------------------------------------------------------
     3. Scroll-reveal animations (IntersectionObserver)
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 4) * 0.08 + "s");
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  
  /* ---------------------------------------------------------
     5. Portfolio filter
  --------------------------------------------------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");

      portfolioItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------------------------------------------------------
     6. Pricing monthly / yearly toggle
  --------------------------------------------------------- */
  var pricingToggle = document.querySelector(".toggle-switch");
  var monthlyLabel = document.querySelector('[data-label="monthly"]');
  var yearlyLabel = document.querySelector('[data-label="yearly"]');
  var priceEls = document.querySelectorAll("[data-monthly]");

  if (pricingToggle) {
    pricingToggle.addEventListener("click", function () {
      var isYearly = pricingToggle.classList.toggle("is-yearly");
      monthlyLabel.classList.toggle("active", !isYearly);
      yearlyLabel.classList.toggle("active", isYearly);

      priceEls.forEach(function (el) {
        var monthly = parseInt(el.getAttribute("data-monthly"), 10);
        var yearly = parseInt(el.getAttribute("data-yearly"), 10);
        el.textContent = "$" + (isYearly ? yearly : monthly);
      });
    });
  }

  /* ---------------------------------------------------------
     7. Launch-offer countdown timer
  --------------------------------------------------------- */
  var countdown = document.querySelector(".countdown");
  if (countdown) {
    var DAYS_FROM_NOW = 6;
    var target = new Date();
    target.setDate(target.getDate() + DAYS_FROM_NOW);
    target.setHours(23, 59, 59, 0);

    var dEl = countdown.querySelector('[data-unit="days"] b');
    var hEl = countdown.querySelector('[data-unit="hours"] b');
    var mEl = countdown.querySelector('[data-unit="minutes"] b');
    var sEl = countdown.querySelector('[data-unit="seconds"] b');

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function tick() {
      var now = new Date();
      var diff = Math.max(0, target - now);

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);

      if (diff <= 0) clearInterval(timer);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     8. Testimonial slider
  --------------------------------------------------------- */
  var slides = document.querySelectorAll(".testimonial-slide");
  var dots = document.querySelectorAll(".testimonial-dots button");
  var currentSlide = 0;
  var slideTimer;

  function showSlide(index) {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 6000);
      });
    });
    slideTimer = setInterval(nextSlide, 6000);
  }

  /* ---------------------------------------------------------
     9. Contact form validation + fake success state
  --------------------------------------------------------- */
  var form = document.querySelector(".contact-form form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll("[required]");

      fields.forEach(function (field) {
        var wrapper = field.closest(".field");
        var isEmail = field.type === "email";
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var ok = field.value.trim().length > 0 && (!isEmail || emailPattern.test(field.value.trim()));

        wrapper.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      var successMsg = document.querySelector(".form-success");
      if (valid) {
        successMsg.classList.add("show");
        form.reset();
        setTimeout(function () { successMsg.classList.remove("show"); }, 5000);
      } else if (successMsg) {
        successMsg.classList.remove("show");
      }
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        field.closest(".field").classList.remove("has-error");
      });
    });
  }

  /* ---------------------------------------------------------
     10. Newsletter mini-form (footer)
  --------------------------------------------------------- */
  var newsletterForm = document.querySelector(".newsletter");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector("input");
      if (input && input.value.trim()) {
        input.value = "";
        input.placeholder = "Subscribed \u2713";
        setTimeout(function () { input.placeholder = "Your email address"; }, 3000);
      }
    });
  }

  /* ---------------------------------------------------------
     11. Smooth-scroll for in-page anchor links
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 84;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }
    });
  });

});
