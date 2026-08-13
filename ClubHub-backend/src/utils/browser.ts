import puppeteer, { Browser } from "puppeteer";

let sharedBrowser: Browser | null = null;

/** Não descarrega nem inicia Chrome no boot do Render. */
export async function warmupBrowser() {
  console.log("Chrome preparado no build; inicia no primeiro scrape.");
}

async function createBrowser(): Promise<Browser> {
  return puppeteer.launch({
    args: [
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--blink-settings=imagesEnabled=false",
    ],
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });
}

export async function getSharedBrowser(): Promise<Browser> {
  if (sharedBrowser?.connected) return sharedBrowser;
  console.log("A iniciar browser partilhado...");
  sharedBrowser = await createBrowser();
  return sharedBrowser;
}

export async function closeSharedBrowser(): Promise<void> {
  if (!sharedBrowser) return;
  await sharedBrowser.close();
  sharedBrowser = null;
  console.log("Browser partilhado fechado.");
}

export async function launchBrowser(): Promise<Browser> {
  return createBrowser();
}
