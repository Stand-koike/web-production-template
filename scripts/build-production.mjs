import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const MANIFEST_PATH = path.join(SRC, "templates", "web-production", "site.manifest.json");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function runInBrowserScope(window, document, code) {
  const runner = new Function("window", "document", code);
  runner(window, document);
}

function createFetch(baseDir) {
  const srcRoot = path.normalize(SRC);

  return async (url) => {
    const filePath = path.normalize(path.join(baseDir, url));

    if (!filePath.startsWith(srcRoot)) {
      throw new Error(`Fetch resolves outside src: ${url} (from ${baseDir})`);
    }

    const body = await fs.readFile(filePath, "utf8");

    return {
      ok: true,
      async text() {
        return body;
      },
      async json() {
        return JSON.parse(body);
      },
    };
  };
}

function removeScriptTags(html, scriptPaths) {
  let output = html;

  for (const scriptPath of scriptPaths) {
    for (const variant of [scriptPath, `../${scriptPath}`]) {
      const pattern = new RegExp(`<script src="${variant.replace(/\./g, "\\.")}"><\\/script>\\s*`, "g");
      output = output.replace(pattern, "");
    }
  }

  return output;
}

function applyAssetPaths(html, manifest) {
  let output = html;

  if (manifest.output.assetPathFromPages) {
    output = output.replaceAll(manifest.output.assetPathFromPages, manifest.output.assetPathTo);
  }

  output = output.replaceAll(manifest.output.assetPathFrom, manifest.output.assetPathTo);

  return output;
}

function applyPageRelativePaths(html, isIndex) {
  if (isIndex) {
    return html;
  }

  // 下層ページは dist/ 直下へフラット出力するため、../styles|scripts を直す。
  // ページ固有 JS を足すときも個別置換は不要（この一括置換で足りる）。
  // 必須なのは: (1) HTML に script タグ (2) manifest.output.scripts への登録（コピー用）
  return html
    .replaceAll("../styles/", "styles/")
    .replaceAll('../styles/', "styles/")
    .replaceAll("../scripts/", "scripts/")
    .replaceAll('../scripts/', "scripts/");
}

async function collectPageEntries(manifest) {
  const entries = [
    {
      sourcePath: path.join(SRC, manifest.source.index),
      outputName: "index.html",
      pageDir: SRC,
      isIndex: true,
    },
  ];

  const pagesDir = path.join(SRC, "pages");

  try {
    const files = await fs.readdir(pagesDir);

    for (const file of files.sort()) {
      if (!file.endsWith(".html")) {
        continue;
      }

      entries.push({
        sourcePath: path.join(pagesDir, file),
        outputName: file,
        pageDir: pagesDir,
        isIndex: false,
      });
    }
  } catch {
    // pages/ is optional until subpages are added.
  }

  return entries;
}

async function buildPage(entry, manifest, facility, loadDataJs, loadSectionsJs) {
  try {
    const html = await fs.readFile(entry.sourcePath, "utf8");
    const { document, window } = parseHTML(html);

    window.__SITE_BUILD__ = true;
    window.fetch = createFetch(entry.pageDir);

    if (!entry.isIndex) {
      window.__SRC_BASE__ = "../";
      window.__ASSET_BASE__ = "../../assets/";
    }

    if (!window.CustomEvent) {
      window.CustomEvent = class SiteCustomEvent extends Event {
        constructor(type, params = {}) {
          super(type, params);
          this.detail = params.detail;
        }
      };
    }

    runInBrowserScope(window, document, loadDataJs);
    runInBrowserScope(window, document, loadSectionsJs);

    if (typeof window.initPage !== "function") {
      throw new Error("initPage is not available after loading runtime scripts");
    }

    await window.initPage();

    let output = `<!doctype html>\n${document.documentElement.outerHTML}`;
    output = removeScriptTags(output, manifest.output.removeScripts);
    output = applyAssetPaths(output, manifest);
    output = applyPageRelativePaths(output, entry.isIndex);

    if (entry.isIndex) {
      const title = facility.brand.name;
      output = output.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    }

    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to build ${entry.outputName}: ${message}`);
  }
}

async function removeDirectory(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    await fs.copyFile(sourcePath, destinationPath);
  }
}

async function writeThemeCss(facility, distDir) {
  if (!facility.theme) {
    return;
  }

  const theme = facility.theme;
  const css = `:root {
  --color-primary: ${theme.primary};
  --color-primary-dark: ${theme.primaryDark};
  --color-accent: ${theme.accent};
  --color-surface: ${theme.surface};
  --color-surface-muted: ${theme.surfaceMuted};
  --color-text: ${theme.text};
  --color-text-muted: ${theme.textMuted};
  --color-border: ${theme.border};
}
`;

  const stylesDir = path.join(distDir, "styles");
  await fs.mkdir(stylesDir, { recursive: true });
  await fs.writeFile(path.join(stylesDir, "theme.css"), css, "utf8");
}

async function buildSite() {
  const manifest = await readJson(MANIFEST_PATH);
  const facility = await readJson(path.join(SRC, manifest.data.facility));
  const distDir = path.join(ROOT, manifest.output.dir);
  const pageEntries = await collectPageEntries(manifest);

  const loadDataJs = await fs.readFile(path.join(SRC, "scripts/load-data.js"), "utf8");
  const loadSectionsJs = await fs.readFile(path.join(SRC, "scripts/load-sections.js"), "utf8");

  await fs.mkdir(distDir, { recursive: true });
  await writeThemeCss(facility, distDir);

  for (const entry of pageEntries) {
    const output = await buildPage(entry, manifest, facility, loadDataJs, loadSectionsJs);

    if (!output.includes("scripts/animation.js")) {
      throw new Error(
        `Failed to build ${entry.outputName}: scripts/animation.js is missing from output HTML`
      );
    }

    const unresolvedPlaceholders = output.match(/\{\{[A-Z0-9_]+\}\}/g);
    if (unresolvedPlaceholders?.length) {
      throw new Error(
        `Failed to build ${entry.outputName}: unresolved placeholders ${[...new Set(unresolvedPlaceholders)].join(", ")}`
      );
    }

    const outputPath = path.join(distDir, entry.outputName);
    await fs.writeFile(outputPath, output, "utf8");
    console.log(`Built ${outputPath}`);
  }

  for (const scriptPath of manifest.output.scripts) {
    const outputScriptPath = path.join(distDir, scriptPath);
    await fs.mkdir(path.dirname(outputScriptPath), { recursive: true });
    await fs.copyFile(path.join(SRC, scriptPath), outputScriptPath);
  }

  for (const stylePath of manifest.output.styles ?? []) {
    const outputStylePath = path.join(distDir, stylePath);
    await fs.mkdir(path.dirname(outputStylePath), { recursive: true });
    await fs.copyFile(path.join(SRC, stylePath), outputStylePath);
  }

  const assetsSource = path.join(ROOT, "assets");
  const assetsDest = path.join(distDir, "assets");

  try {
    await fs.access(assetsSource);
    await removeDirectory(assetsDest);
    await copyDirectory(assetsSource, assetsDest);
  } catch {
    // Optional until image assets are added at project root.
  }

  await fs.writeFile(path.join(distDir, ".nojekyll"), "", "utf8");

  console.log("Build complete.");
}

buildSite().catch((error) => {
  console.error("Build failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
