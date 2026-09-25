// Native links remain usable when the dialog API or JavaScript is unavailable.
function initGallery() {
  const gallery = document.querySelector<HTMLElement>("main.pmu-gallery");
  const dialog = gallery?.querySelector<HTMLDialogElement>("[data-pmu-gallery-dialog]");
  if (!gallery || !dialog || typeof dialog.showModal !== "function" || gallery.dataset.ready) return;
  gallery.dataset.ready = "true";
  const get = <T extends HTMLElement>(name: string) => dialog.querySelector<T>(`[data-pmu-dialog-${name}]`)!;
  const picture = get<HTMLImageElement>("image");
  const video = get<HTMLVideoElement>("video");
  const error = get<HTMLElement>("error");
  const close = get<HTMLButtonElement>("close");
  const stage = get<HTMLElement>("stage");
  const original = get<HTMLAnchorElement>("original");
  const service = get<HTMLAnchorElement>("service");
  let items: HTMLAnchorElement[] = [];
  let index = 0;
  let opener: HTMLAnchorElement | null = null;
  let kind = "";
  let htmlOverflow = "";
  let bodyOverflow = "";
  let start: { id: number; x: number; y: number } | null = null;
  const pointers = new Set<number>();

  function analyticsGalleryId(section: HTMLElement) {
    return (section.id || section.dataset.mediaLabel || "pmu-gallery")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 160) || "pmu-gallery";
  }

  function clearMedia() {
    kind = "";
    picture.hidden = true;
    picture.removeAttribute("src");
    video.hidden = true;
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    video.removeAttribute("poster");
    error.hidden = true;
    start = null;
  }
  function render() {
    clearMedia();
    const item = items[index];
    const section = item.closest<HTMLElement>("[data-pmu-gallery-section]")!;
    kind = item.hasAttribute("data-pmu-video") ? "video" : "image";
    window.dispatchEvent(new CustomEvent("pa:gallery-view", {
      detail: {
        galleryId: analyticsGalleryId(section),
        assetUrl: item.href,
        assetKind: kind
      }
    }));
    get("counter").textContent = `${section.dataset.mediaLabel} · ${index + 1} / ${items.length}`;
    get("caption").textContent = item.dataset.mediaCaption || "";
    original.href = item.href;
    original.textContent = kind === "video" ? "Otwórz pełny film ↗" : "Otwórz pełne zdjęcie ↗";
    service.href = section.dataset.serviceHref!;
    service.textContent = `${section.dataset.serviceLabel} →`;
    if (kind === "video") {
      video.hidden = false;
      video.muted = true;
      video.poster = item.dataset.mediaPoster || "";
      video.src = item.href;
      void video.play().catch(() => { /* Native controls allow another play attempt. */ });
    } else {
      picture.alt = item.dataset.mediaAlt || item.dataset.mediaCaption || "Zdjęcie z galerii";
      picture.hidden = false;
      picture.src = item.href;
    }
  }
  function move(step: number) {
    if (!dialog.open || items.length < 2) return;
    index = (index + step + items.length) % items.length;
    render();
  }
  gallery.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest<HTMLAnchorElement>("a[data-pmu-photo], a[data-pmu-video]");
    const section = link?.closest<HTMLElement>("[data-pmu-gallery-section]");
    if (!link || !section) return;
    // Only suppress the ordinary link once opening has succeeded.
    try { dialog.showModal(); } catch { return; }
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("pa:gallery-open", {
      detail: { galleryId: analyticsGalleryId(section) }
    }));
    opener = link;
    items = Array.from(section.querySelectorAll<HTMLAnchorElement>("a[data-pmu-photo], a[data-pmu-video]"));
    index = items.indexOf(link);
    htmlOverflow = document.documentElement.style.overflow;
    bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    render();
    close.focus({ preventScroll: true });
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    clearMedia();
    pointers.clear();
    document.documentElement.style.overflow = htmlOverflow;
    document.body.style.overflow = bodyOverflow;
    opener?.focus({ preventScroll: true });
  });
  get("prev").addEventListener("click", () => move(-1));
  get("next").addEventListener("click", () => move(1));
  dialog.addEventListener("keydown", (event) => {
    if (kind !== "image" || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  picture.addEventListener("error", () => {
    if (dialog.open && kind === "image" && picture.getAttribute("src")) {
      picture.hidden = true;
      error.hidden = false;
    }
  });
  video.addEventListener("error", () => {
    if (dialog.open && kind === "video" && video.error) {
      video.hidden = true;
      error.hidden = false;
    }
  });
  stage.addEventListener("pointerdown", (event) => {
    pointers.add(event.pointerId);
    if (kind !== "image" || event.pointerType === "mouse" || pointers.size !== 1) { start = null; return; }
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener("pointerup", (event) => {
    const origin = start;
    pointers.delete(event.pointerId);
    start = null;
    if (!origin || origin.id !== event.pointerId || kind !== "image") return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) >= 60 && Math.abs(dx) > 1.4 * Math.abs(dy)) move(dx < 0 ? 1 : -1);
  });
  stage.addEventListener("pointercancel", (event) => { pointers.delete(event.pointerId); start = null; });
}
initGallery();
