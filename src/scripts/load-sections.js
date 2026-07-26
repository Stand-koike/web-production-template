const COMPONENT_MAP = {
  button: "components/button.html",
  "phone-display": "components/phone-display.html",
  "section-heading": "components/section-heading.html",
  "nav-link": "components/nav-link.html",
  "nav-group": "components/nav-group.html",
  "news-card": "components/news-card.html",
  "faq-card": "components/faq-card.html",
  badge: "components/badge.html",
  divider: "components/divider.html",
  image: "components/image.html",
  "social-links": "components/social-links.html",
};

const BUTTON_VARIANTS = {
  primary: { classes: "btn btn-primary" },
  outline: { classes: "btn btn-outline" },
  "header-cta": { classes: "btn btn-primary site-header__cta" },
};

function getTemplateVars(element) {
  const vars = {};
  for (const attr of element.attributes) {
    if (!attr.name.startsWith("data-") || attr.name === "data-component") {
      continue;
    }
    const key = attr.name.slice(5).replace(/-/g, "_").toUpperCase();
    vars[key] = attr.value;
  }
  return vars;
}

function applyTemplate(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value ?? "");
  }
  return html;
}

function resolveButtonClasses(vars) {
  const preset = BUTTON_VARIANTS[vars.VARIANT] || BUTTON_VARIANTS.primary;
  return preset.classes;
}

function getSlotContent(element, slotName) {
  const template = element.querySelector(`template[data-slot="${slotName}"]`);
  if (!template) {
    return "";
  }

  if (template.content?.childNodes.length) {
    return Array.from(template.content.childNodes)
      .map((node) => node.outerHTML || node.textContent || "")
      .join("")
      .trim();
  }

  return template.innerHTML.trim();
}

function buildNavGroupHtml(element, vars) {
  const items = JSON.parse(vars.ITEMS || "[]");

  return items
    .map(
      (item) =>
        `<div data-component="nav-link" data-label="${item.label}" data-href="${window.resolvePageHref(item.href)}"></div>`
    )
    .join("\n          ");
}

function buildHeaderHtml(element, vars) {
  const navItems = getSlotContent(element, "nav-items");

  return `<header class="site-header">
        <div class="container site-header__inner">
          <a href="${vars.HOME_HREF || "/"}" class="site-header__brand" aria-label="${vars.LOGO_ARIA_LABEL}">
            <img src="${vars.LOGO_SRC}" alt="${vars.LOGO_ALT}" class="site-header__logo" />
            <span class="site-header__name">${vars.LOGO_ALT}</span>
          </a>
          <nav class="site-header__nav" aria-label="Primary">
            ${navItems}
          </nav>
          <div data-component="button" data-variant="header-cta" data-href="${vars.CTA_HREF}" data-label="${vars.CTA_LABEL}"></div>
        </div>
      </header>`;
}

function buildFooterHtml(element, vars) {
  const navItems = getSlotContent(element, "nav-items");

  return `<footer class="site-footer">
        <div class="container site-footer__inner">
          <div>
            <img src="${vars.LOGO_SRC}" alt="${vars.LOGO_ALT}" class="site-footer__logo" />
            <p class="site-footer__address">${vars.ADDRESS_TEXT}</p>
            <div data-component="phone-display" data-number="${vars.PHONE_NUMBER}" data-href="${vars.PHONE_TEL}"></div>
            <div
              data-component="social-links"
              data-instagram-href="${vars.INSTAGRAM_HREF || "#"}"
              data-facebook-href="${vars.FACEBOOK_HREF || "#"}"
            ></div>
          </div>
          <nav class="site-footer__nav" aria-label="Footer">
            ${navItems}
          </nav>
          <p class="site-footer__copyright">&copy; ${vars.COPYRIGHT_TEXT}</p>
        </div>
      </footer>`;
}

function resolveFetchPath(src) {
  if (src.startsWith("http") || src.startsWith("../")) {
    return src;
  }

  const base = window.__SRC_BASE__ || "";
  return `${base}${src}`;
}

async function fetchText(src) {
  const response = await fetch(resolveFetchPath(src));
  if (!response.ok) {
    throw new Error(`Failed to load: ${src}`);
  }
  return response.text();
}

async function loadComponent(element) {
  const name = element.getAttribute("data-component");
  const src = COMPONENT_MAP[name];
  if (!src) {
    throw new Error(`Unknown component: ${name}`);
  }

  const vars = getTemplateVars(element);

  if (name === "nav-group") {
    element.outerHTML = buildNavGroupHtml(element, vars);
    return;
  }

  if (name === "button") {
    vars.CLASSES = resolveButtonClasses(vars);
    vars.HREF = window.resolvePageHref(vars.HREF || "#");
    vars.LABEL = vars.LABEL || "";
  }

  if (name === "phone-display") {
    vars.CLASSES = "phone-display";
    vars.HREF = vars.HREF || `tel:${vars.NUMBER}`;
    vars.DISPLAY = vars.DISPLAY || vars.NUMBER;
  }

  if (name === "nav-link") {
    vars.HREF = window.resolvePageHref(vars.HREF || "#");
    vars.LABEL = vars.LABEL || "";
  }

  if (name === "section-heading") {
    vars.EYEBROW = vars.EYEBROW || vars.LABEL_EN || "";
    vars.TITLE = vars.TITLE || vars.LABEL_JA || "";
  }

  if (name === "news-card") {
    vars.DATE = vars.DATE || "";
    vars.DATE_ISO = vars.DATE_ISO || vars.DATE;
    vars.TITLE = vars.TITLE || "";
    vars.HREF = window.resolvePageHref(vars.HREF || "#");
  }

  if (name === "faq-card") {
    vars.QUESTION = vars.QUESTION || "";
    vars.ANSWER = vars.ANSWER || "";
  }

  if (name === "badge") {
    vars.LABEL = vars.LABEL || "";
  }

  if (name === "image") {
    vars.SRC = vars.SRC || "";
    vars.ALT = vars.ALT || "";
  }

  if (name === "social-links") {
    vars.INSTAGRAM_HREF = vars.INSTAGRAM_HREF || "#";
    vars.FACEBOOK_HREF = vars.FACEBOOK_HREF || "#";
  }

  const template = await fetchText(src);
  element.outerHTML = applyTemplate(template, vars);
}

function buildFeatureCardHtml(element, vars) {
  const heading = getSlotContent(element, "heading") || vars.TITLE || "";
  const body = getSlotContent(element, "body") || vars.DESCRIPTION || "";
  const ctaHref = window.resolvePageHref(vars.CTA_HREF || "#");
  const ctaLabel = vars.CTA_LABEL || "";
  const cta = ctaLabel
    ? `<div data-component="button" data-variant="outline" data-label="${ctaLabel}" data-href="${ctaHref}"></div>`
    : "";

  return `<article class="feature-card js-fade-up" data-animate="card">
          <figure class="feature-card__media">
            <img src="${vars.IMAGE_SRC || ""}" alt="${vars.IMAGE_ALT || heading}" loading="lazy" />
          </figure>
          <div class="feature-card__body">
            <h3 class="feature-card__title">${heading}</h3>
            <p class="feature-card__description">${body}</p>
            ${cta}
          </div>
        </article>`;
}

function buildImageTextSectionHtml(element, vars) {
  const heading = getSlotContent(element, "heading");
  const body = getSlotContent(element, "body");
  const reverse = vars.REVERSE === "true";
  const contentFirst = `
          <div class="image-text-section__content js-fade-up">
            <p class="section-heading__eyebrow">${vars.EYEBROW || ""}</p>
            <h2 class="section-heading__title">${vars.TITLE || heading}</h2>
            <p class="image-text-section__description">${vars.DESCRIPTION || body}</p>
          </div>`;
  const media = `
          <figure class="image-text-section__media js-fade-in">
            <img src="${vars.IMAGE_SRC || ""}" alt="${vars.IMAGE_ALT || vars.TITLE || ""}" loading="lazy" />
          </figure>`;

  return `<section class="image-text-section" id="${vars.ID || ""}">
        <div class="container image-text-section__inner${reverse ? " image-text-section__inner--reverse" : ""}">
          ${reverse ? media + contentFirst : contentFirst + media}
        </div>
      </section>`;
}

function buildFullBleedBannerHtml(element, vars) {
  const heading = getSlotContent(element, "heading") || vars.TITLE || "";
  const body = getSlotContent(element, "body") || vars.DESCRIPTION || "";

  return `<section class="full-bleed-banner js-fade-in" id="${vars.ID || ""}">
        <img class="full-bleed-banner__image" src="${vars.IMAGE_SRC || ""}" alt="${vars.IMAGE_ALT || heading}" />
        <div class="full-bleed-banner__overlay">
          <div class="container">
            <p class="full-bleed-banner__eyebrow">${vars.EYEBROW || ""}</p>
            <h2 class="full-bleed-banner__title">${heading}</h2>
            <p class="full-bleed-banner__description">${body}</p>
          </div>
        </div>
      </section>`;
}

async function loadPattern(element) {
  const name = element.getAttribute("data-pattern");
  const vars = getTemplateVars(element);

  if (name === "header") {
    element.outerHTML = buildHeaderHtml(element, vars);
    return;
  }

  if (name === "footer") {
    element.outerHTML = buildFooterHtml(element, vars);
    return;
  }

  if (name === "feature-card") {
    element.outerHTML = buildFeatureCardHtml(element, vars);
    return;
  }

  if (name === "image-text-section") {
    element.outerHTML = buildImageTextSectionHtml(element, vars);
    return;
  }

  if (name === "full-bleed-banner") {
    element.outerHTML = buildFullBleedBannerHtml(element, vars);
    return;
  }

  throw new Error(`Unknown pattern: ${name}`);
}

async function loadSections() {
  const placeholders = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(placeholders).map(async (placeholder) => {
      const src = placeholder.getAttribute("data-include");
      placeholder.outerHTML = await fetchText(src);
    })
  );
}

async function loadPatterns() {
  let patterns = document.querySelectorAll("[data-pattern]");
  while (patterns.length > 0) {
    await Promise.all(Array.from(patterns).map((element) => loadPattern(element)));
    patterns = document.querySelectorAll("[data-pattern]");
  }
}

async function loadComponents() {
  let components = document.querySelectorAll("[data-component]");
  while (components.length > 0) {
    await Promise.all(Array.from(components).map((element) => loadComponent(element)));
    components = document.querySelectorAll("[data-component]");
  }
}

async function initPage() {
  await loadSections();

  const facility = await window.loadFacilityData();
  window.applyFacilityData(facility);

  const content = await window.loadContentData();
  window.applyContentData(content);

  await loadPatterns();
  window.applyPhoneDisplayData(facility);

  await loadComponents();

  if (!window.__SITE_BUILD__) {
    document.dispatchEvent(new CustomEvent("page:ready"));
  }
}

window.initPage = initPage;

if (!window.__SITE_BUILD__) {
  initPage();
}
