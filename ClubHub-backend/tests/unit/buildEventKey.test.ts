import { buildEventKey } from "../../src/utils/buildEventKey";

describe("buildEventKey", () => {
  it("combina jogo, tipo, minuto e jogador", () => {
    expect(
      buildEventKey({ type: "goal", minute: 42, playerId: 7 }, 15),
    ).toBe("15:goal:42:7");
  });

  it("usa none quando não existe jogador", () => {
    expect(buildEventKey({ type: "yellow-card", minute: 90 }, 3)).toBe(
      "3:yellow-card:90:none",
    );
  });
});
