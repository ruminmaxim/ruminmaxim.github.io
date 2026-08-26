(function () {
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
    window.tippy(".skill", {
      placement: "bottom",
      trigger: "click",
      interactive: true,
      theme: "myTheme",
      zIndex: 1
    });
  }
})();
