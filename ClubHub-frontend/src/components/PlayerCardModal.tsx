import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Player } from "../models/Player";
import { Stats } from "../models/Stats";
import { PlayerService } from "../services/PlayerService";
import { useSeasons } from "../hooks/useSeasons";
import { COLORS, SPACING} from "../theme/colors";
import { styles } from "./styles/PlayerCardModal.styles";

const defaultPlayerImage = require("../../assets/player.jpg");

//  Linha de stat individual
const StatRow = ({ season, stats }: { season: string; stats: Stats }) => (
  <View style={styles.statRow}>
    <Text style={styles.seasonLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{season}</Text>

    <View style={styles.statCell}>
      <Text style={styles.statValue}>{stats.gamesPlayed ?? 0}</Text>
    </View>

    <View style={styles.statCell}>
      <Text style={[styles.statValue]}>
        {stats.goals ?? 0}
      </Text>
    </View>

    <View style={styles.statCell}>
      <Text style={styles.statValue}>
        {stats.minutesPlayed ?? 0}
      </Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
//  Modal principal
// ─────────────────────────────────────────────────────────────
interface PlayerCardModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerCardModal: React.FC<PlayerCardModalProps> = ({
  player,
  onClose,
}) => {
  const { seasons } = useSeasons();
  const seasonMap = Object.fromEntries(seasons.map((s) => [s.id, s.year]));
  const [fullPlayer, setFullPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  // Quando o modal abre, vai buscar o jogador com TODAS as stats
  useEffect(() => {
    if (!player) {
      setFullPlayer(null);
      return;
    }

    setLoading(true);
    PlayerService.getAllStats(player.id)
      .then(setFullPlayer)
      .catch(() => setFullPlayer(player)) // fallback: usa o que já temos
      .finally(() => setLoading(false));
  }, [player?.id]);

  if (!player) return null;

  const display = fullPlayer ?? player;
  const [firstName, ...rest] = display.name.split(" ");
  const lastName = rest.join(" ");

  // Posição e número da época mais recente
  const currentStat = display.Stats?.[0];
  const position = currentStat?.position ?? "—";
  const number = currentStat?.number;

  // Já chegam ordenadas do backend (season year DESC)
  const sortedStats = display.Stats ?? [];

  return (
    <Modal
      visible={!!player}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Botão fechar */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Corpo em duas colunas */}
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
                  display.photoUrl
                    ? { uri: display.photoUrl }
                    : defaultPlayerImage
                }
                style={styles.photo}
                resizeMode="contain"
              />
              <Text style={styles.firstName}>{firstName}</Text>
              <Text style={styles.firstName} numberOfLines={1}>{lastName}</Text>
              <View style={styles.positionBadge}>
                <Text style={styles.positionText}>{position}</Text>
              </View>
            </View>

            {/* Coluna direita — stats */}
            <View style={styles.statsCol}>
              <Text style={styles.statsTitle}>Estatísticas</Text>

              {loading ? (
                <ActivityIndicator
                  style={{ marginTop: SPACING.lg }}
                  color={COLORS.primary}
                />
              ) : (
                <>
                  <View style={styles.statsHeader}>
                    <Text style={[styles.statLabel, { flex: 1 }]}>Época</Text>
                    <Text style={[styles.statLabel, styles.colCenter]}>J</Text>
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
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};