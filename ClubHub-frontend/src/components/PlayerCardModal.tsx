import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Player } from "../models/Player";
import { Stats } from "../models/Stats";
import { styles } from "./styles/PlayerCardModal.styles";

const defaultPlayerImage = require("../../assets/player.jpg");

//  Linha de stat individual
const StatRow = ({
  season,
  stats,
}: {
  season: string;
  stats: Stats;
}) => (
  <View style={styles.statRow}>
    <Text style={styles.seasonLabel}>{season}</Text>

    <View style={styles.statCell}>
      <Text style={styles.statValue}>{stats.gamesPlayed ?? 0}</Text>
      <Text style={styles.statLabel}>J</Text>
    </View>

    <View style={styles.statCell}>
      <Text style={styles.statValue}>
        {stats.goals ?? 0}
      </Text>
      <Text style={styles.statLabel}>G</Text>
    </View>

    <View style={styles.statCell}>
      <Text style={styles.statValue}>
        {(stats.minutesPlayed ?? 0)}
      </Text>
      <Text style={styles.statLabel}>Min</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
//  Modal principal
// ─────────────────────────────────────────────────────────────
interface PlayerCardModalProps {
  player: Player | null;
  /** Mapa de seasonId → year string, ex: { 1: "2023/24", 2: "2024/25" } */
  seasonMap: Record<number, string>;
  onClose: () => void;
}

export const PlayerCardModal: React.FC<PlayerCardModalProps> = ({
  player,
  seasonMap,
  onClose,
}) => {
  if (!player) return null;

  const [firstName, ...rest] = player.name.split(" ");
  const lastName = rest.join(" ");

  const currentStat = player.Stats?.[0];
  const position = currentStat?.position ?? "—";
  const number = currentStat?.number;

  // Ordena as stats da mais recente para a mais antiga
  const sortedStats = [...(player.Stats ?? [])].sort(
    (a, b) => b.seasonId - a.seasonId,
  );

  return (
    <Modal
      visible={!!player}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* ── Botão fechar ── */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* ── Conteúdo em duas colunas ── */}
          <View style={styles.body}>
            {/* Coluna esquerda — foto */}
            <View style={styles.photoCol}>
              {number !== undefined && (
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>{number}</Text>
                </View>
              )}
              <Image
                source={
                  player.photoUrl
                    ? { uri: player.photoUrl }
                    : defaultPlayerImage
                }
                style={styles.photo}
                resizeMode="contain"
              />

              <Text style={styles.firstName}>{firstName}</Text>
              <Text style={styles.lastName} numberOfLines={1}>
                {lastName}
              </Text>
              <View style={styles.positionBadge}>
                <Text style={styles.positionText}>{position}</Text>
              </View>
            </View>

            {/* Coluna direita — stats */}
            <View style={styles.statsCol}>
              <Text style={styles.statsTitle}>Estatísticas</Text>

              {/* Cabeçalho da tabela */}
              <View style={styles.statsHeader}>
                <Text style={[styles.statLabel, { flex: 2 }]}>Época</Text>
                <Text style={[styles.statLabel, styles.colCenter]}>JJ</Text>
                <Text style={[styles.statLabel, styles.colCenter]}>G</Text>
                <Text style={[styles.statLabel, styles.colCenter]}>Min</Text>
              </View>

              {sortedStats.length === 0 ? (
                <Text style={styles.noStats}>Sem registos disponíveis</Text>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {sortedStats.map((s) => (
                    <StatRow
                      key={s.seasonId}
                      season={seasonMap[s.seasonId] ?? String(s.seasonId)}
                      stats={s}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};