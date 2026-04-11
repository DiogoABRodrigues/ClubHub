import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";

const CHROMIUM_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function launchBrowser() {
  const isProduction = process.env.NODE_ENV === "production";

  return puppeteer.launch({
    args: chromium.args,
    executablePath: isProduction
      ? await chromium.executablePath(CHROMIUM_URL)
      : undefined,
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });
}