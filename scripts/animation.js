import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * モーション定数（ここだけ編集すれば全体の調子が変わる）
 * 詳細は docs/animation-spec.md
 */
export const MOTION = {
  duration: 0.9,
  durationSlow: 1.2,
  y: 24,
  stagger: 0.12,
  staggerHero: 0.15,
  ease: "power2.out",
  start: "top 85%",
  once: true,
  labelScale: 0.98,
};

let animationsInitialized = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasDevLoaders() {
  return Boolean(document.querySelector('script[src*="load-sections.js"]'));
}

/**
 * ページ種別: body[data-page="top" | "about" | ...]
 */
export function getPageId() {
  return document.body?.dataset?.page || "";
}

/**
 * 高さ変化 UI（アコーディオン等）があるページ。
 * body[data-motion="height-ui"] で明示する（ページ名ハードコード禁止）。
 * このときセクション全体の ScrollTrigger reveal はスキップし Hero のみ。
 */
export function isHeightUiPage() {
  return document.body?.dataset?.motion === "height-ui";
}

/** 高さ変更後に呼ぶ（アコーディオン開閉など） */
export function refreshScrollTriggers() {
  if (typeof ScrollTrigger === "undefined") return;
  ScrollTrigger.refresh();
}

/** Scroll reveal: fade-up */
export function fadeUp(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;

  gsap.from(els, {
    y: options.y ?? MOTION.y,
    opacity: 0,
    duration: options.duration ?? MOTION.duration,
    ease: options.ease ?? MOTION.ease,
    stagger: options.stagger ?? 0,
    scrollTrigger: {
      trigger: options.trigger || els[0],
      start: options.start ?? MOTION.start,
      once: options.once ?? MOTION.once,
    },
  });
}

/** Opacity only */
export function fadeIn(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;

  gsap.from(els, {
    opacity: 0,
    duration: options.duration ?? MOTION.durationSlow,
    ease: options.ease ?? MOTION.ease,
    stagger: options.stagger ?? 0,
    scrollTrigger: {
      trigger: options.trigger || els[0],
      start: options.start ?? MOTION.start,
      once: options.once ?? MOTION.once,
    },
  });
}

/** (1) Hero: ロード時 fade-up + stagger */
function initHero() {
  document.querySelectorAll('[data-animate="hero"]').forEach((hero) => {
    const kids = Array.from(hero.children);
    if (!kids.length) return;

    gsap.from(kids, {
      opacity: 0,
      y: MOTION.y,
      duration: MOTION.durationSlow,
      stagger: MOTION.staggerHero,
      ease: MOTION.ease,
    });
  });
}

/** (2) main 直下ブロックの scroll reveal（グリッド付きは見出しのみ） */
function initMainReveal() {
  document.querySelectorAll("main > *").forEach((block) => {
    if (block.querySelector('[data-animate="hero"]')) return;
    if (block.matches('[data-animate="hero"]')) return;

    const grid = block.querySelector('[data-animate="stagger-grid"]');
    if (grid) {
      const heading =
        block.querySelector('[data-animate="reveal"]') ||
        block.querySelector(".js-fade-up") ||
        block.querySelector(".section-heading, h1, h2");
      if (heading) {
        fadeUp(heading, { trigger: heading });
      }
      return;
    }

    const explicit = block.querySelector('[data-animate="reveal"]');
    if (explicit) {
      fadeUp(explicit, { trigger: block });
      return;
    }

    fadeUp(block, { trigger: block });
  });
}

/** (3) グリッド子要素 stagger */
function initStaggerGrids() {
  document.querySelectorAll('[data-animate="stagger-grid"]').forEach((grid) => {
    const cards = grid.querySelectorAll(':scope > [data-animate="card"], :scope > *');
    if (!cards.length) return;

    fadeUp(cards, {
      trigger: grid,
      stagger: MOTION.stagger,
    });
  });
}

/** (4) label の弱い scale */
function initLabels() {
  document.querySelectorAll('[data-animate="label"]').forEach((label) => {
    gsap.from(label, {
      opacity: 0,
      scale: MOTION.labelScale,
      duration: MOTION.duration,
      ease: MOTION.ease,
      scrollTrigger: {
        trigger: label,
        start: MOTION.start,
        once: MOTION.once,
      },
    });
  });
}

/**
 * ページ種別ごとの init（body[data-page] / data-motion で分岐）。
 * height-ui: Hero のみ（セクション ST fade は高さずれで opacity:0 残留しやすい）
 */
function initByPage() {
  initHero();

  // アコーディオン等: セクション全体 reveal / stagger を使わない
  if (isHeightUiPage()) {
    return;
  }

  // top / 通常下層（about, rooms, access など）
  initMainReveal();
  initStaggerGrids();
  initLabels();
}

export function initAnimations() {
  if (animationsInitialized) return;
  if (prefersReducedMotion()) return;
  if (typeof gsap === "undefined") return;

  animationsInitialized = true;
  initByPage();
}

function bootAnimations() {
  try {
    initAnimations();
  } catch (error) {
    console.warn("[animation] init skipped:", error);
  }
}

/**
 * 開発: load-sections.js あり → page:ready
 * 本番 dist: loader なし → DOMContentLoaded / 即時
 * page:ready のみだと dist でアニメが動かない
 */
function scheduleBoot() {
  if (hasDevLoaders()) {
    document.addEventListener("page:ready", bootAnimations, { once: true });
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAnimations, { once: true });
  } else {
    bootAnimations();
  }
}

scheduleBoot();
