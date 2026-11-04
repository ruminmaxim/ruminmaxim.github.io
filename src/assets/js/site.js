(function () {
  const savedScrollKey = "portfolioHomeScroll";
  const pendingScrollKey = "portfolioRestoreScroll";
  const isHome = document.querySelector(".newHomeMain") !== null;
  const homePath = document.querySelector('.newHeroLanguages a[aria-current="page"]')?.pathname || window.location.pathname;

  if (isHome) {
    document.querySelectorAll('a[href$="-ru.html"], a[href$="-eng.html"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        try {
          sessionStorage.setItem(savedScrollKey, JSON.stringify({ path: homePath, y: window.scrollY, time: Date.now() }));
        } catch { /* Navigation still works when storage is unavailable. */ }
      });
    });

    window.addEventListener("pageshow", () => {
      try {
        const pending = JSON.parse(sessionStorage.getItem(pendingScrollKey) || "null");
        sessionStorage.removeItem(pendingScrollKey);
        if (pending?.path !== homePath || !Number.isFinite(pending.y)) return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          window.scrollTo({ top: pending.y, behavior: "instant" });
        }));
      } catch { /* The home page remains usable without scroll restoration. */ }
    });
  }

  const returnHomeLink = document.querySelector("[data-return-home]");
  if (returnHomeLink) {
    returnHomeLink.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      try {
        const saved = JSON.parse(sessionStorage.getItem(savedScrollKey) || "null");
        const targetPath = new URL(returnHomeLink.href).pathname;
        if (saved?.path === targetPath && Number.isFinite(saved.y) && Date.now() - saved.time < 30 * 60 * 1000) {
          sessionStorage.setItem(pendingScrollKey, JSON.stringify(saved));
        }
        sessionStorage.removeItem(savedScrollKey);
      } catch { /* The link still returns to the canonical home page. */ }
    });
  }

  const openContactsButtons = document.querySelectorAll("[data-open-contacts]");

  openContactsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = "overlay";
    });
  });

  const mobileMenu = document.querySelector(".mobileMenu");
  const menuButton = document.querySelector(".menuIconContainer");

  if (mobileMenu && menuButton) {
    const setMenuState = (isOpen) => {
      mobileMenu.classList.toggle("menuOpen", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    };

    const toggleMenu = () => setMenuState(!mobileMenu.classList.contains("menuOpen"));

    menuButton.addEventListener("click", toggleMenu);

    document.querySelectorAll("[data-close-menu]").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });
  }

  if (typeof window.tippy === "function") {
    window.tippy(".skill, .newHeroTag", {
      placement: "bottom",
      trigger: "click",
      interactive: true,
      theme: "myTheme",
      zIndex: 1
    });
  }
})();
