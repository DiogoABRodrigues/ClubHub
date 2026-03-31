import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus, Edit, Users } from "lucide-react-native";
import { styles } from "./AdminTeams.styles";

type Team = {
  category: string;
  players: number;
  staff: number;
};

type Player = {
  number: number;
  name: string;
  position: string;
  status: "Active" | "Injured";
};

const TEAMS: Team[] = [
  { category: "Senior", players: 25, staff: 8 },
  { category: "U19", players: 22, staff: 5 },
  { category: "U17", players: 20, staff: 4 },
  { category: "U15", players: 18, staff: 3 },
];

const PLAYERS: Player[] = [
  { number: 1, name: "Marco Silva", position: "GK", status: "Active" },
  { number: 2, name: "João Santos", position: "RB", status: "Active" },
  { number: 5, name: "Pedro Costa", position: "CB", status: "Active" },
  { number: 10, name: "Carlos Rodrigues", position: "CAM", status: "Injured" },
  { number: 9, name: "Fernando Pereira", position: "ST", status: "Active" },
];

export const AdminTeams: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return PLAYERS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const renderPlayer = useCallback((player: Player) => (
    <View key={player.number} style={styles.playerRow}>
      <View style={{ flex: 1 }}>
        <View style={styles.playerNumber}>
          <Text style={{ color: "#0ea5e9" }}>{player.number}</Text>
        </View>
      </View>

      <Text style={{ flex: 4 }}>{player.name}</Text>
      <Text style={{ flex: 2 }}>{player.position}</Text>

      <View style={{ flex: 3 }}>
        <Text
          style={[
            styles.playerStatus,
            player.status === "Active"
              ? styles.statusActive
              : styles.statusInjured,
          ]}
        >
          {player.status}
        </Text>
      </View>

      <Pressable style={{ flex: 2, alignItems: "flex-end" }}>
        <Edit width={16} height={16} color="#0ea5e9" />
      </Pressable>
    </View>
  ), []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate("AdminDashboard" as never)}>
          <ArrowLeft width={20} height={20} color="#999" />
        </Pressable>

        <Text style={styles.headerTitle}>Manage Teams</Text>

        <Pressable style={styles.addCategoryButton}>
          <Plus width={16} height={16} color="#fff" />
          <Text style={styles.addCategoryText}>Add Category</Text>
        </Pressable>
      </View>

      <View style={{ padding: 16 }}>
        {TEAMS.map((team) => (
          <View key={team.category} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamInfo}>
                <Users width={20} height={20} color="#0ea5e9" />
                <View>
                  <Text style={styles.teamName}>FC Titans {team.category}</Text>
                </View>
              </View>
            </View>

            <View style={styles.teamStats}>
              <Text>{team.players}</Text>
              <Text>{team.staff}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        {filteredPlayers.map(renderPlayer)}
      </View>
    </ScrollView>
  );
};