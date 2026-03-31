// ─────────────────────────────────────────────
//  theme/colors.ts  —  Paleta atualizada
// ─────────────────────────────────────────────

export const COLORS = {
  // ── Identidade principal ──────────────────
  primary:       "#426bdb", // Royal Blue — botões, ações, tabs ativas
  primaryDark:   "#4660b4", // Deep Blue  — header do MatchDetail
  primaryLight:  "#DBEAFE", // Blue Tint  — fundos de seleção / hover / badges

  // ── Superfícies ───────────────────────────
  background:    "#F8F9FA", // Off-white  — fundo geral das screens
  surface:       "#FFFFFF", // Branco     — cards, modais
  surfaceLight:  "#F1F5F9", // Cinza suave — header Home, fundos alt

  // ── Texto ─────────────────────────────────
  textPrimary:   "#0F172A", // Slate 900  — texto principal
  textSecondary: "#414244", // Gray 500   — texto secundário / labels
  textMuted:     "#9CA3AF", // Gray 400   — hints, placeholders, minutagem

  // ── Bordas ────────────────────────────────
  border:        "#E2E6EA", // Bordas e divisórias
  muted:         "#E2E6EA", // alias (manter compatibilidade)

  // ── Status semânticos ─────────────────────
  success:       "#16A34A", // Verde      — golos, vitória, promoção
  successLight:  "#DCFCE7", // Verde claro — fundo linhas de promoção
  error:         "#DC2626", // Vermelho   — descida, derrota, erro
  errorLight:    "#FEE2E2", // Verm. claro — fundo linhas de descida
  warning:       "#EAB308", // Âmbar      — cartões amarelos
  warningLight:  "#FEF3C7", // Âmbar claro — fundo avisos
  destructive:   "#DC2626", // alias error (manter compatibilidade)

  // ── Charts / Extras ───────────────────────
  chart2:        "#16A34A", // Verde (golos / positivo)
  chart3:        "#EAB308", // Âmbar (cartões)

  // ── Accent secundário (uso pontual) ───────
  secondary:     "#3B82F6", // Azul médio — ícones de secção
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