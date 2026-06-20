import {
  applyTimeStr,
  formatToDateStr,
  formatToTimeStr,
  getPenaltyDisplayScore,
  parseDateStr,
} from "../../src/utils/dateUtils";

describe("dateUtils", () => {
  it("converte uma data YYYY-MM-DD para meia-noite local", () => {
    const date = parseDateStr("2026-06-20");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(20);
    expect(date.getHours()).toBe(0);
  });

  it("aplica horas sem alterar a data original", () => {
    const base = new Date(2026, 5, 20, 8, 0);
    const result = applyTimeStr(base, "21:35");

    expect(result).not.toBe(base);
    expect(formatToTimeStr(result)).toBe("21:35");
    expect(formatToTimeStr(base)).toBe("08:00");
  });

  it("formata uma data ISO", () => {
    expect(formatToDateStr(new Date("2026-06-20T12:00:00.000Z"))).toBe(
      "2026-06-20",
    );
  });

  it.each([
    ["V", "C", ["2*", "1"]],
    ["V", "F", ["1", "2*"]],
    ["D", "C", ["1", "2*"]],
    ["D", "F", ["2*", "1"]],
  ] as const)(
    "assinala corretamente o vencedor nos penáltis (%s, %s)",
    (outcome, homeOrAway, expected) => {
      expect(
        getPenaltyDisplayScore("1-1", outcome, homeOrAway, true),
      ).toEqual(expected);
    },
  );

  it("não altera resultados que não foram decididos nos penáltis", () => {
    expect(getPenaltyDisplayScore("2-1", "V", "C", false)).toBeNull();
    expect(getPenaltyDisplayScore(null, "V", "C", true)).toBeNull();
    expect(getPenaltyDisplayScore("1-1", "E", "C", true)).toBeNull();
  });
});
