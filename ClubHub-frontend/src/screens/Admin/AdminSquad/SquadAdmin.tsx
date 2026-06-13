import React, { useCallback, useMemo } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../../hooks/usePlayers";
import { Player, SquadStatus } from "../../../models/Player";
import { styles } from "../../Squad/Squad.styles";
import {
  mapToMainPosition,
  getPositionOrder,
} from "../../../utils/playerPositionUtils";
import { useAuth } from "../../../contexts/AuthContext";
import { useSelectedSeason } from "../../../contexts/Selectedseasoncontext";

const defaultPlayerImage = require("../../../../assets/player.jpg");

/* ---------------- UTILS ---------------- */
const chunkArray = (arr: Player[], size: number) => {
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const STATUS_LABELS: Record<SquadStatus, string> = {
  active: "Ativo",
  left: "Saiu",
  error: "Erro",
};

const STATUS_COLORS: Record<SquadStatus, string> = {
  active: "#22c55e",
  left: "#f59e0b",
  error: "#ef4444",
};

/* ---------------- CARD MEMO ---------------- */
const PlayerCard = React.memo(
  ({
    player,
    onChangeStatus,
  }: {
    player: Player;
    onChangeStatus: (p: Player) => void;
  }) => {
    const [firstName, ...rest] = player.name.split(" ");
    const lastName = rest.join(" ");
    const currentStatus: SquadStatus = player.squadStatus ?? "active";

    const isLeft = currentStatus === "left";
    const isError = currentStatus === "error";

    return (
      <View
        style={[
          styles.playerCard,
          isLeft && { opacity: 0.55 },
          isError && { opacity: 0.25 },
        ]}
      >
        <Image
          source={
            player.photoUrl ? { uri: player.photoUrl } : defaultPlayerImage
          }
          style={styles.playerImage}
          resizeMode="contain"
        />

        {/* Badge de estado */}
        <View
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: STATUS_COLORS[currentStatus],
            borderRadius: 4,
            paddingHorizontal: 4,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
            {STATUS_LABELS[currentStatus]}
          </Text>
        </View>

        <Text style={styles.playerName} numberOfLines={1}>
          {firstName}
        </Text>
        <Text style={styles.playerName} numberOfLines={1}>
          {lastName}
        </Text>

        {/* Botão para abrir picker de estado */}
        <TouchableOpacity
          onPress={() => onChangeStatus(player)}
          style={{
            marginTop: 4,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: STATUS_COLORS[currentStatus],
          }}
        >
          <Text
            style={{
              fontSize: 9,
              color: STATUS_COLORS[currentStatus],
              fontWeight: "600",
            }}
          >
            Mudar estado
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

/* ---------------- SCREEN ---------------- */
export function AdminSquadScreen() {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Acesso negado</Text>
      </View>
    );
  }

  const { allPlayers, updateSquadStatus } = usePlayers();
  const { selectedSeasonId } = useSelectedSeason();

  /* SORT ONCE - mostra TODOS (incluindo "error") para o admin */
  const sortedPlayers = useMemo(() => {
    return [...allPlayers].sort((a, b) => {
      const posA = getPositionOrder(a.Stats?.[0]?.position || "");
      const posB = getPositionOrder(b.Stats?.[0]?.position || "");
      if (posA !== posB) return posA - posB;
      return (a.Stats?.[0]?.number || 0) - (b.Stats?.[0]?.number || 0);
    });
  }, [allPlayers]);

  const groupedData = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    for (const p of sortedPlayers) {
      const key = mapToMainPosition(p.Stats?.[0]?.position || "");
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    return Object.entries(groups).map(([position, players]) => ({
      position,
      players,
    }));
  }, [sortedPlayers]);

  const flashData = useMemo(() => {
    const result: any[] = [];
    groupedData.forEach((group) => {
      result.push({ type: "header", position: group.position });
      chunkArray(group.players, 3).forEach((row) => {
        result.push({ type: "row", players: row });
      });
    });
    return result;
  }, [groupedData]);

  const handleChangeStatus = useCallback(
    (player: Player) => {
      const current: SquadStatus = player.squadStatus ?? "active";
      const options: SquadStatus[] = (
        ["active", "left", "error"] as SquadStatus[]
      ).filter((s) => s !== current);

      Alert.alert(
        "Mudar estado",
        `${player.name} - estado atual: ${STATUS_LABELS[current]}`,
        [
          { text: "Cancelar", style: "cancel" },
          ...options.map((s) => ({
            text: STATUS_LABELS[s],
            onPress: () =>
              updateSquadStatus({
                playerExternalId: player.externalId,
                seasonId: selectedSeasonId!,
                status: s,
              }),
          })),
        ],
      );
    },
    [updateSquadStatus, selectedSeasonId],
  );

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item.type === "header") {
        return (
          <View style={styles.positionHeader}>
            <Text style={styles.positionHeaderText}>{item.position}</Text>
          </View>
        );
      }

      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {item.players.map((p: Player) => (
            <PlayerCard
              key={p.id}
              player={p}
              onChangeStatus={handleChangeStatus}
            />
          ))}
        </View>
      );
    },
    [handleChangeStatus],
  );

  return (
    <FlashList
      data={flashData}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        if (item.type === "header") return `h-${item.position}-${index}`;
        if (item.type === "row")
          return `r-${item.players.map((p: Player) => p.id).join("-")}`;
        return `unknown-${index}`;
      }}
      contentContainerStyle={styles.squadList}
    />
  );
}
