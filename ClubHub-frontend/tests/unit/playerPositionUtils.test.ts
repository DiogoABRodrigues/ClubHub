import {
  getPositionOrder,
  mapToMainPosition,
} from "../../src/utils/playerPositionUtils";

describe("playerPositionUtils", () => {
  it.each([
    ["Guarda Redes", "Guarda Redes"],
    ["CB", "Defesa"],
    ["cam", "Médio"],
    ["ST", "Avançado"],
    ["Treinador", "Treinador"],
  ])("normaliza %s para %s", (input, expected) => {
    expect(mapToMainPosition(input)).toBe(expected);
  });

  it("usa médio como fallback seguro", () => {
    expect(mapToMainPosition("posição desconhecida")).toBe("Médio");
  });

  it("ordena jogadores por grupo posicional", () => {
    expect(getPositionOrder("Guarda Redes")).toBeLessThan(
      getPositionOrder("Defesa"),
    );
    expect(getPositionOrder("Defesa")).toBeLessThan(getPositionOrder("ST"));
    expect(getPositionOrder("ST")).toBeLessThan(
      getPositionOrder("Treinador"),
    );
  });
});
