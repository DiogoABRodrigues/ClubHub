import * as cheerio from "cheerio";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/models/Match", () => ({ default: {} }));
vi.mock("../../src/models/Competition", () => ({ default: {} }));
vi.mock("../../src/models/Season", () => ({ default: {} }));
vi.mock("../../src/models/Player", () => ({ default: {} }));
vi.mock("../../src/models/Lineup", () => ({ default: {} }));
vi.mock("../../src/models/MatchEvent", () => ({ default: {} }));
vi.mock("../../src/utils/browser", () => ({ getSharedBrowser: vi.fn() }));
vi.mock("../../src/services/cache.service", () => ({ default: {} }));
import {
  parseFormations,
  parseHeaderGoals,
} from "../../src/scrapers/matchScraper";

const player = (
  name: string,
  externalId: number,
  events = "",
) => `
  <div class="player">
    <div class="name"><a href="/jogador/${name.toLowerCase()}/${externalId}">${name}</a></div>
    <div class="events">${events}</div>
  </div>`;

describe("matchScraper formations", () => {
  it("distingue um golo de penálti de um golo normal", () => {
    const $ = cheerio.load(`
      <div class="match-header-team left">
        <div class="match-header-team-name"><a>Adversário</a></div>
      </div>
      <div class="match-header-team right">
        <div class="match-header-team-name"><a>ADECAS</a></div>
      </div>
      <div class="match-header-scorers right">
        <a href="/jogador/scorer/401">Scorer</a><span class="time">76' 82' (g.p.)</span>
      </div>
    `);

    expect(parseHeaderGoals($, "Adecas")).toEqual([
      expect.objectContaining({
        type: "goal",
        minute: 76,
        penaltyScored: null,
      }),
      expect.objectContaining({
        type: "goal",
        minute: 82,
        penaltyScored: true,
      }),
    ]);
  });

  it("extrai amarelos e emparelha substituições por equipa e minuto", () => {
    const $ = cheerio.load(`
      <div id="game_report">
        <div class="zz-tpl-row game_report">
          <div class="zz-tpl-col">
            <div class="subtitle">Adversário</div>
            ${player(
              "Opponent Starter",
              901,
              '<span title="Amarelos">R</span><div>10\'</div><span class="icn_zerozero grey">8</span><div>53\'</div>',
            )}
          </div>
          <div class="zz-tpl-col">
            <div class="subtitle">ADECAS</div>
            ${player(
              "Starter One",
              101,
              '<span title="Amarelos">R</span><div>20\'</div><span class="icn_zerozero grey">8</span><div>66\'</div>',
            )}
            ${player(
              "Starter Two",
              102,
              '<span title="Amarelos" class="icn_zerozero yellow">R</span><div>30\'</div><span title="Vermelhos" class="icn_zerozero yellow">S</span><span class="icn_zerozero red">R</span><div>34\'</div><span class="icn_zerozero grey">8</span><div>66\'</div>',
            )}
            ${player(
              "Direct Red",
              103,
              '<span title="Vermelhos" class="icn_zerozero red">R</span><div>40\'</div>',
            )}
          </div>
        </div>
        <div class="zz-tpl-row game_report">
          <div class="zz-tpl-col">
            ${player(
              "Opponent Substitute",
              902,
              '<span title="Entrou">7</span><div>53\'</div>',
            )}
          </div>
          <div class="zz-tpl-col">
            ${player(
              "Substitute One",
              201,
              '<span title="Entrou">7</span><div>66\'</div><span title="Amarelos">R</span><div>70\'</div>',
            )}
            ${player(
              "Substitute Two",
              202,
              '<span title="Entrou">7</span><div>66\'</div>',
            )}
            ${player(
              "Unused Substitute",
              203,
              '<span title="Amarelos">R</span><div>80\'</div>',
            )}
          </div>
        </div>
      </div>
    `);

    const formations = parseFormations($, "Adecas");

    expect(formations?.lineup).toEqual([
      { externalId: 101, name: "Starter One", isStarting: true },
      { externalId: 102, name: "Starter Two", isStarting: true },
      { externalId: 103, name: "Direct Red", isStarting: true },
      { externalId: 201, name: "Substitute One", isStarting: false },
      { externalId: 202, name: "Substitute Two", isStarting: false },
      { externalId: 203, name: "Unused Substitute", isStarting: false },
    ]);

    expect(formations?.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "yellow_card",
          minute: 10,
          isOpponent: true,
          externalId: null,
        }),
        expect.objectContaining({
          type: "yellow_card",
          minute: 20,
          isOpponent: false,
          externalId: 101,
        }),
        expect.objectContaining({
          type: "red_card",
          minute: 34,
          isOpponent: false,
          externalId: 102,
          isSecondYellow: true,
        }),
        expect.objectContaining({
          type: "red_card",
          minute: 40,
          isOpponent: false,
          externalId: 103,
          isSecondYellow: false,
        }),
        expect.objectContaining({
          type: "yellow_card",
          minute: 70,
          isOpponent: false,
          externalId: 201,
        }),
        expect.objectContaining({
          type: "substitution",
          minute: 53,
          isOpponent: true,
          playerInExternalId: null,
          playerOutExternalId: null,
        }),
        expect.objectContaining({
          type: "substitution",
          minute: 66,
          isOpponent: false,
          playerInExternalId: 201,
          playerOutExternalId: 101,
        }),
        expect.objectContaining({
          type: "substitution",
          minute: 66,
          isOpponent: false,
          playerInExternalId: 202,
          playerOutExternalId: 102,
        }),
      ]),
    );

    expect(
      formations?.events.some(
        (event) => event.type === "yellow_card" && event.minute === 80,
      ),
    ).toBe(false);
  });

  it("normaliza minutos de compensação", () => {
    const $ = cheerio.load(`
      <div id="game_report">
        <div class="zz-tpl-row game_report">
          <div class="zz-tpl-col"><div class="subtitle">Adversário</div></div>
          <div class="zz-tpl-col">
            <div class="subtitle">Adecas</div>
            ${player(
              "Late Card",
              301,
              '<span title="Amarelos">R</span><div>90+5\'</div>',
            )}
          </div>
        </div>
        <div class="zz-tpl-row game_report">
          <div class="zz-tpl-col"></div>
          <div class="zz-tpl-col"></div>
        </div>
      </div>
    `);

    expect(parseFormations($, "Adecas")?.events).toContainEqual({
      type: "yellow_card",
      minute: 95,
      phase: "2nd",
      isOpponent: false,
      isOwnGoal: false,
      isSecondYellow: false,
      penaltyScored: null,
      externalId: 301,
    });
  });
});
