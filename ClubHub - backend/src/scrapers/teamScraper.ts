import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import Player from "../models/Player";

export async function scrapeTeamPlayers() {
  const browser = await puppeteer.launch({
    headless: false, // Manter false para debugging
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  await page.goto("https://www.zerozero.pt/equipa/adecas/18231", {
    waitUntil: "networkidle2",
    timeout: 30000
  });

  // 👇 aceitar cookies
  try {
    await page.waitForSelector("button", { timeout: 5000 });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const acceptBtn = buttons.find(btn =>
        btn.textContent?.includes("Aceitar") || btn.textContent?.includes("Aceitar todos")
      );
      if (acceptBtn) acceptBtn.click();
    });
  } catch (err) {
    console.log("Cookie button not found or already accepted");
  }

  // ⏳ Aguardar o carregamento do conteúdo principal
  try {
    // Aguardar pela seção de jogadores
    await page.waitForSelector("#team_squad, .team-squad, .squad-container", { timeout: 10000 });
    
    // Scroll para carregar conteúdo lazy-load
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await new Promise((r) => setTimeout(r, 2000));
    
    // Aguardar elementos específicos dos jogadores
    await page.waitForFunction(
      () => {
        const players = document.querySelectorAll('.staff, .player-item, .squad-player, [class*="player"]');
        return players.length > 0;
      },
      { timeout: 10000 }
    );
    
  } catch (err) {
    console.log("Timeout waiting for players, trying to continue...");
  }

  // Aguardar mais um pouco para garantir
  await new Promise((r) => setTimeout(r, 3000));

  // Obter o HTML após todo o carregamento
  const html = await page.content();
  
  // Debug: tirar screenshot para ver o estado da página
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  
  await browser.close();

  const $ = cheerio.load(html);

  const players: any[] = [];

  // Verificar se encontrou a seção do plantel
  const squadSection = $("#team_squad");
  if (squadSection.length === 0) {
    console.log("#team_squad não encontrado");
    console.log("Classes disponíveis no body:", $("body").attr("class"));
  } else {
    console.log("#team_squad encontrado");
  }

  // Método 1: Procurar por staff items
  $(".staff").each((_, playerEl) => {
    const number = $(playerEl).find(".number").text().trim();
    const nameEl = $(playerEl).find(".name a");
    const name = nameEl.length ? nameEl.text().trim() : $(playerEl).find(".name").text().trim();
    
    // 🔥 NOVO: Extrair idade
    let age = null;
    const ageText = $(playerEl).find(".name span").text().trim();

    if (ageText) {
    const match = ageText.match(/\d+/);
    if (match) age = parseInt(match[0]);
    }
    if (ageText) {
      const ageMatch = ageText.match(/\d+/);
      if (ageMatch) age = parseInt(ageMatch[0]);
    }
    
    // 🔥 NOVO: Extrair URL da foto
    let photoUrl = null;

    const style = $(playerEl).find(".photo").attr("style");

    if (style) {
    const match = style.match(/url\(['"]?(.*?)['"]?\)/);
    if (match) {
        photoUrl = match[1];
    }
    }
    
    // Tentar encontrar posição pelo elemento pai
    let position = "";
    const parentSection = $(playerEl).closest(".innerbox");
    if (parentSection.length) {
      position = parentSection.find(".section").text().trim();
    }
    
    if (name && name !== "") {
      players.push({
        name,
        position: position || "Unknown",
        number: number && number !== "-" ? parseInt(number) : null,
        age: age,
        photoUrl: photoUrl
      });
    }
  });

  // Método 2: Se não encontrou com .staff, tentar outros seletores
  if (players.length === 0) {
    console.log("Tentando seletores alternativos...");
    
    $("tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 2) {
        const nameCell = $(cells[1]).find("a").first();
        const name = nameCell.text().trim();
        const number = $(cells[0]).text().trim();
        
        // 🔥 NOVO: Tentar extrair idade da linha
        let age = null;
        if (cells.length >= 4) {
          const ageText = $(cells[3]).text().trim();
          const ageMatch = ageText.match(/\d+/);
          if (ageMatch) age = parseInt(ageMatch[0]);
        }
        
        // 🔥 NOVO: Extrair foto do link
        let photoUrl = null;
        const imgInCell = $(cells[1]).find("img");
        if (imgInCell.length) {
          photoUrl = imgInCell.attr("src") || imgInCell.attr("data-src");
          if (photoUrl && !photoUrl.startsWith("http")) {
            photoUrl = "https://www.zerozero.pt" + photoUrl;
          }
        }
        
        if (name && name !== "" && !name.includes("Guarda") && !name.includes("Defesa") && !name.includes("Médio") && !name.includes("Avançado")) {
          players.push({
            name,
            position: "Unknown",
            number: number && number !== "-" ? parseInt(number) : null,
            age: age,
            photoUrl: photoUrl
          });
        }
      }
    });
  }

  // Método 3: Procurar por qualquer link que pareça nome de jogador
  if (players.length === 0) {
    console.log("Procurando por links de jogadores...");
    
    $("a[href*='/jogador/']").each((_, link) => {
      const name = $(link).text().trim();
      
      // 🔥 NOVO: Tentar encontrar foto associada
      let photoUrl = null;
      const parent = $(link).closest("div, li, tr");
      const imgInParent = parent.find("img");
      if (imgInParent.length) {
        photoUrl = imgInParent.attr("src") || imgInParent.attr("data-src");
        if (photoUrl && !photoUrl.startsWith("http")) {
          photoUrl = "https://www.zerozero.pt" + photoUrl;
        }
      }
      
      // 🔥 NOVO: Tentar encontrar idade associada
      let age = null;
      const ageText = parent.find(".age, .idade, .year, .data-nascimento").text().trim();
      if (ageText) {
        const ageMatch = ageText.match(/\d+/);
        if (ageMatch) age = parseInt(ageMatch[0]);
      }
      
      if (name && name.length > 2 && name.length < 50) {
        // Evitar duplicatas
        if (!players.some(p => p.name === name)) {
          players.push({
            name,
            position: "Unknown",
            number: null,
            age: age,
            photoUrl: photoUrl
          });
        }
      }
    });
  }

  // 📸 Método 4: Download das fotos (opcional)
  if (players.length > 0 && players.some(p => p.photoUrl)) {
    for (const player of players) {
      if (player.photoUrl) {
        console.log(`  - ${player.name}: ${player.photoUrl}`);
      }
    }
  }

  console.log(`\n✅ Total de jogadores encontrados: ${players.length}`);

  return players;
}

// 🔧 Função auxiliar para baixar as fotos (opcional)
export async function downloadPlayerPhotos(players: any[], outputDir: string) {
  const fs = require('fs').promises;
  const path = require('path');
  const https = require('https');
  
  // Criar diretório se não existir
  await fs.mkdir(outputDir, { recursive: true });
  
  for (const player of players) {
    if (player.photoUrl) {
      const fileName = `${player.name.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      const filePath = path.join(outputDir, fileName);
      
      try {
        await new Promise((resolve, reject) => {
          https.get(player.photoUrl, (response: any) => {
            if (response.statusCode === 200) {
              const chunks: any[] = [];
              response.on('data', (chunk: any) => chunks.push(chunk));
              response.on('end', () => {
                fs.writeFile(filePath, Buffer.concat(chunks))
                  .then(resolve)
                  .catch(reject);
              });
            } else {
              reject(new Error(`Failed to download: ${response.statusCode}`));
            }
          }).on('error', reject);
        });
      } catch (error : any) {
        console.log(`❌ Erro ao baixar foto de ${player.name}:`, error.message);
      }
    }
  }
}

export async function savePlayers(players: any[]) {
  await Player.destroy({});

  await Player.bulkCreate(players);
}