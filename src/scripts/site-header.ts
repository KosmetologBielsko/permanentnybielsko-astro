const header = document.querySelector<HTMLElement>('[data-site-header]');
const button = header?.querySelector<HTMLButtonElement>('[data-menu-button]');
const dialog = header?.querySelector<HTMLDialogElement>('[data-header-dialog]');
const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-menu-close]');
const services = header?.querySelector<HTMLDetailsElement>('[data-services-menu]');

if (header && button && dialog && closeButton && !header.dataset.ready) {
  header.dataset.ready = 'true';
  const desktop = window.matchMedia('(min-width: 1180px)');
  let htmlOverflow = '';
  let bodyOverflow = '';
  const closeMenu = () => { if (dialog.open) dialog.close(); };
  button.addEventListener('click', () => {
    if (dialog.open) return closeMenu();
    htmlOverflow = document.documentElement.style.overflow;
    bodyOverflow = document.body.style.overflow;
    dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Zamknij menu');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });
  closeButton.addEventListener('click', closeMenu);
  dialog.addEventListener('close', () => {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Otwórz menu');
    document.documentElement.style.overflow = htmlOverflow;
    document.body.style.overflow = bodyOverflow;
    (desktop.matches ? header.querySelector<HTMLAnchorElement>('.bph-logo') : button)?.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
  });
  dialog.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', closeMenu));
  desktop.addEventListener('change', () => { closeMenu(); if (services) services.open = false; });
  document.addEventListener('click', event => {
    if (services && event.target instanceof Node && !services.contains(event.target)) services.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && services?.open) {
      services.open = false;
      services.querySelector('summary')?.focus();
    }
  });
  services?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { services.open = false; }));
  window.addEventListener('pagehide', () => { closeMenu(); if (services) services.open = false; });
}
