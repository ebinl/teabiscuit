/* ==========================================================================
   teabiscuit. Creative Studio — Interactive Scripts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Preloader GSAP Timeline (Visible Logo + "Attention to Revenue" -> "TEABISCUITMEDIA")
  const preloader = document.querySelector(".mil-preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("mil-hidden");
    }, 1500);
  }

  // 2. Custom Cursor Follower
  const cursorDot = document.querySelector(".cursor-dot");
  if (cursorDot) {
    window.addEventListener("mousemove", (e) => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
    });

    document
      .querySelectorAll("a, button, .p__box, .service-item, .team-person-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () =>
          cursorDot.classList.add("is-hovering")
        );
        el.addEventListener("mouseleave", () =>
          cursorDot.classList.remove("is-hovering")
        );
      });
  }

  // 3. Sticky Header & Scroll-to-Top SVG Circle Progress
  const header = document.querySelector(".header-area");
  const progressWrap = document.querySelector(".progress-wrap");
  const progressPath = document.querySelector(".progress-wrap path");

  if (progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = pathLength + " " + pathLength;
    progressPath.style.strokeDashoffset = pathLength;

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / (height || 1);
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 120) {
        progressWrap.classList.add("active-progress");
        if (header) header.classList.add("scrolled");
      } else {
        progressWrap.classList.remove("active-progress");
        if (header) header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    progressWrap.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 4. Offcanvas Menu Toggle
  const offcanvas = document.getElementById("offcanvasArea");
  const openBtn = document.getElementById("openOffcanvas");
  const closeBtn = document.getElementById("closeOffcanvas");

  if (openBtn && offcanvas) {
    openBtn.addEventListener("click", () => offcanvas.classList.add("is-open"));
  }
  if (closeBtn && offcanvas) {
    closeBtn.addEventListener("click", () =>
      offcanvas.classList.remove("is-open")
    );
  }
  document.querySelectorAll(".offcanvas-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (offcanvas) offcanvas.classList.remove("is-open");
    });
  });

  // 5. Portfolio Accordion Touch / Click Toggle Support
  const pBoxes = document.querySelectorAll(".portfolio___section .p__box");
  pBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      pBoxes.forEach((b) => {
        if (b !== box) b.classList.remove("is-expanded");
      });
      box.classList.toggle("is-expanded");
    });
  });

  // 6. Services Swiper Carousel (8 Cards)
  if (window.Swiper && document.querySelector(".Service_slider")) {
    new Swiper(".Service_slider", {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: { slidesPerView: 1.1, slidesPerGroup: 1 },
        640: { slidesPerView: 2, slidesPerGroup: 2 },
        1024: { slidesPerView: 3, slidesPerGroup: 2 },
        1360: { slidesPerView: 4, slidesPerGroup: 2 },
      },
    });
  }

  // 7. Testimonials Swiper Carousel (2 Cards side-by-side)
  if (window.Swiper && document.querySelector(".text__testimonial_carousel")) {
    new Swiper(".text__testimonial_carousel", {
      slidesPerView: 1,
      spaceBetween: 22,
      loop: true,
      autoplay: {
        delay: 3800,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".test-next",
        prevEl: ".test-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        992: { slidesPerView: 2 },
      },
    });
  }

  // 8. FAQ Accordion (Single open at a time)
  const faqItems = document.querySelectorAll(".tb-faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".tb-faq-item__question");
    if (btn) {
      btn.addEventListener("click", () => {
        faqItems.forEach((other) => {
          if (other !== item) other.classList.remove("active");
        });
        item.classList.toggle("active");
      });
    }
  });

  // 9. Animated Counters on Scroll
  const counters = document.querySelectorAll(".wc-counter");
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || "100", 10);
    const suffix = el.dataset.suffix || "+";
    const padZero = el.dataset.pad === "true";
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = Math.floor(eased * target);
      const formatted =
        padZero && current < 10 ? "0" + current : String(current);
      el.textContent = formatted + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // 10. Interactive Studio Team Panorama Tooltip
  const memberTip = document.getElementById("member-tip");
  const nameEl = memberTip ? memberTip.querySelector(".member-name") : null;
  const roleEl = memberTip ? memberTip.querySelector(".member-role") : null;

  document.querySelectorAll(".team-person-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (!memberTip) return;
      nameEl.textContent = card.dataset.name;
      roleEl.textContent = card.dataset.role;
      memberTip.hidden = false;
    });
    card.addEventListener("mousemove", (e) => {
      if (!memberTip) return;
      memberTip.style.left = e.clientX + "px";
      memberTip.style.top = e.clientY + "px";
    });
    card.addEventListener("mouseleave", () => {
      if (!memberTip) return;
      memberTip.hidden = true;
    });
  });

  // 11. Lead Capture / Project Brief Modal
  const modalBackdrop = document.getElementById("projectModal");
  const openModalBtns = document.querySelectorAll("[data-tb-open-popup]");
  const closeModalBtn = document.getElementById("closeProjectModal");
  const projectForm = document.getElementById("tbProjectForm");
  const formSuccess = document.getElementById("tbFormSuccess");

  // 12. Dark Mode Navbar Toggle (with localStorage persistence)
  const themeToggleBtn = document.getElementById("themeToggle");
  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    }
  };

  window.toggleDarkMode = () => {
    const isNowDark = !document.body.classList.contains("dark-mode");
    applyTheme(isNowDark);
    try {
      localStorage.setItem("tb_theme", isNowDark ? "dark" : "light");
    } catch (e) {}
  };

  try {
    const savedTheme = localStorage.getItem("tb_theme");
    if (savedTheme === "dark") {
      applyTheme(true);
    }
  } catch (e) {}

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (modalBackdrop) modalBackdrop.classList.add("is-open");
    });
  });

  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener("click", () =>
      modalBackdrop.classList.remove("is-open")
    );
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove("is-open");
    });
  }

  if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formSuccess) {
        formSuccess.style.display = "block";
      }
      setTimeout(() => {
        projectForm.reset();
        if (formSuccess) formSuccess.style.display = "none";
        if (modalBackdrop) modalBackdrop.classList.remove("is-open");
      }, 2200);
    });
  }
});


// 13. Futuristic 3D Holographic Tilt & Cursor Glow Effect on Cards
document.addEventListener("DOMContentLoaded", function () {
  const tiltCards = document.querySelectorAll(
    ".bx__about, .service-item, .counter-item, .client-box, .test__bx, .team-person-card"
  );

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});


// 14. Founder's Full Journey Popup Modal Toggle
document.addEventListener("DOMContentLoaded", function () {
  const founderModal = document.getElementById("founderModal");
  const openFounderBtn = document.getElementById("openFounderModal");
  const closeFounderBtn = document.getElementById("closeFounderModal");

  if (openFounderBtn && founderModal) {
    openFounderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      founderModal.classList.add("is-open");
    });
  }

  if (closeFounderBtn && founderModal) {
    closeFounderBtn.addEventListener("click", () => {
      founderModal.classList.remove("is-open");
    });
    founderModal.addEventListener("click", (e) => {
      if (e.target === founderModal) {
        founderModal.classList.remove("is-open");
      }
    });
  }
});


// 15. Interactive Customer Service Enquiry Panel & Direct WhatsApp Quote Builder
document.addEventListener("DOMContentLoaded", function () {
  const tabBtns = document.querySelectorAll(".enquiry-tab-btn");
  const detailPanels = document.querySelectorAll(".enquiry-detail-card");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-service-key");
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      detailPanels.forEach((panel) => {
        if (panel.getAttribute("data-service-panel") === key) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // Dynamic WhatsApp Quote Link with Optional Customer Note
  document.querySelectorAll(".whatsapp-quote-btn").forEach((quoteBtn) => {
    quoteBtn.addEventListener("click", function (e) {
      const card = quoteBtn.closest(".enquiry-detail-card");
      const serviceTitle = quoteBtn.getAttribute("data-service-title") || "Digital Marketing Service";
      const noteInput = card ? card.querySelector(".enquiry-custom-note") : null;
      const customNote = noteInput && noteInput.value.trim() ? noteInput.value.trim() : "";

      let message = `Hi Tea Biscuit Media! I would like to ask for a quote for *${serviceTitle}*.`;
      if (customNote) {
        message += `\n\nProject Details: ${customNote}`;
      }
      const waUrl = `https://wa.me/919740778748?text=${encodeURIComponent(message)}`;
      quoteBtn.setAttribute("href", waUrl);
    });
  });
});


// 16. Our Creative Collective 4-Column Team Swiper Carousel (9 Total Columns)
document.addEventListener("DOMContentLoaded", function () {
  if (window.Swiper && document.querySelector(".collective-swiper")) {
    new Swiper(".collective-swiper", {
      slidesPerView: 1,
      spaceBetween: 22,
      loop: true,
      autoplay: {
        delay: 3800,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".collective-next",
        prevEl: ".collective-prev",
      },
      breakpoints: {
        320: { slidesPerView: 1.15, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 18 },
        992: { slidesPerView: 3, spaceBetween: 20 },
        1200: { slidesPerView: 4, spaceBetween: 22 },
      },
    });
  }
});


// 17. Pop-Up Page View Navigation (Opens Target Section With Bouncy Popping Animation Instead of Scrolling Down)
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("sectionPopOverlay");
  const contentBox = document.getElementById("sectionPopContent");
  const titleEl = document.getElementById("sectionPopTitle");
  const closeBtn = document.getElementById("closeSectionPop");
  const offcanvas = document.getElementById("offcanvasArea");

  if (!overlay || !contentBox) return;

  const sectionLabels = {
    "#enquiry-panel": "Services & Instant WhatsApp Quote",
    "#services-section": "Digital Marketing Channels",
    "#portfolio": "ROAS & Campaign Case Studies",
    "#about": "6-Pillar Growth Framework",
    "#founder": "Leadership — Founder & Technical Head",
    "#creative-team": "Our Creative Collective",
    "#faq": "Frequently Asked Questions",
    "#contact": "Start Your Growth Engine",
  };

  let activeSection = null;
  let placeholderNode = null;

  function restoreActiveSection() {
    if (activeSection && placeholderNode && placeholderNode.parentNode) {
      placeholderNode.parentNode.insertBefore(activeSection, placeholderNode);
      placeholderNode.parentNode.removeChild(placeholderNode);
    }
    activeSection = null;
    placeholderNode = null;
  }

  function closeSectionPop() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    restoreActiveSection();
  }

  function openSectionPop(hash, triggerLink) {
    const target = document.querySelector(hash);
    if (!target || target.tagName !== "SECTION") return false;

    // Close offcanvas menu if open
    if (offcanvas) offcanvas.classList.remove("is-open");

    // Restore any previously popped section before popping the new one
    restoreActiveSection();

    // Re-trigger popping spring animation cleanly
    overlay.classList.remove("is-open");
    void overlay.offsetWidth;

    placeholderNode = document.createComment("section-pop-anchor:" + hash);
    target.parentNode.insertBefore(placeholderNode, target);
    contentBox.innerHTML = "";
    contentBox.appendChild(target);
    contentBox.scrollTop = 0;
    activeSection = target;

    const labelText =
      sectionLabels[hash] ||
      (triggerLink ? triggerLink.textContent.trim().replace(/\s+/g, " ") : "Explore");
    if (titleEl) titleEl.textContent = labelText;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Update active state on desktop navbar pills
    document.querySelectorAll(".main-menu > ul > li > a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === hash);
    });

    // Notify Swipers or responsive layouts inside the popped section
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);

    return true;
  }

  // Intercept all internal section anchor clicks (Navbar, Offcanvas Drawer, Hero & Footer buttons)
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    // Home (#top): close pop-up and trigger crisp hero pop animation without scrolling down
    if (hash === "#top") {
      e.preventDefault();
      if (offcanvas) offcanvas.classList.remove("is-open");
      closeSectionPop();
      window.scrollTo(0, 0);
      document.querySelectorAll(".main-menu > ul > li > a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#top");
      });
      const hero = document.querySelector(".intro-area");
      if (hero) {
        hero.classList.remove("hero-pop-pulse");
        void hero.offsetWidth;
        hero.classList.add("hero-pop-pulse");
      }
      return;
    }

    // Ignore non-section placeholder anchors (e.g. #instagram, #linkedin, #github)
    const targetEl = document.querySelector(hash);
    if (!targetEl || targetEl.tagName !== "SECTION") return;

    e.preventDefault();
    openSectionPop(hash, link);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSectionPop);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeSectionPop();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeSectionPop();
    }
  });
});
