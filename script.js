const nav = document.querySelector(".site-nav");
const navPanel = document.querySelector(".nav-panel");
const menuButton = document.querySelector(".menu-button");
const navItems = document.querySelectorAll(".nav-item");
const hero = document.querySelector(".hero-sequence");
const heroFrame = document.querySelector(".hero-frame");
const heroFrameColor = document.querySelector(".hero-frame-color, [data-about-brush-color]");
const heroVideos = [...document.querySelectorAll("[data-hero-scroll-video]")];
const heroVideo = heroVideos[0] || null;
const heroChapters = [...document.querySelectorAll("[data-hero-chapter]")];
const heroSticky = document.querySelector(".hero-sticky");
const heroTitle = document.querySelector(".hero-sticky h1");
const heroBrushSurface = document.querySelector(".hero-sticky, [data-about-brush]");
const pageShell = document.querySelector(".page-shell");
const siteFooter = document.querySelector(".site-footer");
const footerSpacer = document.querySelector(".footer-reveal-spacer");
const themeStorageKey = "andreas-boehler-theme";
const consentStorageKey = "andreas-boehler-consent-v2";
const legacyConsentStorageKeys = ["andreas-boehler-consent-v1"];
const googleAnalyticsMeasurementId = "G-H7564XZ7BB";
const googleAnalyticsScriptId = "andreas-google-analytics";
const loaderQuoteStorageKey = "andreas-boehler-loader-quote-seen-v4";
const loaderSessionKey = "andreas-boehler-loader-seen-v4";
const consentCategories = ["statistics", "marketing", "external"];
const defaultConsent = {
  necessary: true,
  statistics: false,
  marketing: false,
  external: false,
  decided: false,
  version: 2
};
const brandMarkPath = "M58.41,25.69l-14.2-2.75c.29-1.1.44-2.35.44-3.75,0-4.69-1.28-7.92-3.84-9.72-2.56-1.79-6.16-2.69-10.81-2.69h-12.17v11.04l-7.26-1.41v9.16l7.26,1.26v.02l10.83,1.61,17.53,2.6-.1.02.28.04-3.14.47s-.01-.01-.02-.02l-9.86,1.6s0,0,0,0l-5.83.95h0s-9.69,1.57-9.69,1.57h0s-7.26,1.18-7.26,1.18v8.85l7.26-1.4v10.32h14.29c9.29,0,13.94-4.69,13.94-14.06,0-.58-.02-1.14-.06-1.69l12.41-2.39v-10.81ZM27.52,13.46h1.83c2.32,0,4.04.46,5.14,1.39,1.1.93,1.65,2.45,1.65,4.58,0,.7-.04,1.34-.12,1.92l-8.51-1.65v-6.24ZM35.28,46c-.96,1.18-2.63,1.77-4.99,1.77h-2.78v-5.33l9.21-1.77c-.03,2.42-.52,4.2-1.44,5.33Z";
let activeConsent = null;
let heroVideoScrub = null;

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
    link.setAttribute("aria-label", "Andreas Boehler Startseite");
    wordmark.className = "site-mark-wordmark";
    wordmark.setAttribute("aria-hidden", "true");
    wordmark.innerHTML = "<span>ANDREAS</span><span>BOEHLER</span>";
    link.append(createBrandGlyph("brand-glyph site-mark-glyph"), wordmark);
    nav.append(link);
    document.documentElement.classList.add("is-brand-pending");
  }

  document.querySelectorAll(".footer-mark").forEach((mark) => {
    mark.setAttribute("aria-label", "Andreas Boehler Startseite");

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
    const text = label.textContent.replace(/\s+/g, " ").trim();

    if (!text || label.dataset.accessibleHoverReady === "true") {
      return;
    }

    const link = label.closest(".nav-item");
    const context = link?.querySelector("strong")?.textContent.replace(/\s+/g, " ").trim();
    const accessibleLabel = [text, context].filter(Boolean).join(" — ");

    if (link && accessibleLabel) {
      link.setAttribute("aria-label", accessibleLabel);
    }

    label.dataset.text = text;
    label.dataset.accessibleHoverReady = "true";
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

function setupWorksCuration() {
  const grid = document.querySelector(".redox-portfolio-grid");

  if (!grid || grid.dataset.curationReady === "true") {
    return;
  }

  const signatureOrder = [
    "dj-bobo-evolut30n-tour.html",
    "50-jahre-europa-park.html",
    "tnw-website.html",
    "voltron-nevera-tv-werbespot.html",
    "novartis-medportal.html",
    "photography.html",
    "phantom-der-oper-vr-coastiality.html",
    "duolingo-spec-ad.html",
    "virtual-production-case-study.html"
  ];
  const cards = [...grid.querySelectorAll(".redox-project-card")];
  const signatureCards = signatureOrder
    .map((href) => cards.find((card) => card.getAttribute("href") === href))
    .filter(Boolean);
  const signatureSet = new Set(signatureCards);
  const archiveCards = cards.filter((card) => !signatureSet.has(card));

  signatureCards.forEach((card) => {
    card.classList.add("is-signature");
    grid.append(card);
  });
  archiveCards.forEach((card) => {
    card.classList.add("is-archive");
    grid.append(card);
  });

  if (archiveCards.length) {
    const archiveToggle = document.createElement("button");
    archiveToggle.className = "works-archive-toggle";
    archiveToggle.type = "button";
    archiveToggle.setAttribute("aria-expanded", "false");
    archiveToggle.textContent = `Archiv öffnen · ${archiveCards.length} Projekte`;
    archiveToggle.addEventListener("click", () => {
      const isOpen = grid.classList.toggle("is-archive-open");
      archiveToggle.setAttribute("aria-expanded", String(isOpen));
      archiveToggle.textContent = isOpen
        ? "Archiv schließen"
        : `Archiv öffnen · ${archiveCards.length} Projekte`;
    });
    grid.after(archiveToggle);
  }

  grid.dataset.curationReady = "true";
}

function setupWorksScrollCue() {
  const cue = document.querySelector(".works-scroll-cue");

  if (!cue) {
    return;
  }

  cue.addEventListener("click", (event) => {
    const target = document.querySelector(cue.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", cue.getAttribute("href"));
  });
}

function setupDynamicCopyright() {
  const currentYear = new Date().getFullYear();

  document.querySelectorAll(".footer-bottom > span:first-child").forEach((line) => {
    line.textContent = `© ${currentYear} Andreas Boehler.`;
  });
}

function setupStudioCursor() {
  if (document.body.dataset.page === "webdesign") {
    return;
  }

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
      "[data-about-brush]",
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
    cursor.classList.toggle("is-brush", nextMode === "brush");
    cursor.classList.toggle("is-text", nextMode === "text");
  };

  const updateModeFromPoint = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);

    if (!target) {
      setMode("");
      return;
    }

    if (target.closest('.site-nav, .photo-lightbox, .cookie-consent, .embed-consent-action')) {
      setMode('');
      return;
    }

    if (target.closest(selectors.text)) {
      setMode("text");
      return;
    }

    if (target.closest(selectors.view)) {
      const brushTarget = target.closest(".brush-feature, .hero-reveal, [data-about-brush]");
      setMode(brushTarget ? "brush" : "view", brushTarget ? "" : "VIEW");
      return;
    }

    const actionTarget = target.closest(selectors.action);
    if (actionTarget) {
      const actionLabel = actionTarget.matches(".menu-button") && nav?.classList.contains("is-open")
        ? "CLOSE"
        : "OPEN";
      setMode("hover", actionLabel);
      return;
    }

    setMode("");
  };

  let cursorFrame = null;
  const animate = () => {
    cursorFrame = null;
    state.ringX += (state.x - state.ringX) * 0.18;
    state.ringY += (state.y - state.ringY) * 0.18;
    state.dotX += (state.x - state.dotX) * 0.55;
    state.dotY += (state.y - state.dotY) * 0.55;

    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate3d(-50%, -50%, 0) scale(var(--cursor-scale, 1))`;
    dot.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate3d(-50%, -50%, 0)`;
    const unsettled = Math.abs(state.x - state.ringX) + Math.abs(state.y - state.ringY) > 0.1;
    if (unsettled && !document.hidden && finePointer.matches && !reducedMotion.matches) cursorFrame = window.requestAnimationFrame(animate);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") {
      return;
    }

    state.x = event.clientX;
    state.y = event.clientY;
    if (!cursorFrame) cursorFrame = window.requestAnimationFrame(animate);
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
  if (document.body.dataset.page === "webdesign") {
    document.documentElement.classList.add("is-brand-revealed");
    document.documentElement.classList.remove("is-brand-pending");
    unlockPageScroll();
    return;
  }

  if (document.querySelector(".site-loader")) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasSeenLoader = reduceMotion;

  try {
    hasSeenLoader = hasSeenLoader || sessionStorage.getItem(loaderSessionKey) === "true";
    sessionStorage.setItem(loaderSessionKey, "true");
  } catch (error) {
    hasSeenLoader = reduceMotion;
  }

  if (hasSeenLoader) {
    document.documentElement.classList.add("is-brand-revealed");
    document.documentElement.classList.remove("is-brand-pending");
    unlockPageScroll();
    return;
  }

  const getLoaderSectionLabel = () => {
    const activeNavLabel = document.querySelector(".nav-item.active span")?.textContent.trim();
    const pageLabels = {
      home: "Home",
      works: "Works",
      services: "Leistungen",
      about: "About",
      contact: "Contact",
      faq: "FAQ",
      privacy: "Datenschutz",
      imprint: "Impressum",
      agb: "AGB"
    };
    const fallbackLabel = pageLabels[document.body?.dataset.page] || document.title.split("|")[0] || "Andreas";

    return (activeNavLabel || fallbackLabel).replace(/\s+/g, " ").trim().toUpperCase();
  };

  const loader = document.createElement("div");
  const curtain = document.createElement("div");
  const noise = document.createElement("div");
  const loaderStage = document.createElement("div");
  const mark = document.createElement("div");
  const glyphStack = document.createElement("div");
  const progressText = document.createElement("div");
  const loaderSection = document.createElement("div");
  const loaderSectionTitle = document.createElement("strong");
  const loaderQuote = document.createElement("div");
  const quoteLine = document.createElement("span");
  const quoteMain = document.createElement("strong");
  const introDelay = 100;
  const fillDuration = 300;
  const exitDuration = 560;
  const progressDuration = 1100;
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
      document.documentElement.classList.add("is-brand-revealed");
      document.documentElement.classList.remove("is-brand-pending");
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
  loaderSection.className = "loader-section-label";
  loaderSection.setAttribute("aria-hidden", "true");
  loaderSectionTitle.textContent = getLoaderSectionLabel();
  loaderSection.append(loaderSectionTitle);
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
    loaderStage.append(loaderQuote, mark, loaderSection);
  } else {
    loaderStage.append(mark, loaderSection);
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
    mark.style.filter = "blur(0)";
    mark.style.transform = "translate3d(0, 0, 0)";
    glyphStack.style.opacity = "1";
    glyphStack.style.filter = "blur(0)";
    glyphStack.style.transform = "translate3d(0, 0, 0)";
    outlinePath?.style.setProperty("stroke-dashoffset", "0");
    window.setTimeout(() => {
      loader.classList.add("is-active");
    }, introDelay);
  }, 40);

  const now = () => window.performance?.now?.() ?? Date.now();
  const readyAt = now() + 1100;
  const waitAndHide = () => {
    const remaining = Math.max(0, readyAt - now());
    window.setTimeout(hideLoader, remaining);
  };

  waitAndHide();
  window.setTimeout(() => {
    loader.remove();
    document.documentElement.classList.add("is-brand-revealed");
    document.documentElement.classList.remove("is-brand-pending");
    unlockPageScroll();
  }, 2600);
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
    legacyConsentStorageKeys.forEach((key) => localStorage.removeItem(key));
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

function getGoogleTag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function googleTag() {
    window.dataLayer.push(arguments);
  };

  return window.gtag;
}

function disableGoogleAnalytics() {
  window[`ga-disable-${googleAnalyticsMeasurementId}`] = true;
  document.documentElement.dataset.analytics = "disabled";

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }
}

function enableGoogleAnalytics() {
  if (!isConsentCategoryAllowed("statistics")) {
    disableGoogleAnalytics();
    return;
  }

  window[`ga-disable-${googleAnalyticsMeasurementId}`] = false;
  document.documentElement.dataset.analytics = "loading";
  const gtag = getGoogleTag();

  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  if (!document.getElementById(googleAnalyticsScriptId)) {
    const script = document.createElement("script");

    script.id = googleAnalyticsScriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsMeasurementId)}`;
    script.addEventListener("load", () => {
      document.documentElement.dataset.analytics = "loaded";
    });
    script.addEventListener("error", () => {
      document.documentElement.dataset.analytics = "error";
    });
    document.head.append(script);

    gtag("js", new Date());
    gtag("config", googleAnalyticsMeasurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  } else {
    document.documentElement.dataset.analytics = "loaded";
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }
}

function syncGoogleAnalyticsConsent() {
  if (isConsentCategoryAllowed("statistics")) {
    enableGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }
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
  syncGoogleAnalyticsConsent();
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
    createConsentOption("statistics", "Statistik", "Reichweiten- und Performance-Messung mit Google Analytics nach deiner Einwilligung."),
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
    image: "assets/europa-park-50-jahre-teaser.jpg",
    intro: "Ein Jubiläumsprojekt für eine der stärksten Entertainment-Marken Europas: emotional, schnell verständlich und nah am Erlebnis.",
    role: "Konzeption und vollständiges Rendering der finalen Logoanimation, Kamera sowie Editing bis zum Release.",
    description: "Der Spot verdichtet Attraktionen, Menschen und Erinnerungen zu einer filmischen Jubiläumserzählung. Den Abschluss bildet die von mir konzipierte und vollständig gerenderte Logoanimation.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    facts: [
      ["Format", "Jubiläumscontent, Kampagnenbilder und bewegte Markenkommunikation."],
      ["Stärke", "Viele Erlebniswelten werden zu einer klaren emotionalen Linie verdichtet."],
      ["Einsatz", "Website, Social Media, interne Kommunikation und Event-Kontext."],
      ["Look", "Energetisch, farbig, menschlich und mit hohem Wiedererkennungswert."]
    ]
  },
  "tnw-website": {
    title: "TNW Website",
    eyebrow: "Digital Experience · Filmcontent · Basel",
    image: "assets/projects/tnw/tnw-web-header.jpg",
    intro: "Eine digitale Mobilitätsplattform, in der klare Nutzerführung, frische Bildwelten und bewegter Content als ein System zusammenspielen.",
    role: "Mitwirkung am Webdesign und an der visuellen Ausarbeitung der Website sowie Konzeption und Produktion von Filmcontent.",
    description: "Für den Tarifverbund Nordwestschweiz entstand im Team von The Bloc Switzerland ein zugänglicher, interaktiver Auftritt mit neuer Navigation, Fotografie, Drohnenbildern und einer filmischen Landingpage-Sequenz.",
    service: "Webdesign & visuelle Kommunikation",
    serviceLink: "webdesign-freiburg.html",
    facts: [
      ["Beitrag", "Webdesign, visuelle Ausarbeitung und Filmcontent für die digitale Markenpräsenz."],
      ["Kontext", "Tarifverbund Nordwestschweiz, Mobilität, Servicekommunikation und Region Basel."],
      ["Ergebnis", "Eine klarere Navigation und eine menschliche Bildwelt verbinden Information mit Bewegung."],
      ["Team", "Realisierung im Team von The Bloc Switzerland für TNW."]
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
    title: "DJ BoBo – The Great Adventure",
    eyebrow: "Tourtrailer · Producer · VFX · KI Postproduktion · 2024",
    image: "assets/dj-bobo-great-adventure-filmstill.jpg",
    intro: "Ein filmischer Tourtrailer zwischen Abenteuerkino, Special VFX und digitaler Postproduktion.",
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
  "movin-powerbreak": {
    title: "MOVIN Powerbreak",
    eyebrow: "Imagefilm · Sport · Physiotherapie",
    image: "assets/projects/movin-powerbreak/movin-powerbreak-hero.jpg",
    intro: "Ein 20-sekündiger Imagefilm über Zweifel, therapeutische Begleitung und den Moment, in dem Bewegung wieder möglich wird.",
    role: "Konzeption, Schnitt, Postproduktion, Motion Design, KI-Visuals und Audiokonzept.",
    description: "Cineastische Sportbilder, authentische MOVIN-Aufnahmen, präzise Typografie und eine markante Logoanimation verdichten eine persönliche Entwicklung zu einer klaren Markenbotschaft.",
    service: "Werbefilm & Produktfilm",
    serviceLink: "werbefilm-produktfilm.html",
    format: "Imagefilm · 00:20 min",
    collaboration: "Direkte Zusammenarbeit mit MOVIN am Lorettoberg.",
    place: "Freiburg",
    year: "2026",
    videos: [
      {
        title: "MOVIN Powerbreak",
        player: "https://www.youtube-nocookie.com/embed/lyvVpJFlL6A",
        thumbnail: "assets/projects/movin-powerbreak/movin-powerbreak-hero.jpg",
        duration: "20",
        date: "2026-01-01",
        description: "20-sekündiger Imagefilm für MOVIN über therapeutische Begleitung und sportliche Leistungsfähigkeit."
      }
    ],
    facts: [
      ["Format", "Imagefilm · 00:20 min"],
      ["Leistung", "Konzeption, Schnitt, Postproduktion, Motion Design, KI-Visuals und Audiokonzept."],
      ["Zusammenarbeit", "MOVIN am Lorettoberg."],
      ["Ort & Jahr", "Freiburg · 2026"]
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
      ["Nutzen", "Komplexe Angebote werden über visuelle Struktur leichter erfassbar."]
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


// Live portfolio sync start
const liveProjectEnhancements = {
  "50-jahre-europa-park": {
    "videos": [
      {
        "title": "50 Jahre Europa-Park - Andreas Boehler X Filmemacher Fotograf",
        "player": "https://www.youtube.com/embed/4Sp3URHqSBw",
        "thumbnail": "",
        "duration": "",
        "date": "2024-11-26",
        "description": "Bekijk je favoriete video's, luister naar de muziek die je leuk vindt, upload originele content en deel alles met vrienden, familie en anderen op YouTube."
      }
    ]
  },
  "duolingo-spec-ad": {
    "videos": [
      {
        "title": "Learning Russian, the hard way... - DUOLINGO Spec Ad",
        "player": "https://www.youtube.com/embed/SkJ3qPWwTQ0",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2023/08/maxresdefault-2.jpg",
        "duration": "30",
        "date": "2023-08-29",
        "description": "He should have used @duolingo... With Nicky : Nicolas BIEGELHuman Ressources : Claire VERLEYAssistant HR : Jerome MATTERNScenarist and Director : Emile BIEG..."
      }
    ]
  },
  "rockstar-musicvideo": {
    "videos": [
      {
        "title": "MC PRISMA- ROCKSTAR",
        "player": "https://www.youtube.com/embed/y95RLOrmGY8",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2023/05/maxresdefault-1.jpg",
        "duration": "186",
        "date": "2023-05-11",
        "description": "Director x DOP X Editor x CC x Drone x VFX Andreas Boehler► Instagram: https://www.instagram.com/andy.b.graphy/► Homepage: https://andreasboehler.com/ MC Pri..."
      }
    ]
  },
  "dj-bobo-evolut30n-tour": {
    "videos": [
      {
        "title": "DJ BoBo The Great Adventure Tourtrailer",
        "player": "https://www.youtube.com/embed/VcAIj00Vxqc",
        "thumbnail": "assets/dj-bobo-great-adventure-filmstill.jpg",
        "duration": "",
        "date": "2024-01-01",
        "description": "Tourtrailer zu The Great Adventure mit Special VFX, 3D, Motion Graphics und KI-gestützter Postproduktion."
      }
    ]
  },
  "europa-park-neuheiten-2023": {
    "videos": [
      {
        "title": "Europa-Park 2023 - Alle Neuheiten!",
        "player": "https://www.youtube.com/embed/kt-pYo8eOrg",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2023/04/maxresdefault.jpg",
        "duration": "701",
        "date": "2023-04-01",
        "description": "Jetzt Tickets buchen: https://tickets.mackinternational.de/de/Mit dem Saisonstart dürft ihr euch auf viele spektakuläre Neuheiten freuen. Im Europa-Park wird..."
      }
    ]
  },
  "europa-park-dinnershow-2022": {
    "title": "Europa-Park Dinnershow 2022",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-europa-park-dinnershow-2022.png",
    "intro": "Ein Gala-Menü von 2-Sterne Koch Peter Hagen-Wiest und ein begleitendes fünfstündiges Showprogramm sorgen für einen unvergesslichen Abend! Projekt Erstellung eines Werbespots für die Europa-Park Dinnershow 2022 Arbeit Camera.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Ein Gala-Menü von 2-Sterne Koch Peter Hagen-Wiest und ein begleitendes fünfstündiges Showprogramm sorgen für einen unvergesslichen Abend! Projekt Erstellung eines Werbespots für die Europa-Park Dinnershow 2022 Arbeit Camera.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "Europa-Park Dinnershow 2022",
        "player": "https://www.youtube.com/embed/jQXS_mpJDus",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2023/03/maxresdefault.jpg",
        "duration": "33",
        "date": "2022-12-14",
        "description": "https://www.europapark.de/de/events/dinner-showEin Gala-Menü von 2-Sterne Koch Peter Hagen-Wiest und ein begleitendes fünfstündiges Showprogramm sorgen für e..."
      }
    ]
  },
  "smt-imagefilm-qualitaet": {
    "videos": [
      {
        "title": "SMT Imagefilm",
        "player": "https://player.vimeo.com/video/757935943",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2023/01/SMT_Imagefilm_Quality_28.png",
        "duration": "197",
        "date": "2022-10-07",
        "description": "Die SMT Basel ist das führende Kompetenz- und Ausbildungs-Zentrum für Führungskräfte der Metallbaubranche in der Schweiz und setzt in Bezug auf neuste Technologien und Entwicklungen maßgebliche Zeichen.Die SMT bildet Qualität und."
      }
    ]
  },
  "movin-recruitingfilm": {
    "videos": [
      {
        "title": "MOVIN Freiburg - Physiotherapie",
        "player": "https://www.youtube.com/embed/UYP4_OR9A9M",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2022/09/14_Movin_Recrutingfilm_4K_Final_H264_11-1.jpg",
        "duration": "104",
        "date": "2022-09-18",
        "description": "Der Recruitingfilm für MOVIN zeigt die Vielfalt des Teams, den Arbeitsalltag in zwei Freiburger Praxen und persönliche Entwicklungsmöglichkeiten."
      }
    ]
  },
  "virtual-production-case-study": {
    "videos": [
      {
        "title": "Virtual Prod Movie + Making Of",
        "player": "https://player.vimeo.com/video/733247919",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2022/09/VP_Thumbnail_blank.jpg",
        "duration": "170",
        "date": "2022-07-25",
        "description": "Case Film für die Produktionstechnik Virtual Production"
      }
    ]
  },
  "paris": {
    "title": "Paris – Stadt der Lichter",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-paris.jpg",
    "intro": "Paris – Stadt der Lichter aus dem Portfolio von Andreas Boehler.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Paris – Stadt der Lichter aus dem Portfolio von Andreas Boehler.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "uniimmo-portraits": {
    "title": "UniImmo Portraits",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-uniimmo-portraits.jpg",
    "intro": "Für die neue Website von UniImmo entstand eine helle, moderne Portraitserie. Sie zeigt das Team professionell, freundlich und mit einer konsistenten visuellen Sprache.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Für die neue Website von UniImmo entstand eine helle, moderne Portraitserie. Sie zeigt das Team professionell, freundlich und mit einer konsistenten visuellen Sprache.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "mercedes-gt-in-der-salzwuste": {
    "title": "Mercedes Benz GT in der Salzwüste",
    "eyebrow": "3D / Visualisierung",
    "image": "assets/live-mercedes-gt-in-der-salzwuste.jpg",
    "intro": "Für dieses freie Projekt habe ich mit der Unreal Engine 5 ein Automotive-Visual entwickelt. Das Auto sollte in einer untypischen Umgebung gezeigt werden. Die reduzierte Landschaft der Salzwüste lässt das Design des Wagens eher in.",
    "role": "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung.",
    "description": "Für dieses freie Projekt habe ich mit der Unreal Engine 5 ein Automotive-Visual entwickelt. Das Auto sollte in einer untypischen Umgebung gezeigt werden. Die reduzierte Landschaft der Salzwüste lässt das Design des Wagens eher in.",
    "service": "Art Direction & Branding",
    "serviceLink": "art-direction.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "3D, Visualisierung."
      ],
      [
        "Leistung",
        "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "kaeppeli-recruitngfilm": {
    "title": "Käppeli Recruitingfilm",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-kaeppeli-recruitngfilm.png",
    "intro": "Der Recruitingfilm für das Alters- und Pflegeheim Käppeli in Muttenz zeigt Arbeitsalltag, Teamkultur und die Nähe zu den Menschen, die dort leben.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Der Recruitingfilm für das Alters- und Pflegeheim Käppeli in Muttenz zeigt Arbeitsalltag, Teamkultur und die Nähe zu den Menschen, die dort leben.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "Recruitingfilm Altersheim Kaeppeli",
        "player": "https://player.vimeo.com/video/702877027",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2022/05/kaeppeli_teaser.png",
        "duration": "183",
        "date": "2022-04-25",
        "description": "Ausführung als Angestellter bei X-Ray AG für das Altersheim zum Park in Muttenz"
      }
    ]
  },
  "one-stop-in-venedig": {
    "title": "One stop in Venedig",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-one-stop-in-venedig.jpg",
    "intro": "Die Stadt, die auf Brücken gebaut ist. So oder so ähnlich kennt man Venedig. Auf einem Roadtrip kam ich an der Stadt vorbei. Bereit für einen kleinen Stopp sind diese Bilder entstanden. Die Stadt Venedig entstand auf mehr als 120.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Die Stadt, die auf Brücken gebaut ist. So oder so ähnlich kennt man Venedig. Auf einem Roadtrip kam ich an der Stadt vorbei. Bereit für einen kleinen Stopp sind diese Bilder entstanden. Die Stadt Venedig entstand auf mehr als 120.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "dogportrait-ilvy-co": {
    "title": "Dogportrait Ilvy & Co",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-dogportrait-ilvy-co.jpg",
    "intro": "Die flinke Ilvie rennt blitzschnell davon, während der andere schwarze Gefährte sich beruhigend an seinem Spielzeug festbeißt. Zwei Hunde, die unterschiedlich sind, aber trotzdem ihr Leben zusammen teilen. In dieser Fotoserie.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Die flinke Ilvie rennt blitzschnell davon, während der andere schwarze Gefährte sich beruhigend an seinem Spielzeug festbeißt. Zwei Hunde, die unterschiedlich sind, aber trotzdem ihr Leben zusammen teilen. In dieser Fotoserie.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "zum-park-recruitngfilm": {
    "title": "Zum Park Recruitingfilm",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-zum-park-recruitngfilm.png",
    "intro": "Das Alters- und Pflegeheim Zum Park in Muttenz bietet 138 Menschen ein Zuhause. Der Recruitingfilm macht Arbeitsalltag, Haltung und Teamkultur sichtbar und spricht neue Fachkräfte persönlich an.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Das Alters- und Pflegeheim Zum Park in Muttenz bietet 138 Menschen ein Zuhause. Der Recruitingfilm macht Arbeitsalltag, Haltung und Teamkultur sichtbar und spricht neue Fachkräfte persönlich an.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "Zum Park Recruitingfilm",
        "player": "https://player.vimeo.com/video/684537299",
        "thumbnail": "",
        "duration": "",
        "date": "",
        "description": "Zum Park Recruitingfilm"
      }
    ]
  },
  "desert-mustang": {
    "title": "Desert Mustang",
    "eyebrow": "3D / Visualisierung",
    "image": "assets/live-desert-mustang.jpg",
    "intro": "Die Unreal Engine ist ein Tool das sich seit 2020 immer mehr beliebtheit erfreut. Getrieben von den neuen Möglichkeiten wollte ich einen Automotive Render auf die Beine stellen der auf dem Poster einer großen Kampagne erscheinen.",
    "role": "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung.",
    "description": "Die Unreal Engine ist ein Tool das sich seit 2020 immer mehr beliebtheit erfreut. Getrieben von den neuen Möglichkeiten wollte ich einen Automotive Render auf die Beine stellen der auf dem Poster einer großen Kampagne erscheinen.",
    "service": "Art Direction & Branding",
    "serviceLink": "art-direction.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "3D, Visualisierung."
      ],
      [
        "Leistung",
        "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "ocean-coast": {
    "title": "Ocean Coast",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-ocean-coast.jpg",
    "intro": "Glamour, Luxus und ein Hauch Dekadenz, dafür steht die Côte d’Azur wie kein anderes Reiseziel am Mittelmeer. Was man an der französischen Riviera auch findet: eine spektakuläre Landschaft mit zerklüfteten Bergen hinter dem.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Glamour, Luxus und ein Hauch Dekadenz, dafür steht die Côte d’Azur wie kein anderes Reiseziel am Mittelmeer. Was man an der französischen Riviera auch findet: eine spektakuläre Landschaft mit zerklüfteten Bergen hinter dem.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "hamburg": {
    "title": "Hamburg",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-hamburg.jpg",
    "intro": "Hamburg, die Hansestadt ist nicht schön. Hamburg ist eher schroff und ungezwungen. Die Stadt lebt durch das raue Wetter. Entsprechend sind auch die Menschen rau. Auf einem Trip durch Hamburg konnte ich die Hansestadt.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Hamburg, die Hansestadt ist nicht schön. Hamburg ist eher schroff und ungezwungen. Die Stadt lebt durch das raue Wetter. Entsprechend sind auch die Menschen rau. Auf einem Trip durch Hamburg konnte ich die Hansestadt.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "vietnam": {
    "title": "Vietnam",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-vietnam.jpg",
    "intro": "Vietnam erfreut sich immer mehr an Beliebtheit als Reiseziel. Die Kultur scheint sehr unterschiedlich im Vergleich mit dem Westen. Eine Straße auf einen viele Motorradfahrer kreuzen wird für uns zum Hindernis, in Vietnam hingegen.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Vietnam erfreut sich immer mehr an Beliebtheit als Reiseziel. Die Kultur scheint sehr unterschiedlich im Vergleich mit dem Westen. Eine Straße auf einen viele Motorradfahrer kreuzen wird für uns zum Hindernis, in Vietnam hingegen.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "ttp-group-imagefilm": {
    "title": "TTP Group Imagefilm",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-ttp-group-imagefilm.png",
    "intro": "Die Imagefilmproduktion für die TTP Group hat mit der Frage gestartet: What is passion? In diesem Imagefilm ging es darum zu erläutern, was Leidenschaft ist für die Ingenieure, Designer und Architekten der TTP Group: Sie widmen.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Die Imagefilmproduktion für die TTP Group hat mit der Frage gestartet: What is passion? In diesem Imagefilm ging es darum zu erläutern, was Leidenschaft ist für die Ingenieure, Designer und Architekten der TTP Group: Sie widmen.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "TTP Group Imagefilm",
        "player": "https://player.vimeo.com/video/648483631",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2021/12/1316734733-3e745a86fa8a27ddfa580af828c415b9f49ee506bed9c6f870142c741dca46e3-d_640-1.jpg",
        "duration": "171",
        "date": "2021-11-22",
        "description": "Die Imagefilmproduktion für die TTP Group hat mit der Frage gestartet: What is passion? In diesem Imagefilm ging es darum zu erläutern, was Leidenschaft ist für die Ingenieure, Designer und Architekten der TTP Group: Sie widmen sich der."
      }
    ]
  },
  "christoph-goettel-artist-portrait": {
    "title": "Christoph Goettel Artist Portrait",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-christoph-goettel-artist-portrait.jpg",
    "intro": "Der Künstler Christoph Goettel macht schon seit vielen Jahren moderne Kunst aus verschiedenen Materialien. Seine Kunst drückt sich aus durch klaren Aussagen. Er kombiniert verschiedenste Materialien. Für seine neuen Porträts.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Der Künstler Christoph Goettel macht schon seit vielen Jahren moderne Kunst aus verschiedenen Materialien. Seine Kunst drückt sich aus durch klaren Aussagen. Er kombiniert verschiedenste Materialien. Für seine neuen Porträts.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "jeep-wrangler-on-hawaii": {
    "title": "Jeep Wrangler on Hawaii",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-jeep-wrangler-on-hawaii.jpg",
    "intro": "Eine automobile Fotostrecke mit dem Jeep Wrangler vor der vulkanischen Landschaft Hawaiis. Die Serie verbindet Abenteuer, Weite und markante Fahrzeugdetails mit einem filmischen Reise-Look.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Eine automobile Fotostrecke mit dem Jeep Wrangler vor der vulkanischen Landschaft Hawaiis. Die Serie verbindet Abenteuer, Weite und markante Fahrzeugdetails mit einem filmischen Reise-Look.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "praxis-seesemann-commercial-fotografie": {
    "title": "Praxis Seesemann Commercial Fotografie",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-praxis-seesemann-commercial-fotografie.jpg",
    "intro": "Für das Rebranding der Praxis Dr. Seesemann und Dr. Mike entstand eine neue Image- und Portraitserie. Das gesamte Praxisteam wurde in einem einheitlichen Studiosetup fotografiert.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Für das Rebranding der Praxis Dr. Seesemann und Dr. Mike entstand eine neue Image- und Portraitserie. Das gesamte Praxisteam wurde in einem einheitlichen Studiosetup fotografiert.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "chris-blair-engagement-video": {
    "title": "Chris & Blair Engagement Video",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-chris-blair-engagement-video.jpg",
    "intro": "Chris & Blair wollten heiraten. Um dies ordentlich zu promoten wollte Sie anstatt einen Einladungskarte ein Video versenden. Dieses Video soll um die ganze Welt gehen. Leute aus der gesamten Welt sind zu der Hochzeit eingeladen.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Chris & Blair wollten heiraten. Um dies ordentlich zu promoten wollte Sie anstatt einen Einladungskarte ein Video versenden. Dieses Video soll um die ganze Welt gehen. Leute aus der gesamten Welt sind zu der Hochzeit eingeladen.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "valentin-business-portrait": {
    "title": "Valentin Business Portrait",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-valentin-business-portrait.jpg",
    "intro": "Valentin brauche einige neue Portraits für seine eigene Vermarktung. Ursprünglich oft als Rapper oder Auftrittstalent zeigen diese Portraits ihn mal in einem edlen Business Look. Die Portraits wurden eigenhändig im hauseigenen.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Valentin brauche einige neue Portraits für seine eigene Vermarktung. Ursprünglich oft als Rapper oder Auftrittstalent zeigen diese Portraits ihn mal in einem edlen Business Look. Die Portraits wurden eigenhändig im hauseigenen.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "adesso-life-sciences-imagemovie": {
    "title": "adesso Life Sciences Imagemovie",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-adesso-life-sciences-imagemovie.jpg",
    "intro": "Der Imagefilm übersetzt die drei Kompetenzbereiche von adesso Life Sciences in eine klare filmische Erzählung über digitale Lösungen für die Branche.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Der Imagefilm übersetzt die drei Kompetenzbereiche von adesso Life Sciences in eine klare filmische Erzählung über digitale Lösungen für die Branche.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "adesso Life Sciences - Imagevideo",
        "player": "https://www.youtube.com/embed/CPQASGZN5mc",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2021/12/maxresdefault-2.jpg",
        "duration": "140",
        "date": "2021-12-15",
        "description": "Ein Imagefilm über die digitalen Life-Sciences-Lösungen von adesso und die Verbindung von Technologie, Wissenschaft und Zusammenarbeit."
      }
    ]
  },
  "larissa-spring-feels": {
    "title": "Larissa – Spring Feels",
    "eyebrow": "Portfolio / Case Study",
    "image": "assets/live-larissa-spring-feels.jpg",
    "intro": "Larissa – Spring Feels aus dem Portfolio von Andreas Boehler.",
    "role": "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung.",
    "description": "Larissa – Spring Feels aus dem Portfolio von Andreas Boehler.",
    "service": "Art Direction & Branding",
    "serviceLink": "art-direction.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Portfolio, Case Study."
      ],
      [
        "Leistung",
        "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "hochzeit-lucas-valerie": {
    "title": "Hochzeit Lucas & Valerie",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-hochzeit-lucas-valerie.jpg",
    "intro": "Lucas & Valerie wollte für ihre Hochzeit eine besondere Location die Sie mit ihrer Heimat verbindet. Das Badener Land mit seinen schönen Weinbergen war dabei ideal. Im Weingut des damaligen Bundespräsidenten des DFB Fritz Keller.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Lucas & Valerie wollte für ihre Hochzeit eine besondere Location die Sie mit ihrer Heimat verbindet. Das Badener Land mit seinen schönen Weinbergen war dabei ideal. Im Weingut des damaligen Bundespräsidenten des DFB Fritz Keller.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "familienportrait-foro": {
    "title": "Familienportrait Foro",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-familienportrait-foro.jpg",
    "intro": "Eine emotionale Fotoserie mit Larissa in einer verspielten Umgebung. Herbstfarben, natürliches Licht und ein bewusst gesetzter Look verbinden Leichtigkeit mit einer edlen Bildwirkung.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Eine emotionale Fotoserie mit Larissa in einer verspielten Umgebung. Herbstfarben, natürliches Licht und ein bewusst gesetzter Look verbinden Leichtigkeit mit einer edlen Bildwirkung.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "sportsportrait-irene": {
    "title": "Sportsportrait Irene",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-sportsportrait-irene.jpg",
    "intro": "Für eine Spec Ad der Agentur X-Ray entstand ein dynamisches Sportsportrait der Schweizer Personal Trainerin Irene Wilk-Zürcher. Licht, Bewegung und Haltung übersetzen ihre Energie in eine prägnante Kampagnenästhetik.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Für eine Spec Ad der Agentur X-Ray entstand ein dynamisches Sportsportrait der Schweizer Personal Trainerin Irene Wilk-Zürcher. Licht, Bewegung und Haltung übersetzen ihre Energie in eine prägnante Kampagnenästhetik.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "larissa-autumn-spirit": {
    "title": "Larissa Autumn Spirit",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-larissa-autumn-spirit.jpg",
    "intro": "Eine emotionale Fotoserie mit Larissa in einer verspielten Umgebung. Herbstfarben, natürliches Licht und ein bewusst gesetzter Look verbinden Leichtigkeit mit einer edlen Bildwirkung.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Eine emotionale Fotoserie mit Larissa in einer verspielten Umgebung. Herbstfarben, natürliches Licht und ein bewusst gesetzter Look verbinden Leichtigkeit mit einer edlen Bildwirkung.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "austellung-around-the-world": {
    "title": "Ausstellung „Around the World“",
    "eyebrow": "Portfolio / Case Study",
    "image": "assets/live-austellung-around-the-world.jpg",
    "intro": "Die Freiburger Frisörfiliale die ehemals Max Lui hieß und nun KAJO Frisöre brauchte für ihre Räumlichkeiten eine Szenografie mit verschiedenen Sehnsuchtsbildern. Unter dem Titel „Around the World“ wurden verschiedene.",
    "role": "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung.",
    "description": "Die Freiburger Frisörfiliale die ehemals Max Lui hieß und nun KAJO Frisöre brauchte für ihre Räumlichkeiten eine Szenografie mit verschiedenen Sehnsuchtsbildern. Unter dem Titel „Around the World“ wurden verschiedene.",
    "service": "Art Direction & Branding",
    "serviceLink": "art-direction.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Portfolio, Case Study."
      ],
      [
        "Leistung",
        "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "hochzeit-albana-max": {
    "title": "Hochzeit Albana & Max",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-hochzeit-albana-max.jpg",
    "intro": "An diesem Abend wurde kräftig gefeiert denn Albana und Max haben geheiratet. Ich durfte ihren emotionalen tag zwischen Kaiserstuhl und Weinbergen begleiten. Familie und Freunde waren geladen und konnten sich bei schönstem Wetter.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "An diesem Abend wurde kräftig gefeiert denn Albana und Max haben geheiratet. Ich durfte ihren emotionalen tag zwischen Kaiserstuhl und Weinbergen begleiten. Familie und Freunde waren geladen und konnten sich bei schönstem Wetter.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "austellung-movin": {
    "title": "Austellung Movin",
    "eyebrow": "Portfolio / Case Study",
    "image": "assets/live-austellung-movin.jpg",
    "intro": "In Kooperation mit der 2019 neu eröffneten Physiotherapiepraxis movinamlorettoberg gab es die Möglichkeit die Praxis für die Eröffnung visuell noch ein wenig spektakulärer zu machen. Ganz wichtig war hier das die Stadt Freiburg.",
    "role": "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung.",
    "description": "In Kooperation mit der 2019 neu eröffneten Physiotherapiepraxis movinamlorettoberg gab es die Möglichkeit die Praxis für die Eröffnung visuell noch ein wenig spektakulärer zu machen. Ganz wichtig war hier das die Stadt Freiburg.",
    "service": "Art Direction & Branding",
    "serviceLink": "art-direction.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Portfolio, Case Study."
      ],
      [
        "Leistung",
        "Art Direction, visuelles Konzept, Lookentwicklung und digitale Umsetzung."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "businessportrait-kurt": {
    "title": "Businessportrait Kurt",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-businessportrait-kurt.jpg",
    "intro": "Portrait Bilder im Studio zu schießen ist bei dem Ottonormal Mensch eher ein unbeliebtes Thema. Ich als Fotograf finde es immer faszinierend den Menschen auf seine Art abzulichten das man die Person hinter dem Foto spürt. Die.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Portrait Bilder im Studio zu schießen ist bei dem Ottonormal Mensch eher ein unbeliebtes Thema. Ich als Fotograf finde es immer faszinierend den Menschen auf seine Art abzulichten das man die Person hinter dem Foto spürt. Die.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "messe-basel-imagemovie": {
    "title": "Messe Basel Imagemovie",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-messe-basel-imagemovie.jpg",
    "intro": "Der Film über die Messe, bei der normalerweise Kunstaustellungen wie die Art Basel oder Fachmessen wie die Swissbau stattfinden ist ein Anziehungspunkt für ein internationales Publikum. Um die Messe auch besser im Ausland zu.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Der Film über die Messe, bei der normalerweise Kunstaustellungen wie die Art Basel oder Fachmessen wie die Swissbau stattfinden ist ein Anziehungspunkt für ein internationales Publikum. Um die Messe auch besser im Ausland zu.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "MESSE BASEL",
        "player": "https://player.vimeo.com/video/417541908",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2021/12/920025702-eb192f207a64d2c3d7aa9ed3a7ad32a3630578549455e954558ec7c72fb53c08-d_640.jpg",
        "duration": "139",
        "date": "2020-05-12",
        "description": "Der Film über die Messe, bei der normalerweise Kunstaustellungen wie die Art Basel oder Fachmessen wie die Swissbau stattfinden ist ein Anziehungspunkt für ein internationales Publikum. Um die Messe auch besser im Ausland zu bewerben ist."
      }
    ]
  },
  "evoke-emotions-commercial": {
    "title": "Evoke Emotions commercial",
    "eyebrow": "Film / Commercial",
    "image": "assets/live-evoke-emotions-commercial.jpg",
    "intro": "Der Imagemovie „Evoke Emotions“ der Basler Agentur X-Ray ist hauseigener Werbespot für die Agentur selbst bei dem es darum geht das die Agentur Welten für neue Projekte kreieren kann. Eine Videoproduktion erfordert vielseitiges.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Der Imagemovie „Evoke Emotions“ der Basler Agentur X-Ray ist hauseigener Werbespot für die Agentur selbst bei dem es darum geht das die Agentur Welten für neue Projekte kreieren kann. Eine Videoproduktion erfordert vielseitiges.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "Evoke Emotions Image Movie",
        "player": "https://player.vimeo.com/video/302404336",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2022/01/852766684-75857394ced3774ee396df84cabc90ed49d68614e8d0337133511aec2d152970-d_640.jpg",
        "duration": "142",
        "date": "2018-11-23",
        "description": "Winner New York Film Award April 2019: Best Cinematography Best Commercial / Promotional Video Winner Best Shorts: Award of Exellence Experimental Award of Exellence Special mention Music Video A video production requires versatile."
      }
    ]
  },
  "destiny": {
    "title": "destiNY",
    "eyebrow": "Fotografie / Portfolio",
    "image": "assets/live-destiny.jpg",
    "intro": "Das New York Fotobuch destiNY is ein Bildband der sich auszeichnet durch über 200 Fotografien aus New York in höchster 50 Megapixelauflösung. In dieser modernen Zeit ergeben sich dabei ganz neue Blickwinkel. Oft gehypt und oft.",
    "role": "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie.",
    "description": "Das New York Fotobuch destiNY is ein Bildband der sich auszeichnet durch über 200 Fotografien aus New York in höchster 50 Megapixelauflösung. In dieser modernen Zeit ergeben sich dabei ganz neue Blickwinkel. Oft gehypt und oft.",
    "service": "Markenfotografie",
    "serviceLink": "markenfotografie.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Fotografie, Portfolio."
      ],
      [
        "Leistung",
        "Fotografie, Bildauswahl, Lookentwicklung und visuelle Serie."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": []
  },
  "energize-your-communications-commercial": {
    "title": "Energize your Communications commercial",
    "eyebrow": "Film / Commercial",
    "image": "assets/booklet-energize-your-communications-commercial.jpg",
    "intro": "Mit der Story «Energize Communications» hat es sich die Agentur X-Ray zur Aufgabe gemacht, Ihnen den Vorteil einer starken und professionellen Film-/Videoproduktion zu vermitteln. Von der Strategie, dem Storytelling, der.",
    "role": "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion.",
    "description": "Mit der Story «Energize Communications» hat es sich die Agentur X-Ray zur Aufgabe gemacht, Ihnen den Vorteil einer starken und professionellen Film-/Videoproduktion zu vermitteln. Von der Strategie, dem Storytelling, der.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Live-Import",
        "Aus dem bestehenden Portfolio von andreasboehler.com uebernommen."
      ],
      [
        "Format",
        "Film, Commercial."
      ],
      [
        "Leistung",
        "Konzept, Produktion, Kameraarbeit, Schnitt und Postproduktion."
      ],
      [
        "Kontext",
        "Referenz fuer Marken, Agenturen und Unternehmen mit visuellem Anspruch."
      ]
    ],
    "videos": [
      {
        "title": "Energize your communications - FULL CUT",
        "player": "https://player.vimeo.com/video/528223515",
        "thumbnail": "https://andreasboehler.com/wp-content/uploads/2022/01/1093351593-77ae261130621dd9d44ca23c764a5e572d3b46b215a445020e03820ba373b57c-d_640.jpg",
        "duration": "180",
        "date": "2021-03-24",
        "description": "Energize Communications ist eine visuelle Filmidee über die Wirkung klarer Botschaften und professionell inszenierter Bewegtbildkommunikation."
      }
    ]
  }
};

Object.entries(liveProjectEnhancements).forEach(([slug, enhancement]) => {
  projectData[slug] = {
    ...(projectData[slug] || {}),
    ...enhancement
  };
});
// Live portfolio sync end

// Booklet reference sync start
const bookletProjectEnhancements = {
  "phantom-der-oper-vr-coastiality": {
    "title": "Phantom der Oper VR Coastiality",
    "eyebrow": "Europa-Park / Coastiality / Werbespot",
    "image": "assets/andreas-amusement-park.jpg",
    "intro": "Ein zweiminütiger Storytrailer für die Andrew-Lloyd-Webber-Attraktion im Europa-Park, gedreht unter aufwändigen Bedingungen in der Eurosat-Kugel und im französischen Themenbereich.",
    "role": "Drehplanung, Produktionsleitung, Teamleitung, Producer, Post-VFX, Kundenkommunikation und KI-gestützte Postproduktion.",
    "description": "Der Spot verbindet Film-Noir-Atmosphäre, Themenpark-Inszenierung und die Musik von Phantom der Oper zu einem kompakten Trailer für ein immersives Coastiality-Erlebnis.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Quelle",
        "Aus dem Portfolio-Booklet als starke Entertainment-Referenz übernommen."
      ],
      [
        "Medium",
        "Werbespot für die Eurosat Coastiality Attraktion im Europa-Park."
      ],
      [
        "Produktion",
        "Gedreht mit spezieller Lichtsetzung in anspruchsvoller Freizeitpark-Umgebung."
      ],
      [
        "Stärke",
        "Bekannte IP, hoher Produktionsdruck und ein klarer filmischer Look."
      ]
    ],
    "videos": [
      {
        "title": "Phantom der Oper VR Coastiality Werbespot",
        "player": "https://www.youtube.com/embed/HHK7qdg0yJE",
        "thumbnail": "",
        "duration": "",
        "date": "2023-01-01",
        "description": "Storytrailer für Eurosat Coastiality - Das Phantom der Oper im Europa-Park."
      }
    ]
  },
  "voltron-nevera-tv-werbespot": {
    "title": "Voltron Nevera TV Werbespot",
    "eyebrow": "Europa-Park / TV-Spot / Entertainment",
    "image": "assets/booklet-voltron-nevera-tv-werbespot.jpg?v=single-frame",
    "intro": "Ein 60-sekündiger TV-Werbespot für Voltron Nevera powered by Rimac, die neue Achterbahn im Europa-Park mit großem Storytelling rund um Nikola Tesla.",
    "role": "Drehplanung, Produktionsplanung, Logo-VFX, Producer und Post-Production Supervision.",
    "description": "Der Case verbindet internationale Drehorte, Motion-Control-Aufnahmen, 3D-Backplates und Entertainment-Marketing zu einer großen Coaster-Ankündigung.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Quelle",
        "Aus dem Portfolio-Booklet als eine der stärksten Europa-Park-Referenzen übernommen."
      ],
      [
        "Format",
        "TV-Werbespot und Launch-Kommunikation für eine neue Attraktion."
      ],
      [
        "Setup",
        "Drehs in Sofia und Berlin, Motion-Control-Rig und 3D-Backplates."
      ],
      [
        "Stärke",
        "Große Marke, komplexe Produktion und klare Entertainment-Dramaturgie."
      ]
    ],
    "videos": [
      {
        "title": "Voltron Nevera TV Werbespot",
        "player": "https://www.youtube.com/embed/xUfla2hxdUA",
        "thumbnail": "",
        "duration": "",
        "date": "2024-04-26",
        "description": "TV-Spot für Voltron Nevera powered by Rimac im Europa-Park."
      }
    ]
  },
  "songwon-corporate-movie": {
    "title": "SONGWON Corporate Movie",
    "eyebrow": "Corporate Film / Messe / Industry",
    "image": "assets/andreas-hero-video.png",
    "intro": "Ein Corporate Movie für SONGWON, entwickelt für Messe, Internet und Presse, um Geschichte, Stimmung und industrielle Relevanz der Marke sichtbar zu machen.",
    "role": "Konzept, Motion Graphics, Art Direction, Storyboarding, Moodboard und Kundenpräsentation.",
    "description": "Der Film übersetzt ein industrielles B2B-Thema in eine verständliche, markennahe Erzählung für einen internationalen Messeauftritt.",
    "service": "Werbefilm & Produktfilm",
    "serviceLink": "werbefilm-produktfilm.html",
    "facts": [
      [
        "Quelle",
        "Aus dem Portfolio-Booklet als starke Industrie- und Messefilm-Referenz übernommen."
      ],
      [
        "Medium",
        "Imagefilm für Internet, Messe und Presse."
      ],
      [
        "Kontext",
        "SONGWON als Hersteller mit Produkten, die im Alltag vieler Menschen Anwendung finden."
      ],
      [
        "Stärke",
        "Industriekommunikation mit klarer Art Direction und Motion-Logik."
      ]
    ],
    "videos": [
      {
        "title": "SONGWON Corporate Movie",
        "player": "https://player.vimeo.com/video/193071948",
        "thumbnail": "",
        "duration": "",
        "date": "2016-01-01",
        "description": "Corporate Movie für SONGWON aus dem Portfolio-Booklet."
      }
    ]
  },
  "dj-bobo-evolut30n-tour": {
    "videos": [
      {
        "title": "DJ BoBo The Great Adventure Tourtrailer",
        "player": "https://www.youtube.com/embed/VcAIj00Vxqc",
        "thumbnail": "assets/dj-bobo-great-adventure-filmstill.jpg",
        "duration": "",
        "date": "2024-01-01",
        "description": "Tourtrailer zu The Great Adventure, mit Special VFX, 3D, Motion Graphics und KI-gestützter Postproduktion."
      },
      {
        "title": "DJ BoBo The Great Adventure BTS",
        "player": "https://www.youtube.com/embed/6tjD9pYtZkA",
        "thumbnail": "",
        "duration": "",
        "date": "2024-01-01",
        "description": "Behind-the-scenes Einblick aus dem Portfolio-Booklet zur DJ Bobo Tourtrailer-Produktion."
      }
    ]
  },
  "novartis-medportal": {
    "videos": [
      {
        "title": "Novartis Medportal Werbefilm",
        "player": "https://player.vimeo.com/video/564594210?h=59a1ee7f1a",
        "thumbnail": "",
        "duration": "",
        "date": "2021-01-01",
        "description": "Werbefilm für das Novartis Medportal, mit Konzept, 3D Visualisierung, Rendering, Motion Graphics und Typoanimation."
      }
    ]
  },
  "movicol-mode-of-action": {
    "videos": [
      {
        "title": "Movicol Mode of Action Video",
        "player": "https://player.vimeo.com/video/305969506?h=38122cddf0",
        "thumbnail": "",
        "duration": "",
        "date": "2018-01-01",
        "description": "3D Mode-of-Action-Video für Movicol mit Storyboard, Design, 3D Animation, Modelling, Postproduktion und Sound FX."
      }
    ]
  },
  "energize-your-communications-commercial": {
    "videos": [
      {
        "title": "Energize your Communications",
        "player": "https://player.vimeo.com/video/528223515",
        "thumbnail": "",
        "duration": "180",
        "date": "2020-01-01",
        "description": "Award-prämierter Imagefilm für X-Ray mit DOP, Special VFX, Compositing, Schnitt und Color Grading."
      }
    ]
  }
};

Object.entries(bookletProjectEnhancements).forEach(([slug, enhancement]) => {
  projectData[slug] = {
    ...(projectData[slug] || {}),
    ...enhancement
  };
});
// Booklet reference sync end

// Portfolio PDF alignment start
const portfolioPdfProjectData = {
  "bongrain-savencia": {
    intro: "Webkonzept und digitale Verkaufsmittel für die Käsemarken von Savencia beziehungsweise Bongrain.",
    description: "Die Website verband Rezepte und Verwendungshinweise mit einer iPad-Anwendung als Verkaufstool für den Außendienst.",
    format: "Website, Rich-Media-Seiten und responsive Websites",
    role: "Brainstorming, Konzeption des Webdesigns und Kampagnenerstellung.",
    collaboration: "Auftrag der Agentur X-Ray für Savencia beziehungsweise Bongrain.",
    place: "Basel",
    year: "2013-2016"
  },
  "dj-bobo-evolut30n-tour": {
    intro: "Tourtrailer für DJ BoBos Welttournee The Great Adventure, inspiriert von digitalem Abenteuerkino.",
    description: "Der in Friesenheim gedrehte Trailer verbindet Straßensperren, Technocrane-Aufnahmen, VFX und Motion Graphics zu einem dynamischen Auftakt für die Show.",
    format: "Werbespot für die Welttournee",
    role: "Producer, Drehplanung, Special VFX, Postproduktion, 3D und Motion Graphics sowie KI-gestützte Postproduktion.",
    collaboration: "Tourtrailer für DJ BoBo, umgesetzt im beteiligten Produktions- und Postproduktionsteam.",
    place: "Rust",
    year: "2024"
  },
  "x-ray-website": {
    intro: "Konzeption und Entwicklung einer neuen responsiven Website für die Schweizer Healthcare-Agentur X-Ray.",
    description: "Der Relaunch strukturierte die Leistungen der Agentur neu und verband den Markenauftritt mit einem interaktiven Kontaktformular.",
    format: "Responsive Website",
    role: "Konzeption, Screen- und UI-Design, UX-Testing, Aufbau eines Web-Core-Teams, Projektmanagement und finale Übergabe.",
    collaboration: "Projekt für die Healthcare-Agentur X-Ray.",
    place: "Basel",
    year: "2021"
  },
  "phantom-der-oper-vr-coastiality": {
    intro: "Zweiminütiger Werbespot für die Andrew-Lloyd-Webber-Attraktion im Europa-Park.",
    description: "Unter anspruchsvollen Bedingungen in der Eurosat-Kugel und im französischen Themenbereich entstand ein Storytrailer mit Film-Noir-Anmutung.",
    format: "Werbespot für die Achterbahn",
    role: "Drehplanung, Produktionsleitung, Teamleitung, Producer, Post-VFX, Kundenkommunikation und KI-gestützte Postproduktion.",
    collaboration: "Zusammenarbeit mit Andrew Lloyd Webber und Europa-Park. Story: Mack Magic.",
    place: "Rust",
    year: "2023"
  },
  "arcondis-brand-identity": {
    intro: "Brand Identity und Website für ein auf Life Sciences spezialisiertes IT-Beratungsunternehmen.",
    description: "Eine präzise visuelle Identität und eine klare UX-Struktur übersetzen komplexe regulierte Dienstleistungen in einen vertrauenswürdigen Markenauftritt.",
    format: "Logo, Brand Design und Website",
    role: "Logoentwicklung, Identity-Entwicklung, UX-Design und Prototyping.",
    collaboration: "Projekt für ARCONDIS.",
    place: "Basel",
    year: "2015"
  },
  "novartis-medportal": {
    intro: "Einminütiger Werbefilm für das Novartis Medportal und seine digitalen Funktionen.",
    description: "Der Commercial erklärt das Medportal als Schnittstelle zwischen Unternehmen und medizinischem Fachpersonal in einer klar geführten visuellen Sprache.",
    format: "Commercial für Web und Intranet",
    role: "Konzeption, Moodboard, Planung, 3D-Visualisierung, 3D-Rendering, Motion Graphics, Typoanimation und Finalisierung.",
    collaboration: "Projekt für Novartis.",
    place: "Basel",
    year: "2021"
  },
  "voltron-nevera-tv-werbespot": {
    intro: "60-sekündiger TV-Werbespot zur Ankündigung von Voltron Nevera powered by Rimac im Europa-Park.",
    description: "Drehs in Sofia und Berlin, ein Motion-Control-Rig und animierte 3D-Backplates verbinden die Geschichte Nikola Teslas mit der neuen Achterbahn.",
    format: "TV-Werbespot",
    role: "Drehplanung, Produktionsplanung, Logo-VFX, Producer und Post-Production Supervision.",
    collaboration: "Projekt für Europa-Park. Story: Mack Magic. Regie: Jan Reiff. 3D-Backplates: Mack Animation.",
    place: "Rust",
    year: "2023"
  },
  "energize-your-communications-commercial": {
    intro: "Imagefilm zur Positionierung der Agentur X-Ray im Bereich Film- und Videoproduktion.",
    description: "Die Geschichte Energize Communications übersetzt Strategie, Storytelling und Produktionsplanung in einen kraftvollen, mehrfach ausgezeichneten Film.",
    format: "Imagefilm für das Internet",
    role: "Motion Graphics, Schnitt, Director of Photography, Special VFX, Compositing und Color Grading.",
    collaboration: "Projekt für X-Ray in Kooperation mit Parcours-Weltmeister Chris Harmat.",
    place: "Basel",
    year: "2020"
  },
  "songwon-corporate-movie": {
    intro: "Corporate Movie über Geschichte, Stimmung und industrielle Relevanz von SONGWON.",
    description: "Der Film war Teil eines internationalen Messeauftritts und machte die Rolle der Produkte im Alltag visuell erfahrbar.",
    format: "Imagefilm für Internet, Messe und Presse",
    role: "Konzept, Motion Graphics, Art Direction, Storyboarding, Moodboard und Kundenpräsentation.",
    collaboration: "Projekt für SONGWON im beteiligten Corporate- und Produktionsteam.",
    place: "Basel",
    year: "2016"
  },
  "syngenta-campaign": {
    intro: "Markenentwicklung und Kampagnenaufbau für die Syngenta-Produkte Pergado, Carial Flex und Revus.",
    description: "Für drei Pflanzenschutzmarken entstand ein skalierbares System für internationale Produkt- und Kampagnenkommunikation.",
    format: "PowerPoint- und Print-Templates, Kampagnen, Branding Guidelines und Broschüren",
    role: "Konzept, Recherche, Design und Datentransfer.",
    collaboration: "Projekt für Syngenta.",
    place: "Basel",
    year: "2014"
  },
  "abbvie-oncology": {
    intro: "Imagewerbung für den Onkologie-Bereich von AbbVie.",
    description: "Die Anzeigen verbinden wissenschaftliche Kommunikation mit einer klaren visuellen Leitidee für den Onkologie-Auftritt.",
    format: "Printanzeigen",
    role: "Konzept, Compositing und Layout.",
    collaboration: "Projekt für AbbVie Oncology.",
    place: "Basel",
    year: "2017"
  },
  "dr-martin-klein": {
    intro: "Corporate Design für das persönliche Facharztprofil von Dr. Martin Klein.",
    description: "Logo und Gestaltungssystem übersetzen Empathie, Verständnis, Lehre und die zentrale Rolle des Menschen in einen persönlichen Auftritt.",
    format: "Logo, Visitenkarte, Briefbogen, Markenauftritt und Branding Guidelines",
    role: "Konzept, Recherche, Beratung, Produktionskommunikation, Produktion, Reinzeichnung, Projektleitung und Logodesign.",
    collaboration: "Direktprojekt für das Facharztprofil von Martin Klein.",
    place: "Freiburg",
    year: "2017"
  },
  "movicol-mode-of-action": {
    intro: "Mode-of-Action-Video für das medizinische Produkt Movicol.",
    description: "Die 3D-Animation visualisiert vier Wirkmechanismen und macht die Funktionsweise des Produkts für die Anwendung verständlich.",
    format: "3D Mode-of-Action-Video",
    role: "Konzept, Storyboard, Design, 3D-Animation, 3D-Modelling, Postproduktion und Sound FX.",
    collaboration: "Projekt für Acino und das Produkt Movicol.",
    place: "Basel",
    year: "2018"
  },
  "acino-pain-management": {
    intro: "Mehrsprachiger Awarenessfilm über den korrekten Umgang mit körperlichen Schmerzen.",
    description: "Der in einer französischen Arztpraxis gedrehte Film richtet sich an Patientinnen und Patienten sowie medizinisches Fachpersonal.",
    format: "Imagefilm für Internet und Präsentationen in fünf Sprachen",
    role: "Konzept, Motion Graphics, Art Direction, Storyboarding, Moodboard, Regie, Kamera, 3D-Rendering und Color Grading.",
    collaboration: "Projekt für Acino mit Dreh in Frankreich.",
    place: "Basel",
    year: "2016"
  }
};

Object.entries(portfolioPdfProjectData).forEach(([slug, alignment]) => {
  projectData[slug] = {
    ...(projectData[slug] || {}),
    ...alignment
  };
});
// Portfolio PDF alignment end

// Project image fix sync start
const projectImageFixes = {
  "duolingo-spec-ad": {
    "image": "assets/live-duolingo-spec-ad.jpg"
  },
  "mareike-daniel-wedding": {
    "image": "assets/live-mareike-daniel-wedding.jpg"
  },
  "rockstar-musicvideo": {
    "image": "assets/live-rockstar-musicvideo.jpg"
  },
  "dj-bobo-evolut30n-tour": {
    "image": "assets/dj-bobo-great-adventure-filmstill.jpg"
  },
  "europa-park-neuheiten-2023": {
    "image": "assets/live-europa-park-neuheiten-2023.jpg"
  },
  "europa-park-dinnershow-2022": {
    "image": "assets/live-europa-park-dinnershow-2022.png"
  },
  "smt-imagefilm-qualitaet": {
    "image": "assets/live-smt-imagefilm-qualitaet.png"
  },
  "movin-recruitingfilm": {
    "image": "assets/live-movin-recruitingfilm.jpg"
  },
  "virtual-production-case-study": {
    "image": "assets/live-virtual-production-case-study.jpg"
  },
  "paris": {
    "image": "assets/live-paris.jpg"
  },
  "uniimmo-portraits": {
    "image": "assets/live-uniimmo-portraits.jpg"
  },
  "mercedes-gt-in-der-salzwuste": {
    "image": "assets/live-mercedes-gt-in-der-salzwuste.jpg"
  },
  "kaeppeli-recruitngfilm": {
    "image": "assets/live-kaeppeli-recruitngfilm.png"
  },
  "one-stop-in-venedig": {
    "image": "assets/live-one-stop-in-venedig.jpg"
  },
  "dogportrait-ilvy-co": {
    "image": "assets/live-dogportrait-ilvy-co.jpg"
  },
  "zum-park-recruitngfilm": {
    "image": "assets/live-zum-park-recruitngfilm.png"
  },
  "desert-mustang": {
    "image": "assets/live-desert-mustang.jpg"
  },
  "ocean-coast": {
    "image": "assets/live-ocean-coast.jpg"
  },
  "hamburg": {
    "image": "assets/live-hamburg.jpg"
  },
  "vietnam": {
    "image": "assets/live-vietnam.jpg"
  },
  "ttp-group-imagefilm": {
    "image": "assets/live-ttp-group-imagefilm.png"
  },
  "christoph-goettel-artist-portrait": {
    "image": "assets/live-christoph-goettel-artist-portrait.jpg"
  },
  "jeep-wrangler-on-hawaii": {
    "image": "assets/live-jeep-wrangler-on-hawaii.jpg"
  },
  "praxis-seesemann-commercial-fotografie": {
    "image": "assets/live-praxis-seesemann-commercial-fotografie.jpg"
  },
  "chris-blair-engagement-video": {
    "image": "assets/live-chris-blair-engagement-video.jpg"
  },
  "valentin-business-portrait": {
    "image": "assets/live-valentin-business-portrait.jpg"
  },
  "adesso-life-sciences-imagemovie": {
    "image": "assets/live-adesso-life-sciences-imagemovie.jpg"
  },
  "larissa-spring-feels": {
    "image": "assets/live-larissa-spring-feels.jpg"
  },
  "hochzeit-lucas-valerie": {
    "image": "assets/live-hochzeit-lucas-valerie.jpg"
  },
  "familienportrait-foro": {
    "image": "assets/live-familienportrait-foro.jpg"
  },
  "sportsportrait-irene": {
    "image": "assets/live-sportsportrait-irene.jpg"
  },
  "larissa-autumn-spirit": {
    "image": "assets/live-larissa-autumn-spirit.jpg"
  },
  "austellung-around-the-world": {
    "image": "assets/live-austellung-around-the-world.jpg"
  },
  "hochzeit-albana-max": {
    "image": "assets/live-hochzeit-albana-max.jpg"
  },
  "austellung-movin": {
    "image": "assets/live-austellung-movin.jpg"
  },
  "businessportrait-kurt": {
    "image": "assets/live-businessportrait-kurt.jpg"
  },
  "messe-basel-imagemovie": {
    "image": "assets/live-messe-basel-imagemovie.jpg"
  },
  "evoke-emotions-commercial": {
    "image": "assets/live-evoke-emotions-commercial.jpg"
  },
  "destiny": {
    "image": "assets/live-destiny.jpg"
  },
  "energize-your-communications-commercial": {
    "image": "assets/booklet-energize-your-communications-commercial.jpg"
  },
  "phantom-der-oper-vr-coastiality": {
    "image": "assets/phantom-coastiality-teaser-hd.jpg?v=hd-teaser1"
  },
  "voltron-nevera-tv-werbespot": {
    "image": "assets/booklet-voltron-nevera-tv-werbespot.jpg?v=single-frame"
  },
  "songwon-corporate-movie": {
    "image": "assets/booklet-songwon-corporate-movie.jpg?v=single-frame"
  },
  "novartis-medportal": {
    "image": "assets/booklet-novartis-medportal.jpg"
  },
  "movicol-mode-of-action": {
    "image": "assets/booklet-movicol-mode-of-action.jpg?v=single-frame"
  },
  "acino-pain-management": {
    "image": "assets/andreas-services-lighting.jpg"
  },
  "bongrain-savencia": {
    "image": "assets/andreas-services-creative-tech-nano-banana-2.jpg"
  },
  "x-ray-website": {
    "image": "assets/andreas-services-camera-rig.jpg"
  },
  "arcondis-brand-identity": {
    "image": "assets/andreas-services-creative-tech.jpg"
  },
  "syngenta-campaign": {
    "image": "assets/andreas-moments-analog-model-nano-banana-2.jpg"
  },
  "abbvie-oncology": {
    "image": "assets/andreas-about-production-team.jpg"
  },
  "dr-martin-klein": {
    "image": "assets/andreas-about-portrait.jpg"
  }
};

Object.entries(projectImageFixes).forEach(([slug, enhancement]) => {
  projectData[slug] = {
    ...(projectData[slug] || {}),
    ...enhancement
  };
});
// Project image fix sync end

// Original portfolio exports, verified for this staging edition.
const editorialProjectImages = {
  'dj-bobo-evolut30n-tour': 'assets/projects/dj-bobo-evolut30n-tour/portfolio-1.webp',
  'arcondis-brand-identity': 'assets/projects/arcondis-brand-identity/portfolio-1.webp',
  'dr-martin-klein': 'assets/projects/dr-martin-klein/portfolio-1.webp',
  'acino-pain-management': 'assets/projects/acino-pain-management/portfolio-1.webp',
  'x-ray-website': 'assets/projects/x-ray-website/portfolio-1.webp',
  'bongrain-savencia': 'assets/projects/bongrain-savencia/portfolio-1.webp',
  'abbvie-oncology': 'assets/projects/abbvie-oncology/portfolio-1.webp',
  'syngenta-campaign': 'assets/projects/syngenta-campaign/portfolio-1.webp'
};
Object.entries(editorialProjectImages).forEach(([slug, image]) => {
  if (projectData[slug]) projectData[slug].image = image;
});

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
  if (!heroBrushSurface || !heroFrameColor || heroBrushSurface.hasAttribute('data-webgl-portrait')) {
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

function setupScrollTextReveals() {
  if (document.body.hasAttribute('data-editorial-legal')) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const candidates = [
    "main h1:not(.sr-only)",
    "main h2:not(.sr-only)",
    "main h3:not(.sr-only)",
    "main h4:not(.sr-only)",
    ".page-hero-copy > p",
    ".alien-section-label",
    ".project-depth-head > span"
  ].join(", ");
  const excludedAreas = [
    ".site-nav",
    ".site-footer",
    ".project-facts",
    ".project-copy",
    "details",
    ".hero-chapter",
    ".wedding-hero-copy",
    ".wedding-hero-closing",
    ".cookie-banner",
    ".briefing-form",
    ".consent-banner",
    ".sr-only"
  ].join(", ");
  const parentCounts = new WeakMap();
  const elements = [...document.querySelectorAll(candidates)].filter((element) => {
    if (!element.textContent.trim() || element.closest(excludedAreas)) {
      return false;
    }

    if (element.closest("nav, form, button, .footer-reveal-spacer")) {
      return false;
    }

    return true;
  });

  if (!elements.length) {
    return;
  }

  const pending = new Set();
  const initiallyVisible = [];
  let observer = null;
  let fallbackQueued = false;

  const scheduleRevealFrame = (callback) => {
    if (document.visibilityState === "hidden") {
      window.setTimeout(callback, 32);
      return;
    }

    window.requestAnimationFrame(callback);
  };

  const revealElement = (element) => {
    if (!pending.has(element) && element.classList.contains("is-in-view")) {
      return;
    }

    element.classList.add("is-in-view");
    pending.delete(element);

    if (observer) {
      observer.unobserve(element);
    }
  };

  const revealVisibleElements = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    pending.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top < viewportHeight * 0.94 && rect.bottom > viewportHeight * 0.02) {
        revealElement(element);
      }
    });

    if (!pending.size) {
      window.removeEventListener("scroll", queueFallbackCheck);
      window.removeEventListener("resize", queueFallbackCheck);
    }
  };

  function queueFallbackCheck() {
    if (fallbackQueued) {
      return;
    }

    if (document.visibilityState === "hidden") {
      revealVisibleElements();
      return;
    }

    fallbackQueued = true;
    scheduleRevealFrame(() => {
      fallbackQueued = false;
      revealVisibleElements();
    });
  }

  elements.forEach((element) => {
    const parent = element.parentElement || document.body;
    const index = parentCounts.get(parent) || 0;
    const tagName = element.tagName.toLowerCase();
    parentCounts.set(parent, index + 1);

    element.classList.add("scroll-text-reveal");
    element.classList.toggle("scroll-text-reveal--strong", /^h[1-4]$/.test(tagName));
    element.classList.toggle("scroll-text-reveal--quiet", tagName === "li");
    element.style.setProperty("--scroll-text-delay", `${Math.min(index * 72, 280)}ms`);

    if (reduceMotion || element.getBoundingClientRect().top < window.innerHeight * 0.94) {
      pending.add(element);
      initiallyVisible.push(element);
    } else {
      pending.add(element);
    }
  });

  if (reduceMotion) {
    elements.forEach((element) => element.classList.add("is-in-view"));
    return;
  }

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
      });
    }, {
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.04
    });

    window.scrollTextRevealObserver = observer;
    pending.forEach((element) => observer.observe(element));
  }

  window.addEventListener("scroll", queueFallbackCheck, { passive: true });
  window.addEventListener("resize", queueFallbackCheck);
  if (document.visibilityState === "hidden") {
    initiallyVisible.forEach(revealElement);
    revealVisibleElements();
  } else {
    scheduleRevealFrame(() => {
      initiallyVisible.forEach(revealElement);
      queueFallbackCheck();
    });
  }
}

function setupTextHoverReveals() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const selectors = [
    ".inline-link",
    ".alien-text-link",
    ".alien-final-link",
    ".alien-pill-links a",
    ".alien-service-columns a",
    ".service-link-row a",
    ".service-discipline-details a",
    ".service-discipline-meta a",
    ".redox-service-links a",
    ".redox-index-list a strong",
    ".redox-project-card h2",
    ".works-photo-link",
    ".footer-links a",
    ".footer-bottom a",
    ".footer-locations a",
    ".about-social-links a em",
    ".about-brand-ledger a",
    ".about-brand-rows a",
    ".project-list a",
    ".project-briefing a",
    ".cinematic-cta-links a",
    ".form-actions a"
  ].join(", ");

  document.querySelectorAll(selectors).forEach((element) => {
    if (element.classList.contains("text-hover-reveal") || element.closest(".site-nav")) {
      return;
    }

    if (element.querySelector("img, video, iframe, svg, input, textarea, select, button")) {
      return;
    }

    const text = element.textContent.replace(/\s+/g, " ").trim();

    if (!text || text.length > 96) {
      return;
    }

    const label = document.createElement("span");
    const hoverLabel = document.createElement("span");

    label.className = "text-hover-reveal__label";
    label.dataset.hoverText = text;
    hoverLabel.className = "text-hover-reveal__hover";
    hoverLabel.setAttribute("aria-hidden", "true");
    hoverLabel.textContent = text;

    while (element.firstChild) {
      label.append(element.firstChild);
    }

    label.append(hoverLabel);
    element.append(label);
    element.classList.add("text-hover-reveal");

    if (element.matches(".redox-project-card h2, .redox-index-list a strong, .about-social-links a em")) {
      element.classList.add("text-hover-reveal--large");
    } else if (element.matches(".footer-links a, .footer-bottom a, .footer-locations a")) {
      element.classList.add("text-hover-reveal--quiet");
    }
  });
}

function updateHero() {
  if (!hero || !heroTitle) {
    return;
  }

  const rect = hero.getBoundingClientRect();
  const scrollable = hero.offsetHeight - window.innerHeight;
  const progress = clamp(-rect.top / Math.max(scrollable, 1), 0, 1);
  syncScrollPin(hero, heroSticky, rect);
  hero.style.setProperty("--hero-scroll-progress", progress.toFixed(4));
  heroVideoScrub?.setProgress(progress);
}

function syncScrollPin(section, sticky, rect = section?.getBoundingClientRect()) {
  if (!section || !sticky || !rect) {
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isActive = rect.top <= 0 && rect.bottom > viewportHeight;
  const isEnded = rect.bottom <= viewportHeight;

  sticky.classList.toggle("is-scroll-fixed", isActive);
  sticky.classList.toggle("is-scroll-ended", isEnded);
}

function getHeroPhaseOpacity(progress, start, end, fade = 0.025) {
  if (progress < start || progress > end) {
    return 0;
  }

  const fadeIn = start <= 0 ? 1 : clamp((progress - start) / fade, 0, 1);
  const fadeOut = end >= 1 ? 1 : clamp((end - progress) / fade, 0, 1);
  return Math.min(fadeIn, fadeOut);
}

function setupHeroVideoScrub() {
  if (!hero || !heroVideos.length) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let targetProgress = 0;
  let renderedProgress = 0;
  let scrubFrame = null;
  let hasRendered = false;
  const videoStates = heroVideos.map((video) => ({
    video,
    start: Number.parseFloat(video.dataset.heroStart || "0"),
    end: Number.parseFloat(video.dataset.heroEnd || "1"),
    duration: 0
  }));
  const chapterStates = heroChapters.map((chapter) => ({
    chapter,
    start: Number.parseFloat(chapter.dataset.heroStart || "0"),
    end: Number.parseFloat(chapter.dataset.heroEnd || "1")
  }));

  const render = () => {
    if (reduceMotion || !hasRendered) {
      renderedProgress = targetProgress;
      hasRendered = true;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.085;
    }

    hero.style.setProperty("--hero-video-progress", renderedProgress.toFixed(4));

    if (heroTitle) {
      const introProgress = clamp(renderedProgress / 0.23, 0, 1);
      heroTitle.style.transform = `translate3d(0, ${(-introProgress * 46).toFixed(2)}px, 0)`;
    }

    videoStates.forEach((state, index) => {
      const { video, start, end, duration } = state;
      const opacity = reduceMotion && index > 0
        ? 0
        : getHeroPhaseOpacity(renderedProgress, start, end);
      const localProgress = clamp((renderedProgress - start) / Math.max(end - start, 0.001), 0, 1);

      video.style.opacity = opacity.toFixed(4);
      video.pause();

      if (duration && opacity > 0 && !video.seeking) {
        const targetTime = reduceMotion
          ? 0.04
          : clamp(localProgress * duration, 0.04, Math.max(duration - 0.04, 0.04));

        if (Math.abs(video.currentTime - targetTime) > 0.014) {
          try {
            video.currentTime = targetTime;
          } catch (error) {
            // Metadata and seek ranges can arrive a frame later on slower connections.
          }
        }
      }

      if (index === 0 && heroFrame) {
        heroFrame.style.opacity = opacity.toFixed(4);
      }
    });

    chapterStates.forEach(({ chapter, start, end }) => {
      const opacity = reduceMotion && start > 0
        ? 0
        : getHeroPhaseOpacity(renderedProgress, start, end);
      const localProgress = clamp((renderedProgress - start) / Math.max(end - start, 0.001), 0, 1);
      const translateY = (1 - localProgress) * 24;

      chapter.style.opacity = opacity.toFixed(4);
      chapter.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
      chapter.setAttribute("aria-hidden", opacity > 0.05 ? "false" : "true");
      chapter.inert = opacity <= 0.05;
    });

    if (!reduceMotion && Math.abs(targetProgress - renderedProgress) > 0.0005) {
      scrubFrame = window.requestAnimationFrame(render);
    } else {
      renderedProgress = targetProgress;
      hero.style.setProperty("--hero-video-progress", renderedProgress.toFixed(4));
      scrubFrame = null;
    }
  };

  const requestRender = () => {
    if (!scrubFrame) {
      scrubFrame = window.requestAnimationFrame(render);
    }
  };

  heroVideoScrub = {
    setProgress(progress) {
      targetProgress = clamp(progress, 0, 1);
      requestRender();
    }
  };

  videoStates.forEach((state) => {
    const measure = () => {
      if (Number.isFinite(state.video.duration) && state.video.duration > 0) {
        state.duration = state.video.duration;
      }
      requestRender();
    };

    state.video.pause();
    state.video.load();
    state.video.addEventListener("loadedmetadata", measure, { once: true });
    state.video.addEventListener("canplay", measure, { once: true });
    measure();
  });
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
  if (!nav || !menuButton) {
    return;
  }

  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector(".sr-only").textContent = "Menü öffnen";
  document.documentElement.classList.remove("menu-is-open");
  if (navPanel?.contains(document.activeElement)) menuButton.focus();
  syncMenuTray(false);
}

function releaseStaleMenuScrollLock() {
  if (!nav?.classList.contains("is-open")) {
    document.documentElement.classList.remove("menu-is-open");
  }
}

function syncMenuTray(isOpen) {
  if (!navPanel || !menuButton) {
    return;
  }

  navPanel.inert = !isOpen;
  document.querySelector('main')?.toggleAttribute('inert', isOpen);
  navPanel.style.removeProperty("clip-path");
  navPanel.style.removeProperty("transform");
  navPanel.style.removeProperty("transition");
  menuButton.style.removeProperty("top");
  menuButton.style.removeProperty("transition");
}

let menuTraySyncFrame = null;

function scheduleMenuTraySync() {
  if (!nav?.classList.contains("is-open")) {
    return;
  }

  if (menuTraySyncFrame) {
    window.cancelAnimationFrame(menuTraySyncFrame);
  }

  menuTraySyncFrame = window.requestAnimationFrame(() => {
    menuTraySyncFrame = null;
    syncMenuTray(true);
  });
}

if (window.ResizeObserver && navPanel) {
  const menuTrayObserver = new ResizeObserver(scheduleMenuTraySync);
  menuTrayObserver.observe(navPanel);
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
    const label = isDark ? 'Helles Farbschema einschalten' : 'Dunkles Farbschema einschalten';
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
  if (!pageShell || ["contact", "privacy", "agb", "imprint"].includes(document.body.dataset.page) || document.querySelector(".wedding-inquiry, .guide-cta, .wd-cta, .alien-final-cta, .service-big-cta")) return;
  const projectTitle = document.querySelector("#projectTitle")?.textContent.trim();
  const section = document.createElement("section");
  section.className = projectTitle ? "case-next" : "editorial-cta";
  if (!projectTitle) {
    const heading = document.createElement("h2");
    heading.textContent = document.body.dataset.page === "about" ? "Lass uns etwas bewegen." : "Eine Idee im Kopf?";
    section.append(heading);
  }
  const contact = document.createElement("a");
  contact.textContent = projectTitle ? "Ähnliches Projekt anfragen" : "Projekt besprechen";
  contact.href = projectTitle ? `contact.html?project=${encodeURIComponent(projectTitle)}#briefing` : "contact.html#briefing";
  const works = document.createElement("a");
  works.textContent = "Alle Arbeiten ansehen";
  works.href = "works.html";
  section.append(contact, works);
  pageShell.append(section);
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

function getAbsoluteUrl(url) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, window.location.origin).href;
  } catch (error) {
    return url;
  }
}

function getVideoProviderName(player) {
  if (/youtu/i.test(player)) {
    return "YouTube";
  }

  if (/vimeo/i.test(player)) {
    return "Vimeo";
  }

  return "externes";
}

function formatVideoDuration(seconds) {
  const amount = Number(seconds);

  return Number.isFinite(amount) && amount > 0 ? `PT${Math.round(amount)}S` : undefined;
}

const projectCollaborationOverrides = {
  "50-jahre-europa-park": "Projekt für Europa-Park. Umsetzung im interdisziplinären Content- und Produktionsteam.",
  "tnw-website": "Projekt für TNW. Realisierung im Team von The Bloc Switzerland.",
  "duolingo-spec-ad": "Freie Konzeptarbeit und Spec Ad. Kein Auftrag durch Duolingo.",
  "rockstar-musicvideo": "Direkte Zusammenarbeit mit Artist und beteiligtem Produktionsteam.",
  "dj-bobo-evolut30n-tour": "Entertainment-Produktion für DJ BoBo im beteiligten Produktions- und Postproduktionsteam.",
  "europa-park-neuheiten-2023": "Projekt für Europa-Park. Umsetzung im interdisziplinären Content-Team.",
  "europa-park-dinnershow-2022": "Projekt für Europa-Park. Zusammenarbeit mit Show-, Gastronomie- und Produktionsteam.",
  "phantom-der-oper-vr-coastiality": "Projektpartner: Europa-Park und Andrew Lloyd Webber. Story: Mack Magic.",
  "voltron-nevera-tv-werbespot": "Projekt für Europa-Park. Story: Mack Magic. Regie: Jan Reiff. Animation: Mack Animation.",
  "songwon-corporate-movie": "Projekt für SONGWON. Umsetzung im beteiligten Corporate- und Produktionsteam.",
  "energize-your-communications-commercial": "Projekt für X-Ray. Realisierung im beteiligten Film- und Postproduktionsteam.",
  "virtual-production-case-study": "Freie Case Study und eigenständige Entwicklung.",
  "austellung-around-the-world": "Freie kuratorische und fotografische Arbeit.",
  "austellung-movin": "Eigenständige Ausstellungskonzeption in Zusammenarbeit mit dem Ausstellungsort."
};

const projectClientNames = {
  "smt-imagefilm-qualitaet": "SMT",
  "movin-recruitingfilm": "MOVIN",
  "novartis-medportal": "Novartis",
  "movicol-mode-of-action": "Movicol",
  "acino-pain-management": "Acino",
  "bongrain-savencia": "Bongrain / Savencia",
  "x-ray-website": "X-Ray",
  "arcondis-brand-identity": "ARCONDIS",
  "syngenta-campaign": "Syngenta",
  "abbvie-oncology": "AbbVie",
  "dr-martin-klein": "Dr. Martin Klein",
  "kaeppeli-recruitngfilm": "Käppeli",
  "zum-park-recruitngfilm": "Zum Park",
  "ttp-group-imagefilm": "TTP Group",
  "praxis-seesemann-commercial-fotografie": "Praxis Seesemann",
  "adesso-life-sciences-imagemovie": "adesso Life Sciences",
  "messe-basel-imagemovie": "Messe Basel",
  "evoke-emotions-commercial": "Evoke Emotions"
};

const projectPlaceOverrides = {
  "50-jahre-europa-park": "Rust",
  "tnw-website": "Basel",
  "duolingo-spec-ad": "Freiburg",
  "mareike-daniel-wedding": "Freiburg",
  "rockstar-musicvideo": "Freiburg",
  "dj-bobo-evolut30n-tour": "Rust",
  "europa-park-neuheiten-2023": "Rust",
  "europa-park-dinnershow-2022": "Rust",
  "smt-imagefilm-qualitaet": "Freiburg",
  "movin-recruitingfilm": "Freiburg",
  "virtual-production-case-study": "Freiburg",
  "novartis-medportal": "Basel",
  "movicol-mode-of-action": "Basel",
  "acino-pain-management": "Basel",
  "bongrain-savencia": "Basel",
  "x-ray-website": "Basel",
  "arcondis-brand-identity": "Basel",
  "syngenta-campaign": "Basel",
  "abbvie-oncology": "Basel",
  "dr-martin-klein": "Freiburg",
  "paris": "Paris",
  "uniimmo-portraits": "Freiburg",
  "kaeppeli-recruitngfilm": "Freiburg",
  "one-stop-in-venedig": "Venedig",
  "dogportrait-ilvy-co": "Freiburg",
  "zum-park-recruitngfilm": "Freiburg",
  "hamburg": "Hamburg",
  "vietnam": "Vietnam",
  "ttp-group-imagefilm": "Basel",
  "christoph-goettel-artist-portrait": "Freiburg",
  "jeep-wrangler-on-hawaii": "Hawaii",
  "praxis-seesemann-commercial-fotografie": "Freiburg",
  "chris-blair-engagement-video": "Freiburg",
  "valentin-business-portrait": "Freiburg",
  "adesso-life-sciences-imagemovie": "Basel",
  "larissa-spring-feels": "Freiburg",
  "hochzeit-lucas-valerie": "Freiburg",
  "familienportrait-foro": "Freiburg",
  "sportsportrait-irene": "Freiburg",
  "larissa-autumn-spirit": "Freiburg",
  "austellung-around-the-world": "Freiburg",
  "hochzeit-albana-max": "Freiburg",
  "austellung-movin": "Freiburg",
  "businessportrait-kurt": "Freiburg",
  "messe-basel-imagemovie": "Basel",
  "evoke-emotions-commercial": "Basel",
  "destiny": "New York",
  "energize-your-communications-commercial": "Basel",
  "phantom-der-oper-vr-coastiality": "Rust",
  "voltron-nevera-tv-werbespot": "Rust",
  "songwon-corporate-movie": "Basel",
  "desert-mustang": "Freiburg",
  "mercedes-gt-in-der-salzwuste": "Freiburg",
  "ocean-coast": "Côte d’Azur"
};

const projectYearOverrides = {
  "x-ray-website": "2021",
  "arcondis-brand-identity": "2015",
  "syngenta-campaign": "2014",
  "abbvie-oncology": "2017",
  "dr-martin-klein": "2017",
  "bongrain-savencia": "2015",
  "acino-pain-management": "2016",
  "phantom-der-oper-vr-coastiality": "2023",
  "voltron-nevera-tv-werbespot": "2023",
  "songwon-corporate-movie": "2016",
  "novartis-medportal": "2021",
  "movicol-mode-of-action": "2018",
  "energize-your-communications-commercial": "2020",
  "tnw-website": "2024",
  "austellung-around-the-world": "2020",
  "austellung-movin": "2019",
  "businessportrait-kurt": "2021",
  "chris-blair-engagement-video": "2021",
  "christoph-goettel-artist-portrait": "2021",
  "desert-mustang": "2021",
  "destiny": "2021",
  "dogportrait-ilvy-co": "2022",
  "familienportrait-foro": "2020",
  "hamburg": "2021",
  "hochzeit-albana-max": "2018",
  "hochzeit-lucas-valerie": "2020",
  "jeep-wrangler-on-hawaii": "2019",
  "larissa-autumn-spirit": "2018",
  "larissa-spring-feels": "2021",
  "mareike-daniel-wedding": "2023",
  "mercedes-gt-in-der-salzwuste": "2022",
  "ocean-coast": "2021",
  "one-stop-in-venedig": "2020",
  "paris": "2022",
  "praxis-seesemann-commercial-fotografie": "2021",
  "sportsportrait-irene": "2021",
  "uniimmo-portraits": "2022",
  "valentin-business-portrait": "2021",
  "vietnam": "2021",
  "zum-park-recruitngfilm": "2022"
};

const weddingProjectSlugs = new Set([
  "mareike-daniel-wedding",
  "hochzeit-lucas-valerie",
  "hochzeit-albana-max"
]);

const portraitProjectSlugs = new Set([
  "uniimmo-portraits",
  "dogportrait-ilvy-co",
  "christoph-goettel-artist-portrait",
  "chris-blair-engagement-video",
  "valentin-business-portrait",
  "larissa-spring-feels",
  "familienportrait-foro",
  "sportsportrait-irene",
  "larissa-autumn-spirit",
  "businessportrait-kurt"
]);

const freeProjectSlugs = new Set([
  "paris",
  "mercedes-gt-in-der-salzwuste",
  "one-stop-in-venedig",
  "desert-mustang",
  "ocean-coast",
  "hamburg",
  "vietnam",
  "jeep-wrangler-on-hawaii",
  "destiny"
]);

function findProjectFact(project, labels) {
  return project.facts?.find(([label]) => labels.some((candidate) => (
    label.trim().toLocaleLowerCase("de-DE") === candidate
  )))?.[1];
}

function getProjectFormat(project) {
  return project.format
    || findProjectFact(project, ["format", "medium", "medien", "art des projekts"])
    || `${project.eyebrow.replaceAll("/", " · ")}.`;
}

function getProjectYear(project, slug) {
  if (project.year) {
    return project.year;
  }

  if (projectYearOverrides[slug]) {
    return projectYearOverrides[slug];
  }

  const datedVideo = project.videos?.find((video) => /^\d{4}/.test(video.date || ""));
  return datedVideo?.date.slice(0, 4) || "";
}

function getProjectFormatAndMeta(project, slug) {
  const place = project.place || projectPlaceOverrides[slug] || "";
  const format = getProjectFormat(project)
    .replace(/[.\s]+$/, "")
    .split(/\s*·\s*/)
    .filter((part) => part.toLocaleLowerCase("de-DE") !== place.toLocaleLowerCase("de-DE"))
    .join(" · ");
  const placeYear = [place, getProjectYear(project, slug)]
    .filter(Boolean)
    .join(" · ");

  return placeYear ? `${format}. ${placeYear}` : `${format}.`;
}

function getProjectCollaboration(project, slug) {
  const explicitFact = findProjectFact(project, [
    "zusammenarbeit",
    "projektpartner",
    "auftraggeber",
    "team",
    "credits"
  ]);

  if (project.collaboration) {
    return project.collaboration;
  }

  if (projectCollaborationOverrides[slug]) {
    return projectCollaborationOverrides[slug];
  }

  if (explicitFact) {
    return explicitFact;
  }

  if (weddingProjectSlugs.has(slug)) {
    return "Direktauftrag. Enge Abstimmung mit dem Paar während Planung, Reportage und Bildauswahl.";
  }

  if (portraitProjectSlugs.has(slug)) {
    return "Direkte Zusammenarbeit mit den porträtierten Personen beziehungsweise dem beauftragenden Unternehmen.";
  }

  if (freeProjectSlugs.has(slug)) {
    return "Freie fotografische beziehungsweise filmische Arbeit und eigenständige Umsetzung.";
  }

  if (projectClientNames[slug]) {
    return `Projekt für ${projectClientNames[slug]}. Umsetzung gemeinsam mit dem beteiligten Fach- und Produktionsteam.`;
  }

  return "Projektarbeit in direkter Abstimmung mit Auftraggebenden und beteiligtem Team.";
}

function getProjectFacts(project, slug) {
  return [
    ["Projekt & Format", getProjectFormatAndMeta(project, slug)],
    ["Mein Beitrag", project.role],
    ["Zusammenarbeit", getProjectCollaboration(project, slug)]
  ];
}

function renderProjectVideoSchema(project, slug) {
  document.querySelectorAll("[data-project-video-schema]").forEach((node) => node.remove());

  if (!project.videos?.length) {
    return;
  }

  const videoObjects = project.videos.map((video, index) => {
    const duration = formatVideoDuration(video.duration);
    const object = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `https://andreasboehler.com/${slug}.html#video-${index + 1}`,
      name: video.title || `${project.title} Video`,
      description: video.description || project.description || project.intro,
      embedUrl: video.player,
      thumbnailUrl: getAbsoluteUrl(video.thumbnail || project.image),
      uploadDate: video.date || undefined,
      duration
    };

    Object.keys(object).forEach((key) => {
      if (object[key] === undefined || object[key] === "") {
        delete object[key];
      }
    });

    return object;
  });

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.dataset.projectVideoSchema = "true";
  schema.textContent = JSON.stringify(videoObjects.length === 1 ? videoObjects[0] : videoObjects);
  document.head.append(schema);
}

function renderProjectVideos(project) {
  document.querySelector("#projectVideoShowcase")?.remove();

  if (!project.videos?.length) {
    return;
  }

  const facts = document.querySelector("#projectFacts");
  const section = document.createElement("section");
  const header = document.createElement("header");
  const label = document.createElement("span");
  const heading = document.createElement("h2");
  const grid = document.createElement("div");

  section.className = "project-video-showcase";
  section.id = "projectVideoShowcase";
  section.setAttribute("aria-labelledby", "projectVideoTitle");
  label.textContent = "Video";
  heading.id = "projectVideoTitle";
  heading.textContent = project.videos.length > 1 ? "Filme zum Projekt" : "Film zum Projekt";
  grid.className = "project-video-grid";

  project.videos.forEach((video) => {
    const card = document.createElement("article");
    const frame = document.createElement("div");
    const iframe = document.createElement("iframe");
    const copy = document.createElement("div");
    const videoTitle = document.createElement("h3");
    const meta = document.createElement("p");
    const provider = getVideoProviderName(video.player);

    card.className = "project-video-card";
    frame.className = "consent-embed project-video-frame";
    frame.style.setProperty('--video-poster', `url("${video.thumbnail || project.image}")`);
    frame.dataset.consentPlaceholder = `${provider} Video laden: externe Medien in den Datenschutz-Einstellungen erlauben.`;

    iframe.title = video.title || `${project.title} Video`;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.dataset.consentCategory = "external";
    iframe.dataset.consentSrc = video.player;

    videoTitle.textContent = video.title || project.title;
    meta.textContent = [provider, video.duration ? `${Math.floor(Number(video.duration) / 60)}:${String(Math.round(Number(video.duration) % 60)).padStart(2, '0')} Min.` : ""]
      .filter(Boolean)
      .join(" · ");

    copy.append(videoTitle, meta);
    frame.append(iframe);
    card.append(frame, copy);
    grid.append(card);
  });

  header.append(label, heading);
  section.append(header, grid);

  const projectHero = document.querySelector("#projectHero");

  if (projectHero) {
    projectHero.after(section);
  } else if (facts) {
    facts.before(section);
  }

  window.AndreasConsent?.load();
}

function renderProjectPage() {
  const projectHero = document.querySelector("#projectHero");

  if (!projectHero) {
    return;
  }

  const slug = getCurrentProjectSlug();
  const project = projectData[slug] || projectData["dj-bobo-evolut30n-tour"];
  document.body.dataset.projectSlug = slug;
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
  const heroImage = projectHero.querySelector(".page-hero-image");
  const roleLabel = role?.closest("article")?.querySelector(":scope > span");

  document.querySelector(".project-depth")?.remove();
  document.querySelector(".seo-link-band")?.remove();

  document.body.dataset.projectKind = project.videos?.length ? 'film' : /web|design|branding|identity|guideline|inserat/i.test(project.eyebrow + ' ' + project.service) ? 'design' : 'photo';
  projectHero.style.setProperty("--page-image", `url("${project.image}")`);
  renderProjectVideoSchema(project, slug);

  if (title) title.textContent = project.title;
  if (eyebrow) eyebrow.textContent = getProjectFormat(project).replace(/[.\s]+$/, '');
  if (intro) intro.textContent = project.intro;
  if (roleLabel) roleLabel.textContent = "Projektidee";
  if (role) role.textContent = project.description;
  if (description) description.textContent = "Eine ähnliche Idee?";
  if (heroImage) {
    heroImage.src = project.image;
    heroImage.alt = `Cinematisches Projektbild zu ${project.title}`;
  }
  if (serviceText) serviceText.textContent = `Mehr zu ${project.service} und passenden Produktionsleistungen.`;
  if (serviceLink) serviceLink.href = project.serviceLink;
  if (footerProjectTitle) footerProjectTitle.textContent = project.title;
  if (footerProjectText) footerProjectText.textContent = project.intro;

  const projectQuery = `?project=${encodeURIComponent(project.title)}#briefing`;
  if (contactLink) contactLink.href = `contact.html${projectQuery}`;
  if (briefingLink) briefingLink.href = `contact.html${projectQuery}`;

  if (facts) {
    facts.textContent = "";

    getProjectFacts(project, slug).forEach(([label, text]) => {
      const article = document.createElement("article");
      const span = document.createElement("span");
      const heading = document.createElement("h3");
      const paragraph = document.createElement("p");
      span.textContent = label === "SEO-Relevanz" ? "Schwerpunkt" : label;
      heading.textContent = text;

      article.append(span, heading);
      if (paragraph.textContent) {
        article.append(paragraph);
      }
      facts.append(article);
    });
  }

  renderProjectVideos(project);
}

function getFormValues(form, name) {
  return Array.from(form.querySelectorAll(`[name="${name}"], [name="${name}[]"]`))
    .filter((field) => {
      if (field.type === "checkbox" || field.type === "radio") {
        return field.checked;
      }

      return Boolean(field.value.trim());
    })
    .map((field) => field.value.trim());
}

function setupProtectedEmailReveal() {
  const addressCodes = [
    104, 101, 108, 108, 111, 64, 97, 110, 100, 114, 101, 97, 115,
    98, 111, 101, 104, 108, 101, 114, 46, 99, 111, 109
  ];

  document.querySelectorAll("[data-email-reveal]").forEach((button) => {
    button.addEventListener("click", () => {
      const address = String.fromCharCode(...addressCodes);
      const link = document.createElement("a");
      link.className = "protected-email-link";
      link.href = `mailto:${address}`;
      link.textContent = address;
      link.setAttribute("aria-label", `E-Mail an ${address} schreiben`);
      button.replaceWith(link);
    }, { once: true });
  });
}

function prepareContactForm(form) {
  const startedAt = form.elements.namedItem("form_started_at");

  if (startedAt) {
    startedAt.value = String(Math.floor(Date.now() / 1000));
  }
}

function setContactFormStatus(status, message, state = "") {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
}

function redirectAfterLeadTracking(formType) {
  const destination = `danke.html?anfrage=${encodeURIComponent(formType)}`;
  let redirected = false;
  const redirect = () => {
    if (redirected) {
      return;
    }

    redirected = true;
    window.location.assign(destination);
  };

  if (!isConsentCategoryAllowed("statistics")) {
    window.setTimeout(redirect, 500);
    return;
  }

  const gtag = getGoogleTag();

  gtag("event", "generate_lead", {
    lead_type: formType,
    transport_type: "beacon",
    event_callback: redirect,
    event_timeout: 900
  });
  window.setTimeout(redirect, 1000);
}

async function submitContactForm(form, status, formType) {
  if (!form.reportValidity() || form.dataset.submitting === "true") {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton?.textContent || "";

  form.dataset.submitting = "true";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet ...";
  }
  setContactFormStatus(status, "Die Anfrage wird sicher übermittelt.", "pending");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok !== true) {
      throw new Error(result.message || "Die Anfrage konnte gerade nicht gesendet werden.");
    }

    setContactFormStatus(status, "Danke. Die Anfrage ist angekommen.", "success");
    redirectAfterLeadTracking(formType);
  } catch (error) {
    setContactFormStatus(
      status,
      `${error.message || "Die Anfrage konnte gerade nicht gesendet werden."} Bitte versuche es erneut oder ruf kurz an.`,
      "error"
    );
    form.dataset.submitting = "false";
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  }
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
      : "Wähle zuerst den Projekttyp. Weitere Angaben kannst du optional ergänzen.";
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
  const status = form.querySelector("#briefingFormStatus");

  if (project && reference) {
    reference.value = project;
  }

  prepareContactForm(form);
  form.addEventListener("input", updateBriefingSummary);
  form.addEventListener("change", updateBriefingSummary);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitContactForm(form, status, "project");
  });

  updateBriefingSummary();
}

function setupWeddingInquiryForm() {
  const form = document.querySelector("#weddingInquiryForm");

  if (!form) {
    return;
  }

  const packageSelect = form.querySelector("#weddingPackage");
  const status = form.querySelector("#weddingFormStatus");
  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package");

  if (requestedPackage && packageSelect) {
    const matchingOption = Array.from(packageSelect.options).find((option) => option.value === requestedPackage);

    if (matchingOption) {
      packageSelect.value = matchingOption.value;
    }
  }

  document.querySelectorAll("[data-wedding-package]").forEach((link) => {
    link.addEventListener("click", () => {
      if (packageSelect) {
        packageSelect.value = link.dataset.weddingPackage || "Noch offen";
      }
    });
  });

  prepareContactForm(form);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitContactForm(form, status, "wedding");
  });
}

function setupHomeClientScroll() {
  const section = document.querySelector(".home-client-scroll");
  const sticky = document.querySelector(".home-client-sticky");
  const label = document.querySelector(".home-client-label");
  const track = document.querySelector(".home-client-track ul");
  const cards = Array.from(document.querySelectorAll(".home-client-track li"));

  if (!section || !sticky || !label || !track) {
    return;
  }

  let maxShift = 0;
  let targetProgress = 0;
  let renderedProgress = 0;
  let clientFrame = null;
  let hasRenderedClientScroll = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cardDepths = [1.3, 0.68, 1.55, 0.48, 1.08, 0.78];
  const cardStates = cards.map(() => ({
    targetX: 0,
    targetY: 0,
    x: 0,
    y: 0,
    targetEnergy: 0,
    energy: 0
  }));
  let labelX = 0;
  let labelY = 0;
  let targetLabelX = 0;
  let targetLabelY = 0;
  let labelFrame = null;

  const renderCardTilt = () => {
    let hasMovingCards = false;

    cards.forEach((card, index) => {
      const state = cardStates[index];
      const depth = cardDepths[index % cardDepths.length];

      if (reduceMotion) {
        state.x = 0;
        state.y = 0;
        state.energy = 0;
      } else {
        state.x += (state.targetX - state.x) * 0.14;
        state.y += (state.targetY - state.y) * 0.14;
        state.energy += (state.targetEnergy - state.energy) * 0.12;
      }

      if (
        Math.abs(state.targetX - state.x) > 0.002 ||
        Math.abs(state.targetY - state.y) > 0.002 ||
        Math.abs(state.targetEnergy - state.energy) > 0.002
      ) {
        hasMovingCards = true;
      }

      card.style.setProperty("--client-dyn-x", `${(state.x * depth * 36).toFixed(2)}px`);
      card.style.setProperty("--client-dyn-y", `${(state.y * depth * 24).toFixed(2)}px`);
      card.style.setProperty("--client-dyn-z", `${(state.energy * depth * 145).toFixed(2)}px`);
      card.style.setProperty("--client-dyn-rotate-x", `${(-state.y * depth * 18).toFixed(3)}deg`);
      card.style.setProperty("--client-dyn-rotate-y", `${(state.x * depth * 27).toFixed(3)}deg`);
      card.style.setProperty("--client-dyn-scale", (1 + state.energy * 0.035).toFixed(4));
      card.style.setProperty("--client-card-light", (0.012 + state.energy * 0.075).toFixed(4));
      card.style.setProperty("--client-card-border", (0.15 + state.energy * 0.28).toFixed(4));
      card.style.setProperty("--client-card-shadow", (0.24 + state.energy * 0.22).toFixed(4));
    });

    return hasMovingCards;
  };

  const renderTrack = () => {
    if (reduceMotion) {
      renderedProgress = targetProgress;
    } else if (!hasRenderedClientScroll) {
      renderedProgress = targetProgress;
      hasRenderedClientScroll = true;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.055;
    }

    section.style.setProperty("--home-client-progress", renderedProgress.toFixed(4));
    track.style.transform = `translate3d(${-maxShift * renderedProgress}px, 0, 0)`;
    const hasMovingCards = renderCardTilt();

    if (!reduceMotion && (Math.abs(targetProgress - renderedProgress) > 0.0006 || hasMovingCards)) {
      clientFrame = window.requestAnimationFrame(renderTrack);
    } else {
      renderedProgress = targetProgress;
      section.style.setProperty("--home-client-progress", renderedProgress.toFixed(4));
      track.style.transform = `translate3d(${-maxShift * renderedProgress}px, 0, 0)`;
      renderCardTilt();
      clientFrame = null;
    }
  };

  const requestTrackFrame = () => {
    if (!clientFrame) {
      clientFrame = window.requestAnimationFrame(renderTrack);
    }
  };

  const renderLabel = () => {
    labelX += (targetLabelX - labelX) * 0.16;
    labelY += (targetLabelY - labelY) * 0.16;
    label.style.transform = `translate3d(${labelX.toFixed(2)}px, ${labelY.toFixed(2)}px, 0)`;

    if (Math.abs(targetLabelX - labelX) > 0.2 || Math.abs(targetLabelY - labelY) > 0.2) {
      labelFrame = window.requestAnimationFrame(renderLabel);
    } else {
      labelFrame = null;
    }
  };

  const requestLabelFrame = () => {
    if (!labelFrame) {
      labelFrame = window.requestAnimationFrame(renderLabel);
    }
  };

  const resetLabel = () => {
    targetLabelX = 0;
    targetLabelY = 0;
    cardStates.forEach((state) => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetEnergy = 0;
    });
    requestLabelFrame();
    requestTrackFrame();
  };

  const measure = () => {
    maxShift = Math.max(track.scrollWidth - window.innerWidth + window.innerWidth * 0.08, 0);
    update();
  };

  const update = () => {
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    targetProgress = clamp(-rect.top / scrollable, 0, 1);
    syncScrollPin(section, sticky, rect);
    requestTrackFrame();
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  section.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const stickyRect = sticky.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const labelCenterX = labelRect.left - stickyRect.left - labelX + (labelRect.width / 2);
    const labelCenterY = labelRect.top - stickyRect.top - labelY + (labelRect.height / 2);

    targetLabelX = clamp((event.clientX - stickyRect.left - labelCenterX) * 0.34, -150, 150);
    targetLabelY = clamp((event.clientY - stickyRect.top - labelCenterY) * 0.42, -80, 80);
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const state = cardStates[index];
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);
      const localX = clamp((event.clientX - centerX) / Math.max(rect.width / 2, 1), -1, 1);
      const localY = clamp((event.clientY - centerY) / Math.max(rect.height / 2, 1), -1, 1);
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      const falloff = Math.max(rect.width * 1.18, 320);
      const influence = Math.pow(clamp(1 - (distance / falloff), 0, 1), 1.35);

      state.targetX = localX * influence;
      state.targetY = localY * influence;
      state.targetEnergy = influence;
    });
    requestLabelFrame();
    requestTrackFrame();
  }, { passive: true });
  section.addEventListener("pointerleave", resetLabel, { passive: true });
  measure();
}

function setupHomeVideoProcess() {
  const section = document.querySelector(".home-video-process");
  const sticky = document.querySelector(".home-video-process-sticky");
  const video = document.querySelector("[data-scroll-video]");

  if (!section || !sticky || !video) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let duration = 0;
  let targetProgress = 0;
  let renderedProgress = 0;
  let ticking = false;
  let scrubFrame = null;
  let hasRenderedScrub = false;

  const renderScrub = () => {
    if (reduceMotion) {
      renderedProgress = targetProgress;
    } else if (!hasRenderedScrub) {
      renderedProgress = targetProgress;
      hasRenderedScrub = true;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.062;
    }

    section.style.setProperty("--home-video-progress", renderedProgress.toFixed(4));

    if (duration) {
      const targetTime = clamp(renderedProgress * duration, 0.04, Math.max(duration - 0.04, 0.04));

      video.pause();
      if (Math.abs(video.currentTime - targetTime) > 0.016) {
        try {
          video.currentTime = targetTime;
        } catch (error) {
          // Some browsers reject seeks until metadata/ranges are ready; the next frame retries.
        }
      }
    }

    if (!reduceMotion && Math.abs(targetProgress - renderedProgress) > 0.0005) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    } else {
      renderedProgress = targetProgress;
      section.style.setProperty("--home-video-progress", renderedProgress.toFixed(4));
      scrubFrame = null;
    }
  };

  const requestScrubFrame = () => {
    if (!scrubFrame) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    }
  };

  const measure = () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      duration = video.duration;
    }
    update();
  };

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    targetProgress = clamp(-rect.top / scrollable, 0, 1);
    syncScrollPin(section, sticky, rect);

    if (reduceMotion || !duration) {
      video.pause();
      renderedProgress = targetProgress;
      section.style.setProperty("--home-video-progress", renderedProgress.toFixed(4));
      return;
    }

    requestScrubFrame();
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  video.pause();
  video.load();
  video.addEventListener("loadedmetadata", measure, { once: true });
  video.addEventListener("canplay", measure, { once: true });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  measure();
}

function setupAboutHeroVideoScrub() {
  const section = document.querySelector(".about-hero-scrub");
  const sticky = document.querySelector(".about-hero-scrub-sticky");
  const video = document.querySelector("[data-about-scroll-video]");

  if (!section || !sticky || !video) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let duration = 0;
  let targetProgress = 0;
  let renderedProgress = 0;
  let ticking = false;
  let scrubFrame = null;
  let hasRenderedScrub = false;

  const renderScrub = () => {
    if (reduceMotion) {
      renderedProgress = targetProgress;
    } else if (!hasRenderedScrub) {
      renderedProgress = targetProgress;
      hasRenderedScrub = true;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.062;
    }

    section.style.setProperty("--about-hero-progress", renderedProgress.toFixed(4));

    if (duration) {
      const targetTime = clamp(renderedProgress * duration, 0.04, Math.max(duration - 0.04, 0.04));

      video.pause();
      if (Math.abs(video.currentTime - targetTime) > 0.016) {
        try {
          video.currentTime = targetTime;
        } catch (error) {
          // Scrub seeking can fail before metadata is available; the next frame retries safely.
        }
      }
    }

    if (!reduceMotion && Math.abs(targetProgress - renderedProgress) > 0.0005) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    } else {
      renderedProgress = targetProgress;
      section.style.setProperty("--about-hero-progress", renderedProgress.toFixed(4));
      scrubFrame = null;
    }
  };

  const requestScrubFrame = () => {
    if (!scrubFrame) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    }
  };

  const measure = () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      duration = video.duration;
    }
    update();
  };

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    targetProgress = clamp(-rect.top / scrollable, 0, 1);
    syncScrollPin(section, sticky, rect);

    if (reduceMotion || !duration) {
      video.pause();
      renderedProgress = targetProgress;
      section.style.setProperty("--about-hero-progress", renderedProgress.toFixed(4));
      return;
    }

    requestScrubFrame();
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  video.pause();
  video.load();
  video.addEventListener("loadedmetadata", measure, { once: true });
  video.addEventListener("canplay", measure, { once: true });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  measure();
}

function setupWeddingHeroVideoScrub() {
  const section = document.querySelector(".wedding-hero-scrub");
  const sticky = document.querySelector(".wedding-hero-scrub-sticky");
  const videos = [...document.querySelectorAll("[data-wedding-scroll-video]")];
  const copy = section?.querySelector(".wedding-hero-copy");
  const closings = [...(section?.querySelectorAll(".wedding-hero-closing") || [])];

  if (!section || !sticky || !videos.length) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const videoStates = videos.map((video) => ({
    video,
    start: Number.parseFloat(video.dataset.weddingStart || "0"),
    end: Number.parseFloat(video.dataset.weddingEnd || "1"),
    duration: 0
  }));
  const closingStates = closings.map((closing) => ({
    closing,
    start: Number.parseFloat(closing.dataset.weddingCopyStart || "0.7"),
    end: Number.parseFloat(closing.dataset.weddingCopyEnd || "1"),
    fade: Number.parseFloat(closing.dataset.weddingCopyFade || "0.075")
  }));
  let targetProgress = 0;
  let renderedProgress = 0;
  let ticking = false;
  let scrubFrame = null;
  let hasRenderedScrub = false;

  const renderScrub = () => {
    if (reduceMotion) {
      renderedProgress = 0;
    } else if (!hasRenderedScrub) {
      renderedProgress = targetProgress;
      hasRenderedScrub = true;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.052;
    }

    section.style.setProperty("--wedding-hero-progress", renderedProgress.toFixed(4));

    if (copy) {
      const copyOpacity = clamp(1 - (renderedProgress / 0.2), 0, 1);
      copy.style.opacity = copyOpacity.toFixed(4);
      copy.style.transform = `translate3d(0, ${(-Math.min(renderedProgress / 0.2, 1) * 34).toFixed(2)}px, 0)`;
      copy.style.pointerEvents = renderedProgress < 0.18 ? "auto" : "none";
    }

    closingStates.forEach(({ closing, start, end, fade }) => {
      const closingOpacity = getHeroPhaseOpacity(renderedProgress, start, end, fade);
      closing.style.opacity = closingOpacity.toFixed(4);
      closing.style.transform = `translate3d(0, ${((1 - closingOpacity) * 34).toFixed(2)}px, 0)`;
      closing.setAttribute("aria-hidden", closingOpacity > 0.05 ? "false" : "true");
    });

    videoStates.forEach((state, index) => {
      const { video, start, end, duration } = state;
      const opacity = reduceMotion && index > 0
        ? 0
        : getHeroPhaseOpacity(renderedProgress, start, end, 0.04);
      const localProgress = clamp((renderedProgress - start) / Math.max(end - start, 0.001), 0, 1);

      video.style.opacity = opacity.toFixed(4);
      video.pause();
      if (duration) {
        const targetTime = reduceMotion
          ? 0.04
          : clamp(localProgress * duration, 0.04, Math.max(duration - 0.04, 0.04));

        if (Math.abs(video.currentTime - targetTime) > 0.016) {
          try {
            video.currentTime = targetTime;
          } catch (error) {
            // Metadata and seek ranges can arrive after the first scroll frame.
          }
        }
      }
    });

    if (!reduceMotion && Math.abs(targetProgress - renderedProgress) > 0.0005) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    } else {
      scrubFrame = null;
    }
  };

  const requestScrubFrame = () => {
    if (!scrubFrame) {
      scrubFrame = window.requestAnimationFrame(renderScrub);
    }
  };

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    targetProgress = reduceMotion ? 0 : clamp(-rect.top / scrollable, 0, 1);

    if (!reduceMotion) {
      syncScrollPin(section, sticky, rect);
    }

    requestScrubFrame();
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  const measure = () => {
    videoStates.forEach((state) => {
      if (Number.isFinite(state.video.duration) && state.video.duration > 0) {
        state.duration = state.video.duration;
      }
    });
    update();
  };

  videoStates.forEach(({ video }) => {
    video.pause();
    video.load();
    video.addEventListener("loadedmetadata", measure, { once: true });
    video.addEventListener("canplay", measure, { once: true });
  });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  measure();
}

function setupContactQuoteReveal() {
  const hero = document.querySelector('body[data-page="contact"] .contact-hero');
  const quote = hero?.querySelector(".contact-hero-quote");
  const cover = quote?.querySelector(".contact-hero-quote-cover");
  const supportsPointerReveal = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hero || !quote || !cover || !supportsPointerReveal || reduceMotion) {
    return;
  }

  const context = cover.getContext("2d", { alpha: true });
  if (!context) {
    return;
  }

  let lastPoint = null;
  let resetFrame = null;

  const resetCover = () => {
    const rect = quote.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    cover.width = Math.round(rect.width * pixelRatio);
    cover.height = Math.round(rect.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = window.getComputedStyle(hero).backgroundColor;
    context.fillRect(0, 0, rect.width, rect.height);
    quote.classList.add("is-brush-ready");
    lastPoint = null;
  };

  const erasePoint = (x, y, radius) => {
    const gradient = context.createRadialGradient(x, y, radius * 0.12, x, y, radius);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.58, "rgba(0, 0, 0, 0.94)");
    gradient.addColorStop(0.82, "rgba(0, 0, 0, 0.46)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.save();
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };

  const paintReveal = (event) => {
    const rect = quote.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (point.x < 0 || point.y < 0 || point.x > rect.width || point.y > rect.height) {
      lastPoint = null;
      return;
    }

    const radius = clamp(Math.min(window.innerWidth, window.innerHeight) * 0.105, 68, 118);
    const from = lastPoint || point;
    const distance = Math.hypot(point.x - from.x, point.y - from.y);
    const steps = Math.max(1, Math.ceil(distance / Math.max(radius * 0.22, 12)));

    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      erasePoint(
        from.x + (point.x - from.x) * progress,
        from.y + (point.y - from.y) * progress,
        radius
      );
    }

    lastPoint = point;
  };

  const requestReset = () => {
    if (resetFrame) {
      window.cancelAnimationFrame(resetFrame);
    }
    resetFrame = window.requestAnimationFrame(() => {
      resetFrame = null;
      resetCover();
    });
  };

  hero.addEventListener("pointermove", paintReveal, { passive: true });
  hero.addEventListener("pointerleave", () => {
    lastPoint = null;
  });
  window.addEventListener("resize", requestReset, { passive: true });

  const themeObserver = new MutationObserver(requestReset);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  resetCover();
  document.fonts?.ready.then(requestReset);
}

function setupAiGeneratedLabels() {
  const aiAssetNames = new Set([
    "andreas-agb-hero-nano-banana-2.jpg",
    "andreas-hero-cinematic-nano-banana-2.jpg",
    "andreas-hero-portrait-ai-reveal.webp",
    "andreas-hero-portrait-cutout.png",
    "andreas-hero-portrait-normal.webp",
    "andreas-moments-analog-model-nano-banana-2.jpg",
    "andreas-services-cinematic-production-nano-banana-2.jpg",
    "andreas-services-creative-tech-nano-banana-2.jpg",
    "andreas-wedding-photographer-ai.webp",
    "andreas-wedding-photographer-sony-a7rv-ai.webp"
  ]);

  const labelImages = (root = document) => {
    const images = root instanceof HTMLImageElement ? [root] : root.querySelectorAll?.("img") || [];

    images.forEach((image) => {
      const source = image.currentSrc || image.getAttribute("src") || "";
      const assetName = source.split(/[/?#]/).filter(Boolean).pop()?.toLowerCase();

      if (!assetName || !aiAssetNames.has(assetName)) {
        return;
      }

      const container = image.closest(".about-brush-hero, .page-hero, figure, .wedding-person, .split-showcase") || image.parentElement;

      if (!container || container.querySelector(":scope > .ai-generated-label")) {
        return;
      }

      container.classList.add("ai-generated-media");
      const label = document.createElement("span");
      label.className = "ai-generated-label";
      label.textContent = "KI-generiert";
      label.setAttribute("aria-label", "Dieses Bild wurde mit KI generiert");
      container.append(label);
    });
  };

  labelImages();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          labelImages(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Menü schließen" : "Menü öffnen";
  document.documentElement.classList.toggle("menu-is-open", isOpen);
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

let pageUpdateFrame = null;
const requestPageUpdate = () => {
  if (pageUpdateFrame) {
    return;
  }

  pageUpdateFrame = window.requestAnimationFrame(() => {
    pageUpdateFrame = null;
    updatePage();
  });
};

window.addEventListener("scroll", requestPageUpdate, { passive: true });
window.addEventListener("pageshow", releaseStaleMenuScrollLock);
window.addEventListener("resize", () => {
  requestPageUpdate();

  if (nav?.classList.contains("is-open")) {
    scheduleMenuTraySync();
  }
});

releaseStaleMenuScrollLock();

renderProjectPage();
setupNavHoverLabels();
setupWorksViewToggle();
setupWorksCuration();
setupWorksScrollCue();
setupHomeClientScroll();
setupHeroVideoScrub();
setupHomeVideoProcess();
setupAboutHeroVideoScrub();
setupWeddingHeroVideoScrub();
setupContactQuoteReveal();
setupAiGeneratedLabels();
setupProtectedEmailReveal();
setupBriefingForm();
setupWeddingInquiryForm();
setupTalkButton();
setupThemeToggle();
setupCinematicPageCta();
setupFooterScrollRelease();
setupHeroBackgroundBrush();
setupBrushRevealImages();
setupTextHoverReveals();
setupScrollTextReveals();
syncMenuTray(false);
updatePage();
