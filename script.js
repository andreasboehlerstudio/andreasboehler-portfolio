const nav = document.querySelector(".site-nav");
const navPanel = document.querySelector(".nav-panel");
const menuButton = document.querySelector(".menu-button");
const navItems = document.querySelectorAll(".nav-item");
const hero = document.querySelector(".hero-sequence");
const heroFrame = document.querySelector(".hero-frame");
const heroFrameColor = document.querySelector(".hero-frame-color");
const heroTitle = document.querySelector(".hero-sticky h1");
const heroBrushSurface = document.querySelector(".hero-sticky");
const pageShell = document.querySelector(".page-shell");
const siteFooter = document.querySelector(".site-footer");
const footerSpacer = document.querySelector(".footer-reveal-spacer");
const themeStorageKey = "andreas-boehler-theme";
const consentStorageKey = "andreas-boehler-consent-v1";
const loaderQuoteStorageKey = "andreas-boehler-loader-quote-seen";
const consentCategories = ["statistics", "marketing", "external"];
const defaultConsent = {
  necessary: true,
  statistics: false,
  marketing: false,
  external: false,
  decided: false,
  version: 1
};
const brandMarkPath = "M58.41,25.69l-14.2-2.75c.29-1.1.44-2.35.44-3.75,0-4.69-1.28-7.92-3.84-9.72-2.56-1.79-6.16-2.69-10.81-2.69h-12.17v11.04l-7.26-1.41v9.16l7.26,1.26v.02l10.83,1.61,17.53,2.6-.1.02.28.04-3.14.47s-.01-.01-.02-.02l-9.86,1.6s0,0,0,0l-5.83.95h0s-9.69,1.57-9.69,1.57h0s-7.26,1.18-7.26,1.18v8.85l7.26-1.4v10.32h14.29c9.29,0,13.94-4.69,13.94-14.06,0-.58-.02-1.14-.06-1.69l12.41-2.39v-10.81ZM27.52,13.46h1.83c2.32,0,4.04.46,5.14,1.39,1.1.93,1.65,2.45,1.65,4.58,0,.7-.04,1.34-.12,1.92l-8.51-1.65v-6.24ZM35.28,46c-.96,1.18-2.63,1.77-4.99,1.77h-2.78v-5.33l9.21-1.77c-.03,2.42-.52,4.2-1.44,5.33Z";
let activeConsent = null;

function createBrandGlyph(className = "brand-glyph") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 66 62");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  path.setAttribute("d", brandMarkPath);
  path.setAttribute("fill", "currentColor");
  path.setAttribute("pathLength", "1");
  svg.append(path);

  return svg;
}

function createTextWordmark(className, lines, options = {}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const {
    viewBox = "0 0 118 38",
    y = [14, 33],
    textLength = 114,
    centered = false
  } = options;

  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  lines.forEach((line, index) => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("class", "wordmark-line");
    text.setAttribute("x", centered ? "50%" : "0");
    text.setAttribute("y", String(y[index] ?? y[y.length - 1]));
    text.setAttribute("textLength", String(textLength));
    text.setAttribute("lengthAdjust", "spacingAndGlyphs");
    if (centered) {
      text.setAttribute("text-anchor", "middle");
    }
    text.textContent = line;
    svg.append(text);
  });

  return svg;
}

function setupBrandMarks() {
  if (nav && !nav.querySelector(".site-mark-link")) {
    const link = document.createElement("a");
    const wordmark = document.createElement("span");

    link.className = "site-mark-link";
    link.href = "index.html";
    link.setAttribute("aria-label", "Andreas Boehler Studio Startseite");
    wordmark.className = "site-mark-wordmark";
    wordmark.setAttribute("aria-hidden", "true");
    wordmark.innerHTML = "<span>ANDREAS-</span><span>BOEHLER.</span>";
    link.append(createBrandGlyph("brand-glyph site-mark-glyph"), wordmark);
    nav.append(link);
  }

  document.querySelectorAll(".footer-mark").forEach((mark) => {
    mark.setAttribute("aria-label", "Andreas Boehler Studio Startseite");

    if (!mark.querySelector(".footer-brand-glyph")) {
      mark.prepend(createBrandGlyph("brand-glyph footer-brand-glyph"));
    }
  });

  document.querySelectorAll(".footer-top-link").forEach((link) => {
    link.setAttribute("aria-label", "Zurück nach oben");
    link.setAttribute("title", "Zurück nach oben");
  });
}

function setupNavHoverLabels() {
  document.querySelectorAll(".nav-item span").forEach((label) => {
    const text = label.textContent.trim();

    if (text) {
      label.dataset.text = text;
    }
  });
}

function setupWorksViewToggle() {
  const toggle = document.querySelector("[data-works-view-toggle]");
  const grid = document.querySelector(".redox-portfolio-grid");

  if (!toggle || !grid) {
    return;
  }

  const buttons = [...toggle.querySelectorAll("[data-works-view]")];
  const setView = (view) => {
    const nextView = view === "list" ? "list" : "grid";

    document.body.dataset.worksView = nextView;
    toggle.dataset.view = nextView;
    grid.dataset.view = nextView;

    buttons.forEach((button) => {
      const isActive = button.dataset.worksView === nextView;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.worksView);
    });
  });

  setView("grid");
}

function setupDynamicCopyright() {
  const currentYear = new Date().getFullYear();

  document.querySelectorAll(".footer-bottom > span:first-child").forEach((line) => {
    line.textContent = `© ${currentYear} Andreas Boehler Studio.`;
  });
}

function setupStudioCursor() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reducedMotion.matches || document.querySelector(".studio-cursor")) {
    return;
  }

  const cursor = document.createElement("div");
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  const label = document.createElement("span");
  const state = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    dotX: window.innerWidth / 2,
    dotY: window.innerHeight / 2,
    mode: ""
  };
  const selectors = {
    text: "input, textarea, select, [contenteditable='true']",
    view: [
      ".redox-project-card",
      ".work-card",
      ".directory-card",
      ".project-list a",
      ".about-editorial-hero figure",
      ".about-visual-diary figure",
      ".about-story-panel figure",
      ".brush-feature",
      ".hero-reveal",
      "[data-cursor='view']"
    ].join(", "),
    action: [
      "a",
      "button",
      "summary",
      "label",
      "[role='button']",
      "[tabindex]:not([tabindex='-1'])",
      "[data-cursor='action']"
    ].join(", ")
  };

  cursor.className = "studio-cursor";
  cursor.setAttribute("aria-hidden", "true");
  ring.className = "studio-cursor-ring";
  dot.className = "studio-cursor-dot";
  label.className = "studio-cursor-label";
  ring.append(label);
  cursor.append(ring, dot);
  document.body.append(cursor);
  document.documentElement.classList.add("has-custom-cursor");

  const setMode = (nextMode, nextLabel = "") => {
    if (state.mode === nextMode && label.textContent === nextLabel) {
      return;
    }

    state.mode = nextMode;
    label.textContent = nextLabel;
    cursor.classList.toggle("is-hover", nextMode === "hover");
    cursor.classList.toggle("is-view", nextMode === "view");
    cursor.classList.toggle("is-text", nextMode === "text");
  };

  const updateModeFromPoint = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);

    if (!target) {
      setMode("");
      return;
    }

    if (target.closest(selectors.text)) {
      setMode("text");
      return;
    }

    if (target.closest(selectors.view)) {
      setMode("view", target.closest(".brush-feature, .hero-reveal") ? "REVEAL" : "VIEW");
      return;
    }

    if (target.closest(selectors.action)) {
      setMode("hover", "OPEN");
      return;
    }

    setMode("");
  };

  const animate = () => {
    state.ringX += (state.x - state.ringX) * 0.18;
    state.ringY += (state.y - state.ringY) * 0.18;
    state.dotX += (state.x - state.dotX) * 0.55;
    state.dotY += (state.y - state.dotY) * 0.55;

    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate3d(-50%, -50%, 0) scale(var(--cursor-scale, 1))`;
    dot.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate3d(-50%, -50%, 0)`;
    window.requestAnimationFrame(animate);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") {
      return;
    }

    state.x = event.clientX;
    state.y = event.clientY;
    cursor.classList.add("is-visible");
    updateModeFromPoint(event);
  }, { passive: true });

  document.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
  document.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  document.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));

  finePointer.addEventListener?.("change", (event) => {
    if (!event.matches) {
      document.documentElement.classList.remove("has-custom-cursor");
      cursor.remove();
    }
  });

  animate();
}

function setupPageLoader() {
  if (document.querySelector(".site-loader")) {
    return;
  }

  const loader = document.createElement("div");
  const curtain = document.createElement("div");
  const noise = document.createElement("div");
  const loaderStage = document.createElement("div");
  const mark = document.createElement("div");
  const glyphStack = document.createElement("div");
  const progressText = document.createElement("div");
  const loaderQuote = document.createElement("div");
  const quoteLine = document.createElement("span");
  const quoteMain = document.createElement("strong");
  const introDelay = 620;
  const fillDuration = 1360;
  const exitDuration = 1680;
  const progressDuration = 1840 + fillDuration;
  const progressStartedAt = window.performance?.now?.() ?? Date.now();
  const isHomePage = document.body?.dataset.page === "home";
  let showLoaderQuote = isHomePage;
  let progressFrame = 0;
  let outlineGlyph = null;
  let fillGlyph = null;
  let completionStarted = false;

  if (isHomePage) {
    try {
      showLoaderQuote = sessionStorage.getItem(loaderQuoteStorageKey) !== "true";
      if (showLoaderQuote) {
        sessionStorage.setItem(loaderQuoteStorageKey, "true");
      }
    } catch (error) {
      showLoaderQuote = true;
    }
  }

  const setLoaderProgress = (value) => {
    const progress = Math.max(0, Math.min(100, value));
    const percent = Math.round(progress);

    progressText.textContent = `${String(percent).padStart(2, "0")}%`;
    if (fillGlyph) {
      fillGlyph.style.clipPath = `inset(${(100 - progress).toFixed(3)}% 0 0 0)`;
    }
  };
  const updateLoaderProgress = () => {
    const elapsed = (window.performance?.now?.() ?? Date.now()) - progressStartedAt;
    const linear = clamp(elapsed / progressDuration, 0, 1);
    const eased = 1 - Math.pow(1 - linear, 2.15);

    setLoaderProgress(eased * 100);
    if (linear < 1 && document.body.contains(loader)) {
      progressFrame = window.requestAnimationFrame(updateLoaderProgress);
    }
  };
  const completeLoader = () => {
    if (completionStarted) {
      return;
    }

    completionStarted = true;
    loader.classList.add("is-complete");
    setLoaderProgress(100);
    glyphStack.style.transform = "translate3d(0, -2px, 0) scale(1.018)";
    outlineGlyph.querySelector("path")?.style.setProperty("stroke", "rgba(17, 17, 17, 0.34)");
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      curtain.style.opacity = "1";
      curtain.style.transform = "translate3d(0, -188vh, 0) scaleY(0.92)";
      noise.style.opacity = "0";
      if (showLoaderQuote) {
        loaderQuote.style.opacity = "0";
        loaderQuote.style.filter = "blur(18px)";
        loaderQuote.style.transform = "translate3d(0, -34px, 0) scale(0.96)";
      }
      mark.style.opacity = "0";
      mark.style.filter = "blur(22px)";
      mark.style.transform = "translate3d(0, -42px, 0) scale(0.9)";
      setLoaderProgress(100);
      if (progressFrame) {
        window.cancelAnimationFrame(progressFrame);
      }
      document.body.classList.remove("is-loading");
      unlockPageScroll();
      window.setTimeout(() => {
        loader.remove();
        unlockPageScroll();
      }, exitDuration + 180);
    }, fillDuration);
  };
  const hideLoader = () => {
    completeLoader();
  };

  outlineGlyph = createBrandGlyph("brand-glyph loader-glyph loader-glyph-outline");
  fillGlyph = createBrandGlyph("brand-glyph loader-glyph loader-glyph-fill");
  const outlinePath = outlineGlyph.querySelector("path");

  curtain.className = "loader-curtain";
  noise.className = "loader-noise";
  loaderStage.className = "loader-stage";
  glyphStack.className = "loader-glyph-stack";
  glyphStack.append(outlineGlyph, fillGlyph);
  progressText.className = "loader-progress";
  progressText.setAttribute("aria-hidden", "true");
  loaderQuote.className = "loader-quote";
  quoteLine.textContent = "The average life is";
  quoteMain.textContent = "only about 28000 days";
  loaderQuote.append(quoteLine, quoteMain);
  setLoaderProgress(0);

  loader.className = "site-loader";
  loader.classList.toggle("has-loader-quote", showLoaderQuote);
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-label", "Website wird geladen");
  mark.className = "loader-mark";
  mark.append(glyphStack, progressText);
  if (showLoaderQuote) {
    loaderStage.append(loaderQuote, mark);
  } else {
    loaderStage.append(mark);
  }
  loader.append(curtain, noise, loaderStage);
  document.body.prepend(loader);
  document.body.classList.add("is-loading");
  progressFrame = window.requestAnimationFrame(updateLoaderProgress);

  window.setTimeout(() => {
    loader.classList.add("is-intro");
    loader.style.opacity = "1";
    curtain.style.opacity = "1";
    curtain.style.transform = "translate3d(0, 0, 0) scaleY(1)";
    noise.style.opacity = "0.075";
    if (showLoaderQuote) {
      loaderQuote.style.opacity = "1";
      loaderQuote.style.filter = "blur(0)";
      loaderQuote.style.transform = "translate3d(0, 0, 0)";
    }
    mark.style.opacity = "1";
    mark.style.filter = "blur(0) drop-shadow(0 28px 70px rgba(17, 17, 17, 0.16))";
    mark.style.transform = "translate3d(0, 0, 0)";
    glyphStack.style.opacity = "1";
    glyphStack.style.filter = "blur(0) drop-shadow(0 28px 70px rgba(17, 17, 17, 0.16))";
    glyphStack.style.transform = "translate3d(0, 0, 0)";
    outlinePath?.style.setProperty("stroke-dashoffset", "0");
    window.setTimeout(() => {
      loader.classList.add("is-active");
    }, introDelay);
  }, 40);

  const now = () => window.performance?.now?.() ?? Date.now();
  const readyAt = now() + 1840;
  const waitAndHide = () => {
    const remaining = Math.max(0, readyAt - now());
    window.setTimeout(hideLoader, remaining);
  };

  waitAndHide();
  window.setTimeout(() => {
    loader.remove();
    unlockPageScroll();
  }, 6200);
}

function unlockPageScroll() {
  document.documentElement.style.overflowY = "auto";
  document.documentElement.style.height = "auto";
  document.body.style.overflowY = "auto";
  document.body.style.height = "auto";
  document.body.style.position = "static";
  document.body.style.touchAction = "pan-y";
  document.body.classList.remove("is-loading");
}

function getStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // The theme still changes for the current session if storage is unavailable.
  }
}

function normalizeConsent(consent = {}) {
  return {
    ...defaultConsent,
    ...consent,
    necessary: true,
    statistics: consent.statistics === true,
    marketing: consent.marketing === true,
    external: consent.external === true,
    decided: consent.decided === true
  };
}

function getStoredConsent() {
  try {
    const rawConsent = localStorage.getItem(consentStorageKey);

    return rawConsent ? normalizeConsent(JSON.parse(rawConsent)) : null;
  } catch (error) {
    return null;
  }
}

function storeConsent(consent) {
  try {
    localStorage.setItem(
      consentStorageKey,
      JSON.stringify({
        ...normalizeConsent(consent),
        decided: true,
        updatedAt: new Date().toISOString()
      })
    );
  } catch (error) {
    // Consent is still applied for the current session if storage is unavailable.
  }
}

function isConsentCategoryAllowed(category) {
  if (category === "necessary") {
    return true;
  }

  return activeConsent?.[category] === true;
}

function copyConsentAttributes(source, target) {
  Array.from(source.attributes).forEach((attribute) => {
    if (
      attribute.name === "type" ||
      attribute.name === "data-consent-category" ||
      attribute.name === "data-consent-src" ||
      attribute.name === "data-src" ||
      attribute.name === "data-consent-activated" ||
      attribute.name === "data-consent-blocked"
    ) {
      return;
    }

    target.setAttribute(attribute.name, attribute.value);
  });
}

function activateConsentElement(element) {
  const category = element.dataset.consentCategory;

  if (!category || !isConsentCategoryAllowed(category) || element.dataset.consentActivated === "true") {
    return;
  }

  const source = element.dataset.consentSrc || element.dataset.src;

  if (element.tagName === "SCRIPT") {
    const script = document.createElement("script");

    copyConsentAttributes(element, script);
    if (source) {
      script.src = source;
    }
    if (!source && element.textContent.trim()) {
      script.textContent = element.textContent;
    }
    script.dataset.consentActivated = "true";
    element.replaceWith(script);
    return;
  }

  if (source && ("src" in element)) {
    element.src = source;
  }

  if (element.tagName === "SOURCE" && source) {
    element.setAttribute("srcset", source);
  }

  element.dataset.consentActivated = "true";
  element.dataset.consentBlocked = "false";
  element.closest(".consent-embed")?.classList.add("is-unlocked");
}

function loadConsentControlledResources() {
  document.querySelectorAll("[data-consent-category]").forEach((element) => {
    const category = element.dataset.consentCategory;

    if (isConsentCategoryAllowed(category)) {
      activateConsentElement(element);
    } else {
      element.dataset.consentBlocked = "true";
    }
  });
}

function updateCookieBannerState() {
  const banner = document.querySelector(".cookie-consent");

  if (!banner) {
    return;
  }

  consentCategories.forEach((category) => {
    const input = banner.querySelector(`[data-consent-toggle="${category}"]`);

    if (input) {
      input.checked = activeConsent?.[category] === true;
    }
  });
}

function applyCookieConsent(consent, shouldStore = true) {
  activeConsent = normalizeConsent({ ...consent, decided: true });
  document.documentElement.dataset.consent = "set";
  consentCategories.forEach((category) => {
    document.documentElement.dataset[`consent${category[0].toUpperCase()}${category.slice(1)}`] = String(activeConsent[category]);
  });

  if (shouldStore) {
    storeConsent(activeConsent);
  }

  loadConsentControlledResources();
  updateCookieBannerState();
}

function createConsentOption(category, title, text, locked = false) {
  const label = document.createElement("label");
  const copy = document.createElement("span");
  const titleElement = document.createElement("strong");
  const textElement = document.createElement("small");
  const input = document.createElement("input");
  const switchElement = document.createElement("i");

  label.className = "cookie-consent-option";
  titleElement.textContent = title;
  textElement.textContent = text;
  copy.append(titleElement, textElement);

  input.type = "checkbox";
  input.checked = locked;
  input.disabled = locked;
  input.dataset.consentToggle = category;
  input.setAttribute("aria-label", title);
  switchElement.setAttribute("aria-hidden", "true");

  label.append(copy, input, switchElement);
  return label;
}

function closeCookieBanner() {
  const banner = document.querySelector(".cookie-consent");

  if (!banner) {
    return;
  }

  banner.classList.add("is-hiding");
  window.setTimeout(() => {
    banner.remove();
  }, 360);
}

function setCookieSettingsOpen(banner, isOpen) {
  const settings = banner?.querySelector(".cookie-consent-settings");

  if (!banner || !settings) {
    return;
  }

  banner.classList.toggle("is-settings-open", isOpen);
  settings.style.maxHeight = isOpen ? `${settings.scrollHeight + 28}px` : "0px";
  settings.style.marginTop = isOpen ? "22px" : "0px";
  settings.style.opacity = isOpen ? "1" : "0";
}

function openCookieSettings() {
  const existingBanner = document.querySelector(".cookie-consent");

  if (existingBanner) {
    setCookieSettingsOpen(existingBanner, true);
    updateCookieBannerState();
    existingBanner.querySelector("[data-consent-toggle='statistics']")?.focus();
    return;
  }

  setupCookieConsent(true);
}

function setupCookieFooterTrigger() {
  const footerNav = document.querySelector(".footer-bottom nav");

  if (!footerNav || footerNav.querySelector(".footer-privacy-button")) {
    return;
  }

  const button = document.createElement("button");

  button.className = "footer-privacy-button";
  button.type = "button";
  button.textContent = "Cookie-Einstellungen";
  button.addEventListener("click", openCookieSettings);
  footerNav.append(button);
}

function setupCookieConsent(forceOpen = false) {
  const storedConsent = getStoredConsent();

  setupCookieFooterTrigger();

  if (storedConsent && !forceOpen) {
    applyCookieConsent(storedConsent, false);
    return;
  }

  if (document.querySelector(".cookie-consent")) {
    updateCookieBannerState();
    return;
  }

  activeConsent = storedConsent || normalizeConsent();
  document.documentElement.dataset.consent = activeConsent.decided ? "set" : "pending";
  loadConsentControlledResources();

  const banner = document.createElement("aside");
  const eyebrow = document.createElement("span");
  const title = document.createElement("h2");
  const text = document.createElement("p");
  const links = document.createElement("p");
  const privacyLink = document.createElement("a");
  const imprintLink = document.createElement("a");
  const actions = document.createElement("div");
  const rejectButton = document.createElement("button");
  const settingsButton = document.createElement("button");
  const acceptButton = document.createElement("button");
  const settings = document.createElement("div");
  const saveButton = document.createElement("button");

  banner.className = `cookie-consent${forceOpen ? " is-settings-open" : ""}`;
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.setAttribute("aria-labelledby", "cookieConsentTitle");

  eyebrow.textContent = "Privacy";
  title.id = "cookieConsentTitle";
  title.textContent = "Datenschutz-Einstellungen";
  text.textContent = "Diese Website lädt notwendige lokale Funktionen. Statistik, Marketing und externe Medien bleiben blockiert, bis du aktiv zustimmst.";

  links.className = "cookie-consent-links";
  privacyLink.href = "datenschutz.html";
  privacyLink.textContent = "Datenschutz";
  imprintLink.href = "impressum.html";
  imprintLink.textContent = "Impressum";
  links.append(privacyLink, imprintLink);

  actions.className = "cookie-consent-actions";
  rejectButton.type = "button";
  rejectButton.textContent = "Ablehnen";
  settingsButton.type = "button";
  settingsButton.textContent = "Auswahl";
  acceptButton.type = "button";
  acceptButton.textContent = "Alle akzeptieren";
  acceptButton.className = "is-primary";
  actions.append(rejectButton, settingsButton, acceptButton);

  settings.className = "cookie-consent-settings";
  settings.append(
    createConsentOption("necessary", "Notwendig", "Consent-Speicherung, Theme und technische Grundfunktionen.", true),
    createConsentOption("statistics", "Statistik", "Reichweitenmessung und Performance-Auswertung, falls später eingebunden."),
    createConsentOption("marketing", "Marketing", "Pixel, Remarketing und Kampagnenmessung."),
    createConsentOption("external", "Externe Medien", "YouTube, Vimeo, Maps, Instagram oder vergleichbare Einbettungen.")
  );

  saveButton.type = "button";
  saveButton.className = "cookie-consent-save";
  saveButton.textContent = "Auswahl speichern";
  settings.append(saveButton);

  rejectButton.addEventListener("click", () => {
    applyCookieConsent({ necessary: true });
    closeCookieBanner();
  });

  settingsButton.addEventListener("click", () => {
    setCookieSettingsOpen(banner, !banner.classList.contains("is-settings-open"));
    updateCookieBannerState();
  });

  acceptButton.addEventListener("click", () => {
    applyCookieConsent({
      necessary: true,
      statistics: true,
      marketing: true,
      external: true
    });
    closeCookieBanner();
  });

  saveButton.addEventListener("click", () => {
    applyCookieConsent({
      necessary: true,
      statistics: banner.querySelector("[data-consent-toggle='statistics']")?.checked === true,
      marketing: banner.querySelector("[data-consent-toggle='marketing']")?.checked === true,
      external: banner.querySelector("[data-consent-toggle='external']")?.checked === true
    });
    closeCookieBanner();
  });

  banner.append(eyebrow, title, text, links, settings, actions);
  document.body.append(banner);
  setCookieSettingsOpen(banner, forceOpen);
  updateCookieBannerState();
}

window.AndreasConsent = {
  has: isConsentCategoryAllowed,
  open: openCookieSettings,
  load: loadConsentControlledResources
};

let currentTheme = getStoredTheme() === "dark" ? "dark" : "light";

document.documentElement.dataset.theme = currentTheme;
setupBrandMarks();
setupDynamicCopyright();
setupCookieConsent();
setupPageLoader();
setupStudioCursor();
unlockPageScroll();

const projectData = {
  "50-jahre-europa-park": {
    title: "50 Jahre Europa-Park",
    eyebrow: "Entertainment · Jubiläum",
    image: "assets/andreas-europapark.jpg",
    intro: "Ein Jubiläumsprojekt für eine der stärksten Entertainment-Marken Europas: emotional, schnell verständlich und nah am Erlebnis.",
    role: "Konzept, Produktion, Kameraarbeit, Schnittdramaturgie und markennahe Bildsprache.",
    description: "Der kommunikative Kern: aus vielen Attraktionen, Menschen und Erinnerungen ein Gefühl von Geschichte, Bewegung und Zukunft formen.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Format", "Jubiläumscontent, Kampagnenbilder und bewegte Markenkommunikation."],
      ["Stärke", "Viele Erlebniswelten werden zu einer klaren emotionalen Linie verdichtet."],
      ["Einsatz", "Website, Social Media, interne Kommunikation und Event-Kontext."],
      ["Look", "Energetisch, farbig, menschlich und mit hohem Wiedererkennungswert."]
    ]
  },
  "duolingo-spec-ad": {
    title: "Duolingo Spec Ad",
    eyebrow: "Spec Ad · Commercial",
    image: "assets/andreas-duolingo.jpg",
    intro: "Eine überzeichnete Werbeidee mit starkem Motiv, klarer Dramaturgie und einem Look, der sofort hängen bleibt.",
    role: "Regieansatz, Storyentwicklung, Bildkonzept, Schnittgefühl und Postproduktionslook.",
    description: "Der Case zeigt, wie auch ein kurzer Spec Spot durch Timing, Kontrast und visuelle Zuspitzung eine Marke sofort erzählbar macht.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Ziel", "Eine bekannte App-Marke mit filmischer Übertreibung und Humor emotional aufladen."],
      ["Format", "Kurzformat für Social, Pitch, Showreel und Commercial-Denke."],
      ["Leistung", "Story, Look, Schnitt, Soundgefühl und finale Zuspitzung."],
      ["SEO-Relevanz", "Spec Ad, Werbefilm, Commercial, Social Spot und Markenfilm."]
    ]
  },
  "mareike-daniel-wedding": {
    title: "Mareike & Daniel Wedding",
    eyebrow: "Fotografie · Dokumentarisch",
    image: "assets/andreas-wedding.jpg",
    intro: "Eine emotionale Bildserie, die nicht inszeniert wirken will, sondern Momente mit Timing, Nähe und Lichtgefühl bewahrt.",
    role: "Reportage, Portrait, Licht, Bildauswahl und cinematische Fotografie.",
    description: "Der fotografische Ansatz kommt aus dem Film: Beobachten, führen wenn nötig, aber die echten Momente nicht überformen.",
    service: "Markenfotografie",
    serviceLink: "markenfotografie.html",
    facts: [
      ["Format", "Hochzeitsreportage, Portraits und natürliche Sequenzen."],
      ["Look", "Weich, emotional, unaufgeregt und filmisch."],
      ["Stärke", "Nähe zu Menschen ohne plakative Inszenierung."],
      ["Übertrag", "Der Ansatz funktioniert ebenso für Markenportraits und dokumentarische Corporate-Serien."]
    ]
  },
  "rockstar-musicvideo": {
    title: "Rockstar Musicvideo",
    eyebrow: "Musicvideo · Performance",
    image: "assets/andreas-rockstar.jpg",
    intro: "Ein Musikvideo mit rauer Energie, präzisem Timing und starker visueller Verdichtung rund um Performance und Atmosphäre.",
    role: "Lookentwicklung, Kamera, Regiegefühl, Schnitt und finale Bildwirkung.",
    description: "Musikvideos sind ein gutes Feld für mutige Bildsprache: weniger Erklärung, mehr Rhythmus, Haltung und visuelle Reibung.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Ziel", "Sound, Figur und Stimmung in eine klare visuelle Sprache übersetzen."],
      ["Format", "Musicvideo, Artist Content und Social Cuts."],
      ["Look", "Kontrastreich, direkt, körperlich und dynamisch."],
      ["Stärke", "Schnittgefühl und Bildgestaltung arbeiten mit der Musik statt gegen sie."]
    ]
  },
  "dj-bobo-evolut30n-tour": {
    title: "DJ Bobo EVOLUT30N Tour",
    eyebrow: "Producer · VFX · KI Postproduktion · 2024",
    image: "assets/andreas-djbobo.jpg",
    intro: "Ein futuristischer Tourtrailer zwischen Show, Abenteuerkino und digitaler Postproduktion.",
    role: "Producer, Drehplanung, Special VFX, 3D/Motion Graphics, Postproduction und KI-gestützte Bildarbeit.",
    description: "Für den Tourtrailer wurden Planung, visuelle Effekte und Motion Design zu einem kompakten Show-Auftakt verbunden. Der Case zeigt, wie Entertainment-Kommunikation groß wirken kann, ohne den Produktionskern aus den Augen zu verlieren.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Aufgabe", "Ein Trailer, der Tour, Welt und Showgefühl schnell und hochwertig kommuniziert."],
      ["Leistung", "Produktion, VFX, Post Supervisor, Motion Graphics und KI-Workflow."],
      ["Look", "Futuristisch, energiegeladen, kontrastreich und publikumsnah."],
      ["Mehrwert", "Entertainment-Marketing mit klarer Dramaturgie und hoher visueller Dichte."]
    ]
  },
  "europa-park-neuheiten-2023": {
    title: "Europa-Park Neuheiten 2023",
    eyebrow: "Entertainment · Freizeitpark",
    image: "assets/andreas-amusement-park.jpg",
    intro: "Bewegtbild und Fotografie für neue Attraktionen, saisonale Kommunikation und emotionale Besucherlebnisse.",
    role: "Produktion, Kamera, Schnittdramaturgie, Markenverständnis und schnelle Content-Ausspielung.",
    description: "Freizeitpark-Kommunikation lebt von Tempo, Nähe und Atmosphäre. Der Case bündelt Erlebnis, Familie, Bewegung und klare Markenbilder.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Format", "Hero Content, Social Clips, Website-Motive und Kampagnenschnipsel."],
      ["Anforderung", "Schnelle Produktion bei hohem Wiedererkennungswert."],
      ["Look", "Lebendig, nahbar, farbig und publikumsorientiert."],
      ["Region", "Entertainment-Produktion im Raum Freiburg, Rust und Basel."]
    ]
  },
  "smt-imagefilm-qualitaet": {
    title: "SMT Imagefilm Qualität",
    eyebrow: "Corporate Film · Qualität",
    image: "assets/andreas-hero-video.png",
    intro: "Ein Imagefilm, der Qualität nicht abstrakt behauptet, sondern über Prozesse, Menschen und Details erfahrbar macht.",
    role: "Konzept, Kamera, Schnitt, Motion und klare industrielle Bildsprache.",
    description: "Corporate Filme funktionieren besser, wenn sie nicht nur Maschinen zeigen, sondern Haltung, Präzision und Nutzen visuell sortieren.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Ziel", "Qualität als Prozess und Haltung sichtbar machen."],
      ["Format", "Imagefilm, Messe, Website und Sales-Kommunikation."],
      ["Look", "Präzise, technisch, hochwertig und nachvollziehbar."],
      ["Stärke", "Komplexe Abläufe werden in klare Bildfolgen übersetzt."]
    ]
  },
  "movin-recruitingfilm": {
    title: "MOVIN Recruitingfilm",
    eyebrow: "Recruiting · Employer Branding",
    image: "assets/andreas-hero-film.png",
    intro: "Ein Recruitingfilm, der Arbeit, Menschen und Unternehmenskultur so zeigt, dass Bewerber ein Gefühl für das Umfeld bekommen.",
    role: "Konzept, Interview- oder Szenenlogik, Kamera, Schnitt und zielgruppengerechter Ton.",
    description: "Employer Branding braucht Glaubwürdigkeit. Der Film verbindet echte Arbeitsmomente mit einer präzisen visuellen Haltung.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Ziel", "Mehr passende Bewerbungen durch klare Kultur- und Rollenkommunikation."],
      ["Format", "Recruitingfilm, Social Clips, Karriereseite und Paid Ads."],
      ["Look", "Authentisch, modern, menschlich und direkt."],
      ["Nutzen", "Bewerber verstehen schneller, ob Aufgabe und Umfeld zu ihnen passen."]
    ]
  },
  "virtual-production-case-study": {
    title: "Virtual Production Case Study",
    eyebrow: "Lab · Virtual Production",
    image: "assets/andreas-virtual-production.jpg",
    intro: "Ein Case über moderne Produktionsweisen zwischen realem Set, digitalem Raum, 3D-Logik und Postproduktion.",
    role: "Lookentwicklung, 3D-Denke, Produktionskonzept, Kamera- und Postproduktionsverständnis.",
    description: "Virtual Production ist besonders stark, wenn kreative Idee und technischer Workflow früh zusammen gedacht werden. Der Case zeigt genau diese Verbindung.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Technik", "LED-/3D-Denke, Unreal-nahe Workflows, Kamera und Compositing-Logik."],
      ["Einsatz", "Commercials, Produktinszenierung, Pitchfilme und visuelle Tests."],
      ["Vorteil", "Mehr Kontrolle über Look, Raum, Licht und Wiederholbarkeit."],
      ["Stärke", "Regie, Kamera und Postproduktion werden als ein System geplant."]
    ]
  },
  "novartis-medportal": {
    title: "Novartis Medportal",
    eyebrow: "Healthcare · Digital Portal",
    image: "assets/andreas-hero-video.png",
    intro: "Ein Werbefilm für digitale Prozesse zwischen Pharmaunternehmen, Ärzten und klarer Informationsarchitektur.",
    role: "Konzeption, Moodboard, Planung, 3D Visualisierung, Rendering, Motion Graphics und Typoanimation.",
    description: "Healthcare-Kommunikation braucht Klarheit. Der Case übersetzt ein digitales Portal in verständliche, visuell geführte Vorteile.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Zielgruppe", "Ärzte, interne Stakeholder und digitale Entscheider."],
      ["Leistung", "Konzept, 3D, Motion, Typografie und Postproduktion."],
      ["Look", "Klar, reduziert, technisch und vertrauenswürdig."],
      ["SEO-Relevanz", "Healthcare Film, Pharma Kommunikation, Motion Design und 3D Visualisierung."]
    ]
  },
  "acino-swiss-lab-production-tour": {
    title: "Acino Swiss Lab & Production Tour",
    eyebrow: "Healthcare · 360° Film",
    image: "assets/andreas-hero-film.png",
    intro: "Ein immersiver Einblick in Labor, Produktion und Qualitätsprozesse für Investoren- und Standortkommunikation.",
    role: "Planung, visuelles Konzept, Kamera, 360°-Denke und Produktionskommunikation.",
    description: "Der Film zeigt Produktionsrealität dort, wo Vertrauen entsteht: in Prozessen, Räumen und kontrollierten Abläufen.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Format", "360° Tour, Produktionsfilm und Investorenkommunikation."],
      ["Ziel", "Transparenz, Qualität und technische Kompetenz sichtbar machen."],
      ["Look", "Sauber, kontrolliert, hochwertig und informativ."],
      ["Stärke", "Komplexe Räume werden klar erlebbar."]
    ]
  },
  "movicol-mode-of-action": {
    title: "Movicol Mode of Action",
    eyebrow: "3D Animation · Medical",
    image: "assets/andreas-virtual-production.jpg",
    intro: "Eine medizinische Wirkweise wird durch 3D Animation, Storyboard und präzise Postproduktion verständlich.",
    role: "Konzept, Storyboard, 3D Modelling, 3D Animation, Sound FX und Postproduktion.",
    description: "Mode-of-Action-Filme müssen fachlich präzise und visuell begreifbar sein. Der Case verbindet Erklärung mit sauberer Animation.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Ziel", "Ein medizinisches Wirkprinzip verständlich visualisieren."],
      ["Leistung", "Storyboard, 3D, Animation, Sound und Postproduktion."],
      ["Look", "Reduziert, präzise, didaktisch und hochwertig."],
      ["Einsatz", "Fachkommunikation, Außendienst, Fortbildung und digitale Kanäle."]
    ]
  },
  "acino-pain-management": {
    title: "Acino Pain Management",
    eyebrow: "Awarenessfilm · Healthcare",
    image: "assets/andreas-about.png",
    intro: "Ein Awarenessfilm in mehreren Sprachen für medizinisches Fachpersonal und Patientenkommunikation.",
    role: "Konzept, Regie, Kamera, Motion Graphics, 3D Render, Color Grading und Postproduktion.",
    description: "Healthcare Awareness braucht Empathie und Klarheit. Der Case verbindet medizinische Themen mit emotional verständlicher Bildsprache.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Format", "Mehrsprachiger Awarenessfilm."],
      ["Zielgruppe", "Medizinisches Fachpersonal, Patienten und interne Kommunikation."],
      ["Leistung", "Regie, Kamera, Motion, 3D und Color."],
      ["Stärke", "Komplexes Thema mit menschlicher Tonalität."]
    ]
  },
  "bongrain-savencia": {
    title: "Bongrain / Savencia",
    eyebrow: "Webdesign · Sales Tool",
    image: "assets/andreas-hero-film.png",
    intro: "Digitale Rezepte, Rich Media und ein iPad Sales Tool für Markenkommunikation im Food-Kontext.",
    role: "Webdesign, Kampagnenlogik, Interface, Art Direction und digitale Präsentationsstruktur.",
    description: "Der Case zeigt, wie digitale Produktkommunikation, UI und Sales Enablement zusammenwirken.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Format", "Website, iPad App, Rich Media und digitale Kampagne."],
      ["Ziel", "Produkte und Rezeptwelten nutzbar und verkaufsnah inszenieren."],
      ["Look", "Klar, appetitlich, strukturiert und markennah."],
      ["Stärke", "Designsystem und Nutzbarkeit werden gemeinsam gedacht."]
    ]
  },
  "x-ray-website": {
    title: "X-Ray Website",
    eyebrow: "UX · UI · Healthcare Agency",
    image: "assets/andreas-about.png",
    intro: "Relaunch und digitale Positionierung einer Healthcare-Agentur mit UX, UI und Core-Team-Aufbau.",
    role: "UX, UI, Art Direction, Teamaufbau, Struktur und visuelle Weiterentwicklung.",
    description: "Agentur-Websites müssen Kompetenz schnell zeigen und gleichzeitig intern pflegbar bleiben.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Format", "Website, UX-Struktur, Interface und Inhaltsarchitektur."],
      ["Ziel", "Kompetenz, Team und Healthcare-Fokus sichtbar machen."],
      ["Look", "Professionell, klar, digital und markenorientiert."],
      ["Stärke", "Strategie, Design und Umsetzbarkeit werden verbunden."]
    ]
  },
  "arcondis-brand-identity": {
    title: "ARCONDIS Brand Identity",
    eyebrow: "Branding · Life Science IT",
    image: "assets/andreas-hero-video.png",
    intro: "Brand Identity und Website für Life-Science IT Consulting mit klarer, technischer und vertrauenswürdiger Kommunikation.",
    role: "Brand Identity, Webdesign, Art Direction, visuelles System und digitale Markenführung.",
    description: "Für komplexe Beratungsleistungen braucht es ein System, das Kompetenz ordnet und schnell verständlich macht.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Ziel", "Life-Science-IT sichtbar, differenzierbar und vertrauenswürdig positionieren."],
      ["Leistung", "Branding, Website, Designsystem und Kommunikationslogik."],
      ["Look", "Klar, technisch, reduziert und professionell."],
      ["Nutzen", "Komplexe Services werden über visuelle Struktur leichter erfassbar."]
    ]
  },
  "syngenta-campaign": {
    title: "Syngenta Campaign",
    eyebrow: "Branding · Guidelines",
    image: "assets/andreas-europapark.jpg",
    intro: "Branding, Guidelines und Kampagnenlogik für Agrarprodukte mit hohem Informations- und Vertrauensbedarf.",
    role: "Art Direction, Layoutlogik, Kampagnenstruktur, Guideline-Arbeit und visuelle Adaption.",
    description: "Der Case zeigt, wie fachliche Produktkommunikation durch klare Markenregeln visuell skalierbar wird.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Format", "Kampagne, Guidelines, Produktkommunikation und Layoutsystem."],
      ["Ziel", "Fachliche Inhalte markenkonform und wiederholbar kommunizieren."],
      ["Look", "Strukturiert, seriös, produktnah und skalierbar."],
      ["Stärke", "Informationsdichte wird visuell kontrollierbar."]
    ]
  },
  "abbvie-oncology": {
    title: "AbbVie Oncology",
    eyebrow: "Healthcare · Print Campaign",
    image: "assets/andreas-hero-video.png",
    intro: "Composing und Printanzeigen für Onkologie-Kommunikation mit hoher visueller Sensibilität.",
    role: "Composing, Layout, Art Direction, Bildbearbeitung und Printlogik.",
    description: "Healthcare-Print braucht Präzision in Tonalität, Bildsprache und regulatorischer Klarheit.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Format", "Printanzeigen und Healthcare-Kommunikation."],
      ["Ziel", "Komplexe medizinische Kommunikation visuell zugänglich machen."],
      ["Look", "Sensibel, klar, hochwertig und kontrolliert."],
      ["Stärke", "Bildbearbeitung und Art Direction greifen eng ineinander."]
    ]
  },
  "dr-martin-klein": {
    title: "Dr. Martin Klein",
    eyebrow: "Corporate Design · Facharztprofil",
    image: "assets/andreas-about.png",
    intro: "Corporate Design, Logo und Markenauftritt für ein medizinisches Facharztprofil.",
    role: "Logo, Corporate Design, visuelle Tonalität, Layout und Markenanwendung.",
    description: "Medizinische Profile brauchen Vertrauen, Klarheit und eine persönliche visuelle Sprache.",
    service: "Art Direction & Branding",
    serviceLink: "art-direction.html",
    facts: [
      ["Format", "Corporate Design, Logo, Basismedien und visuelle Anwendung."],
      ["Ziel", "Kompetenz und Persönlichkeit seriös sichtbar machen."],
      ["Look", "Reduziert, ruhig, professionell und menschlich."],
      ["Stärke", "Die Marke wirkt persönlich, ohne an medizinischer Klarheit zu verlieren."]
    ]
  }
};

document.body.classList.add("js-ready");

const currentPage = document.body.dataset.page;

if (currentPage) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === currentPage);
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const brushMoveEvent = "PointerEvent" in window ? "pointermove" : "mousemove";
const brushLeaveEvent = "PointerEvent" in window ? "pointerleave" : "mouseleave";
const brushEnterEvent = "PointerEvent" in window ? "pointerenter" : "mouseenter";

function setupHeroBackgroundBrush() {
  if (!heroBrushSurface || !heroFrameColor) {
    return;
  }

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const state = {
    lastPoint: null,
    points: []
  };
  let maskFrame = null;

  const updateMask = () => {
    const trailPoints = state.points.slice(0, -1);
    const total = Math.max(trailPoints.length - 1, 1);
    const gradients = trailPoints.map((point, index) => {
      const age = index / total;
      const radius = Math.round(38 + age * 56);
      const alpha = (0.16 + age * 0.58).toFixed(2);
      const midAlpha = (0.09 + age * 0.38).toFixed(2);
      const edgeAlpha = (0.03 + age * 0.15).toFixed(2);

      return (
        `radial-gradient(circle ${radius}px at ${point.x}px ${point.y}px, ` +
      `rgba(255,255,255,${alpha}) 0%, ` +
      `rgba(255,255,255,${alpha}) 24%, ` +
      `rgba(255,255,255,${midAlpha}) 54%, ` +
      `rgba(255,255,255,${edgeAlpha}) 78%, ` +
      "rgba(255,255,255,0) 100%)"
      );
    });
    const cursorPoint = state.points.at(-1);
    const cursorGradient = cursorPoint
      ? (
        `radial-gradient(circle 102px at ${cursorPoint.x}px ${cursorPoint.y}px, ` +
      "rgba(255,255,255,1) 0%, " +
        "rgba(255,255,255,0.96) 26%, " +
        "rgba(255,255,255,0.58) 58%, " +
        "rgba(255,255,255,0.18) 82%, " +
      "rgba(255,255,255,0) 100%)"
        )
      : null;
    const mask = cursorGradient
      ? [cursorGradient, ...gradients].join(", ")
      : "radial-gradient(circle 0px at 50% 50%, #ffffff 0%, transparent 100%)";

    heroFrameColor.style.setProperty("--hero-bg-brush-mask", mask);
  };

  const scheduleMaskUpdate = () => {
    if (maskFrame) {
      return;
    }

    maskFrame = window.requestAnimationFrame(() => {
      maskFrame = null;
      updateMask();
    });
  };

  const addPoint = (event) => {
    const rect = heroBrushSurface.getBoundingClientRect();
    const point = {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top)
    };

    if (point.x < 0 || point.y < 0 || point.x > rect.width || point.y > rect.height) {
      state.lastPoint = null;
      return;
    }

    const lastPoint = state.lastPoint || point;
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    const steps = Math.max(1, Math.ceil(distance / 34));

    for (let index = 0; index <= steps; index += 1) {
      const amount = index / steps;
      state.points.push({
        x: Math.round(lastPoint.x + (point.x - lastPoint.x) * amount),
        y: Math.round(lastPoint.y + (point.y - lastPoint.y) * amount)
      });
    }

    state.points = state.points.slice(-42);
    state.lastPoint = point;
    scheduleMaskUpdate();
  };

  heroBrushSurface.addEventListener(brushMoveEvent, addPoint, { passive: true });
  heroBrushSurface.addEventListener(brushLeaveEvent, () => {
    state.lastPoint = null;
  });
}

function setupBrushRevealImages() {
  const brushImages = document.querySelectorAll("[data-brush-reveal] figure > img");

  if (!brushImages.length) {
    return;
  }

  const updateMask = (state) => {
    const trailPoints = state.points.slice(0, -1);
    const total = Math.max(trailPoints.length - 1, 1);
    const gradients = trailPoints.map((point, index) => {
      const age = index / total;
      const radius = Math.round(26 + age * 46);
      const alpha = (0.14 + age * 0.54).toFixed(2);
      const midAlpha = (0.08 + age * 0.34).toFixed(2);
      const edgeAlpha = (0.02 + age * 0.14).toFixed(2);

      return (
        `radial-gradient(circle ${radius}px at ${point.x}px ${point.y}px, ` +
      `rgba(255,255,255,${alpha}) 0%, ` +
      `rgba(255,255,255,${alpha}) 22%, ` +
      `rgba(255,255,255,${midAlpha}) 52%, ` +
      `rgba(255,255,255,${edgeAlpha}) 76%, ` +
      "rgba(255,255,255,0) 100%)"
      );
    });
    const cursorPoint = state.points.at(-1);
    const cursorGradient = cursorPoint
      ? (
        `radial-gradient(circle 72px at ${cursorPoint.x}px ${cursorPoint.y}px, ` +
      "rgba(255,255,255,1) 0%, " +
        "rgba(255,255,255,0.94) 24%, " +
        "rgba(255,255,255,0.52) 56%, " +
        "rgba(255,255,255,0.16) 80%, " +
      "rgba(255,255,255,0) 100%)"
        )
      : null;
    const mask = cursorGradient
      ? [cursorGradient, ...gradients].join(", ")
      : "radial-gradient(circle 0px at 50% 50%, #ffffff 0%, transparent 100%)";

    state.color.style.setProperty("--brush-mask", mask);
  };

  const addPoint = (state, event) => {
    const rect = state.reveal.getBoundingClientRect();
    const point = {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top)
    };
    const lastPoint = state.lastPoint || point;
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    const steps = Math.max(1, Math.ceil(distance / 20));

    for (let index = 0; index <= steps; index += 1) {
      const amount = index / steps;
      state.points.push({
        x: Math.round(lastPoint.x + (point.x - lastPoint.x) * amount),
        y: Math.round(lastPoint.y + (point.y - lastPoint.y) * amount)
      });
    }

    state.points = state.points.slice(-66);
    state.lastPoint = point;
    updateMask(state);
  };

  brushImages.forEach((image) => {
    const reveal = document.createElement("span");
    const colorImage = image.cloneNode(true);
    const state = {
      reveal,
      image,
      color: colorImage,
      points: [],
      lastPoint: null
    };

    reveal.className = "brush-reveal";
    image.classList.add("brush-bw");
    colorImage.className = "brush-color";
    colorImage.setAttribute("aria-hidden", "true");
    colorImage.alt = "";
    image.parentNode.insertBefore(reveal, image);
    reveal.append(image, colorImage);
    updateMask(state);

    reveal.addEventListener(brushEnterEvent, () => {
      state.lastPoint = null;
      state.points = [];
      updateMask(state);
    });
    reveal.addEventListener(brushMoveEvent, (event) => {
      addPoint(state, event);
    }, { passive: true });
    reveal.addEventListener(brushLeaveEvent, () => {
      state.lastPoint = null;
    });
  });
}

function updateHero() {
  if (!hero || !heroFrame || !heroTitle) {
    return;
  }

  const rect = hero.getBoundingClientRect();
  const scrollable = hero.offsetHeight - window.innerHeight;
  const progress = clamp(-rect.top / Math.max(scrollable, 1), 0, 1);

  heroTitle.style.opacity = clamp(1 - progress * 1.25, 0, 1);
  heroTitle.style.transform = `translateY(${-progress * 46}px)`;
}

function updateFooterReveal() {
  if (!pageShell || !siteFooter || !footerSpacer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.style.setProperty("--footer-progress", "0");
    document.body.style.setProperty("--footer-shift", "0px");
    document.body.style.setProperty("--footer-scale", "1");
    document.body.style.setProperty("--footer-radius", "0px");
    document.body.style.setProperty("--footer-inset", "0px");
    document.body.style.setProperty("--footer-content-y", "0px");
    document.body.style.setProperty("--footer-content-opacity", "1");
    document.body.classList.remove("footer-is-visible");
    return;
  }

  if (window.getComputedStyle(footerSpacer).display === "none") {
    document.body.style.setProperty("--footer-progress", "0");
    document.body.style.setProperty("--footer-shift", "0px");
    document.body.style.setProperty("--footer-scale", "1");
    document.body.style.setProperty("--footer-radius", "0px");
    document.body.style.setProperty("--footer-inset", "0px");
    document.body.style.setProperty("--footer-content-y", "0px");
    document.body.style.setProperty("--footer-content-opacity", "1");
    document.body.classList.remove("footer-is-visible");
    return;
  }

  const rect = footerSpacer.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const revealDelay = clamp(viewportHeight * 0.24, 180, 320);
  const start = viewportHeight * 0.96 - revealDelay;
  const end = viewportHeight * 0.2 - revealDelay;
  const progress = clamp((start - rect.top) / Math.max(start - end, 1), 0, 1);
  const eased = 1 - Math.pow(1 - progress, 2.2);
  const radius = Math.round(eased * 32);
  const inset = eased * 4.8;
  const shift = eased * -18;
  const scale = 1 - eased * 0.012;
  const contentProgress = clamp((progress - 0.1) / 0.58, 0, 1);
  const contentEased = 1 - Math.pow(1 - contentProgress, 2);
  const contentY = (1 - contentEased) * 54;

  document.body.style.setProperty("--footer-progress", progress.toFixed(3));
  document.body.style.setProperty("--footer-shift", `${shift.toFixed(2)}px`);
  document.body.style.setProperty("--footer-scale", scale.toFixed(4));
  document.body.style.setProperty("--footer-radius", `${radius}px`);
  document.body.style.setProperty("--footer-inset", `${inset.toFixed(3)}vw`);
  document.body.style.setProperty("--footer-content-y", `${contentY.toFixed(2)}px`);
  document.body.style.setProperty("--footer-content-opacity", contentEased.toFixed(3));
  document.body.classList.toggle("footer-is-visible", progress > 0.02);
}

function setupFooterScrollRelease() {
  if (!siteFooter) {
    return;
  }

  siteFooter.addEventListener("wheel", (event) => {
    if (window.getComputedStyle(siteFooter).position !== "fixed" || event.deltaY >= 0) {
      return;
    }

    if (siteFooter.scrollTop <= 1) {
      event.preventDefault();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
    }
  }, { passive: false });
}

function updatePage() {
  updateHero();
  updateFooterReveal();
}

function closeMenu() {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  syncMenuTray(false);
}

function syncMenuTray(isOpen) {
  if (!navPanel || !menuButton) {
    return;
  }

  navPanel.style.removeProperty("clip-path");
  navPanel.style.removeProperty("transform");
  menuButton.style.removeProperty("top");
}

function applyTheme(theme, shouldStore = true) {
  const toggle = document.querySelector(".theme-toggle");

  currentTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = currentTheme;

  if (shouldStore) {
    storeTheme(currentTheme);
  }

  if (toggle) {
    const isDark = currentTheme === "dark";
    const aperture = isDark ? "F/24" : "F/2.4";
    const nextAperture = isDark ? "F/2.4" : "F/24";
    const label = `Aperture ${aperture}. Wechsel zu ${nextAperture}.`;
    const text = toggle.querySelector(".theme-toggle-text");

    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.dataset.aperture = isDark ? "closed" : "open";

    if (text) {
      text.textContent = aperture;
    }
  }

  syncTalkButtonState();
}

function syncTalkButtonState(forceHover = false) {
  const talkLink = document.querySelector(".nav-talk-link");

  if (!talkLink) {
    return;
  }

  const isDark = currentTheme === "dark";
  const isActive = forceHover || talkLink.matches(":hover") || talkLink.matches(":focus-visible");
  const rootStyle = getComputedStyle(document.documentElement);
  const ember = rootStyle.getPropertyValue("--ember").trim() || "#ff5a1c";
  const background = isActive ? ember : isDark ? "#f4f0e8" : "#111111";
  const foreground = isActive ? "#ffffff" : isDark ? "#101114" : "#ffffff";
  const border = isActive ? ember : isDark ? "rgba(244, 240, 232, 0.72)" : "rgba(17, 17, 17, 0.2)";

  talkLink.style.setProperty("--nav-talk-bg", background, "important");
  talkLink.style.setProperty("--nav-talk-fg", foreground, "important");
  talkLink.style.setProperty("--nav-talk-border", border, "important");
  talkLink.style.setProperty("background-color", background, "important");
  talkLink.style.setProperty("border-color", border, "important");
  talkLink.style.setProperty("color", foreground, "important");
}

function setupThemeToggle() {
  if (!nav || nav.querySelector(".theme-toggle")) {
    return;
  }

  const toggle = document.createElement("button");
  const text = document.createElement("span");
  const aperture = document.createElement("span");

  toggle.className = "theme-toggle";
  toggle.type = "button";
  text.className = "theme-toggle-text";
  aperture.className = "theme-toggle-aperture";
  aperture.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 6; index += 1) {
    const blade = document.createElement("i");
    blade.style.setProperty("--blade-index", String(index));
    aperture.append(blade);
  }

  toggle.append(text, aperture);
  nav.append(toggle);

  toggle.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  applyTheme(currentTheme, false);
}

function setupTalkButton() {
  if (!nav || nav.querySelector(".nav-talk-link")) {
    return;
  }

  const talkLink = document.createElement("a");
  const label = document.createElement("span");
  const track = document.createElement("span");
  const isContactPage = document.body.dataset.page === "contact";

  talkLink.className = "nav-talk-link";
  talkLink.href = isContactPage ? "#briefing" : "contact.html#briefing";
  talkLink.setAttribute("aria-label", "Projektbriefing starten");

  label.className = "nav-talk-label";
  track.className = "nav-talk-track";
  track.append(document.createElement("span"), document.createElement("span"));
  track.children[0].textContent = "Let's Talk";
  track.children[1].textContent = "Let's Talk";
  label.append(track);
  talkLink.append(label);
  nav.append(talkLink);

  talkLink.addEventListener("pointerenter", () => syncTalkButtonState(true));
  talkLink.addEventListener("pointerleave", () => syncTalkButtonState(false));
  talkLink.addEventListener("focus", () => syncTalkButtonState(true));
  talkLink.addEventListener("blur", () => syncTalkButtonState(false));
  syncTalkButtonState();
}

function setupCinematicPageCta() {
  if (!pageShell || ["contact", "privacy", "agb", "imprint"].includes(document.body.dataset.page) || document.querySelector(".cinematic-page-cta")) {
    return;
  }

  pageShell
    .querySelectorAll(":scope > .seo-link-band, :scope > .alien-final-cta, :scope > .service-big-cta")
    .forEach((block) => block.classList.add("is-pre-cinematic-cta"));

  const page = document.body.dataset.page || "home";
  const projectTitle = document.querySelector("#projectTitle")?.textContent?.trim();
  const projectBriefingHref = document.querySelector("#projectBriefingLink")?.getAttribute("href") || "contact.html#briefing";
  const studioEmail = "andy@andreasboehler.com";
  const mailtoHref = `mailto:${studioEmail}`;
  const base = {
    eyebrow: "Next scene",
    headline: "Bilder, die wie Szenen wirken. Stories, die hängen bleiben.",
    text: "Wenn aus einer Idee ein Film, eine Kampagne oder eine markante Bildwelt werden soll, starten wir mit Ziel, Gefühl und Wirkung.",
    marquee: "Creating moments · Cinematic stories · Not just images ·",
    primaryHref: mailtoHref,
    primaryText: "Projekt starten",
    links: [
      ["Briefing starten", "contact.html#briefing"],
      ["Works ansehen", "works.html"],
      ["Services", "services.html"]
    ]
  };
  const copy = {
    works: projectTitle
      ? {
          eyebrow: "Next frame",
          headline: "Wenn dein nächstes Projekt Haltung, Rhythmus und einen klaren Look braucht.",
          text: `${projectTitle} zeigt eine Richtung. Im Briefing klären wir, welche Geschichte, welches Format und welche Bildsprache für dein Projekt die stärkste Wirkung erzeugen.`,
          marquee: "Next frame · Strong story · Cinematic work ·",
          primaryHref: `${mailtoHref}?subject=${encodeURIComponent(`Projektanfrage zu ${projectTitle}`)}`,
          primaryText: "Projekt starten",
          links: [
            ["Briefing", projectBriefingHref],
            ["Alle Works", "works.html"],
            ["Leistungen", "services.html"]
          ]
        }
      : {
          eyebrow: "Next frame",
          headline: "Aus Referenzen wird Richtung. Aus Richtung wird der erste starke Frame.",
          text: "Wenn eine Arbeit hier etwas auslöst, lässt sich daraus schnell ein präziser Ansatz für dein Projekt, deine Marke oder deine Kampagne entwickeln.",
          marquee: "Selected works · Strong story · Cinematic craft ·",
          primaryHref: mailtoHref,
          primaryText: "Projekt starten",
          links: [
            ["Briefing", "contact.html#briefing"],
            ["Services", "services.html"],
            ["About", "about.html"]
          ]
        },
    services: {
      eyebrow: "Production flow",
      headline: "Aus Strategie wird Szene. Aus Szene wird Wirkung.",
      text: "Film, Fotografie, DoP, Art Direction und KI-Workflows werden so kombiniert, dass aus einem Briefing ein visueller Auftritt mit Haltung entsteht.",
      marquee: "Story first · Look matters · Make it cinematic ·",
      primaryHref: mailtoHref,
      primaryText: "Projekt starten",
      links: [
        ["Briefing", "contact.html#briefing"],
        ["Film-Works", "works.html#film"],
        ["DoP buchen", "dop-kameramann.html"]
      ]
    },
    about: {
      eyebrow: "Studio energy",
      headline: "Erfahrung ist die Basis. Neugier ist der Motor.",
      text: "Mehr als zehn Jahre zwischen Agentur, Entertainment, Healthcare, Film, Foto, Design und neuen Tools. Der nächste Schritt beginnt mit einer klaren Idee.",
      marquee: "Experience · Curiosity · Cinematic precision ·",
      primaryHref: mailtoHref,
      primaryText: "Projekt starten",
      links: [
        ["Briefing", "contact.html#briefing"],
        ["Works", "works.html"],
        ["Services", "services.html"]
      ]
    },
    faq: {
      eyebrow: "Open question",
      headline: "Noch offen? Dann lass uns dein Projekt sauber einordnen.",
      text: "Ein paar Eckdaten reichen: Ziel, Timing, Budgetrahmen, Referenzen und gewünschte Medien. Daraus entsteht schnell ein realistischer Produktionsweg.",
      marquee: "Ask better · Plan sharper · Create stronger ·",
      primaryHref: mailtoHref,
      primaryText: "Projekt starten",
      links: [
        ["Briefing", "contact.html#briefing"],
        ["Works", "works.html"],
        ["Services", "services.html"]
      ]
    }
  };
  const config = { ...base, ...(copy[page] || {}) };
  const cta = document.createElement("section");
  const marquee = document.createElement("div");
  const track = document.createElement("div");
  const inner = document.createElement("div");
  const label = document.createElement("div");
  const dot = document.createElement("i");
  const labelText = document.createElement("span");
  const copyWrap = document.createElement("div");
  const title = document.createElement("h2");
  const text = document.createElement("p");
  const links = document.createElement("nav");
  const primary = document.createElement("a");

  cta.className = "cinematic-page-cta";
  cta.setAttribute("aria-labelledby", "cinematicPageCtaTitle");

  marquee.className = "cinematic-cta-marquee";
  marquee.setAttribute("aria-hidden", "true");
  track.className = "cinematic-cta-track";
  Array.from({ length: 6 }).forEach(() => {
    const item = document.createElement("span");
    item.textContent = config.marquee;
    track.append(item);
  });
  marquee.append(track);

  inner.className = "cinematic-cta-inner";
  label.className = "alien-section-label cinematic-cta-label";
  labelText.textContent = config.eyebrow;
  label.append(dot, labelText);

  copyWrap.className = "cinematic-cta-copy";
  title.id = "cinematicPageCtaTitle";
  title.textContent = config.headline;
  text.textContent = config.text;

  primary.className = "cinematic-cta-primary";
  primary.href = config.primaryHref;
  primary.textContent = config.primaryText;

  links.className = "cinematic-cta-links";
  links.setAttribute("aria-label", "Nächste Schritte");
  links.append(primary);
  config.links.forEach(([linkText, href]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = linkText;
    links.append(link);
  });

  copyWrap.append(title, text, links);
  inner.append(label, copyWrap);
  cta.append(marquee, inner);
  pageShell.append(cta);
}

function getCurrentProjectSlug() {
  if (document.body.dataset.projectSlug) {
    return document.body.dataset.projectSlug;
  }

  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get("work");

  if (querySlug) {
    return querySlug;
  }

  const pathSlug = window.location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/, "");

  return projectData[pathSlug] ? pathSlug : "dj-bobo-evolut30n-tour";
}

function renderProjectPage() {
  const projectHero = document.querySelector("#projectHero");

  if (!projectHero) {
    return;
  }

  const slug = getCurrentProjectSlug();
  const project = projectData[slug] || projectData["dj-bobo-evolut30n-tour"];
  const title = document.querySelector("#projectTitle");
  const eyebrow = document.querySelector("#projectEyebrow");
  const intro = document.querySelector("#projectIntro");
  const role = document.querySelector("#projectRole");
  const description = document.querySelector("#projectDescription");
  const facts = document.querySelector("#projectFacts");
  const contactLink = document.querySelector("#projectContactLink");
  const briefingLink = document.querySelector("#projectBriefingLink");
  const serviceText = document.querySelector("#projectServiceText");
  const serviceLink = document.querySelector("#projectServiceLink");
  const footerProjectTitle = document.querySelector("#footerProjectTitle");
  const footerProjectText = document.querySelector("#footerProjectText");

  document.title = `${project.title} | Andreas Boehler Studio`;
  projectHero.style.setProperty("--page-image", `url("${project.image}")`);

  if (title) title.textContent = project.title;
  if (eyebrow) eyebrow.textContent = project.eyebrow;
  if (intro) intro.textContent = project.intro;
  if (role) role.textContent = project.role;
  if (description) description.textContent = project.description;
  if (serviceText) serviceText.textContent = `Mehr zu ${project.service} und passenden Produktionsleistungen.`;
  if (serviceLink) serviceLink.href = project.serviceLink;
  if (footerProjectTitle) footerProjectTitle.textContent = project.title;
  if (footerProjectText) footerProjectText.textContent = project.intro;

  const projectQuery = `?project=${encodeURIComponent(project.title)}#briefing`;
  if (contactLink) contactLink.href = `contact.html${projectQuery}`;
  if (briefingLink) briefingLink.href = `contact.html${projectQuery}`;

  if (facts) {
    facts.textContent = "";

    project.facts.forEach(([label, text]) => {
      const article = document.createElement("article");
      const span = document.createElement("span");
      const heading = document.createElement("h3");
      const paragraph = document.createElement("p");

      span.textContent = label;
      heading.textContent = text.split(".")[0];
      paragraph.textContent = text;

      article.append(span, heading, paragraph);
      facts.append(article);
    });
  }
}

function getFormValues(form, name) {
  return Array.from(form.querySelectorAll(`[name="${name}"]`))
    .filter((field) => {
      if (field.type === "checkbox" || field.type === "radio") {
        return field.checked;
      }

      return Boolean(field.value.trim());
    })
    .map((field) => field.value.trim());
}

function updateBriefingSummary() {
  const form = document.querySelector("#briefingForm");

  if (!form) {
    return;
  }

  const types = getFormValues(form, "Projekttyp");
  const channels = getFormValues(form, "Kanäle");
  const looks = getFormValues(form, "Look");
  const [goal] = getFormValues(form, "Ziel");
  const [timing] = getFormValues(form, "Timing");
  const [budget] = getFormValues(form, "Budget");
  const [status] = getFormValues(form, "Status");
  const reference = form.querySelector("#projectReference")?.value.trim();
  const title = document.querySelector("#briefingSummaryTitle");
  const text = document.querySelector("#briefingSummaryText");
  const scope = document.querySelector("#summaryScope");
  const next = document.querySelector("#summaryNext");
  const summaryReference = document.querySelector("#summaryReference");
  const hasManyNeeds = types.length > 2 || channels.length > 2;
  const hasHighBudget = budget && /40\.000|15\.000/.test(budget);
  const hasFastTiming = timing && /unter 4 Wochen/.test(timing);
  const isCameraOnly = types.includes("DoP / Kameramann") && status === "Nur Kamera / DoP wird gesucht";
  let scopeText = "Noch nicht einschätzbar";
  let titleText = "Noch offen";
  let nextText = "Kurzes Erstgespräch und Referenzen abgleichen";

  if (isCameraOnly) {
    titleText = "Gezielter DoP- oder Kameraeinsatz";
    scopeText = "Schlanker Produktionsumfang mit Fokus auf Set, Licht, Kamera und Look.";
    nextText = "Verfügbarkeit, Drehort, Technikliste und Tagesumfang klären.";
  } else if (hasManyNeeds || hasHighBudget) {
    titleText = "Kampagnen- oder Full-Service-Produktion";
    scopeText = "Mehrere Gewerke sind wahrscheinlich: Konzept, Produktion, Schnitt, Sound, Farbe, Motion und Ausspielungsvarianten.";
    nextText = "Strategiecall oder ausführliches Briefing mit Referenzen, Zielgruppe und Kanalplan.";
  } else if (types.length || goal || budget) {
    titleText = "Fokussierte Produktion";
    scopeText = "Ein kompakter, klar definierter Umfang ist realistisch, wenn Ziel, Kanal und Timing früh sortiert werden.";
    nextText = "Kurzer Call, anschließend grobe Aufwandsschätzung und nächster Konzeptschritt.";
  }

  if (hasFastTiming) {
    nextText = "Timing priorisieren, Pflichtformate festlegen und schnell eine schlanke Produktionsroute wählen.";
  }

  if (title) title.textContent = titleText;
  if (text) {
    const parts = [
      types.length ? `Fokus: ${types.join(", ")}.` : "",
      goal ? `Ziel: ${goal}.` : "",
      channels.length ? `Kanäle: ${channels.join(", ")}.` : "",
      looks.length ? `Look: ${looks.join(", ")}.` : ""
    ].filter(Boolean);

    text.textContent = parts.length
      ? parts.join(" ")
      : "Wähle Projekttyp, Ziel, Timing und Budget. Daraus entsteht eine schnelle Orientierung für Umfang, Team und nächste Schritte.";
  }
  if (scope) scope.textContent = scopeText;
  if (next) next.textContent = nextText;
  if (summaryReference) summaryReference.textContent = reference || "Keine Referenz gewählt";
}

function setupBriefingForm() {
  const form = document.querySelector("#briefingForm");

  if (!form) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const project = params.get("project");
  const reference = form.querySelector("#projectReference");

  if (project && reference) {
    reference.value = project;
  }

  form.addEventListener("input", updateBriefingSummary);
  form.addEventListener("change", updateBriefingSummary);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const grouped = {};

    data.forEach((value, key) => {
      const text = String(value).trim();

      if (!text) {
        return;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(text);
    });

    const lines = [
      "Hallo Andreas,",
      "",
      "ich möchte ein Projekt anfragen und habe die Eckdaten vorbereitet:",
      "",
      ...Object.entries(grouped).map(([key, values]) => `${key}: ${values.join(", ")}`),
      "",
      "Viele Grüße"
    ];
    const subject = encodeURIComponent("Projektbriefing Andreas Boehler Studio");
    const body = encodeURIComponent(lines.join("\n"));

    window.location.href = `mailto:andy@andreasboehler.com?subject=${subject}&body=${body}`;
  });

  updateBriefingSummary();
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  syncMenuTray(isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", updatePage, { passive: true });
window.addEventListener("resize", updatePage);

renderProjectPage();
setupNavHoverLabels();
setupWorksViewToggle();
setupBriefingForm();
setupTalkButton();
setupThemeToggle();
setupCinematicPageCta();
setupFooterScrollRelease();
setupHeroBackgroundBrush();
setupBrushRevealImages();
syncMenuTray(false);
updatePage();
