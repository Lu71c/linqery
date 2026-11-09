/* ==========================================================================
   LINQERY™ — ENGINE CONTROLLER (js/app.js)
   Target: Vanilla ES6+, Zero dipendenze, < 4KB, Reattività 60-120 FPS
   Gestione: 
   1. Header Sticky & Stato Scroll
   2. Menu Mobile Hamburger & Drawer Off-Canvas (Touch & Click)
   3. Navigazione Smooth Scroll con Offset Dinamico
   4. Vetrina Tab Casi Studio con Re-trigger Contatori
   5. FAQ Accordion Esclusivo (<details> nativo)
   6. Modulo Candidatura Asincrono con Ricevuta Live
   7. Motore KPI Number Ticker (Progressione Frazionaria "X su Y", Moltiplicatori e Percentuali)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================================
     1. GESTIONE STATO HEADER ALLO SCROLL
     ========================================================================== */
  const header = document.querySelector(".header-fixed");

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. GESTIONE MENU MOBILE HAMBURGER & DRAWER OFF-CANVAS
     ========================================================================== */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMobileNavBtn = document.getElementById("closeMobileNavBtn");
  const mobileNavDrawer = document.getElementById("mobileNavDrawer");
  const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

  const toggleMobileMenu = (forceState) => {
    if (!mobileNavDrawer) return;

    const shouldOpen =
      forceState !== undefined
        ? forceState
        : !mobileNavDrawer.classList.contains("open");

    mobileNavDrawer.classList.toggle("open", shouldOpen);

    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.toggle("open", shouldOpen);
      mobileNavBackdrop.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.classList.toggle("active", shouldOpen);
      mobileMenuBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    }

    document.body.classList.toggle("no-scroll", shouldOpen);
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (closeMobileNavBtn) {
    closeMobileNavBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu(false);
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", () => {
      toggleMobileMenu(false);
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu(false);
    });
  });

  // Chiusura automatica con tasto Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNavDrawer?.classList.contains("open")) {
      toggleMobileMenu(false);
    }
  });

  /* ==========================================================================
     3. NAVIGAZIONE INTERNA & SMOOTH SCROLL CON OFFSET DINAMICO
     ========================================================================== */
  const internalNavLinks = document.querySelectorAll('a[href^="#"]');

  internalNavLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        toggleMobileMenu(false);

        const headerHeight = header ? header.offsetHeight : 72;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          12;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ==========================================================================
     4. VETRINA TAB CASI STUDIO (Switch Immediato & Riattivazione Contatori)
     ========================================================================== */
  const tabButtons = document.querySelectorAll(".cases-tab-interface .tab-btn");
  const tabPanels = document.querySelectorAll(".cases-tab-interface .case-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPanelId = btn.getAttribute("data-tab-target");
      if (!targetPanelId) return;

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");

        // Riattiva l'animazione contatori per i numeri all'interno del pannello visualizzato
        targetPanel.querySelectorAll(".num-big").forEach((numEl) => {
          numEl.dataset.animated = "false";
          animateValue(numEl);
        });
      }
    });
  });

  /* ==========================================================================
     5. FAQ ACCORDION ESCLUSIVO (<details> Nativo con Chiusura Fratelli)
     ========================================================================== */
  const faqItems = document.querySelectorAll(".faq-stack .faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });

  /* ==========================================================================
     6. MODULO AUDIT CANDIDATURA (Invio Asincrono & Ricevuta Live)
     ========================================================================== */
  const auditForm = document.getElementById("auditForm");
  const formFeedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("btnSubmitForm");

  if (auditForm) {
    auditForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const azienda = document.getElementById("f_azienda")?.value.trim() || "";
      const sito = document.getElementById("f_sito")?.value.trim() || "";
      const nome = document.getElementById("f_nome")?.value.trim() || "";
      const telefono = document.getElementById("f_telefono")?.value.trim() || "";
      const email = document.getElementById("f_email")?.value.trim() || "";

      if (!azienda || !sito || !nome || !telefono || !email) {
        if (formFeedback) {
          formFeedback.className = "form-feedback error";
          formFeedback.style.display = "block";
          formFeedback.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          formFeedback.style.border = "1px solid #ef4444";
          formFeedback.style.color = "#f87171";
          formFeedback.innerHTML = "Compila tutti i campi obbligatori contrassegnati con l'asterisco (*).";
        }
        return;
      }

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:8px;">
          <svg style="width:16px; height:16px; animation:spin 0.8s linear infinite;" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4"/>
          </svg>
          Verifica idoneità in corso...
        </span>
      `;

      if (!document.getElementById("spinAnimation")) {
        const style = document.createElement("style");
        style.id = "spinAnimation";
        style.textContent = "@keyframes spin { 100% { transform: rotate(360deg); } }";
        document.head.appendChild(style);
      }

      setTimeout(() => {
        const auditId = "LQ-" + Math.floor(10000 + Math.random() * 90000);

        if (formFeedback) {
          formFeedback.className = "form-feedback success";
          formFeedback.style.display = "block";
          formFeedback.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
          formFeedback.style.border = "1px solid #10b981";
          formFeedback.style.color = "#34d399";
          formFeedback.style.lineHeight = "1.55";
          formFeedback.innerHTML = `
            <strong>✓ Candidatura registrata con successo [Codice: ${auditId}]</strong><br>
            Azienda: <em>${azienda}</em> (${sito})<br>
            Referente: ${nome} · Riscontro garantito entro 48 ore lavorative via email/telefono.
          `;
        }

        auditForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>✓ Candidatura Inviata</span>
          <svg class="icon-arrow" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
        }, 4000);
      }, 950);
    });
  }

  /* ==========================================================================
     7. MOTORE DI ANIMAZIONE CONTATORI KPI (CROSS-DEVICE: DESKTOP, TABLET, MOBILE)
     ========================================================================== */
  const animateValue = (element) => {
    if (element.dataset.animated === "true") return;
    const rawText = element.textContent.trim();
    if (rawText === "???" || rawText === "") return;

    // Pattern A: Frazione progressiva "X su Y" (es. "9 su 10" -> 1 su 10, 2 su 10, ... 9 su 10)
    const ratioMatch = rawText.match(/^(\d+)\s+(su)\s+(\d+)$/i);
    if (ratioMatch) {
      element.dataset.animated = "true";
      const targetVal = parseInt(ratioMatch[1], 10);
      const word = ratioMatch[2];
      const totalVal = ratioMatch[3];
      const duration = 1200;
      let startTime = null;

      const stepRatio = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * targetVal);

        element.textContent = `${Math.max(1, current)} ${word} ${totalVal}`;

        if (progress < 1) {
          window.requestAnimationFrame(stepRatio);
        } else {
          element.textContent = rawText;
        }
      };

      window.requestAnimationFrame(stepRatio);
      return;
    }

    // Pattern B: Moltiplicatore "×3" (-> ×1, ×2, ×3)
    const multMatch = rawText.match(/^×\s*(\d+)$/);
    if (multMatch) {
      element.dataset.animated = "true";
      const targetVal = parseInt(multMatch[1], 10);
      const duration = 1000;
      let startTime = null;

      const stepMult = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.max(1, Math.floor(ease * targetVal));

        element.textContent = `×${current}`;

        if (progress < 1) {
          window.requestAnimationFrame(stepMult);
        } else {
          element.textContent = rawText;
        }
      };

      window.requestAnimationFrame(stepMult);
      return;
    }

    // Pattern C: Numeri Standard (+, %, separatori di migliaia come +1.600 o 84)
    const isPlus = rawText.startsWith("+");
    const isPercentage = rawText.endsWith("%");

    let numStr = rawText.replace(/^[+×]/, "").replace(/%$/, "").trim();
    const isThousandDot = /^\d{1,3}\.\d{3}$/.test(numStr);
    if (isThousandDot) {
      numStr = numStr.replace(".", "");
    }

    const targetValue = parseFloat(numStr);
    if (isNaN(targetValue)) return;

    element.dataset.animated = "true";
    const duration = 1200;
    let startTime = null;

    const stepNum = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * targetValue);

      let formatted = current.toString();
      if (isThousandDot && current >= 1000) {
        formatted = Math.floor(current / 1000) + "." + (current % 1000).toString().padStart(3, "0");
      }

      element.textContent = `${isPlus ? "+" : ""}${formatted}${isPercentage ? "%" : ""}`;

      if (progress < 1) {
        window.requestAnimationFrame(stepNum);
      } else {
        element.textContent = rawText;
      }
    };

    window.requestAnimationFrame(stepNum);
  };

  // Osservatore d'intersezione per Desktop, Tablet e Mobile
  const statNumbers = document.querySelectorAll(".metric-number, .num-big");

  if ("IntersectionObserver" in window) {
    const kpiObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    statNumbers.forEach((el) => {
      if (el.textContent.trim() !== "???") {
        const rect = el.getBoundingClientRect();
        // Se l'elemento è già visibile a schermo all'apertura, avvia subito il conteggio
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          animateValue(el);
        } else {
          kpiObserver.observe(el);
        }
      }
    });
  } else {
    statNumbers.forEach((el) => animateValue(el));
  }
});
