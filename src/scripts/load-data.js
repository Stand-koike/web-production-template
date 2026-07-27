let facilityCache = null;
let contentCache = null;

function resolveAssetPath(pathValue) {
  if (!pathValue || !window.__ASSET_BASE__) {
    return pathValue;
  }

  if (pathValue.startsWith("../assets/")) {
    return `${window.__ASSET_BASE__}${pathValue.slice("../assets/".length)}`;
  }

  return pathValue;
}

function resolvePageHref(href) {
  if (!href || href.startsWith("#") || href.startsWith("tel:") || /^https?:\/\//.test(href)) {
    return href;
  }

  const pageFile = href.replace(/^pages\//, "");

  if (window.__SITE_BUILD__) {
    return pageFile;
  }

  if (window.__SRC_BASE__) {
    return pageFile;
  }

  return `pages/${pageFile}`;
}

function applyHeaderData(facility) {
  const header = document.querySelector('[data-pattern="header"]');
  if (!header) {
    return;
  }

  header.dataset.homeHref =
    window.__HOME_HREF__ ||
    (window.__SITE_BUILD__ && window.__SRC_BASE__
      ? "index.html"
      : window.__SRC_BASE__
        ? `${window.__SRC_BASE__}index.html`
        : facility.brand.homeHref);
  header.dataset.logoSrc = resolveAssetPath(facility.brand.logoSrc);
  header.dataset.logoAlt = facility.brand.name;
  header.dataset.logoAriaLabel = facility.brand.logoAriaLabel || facility.brand.name;
  header.dataset.ctaHref = facility.contact.phone.tel;
  header.dataset.ctaLabel = facility.header.ctaLabel;
}

function applyFooterData(facility) {
  const footer = document.querySelector('[data-pattern="footer"]');
  if (!footer) {
    return;
  }

  footer.dataset.logoSrc = resolveAssetPath(facility.brand.logoSrc);
  footer.dataset.logoAlt = facility.brand.name;
  footer.dataset.addressText = facility.contact.address;
  footer.dataset.phoneNumber = facility.contact.phone.display;
  footer.dataset.phoneTel = facility.contact.phone.tel;
  footer.dataset.bookingHref = facility.booking.href;
  footer.dataset.bookingLabel = facility.booking.label;
  footer.dataset.copyrightText = facility.footer.copyright;
  footer.dataset.localeText = facility.footer.locale || "";
  footer.dataset.instagramHref = facility.social?.instagram || "#";
  footer.dataset.facebookHref = facility.social?.facebook || "#";
}

function applyPhoneDisplayData(facility) {
  document.querySelectorAll('[data-component="phone-display"]').forEach((element) => {
    element.dataset.number = facility.contact.phone.display;
    element.dataset.href = facility.contact.phone.tel;
  });
}

async function loadFacilityData() {
  if (facilityCache) {
    return facilityCache;
  }

  const srcBase = window.__SRC_BASE__ || "";
  const response = await fetch(`${srcBase}data/facility.json`);
  if (!response.ok) {
    throw new Error("Failed to load: data/facility.json");
  }

  facilityCache = await response.json();
  return facilityCache;
}

async function loadContentData() {
  if (contentCache) {
    return contentCache;
  }

  const srcBase = window.__SRC_BASE__ || "";
  const response = await fetch(`${srcBase}data/content.json`);
  if (!response.ok) {
    throw new Error("Failed to load: data/content.json");
  }

  contentCache = await response.json();
  return contentCache;
}

function applyNavGroupBind(bindName, itemsJson) {
  const selector = `[data-content-bind="${bindName}"]`;

  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.items = itemsJson;
  });

  document.querySelectorAll("template").forEach((template) => {
    template.content.querySelectorAll(selector).forEach((element) => {
      element.dataset.items = itemsJson;
    });
  });
}

function applyNavGroupData(content) {
  if (!content.navigation) {
    return;
  }

  const items = content.navigation.items.map((item) => ({
    ...item,
    href: resolvePageHref(item.href),
  }));
  const itemsJson = JSON.stringify(items);

  applyNavGroupBind("nav-header", itemsJson);
  applyNavGroupBind("nav-footer", itemsJson);
}

function applyHeroData(content) {
  const hero = document.querySelector('[data-content-bind="hero"]');
  if (!hero || !content.hero) {
    return;
  }

  const data = content.hero;
  const image = hero.querySelector('[data-bind="hero-image"]');
  const eyebrow = hero.querySelector('[data-bind="hero-eyebrow"]');
  const title = hero.querySelector('[data-bind="hero-title"]');
  const description = hero.querySelector('[data-bind="hero-description"]');
  const cta = hero.querySelector('[data-bind="hero-cta"]');

  if (image) {
    image.src = resolveAssetPath(data.image);
    image.alt = data.title;
  }
  if (eyebrow) eyebrow.textContent = data.eyebrow;
  if (title) title.textContent = data.title;
  if (description) description.textContent = data.description;
  if (cta) {
    cta.dataset.label = data.ctaLabel;
    cta.dataset.href = resolvePageHref(data.ctaHref);
  }
}

function applyIntroData(content) {
  const intro = document.querySelector('[data-content-bind="intro"]');
  if (!intro || !content.intro) {
    return;
  }

  const data = content.intro;
  const eyebrow = intro.querySelector('[data-bind="intro-eyebrow"]');
  const title = intro.querySelector('[data-bind="intro-title"]');
  const description = intro.querySelector('[data-bind="intro-description"]');
  const image = intro.querySelector('[data-bind="intro-image"]');

  if (eyebrow) {
    eyebrow.dataset.eyebrow = data.eyebrow;
    eyebrow.dataset.title = data.title;
  }
  if (title) title.textContent = data.title;
  if (description) description.textContent = data.description;
  if (image) {
    image.src = resolveAssetPath(data.image);
    image.alt = data.title;
  }
}

function applyNewsData(content) {
  const news = document.querySelector('[data-content-bind="news"]');
  if (!news || !content.news) {
    return;
  }

  const data = content.news;
  const heading = news.querySelector('[data-bind="news-heading"]');
  const list = news.querySelector('[data-bind="news-list"]');

  if (heading) {
    heading.dataset.eyebrow = data.eyebrow;
    heading.dataset.title = data.title;
  }

  if (list) {
    list.innerHTML = data.items
      .map(
        (item) => `<div
            data-component="news-card"
            data-animate="card"
            data-date="${item.date}"
            data-date-iso="${item.dateIso || item.date}"
            data-title="${item.title}"
            data-href="${resolvePageHref(item.href)}"
          ></div>`
      )
      .join("\n");
  }
}

function applyFaqData(content) {
  const faq = document.querySelector('[data-content-bind="faq"]');
  if (!faq || !content.faq) {
    return;
  }

  const data = content.faq;
  const heading = faq.querySelector('[data-bind="faq-heading"]');
  const list = faq.querySelector('[data-bind="faq-list"]');

  if (heading) {
    heading.dataset.eyebrow = data.eyebrow;
    heading.dataset.title = data.title;
  }

  if (list) {
    list.innerHTML = data.items
      .map(
        (item) => `<div
            data-component="faq-card"
            data-animate="card"
            data-question="${item.question}"
            data-answer="${item.answer}"
          ></div>`
      )
      .join("\n");
  }
}

function applyGalleryData(content) {
  const gallery = document.querySelector('[data-content-bind="gallery"]');
  if (!gallery || !content.gallery) {
    return;
  }

  const data = content.gallery;
  const heading = gallery.querySelector('[data-bind="gallery-heading"]');
  const grid = gallery.querySelector('[data-bind="gallery-grid"]');

  if (heading) {
    heading.dataset.eyebrow = data.eyebrow;
    heading.dataset.title = data.title;
  }

  if (grid) {
    grid.innerHTML = data.items
      .map(
        (item) => `<figure class="gallery__item js-fade-up" data-animate="card">
          <img class="responsive-image" src="${resolveAssetPath(item.src)}" alt="${item.alt}" loading="lazy" />
        </figure>`
      )
      .join("\n");
  }
}

function applyFinalCtaData(content) {
  const finalCta = document.querySelector('[data-content-bind="final-cta"]');
  if (!finalCta || !content.finalCta) {
    return;
  }

  const data = content.finalCta;
  const title = finalCta.querySelector('[data-bind="final-cta-title"]');
  const description = finalCta.querySelector('[data-bind="final-cta-description"]');
  const cta = finalCta.querySelector('[data-bind="final-cta-button"]');

  if (title) title.textContent = data.title;
  if (description) description.textContent = data.description;
  if (cta) {
    cta.dataset.label = data.ctaLabel;
    cta.dataset.href = resolvePageHref(data.ctaHref);
  }
}

function applyStayData(content) {
  const stay = document.querySelector('[data-content-bind="stay"]');
  if (!stay || !content.stay) {
    return;
  }

  const data = content.stay;
  const heading = stay.querySelector('[data-bind="stay-heading"]');
  const grid = stay.querySelector('[data-bind="stay-grid"]');

  if (heading) {
    heading.dataset.eyebrow = data.eyebrow;
    heading.dataset.title = data.title;
  }

  if (grid) {
    grid.innerHTML = (data.features || [])
      .map(
        (feature) => `<div
            data-pattern="feature-card"
            data-image-src="${resolveAssetPath(feature.image)}"
            data-image-alt="${feature.alt || feature.title}"
            data-title="${feature.title}"
            data-description="${feature.description}"
            data-cta-label="${feature.ctaLabel || ""}"
            data-cta-href="${resolvePageHref(feature.ctaHref || "#")}"
          >
            <template data-slot="heading">${feature.title}</template>
            <template data-slot="body">${feature.description}</template>
          </div>`
      )
      .join("\n");
  }
}

function applyAboutData(content) {
  const about = document.querySelector('[data-content-bind="about"]');
  if (!about || !content.about) {
    return;
  }

  const data = content.about;
  about.outerHTML = `<div
      data-pattern="image-text-section"
      data-id="about"
      data-page-hero="true"
      data-eyebrow="${data.eyebrow}"
      data-title="${data.title}"
      data-description="${data.description}"
      data-image-src="${resolveAssetPath(data.image)}"
      data-image-alt="${data.title}"
      data-reverse="${data.reverse ? "true" : "false"}"
    ></div>`;
}

function applyBridgeData(content) {
  const bridge = document.querySelector('[data-content-bind="bridge"]');
  if (!bridge || !content.bridge) {
    return;
  }

  const data = content.bridge;
  bridge.outerHTML = `<div
      data-pattern="full-bleed-banner"
      data-id="bridge"
      data-eyebrow="${data.eyebrow}"
      data-title="${data.title}"
      data-description="${data.description}"
      data-image-src="${resolveAssetPath(data.image)}"
      data-image-alt="${data.title}"
    >
      <template data-slot="heading">${data.title}</template>
      <template data-slot="body">${data.description}</template>
    </div>`;
}

function applyAccessPageData(content) {
  const access = document.querySelector('[data-content-bind="access-page"]');
  if (!access || !content.accessPage) {
    return;
  }

  const data = content.accessPage;
  access.outerHTML = `<div
      data-pattern="image-text-section"
      data-id="access"
      data-page-hero="true"
      data-eyebrow="${data.eyebrow}"
      data-title="${data.title}"
      data-description="${data.description}"
      data-image-src="${resolveAssetPath(data.image)}"
      data-image-alt="${data.title}"
      data-reverse="true"
    ></div>`;
}

function applyRoomsPageData(content) {
  const rooms = document.querySelector('[data-content-bind="rooms-page"]');
  if (!rooms || !content.roomsPage) {
    return;
  }

  const data = content.roomsPage;
  const heading = rooms.querySelector('[data-bind="rooms-heading"]');
  const grid = rooms.querySelector('[data-bind="rooms-grid"]');

  if (heading) {
    heading.dataset.eyebrow = data.eyebrow;
    heading.dataset.title = data.title;
  }

  if (grid) {
    grid.innerHTML = (data.features || [])
      .map(
        (feature) => `<div
            data-pattern="feature-card"
            data-image-src="${resolveAssetPath(feature.image)}"
            data-image-alt="${feature.alt || feature.title}"
            data-title="${feature.title}"
            data-description="${feature.description}"
            data-cta-label="${feature.ctaLabel || ""}"
            data-cta-href="${resolvePageHref(feature.ctaHref || "#")}"
          >
            <template data-slot="heading">${feature.title}</template>
            <template data-slot="body">${feature.description}</template>
          </div>`
      )
      .join("\n");
  }
}

function applyFacilityData(facility) {
  applyHeaderData(facility);
  applyFooterData(facility);
  applyPhoneDisplayData(facility);
}

function applyContentData(content) {
  applyNavGroupData(content);
  applyHeroData(content);
  applyIntroData(content);
  applyStayData(content);
  applyAboutData(content);
  applyBridgeData(content);
  applyAccessPageData(content);
  applyRoomsPageData(content);
  applyNewsData(content);
  applyFaqData(content);
  applyGalleryData(content);
  applyFinalCtaData(content);
}

window.loadFacilityData = loadFacilityData;
window.applyFacilityData = applyFacilityData;
window.applyPhoneDisplayData = applyPhoneDisplayData;
window.loadContentData = loadContentData;
window.applyContentData = applyContentData;
window.resolvePageHref = resolvePageHref;
window.resolveAssetPath = resolveAssetPath;
