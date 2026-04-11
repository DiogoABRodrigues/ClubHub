import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";

const CHROMIUM_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

let cachedExecutablePath: string | undefined;

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

export async function launchBrowser() {
  return puppeteer.launch({
    args: chromium.args,
    executablePath: cachedExecutablePath ?? await getExecutablePath(),
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });
}

