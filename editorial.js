function setupEditorialNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  let queued = false;
  const update = () => {
    queued = false;
    const logo = nav.querySelector('.site-mark-link');
    if (!logo) return;
    const rect = logo.getBoundingClientRect();
    const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
    const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
    const underlying = document.elementsFromPoint(x, y).find(node => !nav.contains(node) && node.closest('section,footer'));
    const section = underlying?.closest('section,footer');
    const darkHero = section?.matches('.hero-sequence,.about-brush-hero,.wedding-hero,.home-video-process,.site-footer') ||
      (section?.matches('.page-hero') && !document.body.hasAttribute('data-project-slug') && !document.body.hasAttribute('data-editorial-legal'));
    nav.style.setProperty('--nav-ink', darkHero ? '#ffffff' : 'var(--ink)');
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  update();
}

function setupPhotoLightbox() {
  const links = [...document.querySelectorAll('.photo-tile > a')];
  if (!links.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-lightbox';
  dialog.setAttribute('aria-label', 'Fotografie in voller Ansicht');
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  const caption = document.createElement('figcaption');
  caption.setAttribute('aria-live', 'polite');
  figure.append(image, caption);
  dialog.append(figure);
  let index = 0, opener;
  const show = value => {
    index = (value + links.length) % links.length;
    image.src = links[index].href;
    image.alt = links[index].querySelector('img').alt;
    caption.textContent = `${index + 1} / ${links.length} · ${image.alt}`;
  };
  const button = (name, icon, action, key) => {
    const element = document.createElement('button');
    element.type = 'button'; element.title = name; element.setAttribute('aria-label', name); element.dataset[key] = '';
    const symbol = document.createElement('img');
    symbol.src = `assets/icons/${icon}.svg`; symbol.alt = ''; symbol.width = 22; symbol.height = 22;
    symbol.style.cssText = 'width:22px;height:22px;filter:invert(1)';
    element.append(symbol); element.addEventListener('click', action); dialog.append(element);
    return element;
  };
  const close = button('Schließen', 'x', () => dialog.close(), 'close');
  button('Vorheriges Bild', 'chevron-left', () => show(index - 1), 'prev');
  button('Nächstes Bild', 'chevron-right', () => show(index + 1), 'next');
  dialog.addEventListener('close', () => opener?.focus());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  document.body.append(dialog);
  links.forEach((link, item) => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; show(item); dialog.showModal(); close.focus();
  }));
}

function setupPortraitWebGL() {
  const surface = document.querySelector('[data-webgl-portrait]');
  if (!surface || !matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)').matches || navigator.connection?.saveData) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    import('./about-reveal.js?v=0.5.39-staging.1').then(module => module.mountPortraitReveal(surface)).catch(() => {});
  }, { rootMargin: '100px' });
  observer.observe(surface);
}

setupEditorialNav();
setupPhotoLightbox();
setupPortraitWebGL();
