import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerWithStats } from "../../models/Player";
import { styles as globalStyles } from "./Stats.styles";
import { isFieldPlayer } from "../../utils/playerPositionUtils";

type SortField = "games" | "minutes" | "goals";
type SortOrder = "asc" | "desc";

const SortIcon = React.memo(
  ({ active, order }: { active: boolean; order: SortOrder }) => {
    if (!active) return null;
    return order === "desc" ? (
      <ArrowUp width={14} height={14} color="#666" />
    ) : (
      <ArrowDown width={14} height={14} color="#666" />
    );
  },
);

export function SquadStats() {
  const { players } = usePlayers();
  const [sortField, setSortField] = useState<SortField>("goals");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Ref do FlatList
  const flatListRef = useRef<FlatList>(null);

  // Scroll para o topo sempre que a screen abre
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []); // apenas na montagem

  // Filtra apenas jogadores, ignora staff
  const statsPlayersOnly = useMemo(
    () => players.filter(isFieldPlayer),
    [players]
  );

  const statsSortedPlayers = useMemo(() => {
    const arr = [...statsPlayersOnly];
    console.log("Sorting players by", statsPlayersOnly);
    arr.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortField === "games") {
        valA = a.stats.gamesPlayed;
        valB = b.stats.gamesPlayed;
      } else if (sortField === "minutes") {
        valA = a.stats.minutesPlayed;
        valB = b.stats.minutesPlayed;
      } else {
        valA = a.stats.goals;
        valB = b.stats.goals;
      }

      return sortOrder === "desc" ? valB - valA : valA - valB;
    });

    return arr;
  }, [statsPlayersOnly, sortField, sortOrder]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
      // Opcional: scroll para o topo sempre que muda a ordenação
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    [sortField],
  );

  const renderHeader = useMemo(
    () => (
      <View style={globalStyles.statsHeader}>
        <Text
          style={[
            globalStyles.statsText,
            globalStyles.statsHeaderText,
            localStyles.flex2,
          ]}
        >
          Jogador
        </Text>

        <TouchableOpacity
          style={globalStyles.statsHeaderButton}
          onPress={() => handleSort("games")}
        >
          <Text style={globalStyles.statsHeaderText}>Jogos</Text>
          <SortIcon active={sortField === "games"} order={sortOrder} />
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.statsHeaderButton}
          onPress={() => handleSort("minutes")}
        >
          <Text style={globalStyles.statsHeaderText}>Mins</Text>
          <SortIcon active={sortField === "minutes"} order={sortOrder} />
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.statsHeaderButton}
          onPress={() => handleSort("goals")}
        >
          <Text style={globalStyles.statsHeaderText}>Golos</Text>
          <SortIcon active={sortField === "goals"} order={sortOrder} />
        </TouchableOpacity>
      </View>
    ),
    [handleSort, sortField, sortOrder],
  );

  const renderItem = useCallback(({ item }: { item: PlayerWithStats }) => {
    const defaultPlayerImage = require("../../../assets/player.jpg");

    return (
      <View style={globalStyles.statsRow}>
        <View style={globalStyles.playerInfo}>
          <Image
            source={item.photoUrl ? { uri: item.photoUrl } : defaultPlayerImage}
            style={globalStyles.statsPhoto}
            resizeMode="contain"
          />
          <Text style={globalStyles.playerName}>{item.name}</Text>
        </View>
        <Text style={globalStyles.statsText}>{item.stats.gamesPlayed}</Text>
        <Text style={globalStyles.statsText}>{item.stats.minutesPlayed}</Text>
        <Text style={globalStyles.statsText}>{item.stats.goals}</Text>
      </View>
    );
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={statsSortedPlayers}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={globalStyles.statsTable}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
      getItemLayout={(data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
    />
  );
}

const localStyles = StyleSheet.create({
  flex2: { flex: 2 },
});
