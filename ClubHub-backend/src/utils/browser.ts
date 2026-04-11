import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium-min";

const CHROMIUM_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

let cachedExecutablePath: string | undefined;
let sharedBrowser: Browser | null = null;

async function getExecutablePath(): Promise<string | undefined> {
  if (process.env.NODE_ENV !== "production") return undefined;
  if (!cachedExecutablePath) {
    cachedExecutablePath = await chromium.executablePath(CHROMIUM_URL);
  }
  return cachedExecutablePath;
}

export async function warmupBrowser() {
  if (process.env.NODE_ENV !== "production") return;
  console.log("⏳ A descarregar Chromium...");
  cachedExecutablePath = await chromium.executablePath(CHROMIUM_URL);
  console.log("✅ Chromium pronto:", cachedExecutablePath);
}

async function createBrowser(): Promise<Browser> {
  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--disable-dev-shm-usage",   // evita crashes por falta de memória partilhada
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--blink-settings=imagesEnabled=false", // não carrega imagens → muito mais rápido
    ],
    executablePath: cachedExecutablePath ?? (await getExecutablePath()),
    headless: true,
    defaultViewport: { width: 1280, height: 800 }, // viewport menor → menos memória
  });
}

export async function getSharedBrowser(): Promise<Browser> {
  if (sharedBrowser && sharedBrowser.connected) {
    return sharedBrowser;
  }
  console.log("🚀 A iniciar browser partilhado...");
  sharedBrowser = await createBrowser();
  return sharedBrowser;
}

export async function closeSharedBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
    console.log("🔒 Browser partilhado fechado.");
  }
}

export async function launchBrowser(): Promise<Browser> {
  return createBrowser();
}