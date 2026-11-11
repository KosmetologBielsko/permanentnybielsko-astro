// Progressive enhancement: ordinary anchor links and all photos work without JS.
function initMobileGallery() {
  const gallery = document.querySelector<HTMLElement>("main.pmu-gallery");
  const nav = gallery?.querySelector<HTMLElement>(".pmu-gallery-nav");
  if (!gallery || !nav || gallery.dataset.mobileReady) return;
  gallery.dataset.mobileReady = "true";
  const sections = Array.from(gallery.querySelectorAll<HTMLElement>("[data-pmu-gallery-section]"));
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const phone = window.matchMedia("(max-width: 640px)");
  let active = sections[0];

  function sectionForHash(hash: string) {
    return sections.find((section) => `#${section.id}` === hash || `#${section.id}-tytul` === hash);
  }

  function show(section: HTMLElement) {
    active = section;
    sections.forEach((item) => { item.hidden = phone.matches && item !== active; });
    links.forEach((link) => {
      if (phone.matches && link.hash === `#${active.id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function scrollToSection(section: HTMLElement) {
    const offset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top - offset, behavior: "instant" });
  }

  function syncLocation() {
    const target = sectionForHash(window.location.hash);
    show(target || sections[0]);
    if (phone.matches && target) requestAnimationFrame(() => scrollToSection(target));
  }

  document.addEventListener("click", (event) => {
    if (!phone.matches || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href^='#']");
    const target = link && sectionForHash(link.hash);
    if (!target) return;
    event.preventDefault();
    show(target);
    if (window.location.hash !== link!.hash) window.history.pushState(null, "", link!.hash);
    scrollToSection(target);
    const heading = target.querySelector<HTMLElement>("h2");
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  });
  window.addEventListener("popstate", syncLocation);
  window.addEventListener("hashchange", syncLocation);
  phone.addEventListener("change", () => show(sectionForHash(window.location.hash) || active));
  syncLocation();
}

initMobileGallery();
