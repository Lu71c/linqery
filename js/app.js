/* ==========================================================================
   LINQERY™ — ENGINE CONTROLLER (js/app.js)
   Target: Vanilla ES6+, Zero dipendenze, < 4KB, Reattività 60-120 FPS
   Gestione: Tab Casi Studio, FAQ Esclusive, Invio Asincrono Form, Smooth Nav
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================================
     1. GESTIONE STATO HEADER ALLO SCROLL
     ========================================================================== */
  const header = document.querySelector(".header-fixed");
  
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. NAVIGAZIONE INTERNA & SCROLL OFFSET
     ========================================================================== */
  const internalNavLinks = document.querySelectorAll('a[href^="#"]');

  internalNavLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 72;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        // Aggiorna la cronologia dell'URL senza refresh
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ==========================================================================
     3. VETRINA TAB CASI STUDIO (Switch Immediato Zero-Lag)
     ========================================================================== */
  const tabButtons = document.querySelectorAll(".cases-tab-interface .tab-btn");
  const tabPanels = document.querySelectorAll(".cases-tab-interface .case-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPanelId = btn.getAttribute("data-tab-target");
      if (!targetPanelId) return;

      // Rimozione classi attive
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      // Attivazione elemento selezionato
      btn.classList.add("active");
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     4. FAQ ACCORDION ESCLUSIVO (<details> Nativo con Chiusura Automatica)
     ========================================================================== */
  const faqItems = document.querySelectorAll(".faq-stack .faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      // Quando un blocco viene aperto, chiude gli altri per mantenere la pagina ordinata
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
     5. MODULO AUDIT CANDIDATURA (Invio Asincrono & Generazione Ricevuta)
     ========================================================================== */
  const auditForm = document.getElementById("auditForm");
  const formFeedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("btnSubmitForm");

  if (auditForm) {
    auditForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Estrazione campi
      const azienda = document.getElementById("f_azienda")?.value.trim() || "";
      const sito = document.getElementById("f_sito")?.value.trim() || "";
      const nome = document.getElementById("f_nome")?.value.trim() || "";
      const telefono = document.getElementById("f_telefono")?.value.trim() || "";
      const email = document.getElementById("f_email")?.value.trim() || "";

      // Validazione base
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

      // Stato di caricamento visivo del pulsante
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

      // Iniezione animazione di caricamento CSS se non presente
      if (!document.getElementById("spinAnimation")) {
        const style = document.createElement("style");
        style.id = "spinAnimation";
        style.textContent = "@keyframes spin { 100% { transform: rotate(360deg); } }";
        document.head.appendChild(style);
      }

      // Simulazione dispatch sicuro verso webhook backend / Telegram bot
      setTimeout(() => {
        const auditId = "LQ-" + Math.floor(10000 + Math.random() * 90000);
        const dataOggi = new Date().toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });

        // Risposta a schermo senza ricaricare la pagina
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

        // Reset del form e ripristino pulsante
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
     6. KPI NUMBER TICKER ON SCROLL (Animazione Fluida Contatori)
     ========================================================================== */
  const statNumbers = document.querySelectorAll(".metric-number, .num-big");

  const animateNumber = (element) => {
    const rawText = element.textContent.trim();
    const isPlus = rawText.startsWith("+");
    const isTimes = rawText.startsWith("×");
    const isPercentage = rawText.endsWith("%");
    
    // Estrae solo la componente numerica
    const numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    let startTime = null;
    const duration = 1200; // ms

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * numericValue);

      let formatted = current.toString();
      if (current >= 1000) {
        formatted = (current / 1000).toFixed(3).replace(".", ".");
      }

      element.textContent = `${isPlus ? "+" : ""}${isTimes ? "×" : ""}${formatted}${isPercentage ? "%" : ""}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = rawText; // Ripristina stringa originale esatta
      }
    };

    window.requestAnimationFrame(step);
  };

  // Trigger tramite IntersectionObserver per azionare i numeri solo quando visibili
  if ("IntersectionObserver" in window) {
    const kpiObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach((el) => {
      if (el.textContent.trim() !== "???") {
        kpiObserver.observe(el);
      }
    });
  }
});
