import React, { useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Player } from "../models/Player";
import { Stats } from "../models/Stats";
import { PlayerService } from "../services/PlayerService";
import { useSeasons } from "../hooks/useSeasons";
import { CATEGORY_LABELS, Category } from "../contexts/CategoryContext";
import { COLORS, SPACING } from "../theme/colors";
import { styles } from "./styles/PlayerCardModal.styles";
import { useQuery } from "@tanstack/react-query";

const defaultPlayerImage = require("../../assets/player.jpg");

// ─────────────────────────────────────────────────────────────
//  Agrupamento por época
//  Um jogador pode ter mais do que um registo de Stats na mesma
//  época (um por escalão, ex: Sub-19 e Sub-17). Aqui juntam-se
//  num único grupo com os totais somados, mantendo os registos
//  originais para o detalhe expandido.
// ─────────────────────────────────────────────────────────────
type SeasonTotals = { gamesPlayed: number; goals: number; minutesPlayed: number };

type SeasonGroup = {
  seasonId: number;
  season: string;
  total: SeasonTotals;
  entries: Stats[];
};

const groupStatsBySeason = (
  stats: Stats[],
  seasonMap: Record<number, string>,
): SeasonGroup[] => {
  const order: number[] = [];
  const bySeasonId = new Map<number, Stats[]>();

  stats.forEach((s) => {
    if (!bySeasonId.has(s.seasonId)) {
      bySeasonId.set(s.seasonId, []);
      order.push(s.seasonId);
    }
    bySeasonId.get(s.seasonId)!.push(s);
  });

  // Mantém a ordem de chegada (o backend já devolve por year DESC)
  return order.map((seasonId) => {
    const entries = bySeasonId.get(seasonId)!;
    const total = entries.reduce<SeasonTotals>(
      (acc, e) => ({
        gamesPlayed: acc.gamesPlayed + (e.gamesPlayed ?? 0),
        goals: acc.goals + (e.goals ?? 0),
        minutesPlayed: acc.minutesPlayed + (e.minutesPlayed ?? 0),
      }),
      { gamesPlayed: 0, goals: 0, minutesPlayed: 0 },
    );

    return {
      seasonId,
      season: seasonMap[seasonId] ?? String(seasonId),
      total,
      entries,
    };
  });
};

// Linha de uma época: agregada e clicável quando tem >1 escalão,
// simples e fixa quando só tem um.
const SeasonRow = ({ group }: { group: SeasonGroup }) => {
  const isMulti = group.entries.length > 1;
  const [expanded, setExpanded] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    Animated.timing(rotation, {
      toValue: next ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // ▶ (0deg) roda para ▼ (90deg) - sempre centrada na mesma caixa fixa
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.seasonGroup}>
      <TouchableOpacity
        style={styles.statRow}
        onPress={isMulti ? toggle : undefined}
        activeOpacity={isMulti ? 0.6 : 1}
        disabled={!isMulti}
      >
        <View style={styles.chevronBox}>
          {isMulti && (
            <Animated.Text
              style={[styles.chevronText, { transform: [{ rotate }] }]}
            >
              {">"}
            </Animated.Text>
          )}
        </View>

        <Text
          style={[styles.seasonLabel, isMulti && styles.seasonLabelMulti]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {group.season}
        </Text>

        <View style={styles.statCell}>
          <Text style={styles.statValue}>{group.total.gamesPlayed}</Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{group.total.goals}</Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{group.total.minutesPlayed}</Text>
        </View>
      </TouchableOpacity>

      {isMulti && expanded && (
        <View style={styles.subRows}>
          {group.entries.map((entry, idx) => (
            <View
              key={`${entry.seasonId}-${entry.category}-${idx}`}
              style={[styles.subRow, idx > 0 && styles.subRowDivider]}
            >
              <View style={styles.subTagWrap}>
                <View style={styles.subDot} />
                <Text style={styles.subTagText} numberOfLines={1}>
                  {CATEGORY_LABELS[entry.category as Category] ??
                    entry.category}
                </Text>
              </View>

              <View style={styles.statCell}>
                <Text style={styles.subStatValue}>
                  {entry.gamesPlayed ?? 0}
                </Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.subStatValue}>{entry.goals ?? 0}</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.subStatValue}>
                  {entry.minutesPlayed ?? 0}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

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
  const { data: fullPlayer, isLoading: loading } = useQuery({
    queryKey: ["player", player?.id, "allStats"],
    queryFn: () => PlayerService.getAllStats(player!.id),
    enabled: !!player,
    staleTime: Infinity,
  });

  // display/sortedStats calculados aqui (e não depois do "if (!player)")
  // para que o useMemo abaixo seja sempre chamado, na mesma ordem,
  // independentemente de "player" ser null (regras dos Hooks).
  const display = fullPlayer ?? player;
  const sortedStats = display?.Stats ?? [];

  // Agrupa por época: se houver >1 escalão na mesma época, junta num
  // único grupo agregado (expansível) em vez de mostrar linhas repetidas.
  const seasonGroups = useMemo(
    () => groupStatsBySeason(sortedStats, seasonMap),
    [sortedStats, seasonMap],
  );

  if (!player || !display) return null;

  const [firstName, ...rest] = display.name.split(" ");
  const lastName = rest.join(" ");

  // Posição e número vêm do Squad (injetados pelo backend para o escalão correto)
  // Fallback para Stats?.[0] caso seja o modal de histórico completo (getAllStats)
  const position = player.position ?? display.Stats?.[0]?.position ?? "-";
  const number = player.number ?? display.Stats?.[0]?.number;

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
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={12}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Corpo em duas colunas */}
          <View style={styles.body}>
            {/* Coluna esquerda - foto */}
            <View style={styles.photoCol}>
              <Image
                source={
                  player.squadPhotoUrl ?? player.photoUrl
                    ? { uri: player.squadPhotoUrl ?? player.photoUrl! }
                    : defaultPlayerImage
                }
                style={styles.photo}
                resizeMode="contain"
              />
              <Text style={styles.firstName}>{firstName}</Text>
              <Text style={styles.firstName} numberOfLines={1}>
                {lastName}
              </Text>
              <View style={styles.positionBadge}>
                <Text style={styles.positionText}>{position}</Text>
              </View>
            </View>

            {/* Coluna direita - stats */}
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
                    <View style={styles.chevronBox} />
                    <Text style={[styles.statLabel, { flex: 1 }]}>Época</Text>
                    <Text style={[styles.statLabel, styles.colCenter]}>J</Text>
                    <Text style={[styles.statLabel, styles.colCenter]}>G</Text>
                    <Text style={[styles.statLabel, styles.colCenter]}>
                      Min
                    </Text>
                  </View>

                  {seasonGroups.length === 0 ? (
                    <Text style={styles.noStats}>Sem registos disponíveis</Text>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {seasonGroups.map((group) => (
                        <SeasonRow key={group.seasonId} group={group} />
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