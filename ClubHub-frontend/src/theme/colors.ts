// ─────────────────────────────────────────────
//  theme/colors.ts  —  Paleta atualizada
// ─────────────────────────────────────────────

export const COLORS = {
  // ── Identidade principal ──────────────────
  primary:       "#800000", // Royal Blue — botões, ações, tabs ativas
  primaryDark:   "#000000", // Deep Blue  — header do MatchDetail
  primaryLight:  "#e4d54e",
  secondaryLight: "#8000004b", // Blue Tint  — fundos de seleção / hover / badges

  // ── Superfícies ───────────────────────────
  background:    "#FFFFFFE6", // Off-white  — fundo geral das screens
  surface:       "#800000", // Branco     — cards, modais
  surfaceLight:  "#F1F5F9", // Cinza suave — header Home, fundos alt

  // ── Texto ─────────────────────────────────
  textPrimary:   "#ffffffe6", // Slate 900  — texto principal
  textSecondary: "#0c0c0ce6", // Gray 500   — texto secundário / labels
  textMuted:     "#e6e2e2e6", // Gray 400   — hints, placeholders, minutagem

  // ── Bordas ────────────────────────────────
  border:        "#f7d7ca87", // Bordas e divisórias
  muted:         "#E2E6EA", // alias (manter compatibilidade)

  // ── Status semânticos ─────────────────────
  success:       "#16A34A", // Verde      — golos, vitória, promoção
  successLight:  "#DCFCE7", // Verde claro — fundo linhas de promoção
  error:         "#DC2626", // Vermelho   — descida, derrota, erro
  errorLight:    "#FEE2E2", // Verm. claro — fundo linhas de descida
  warning:       "#EAB308", // Âmbar      — cartões amarelos
  warningLight:  "#FEF3C7", // Âmbar claro — fundo avisos
  destructive:   "#fd0101", // alias error (manter compatibilidade)

  // ── Charts / Extras ───────────────────────
  chart2:        "#16A34A", // Verde (golos / positivo)
  chart3:        "#EAB308", // Âmbar (cartões)

  // ── Accent secundário (uso pontual) ───────
  secondary:     "#800000", // Azul médio — ícones de secção
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
};

export const RADIUS = {
  sm:  4,
  md:  8,
  lg:  12,
  xl:  16,
};

export const FONT_SIZE = {
  xs:  12,
  sm:  14,
  md:  16,
  lg:  18,
  xl:  24,
};