import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
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

export const AdminTeams: React.FC = () => {
  const navigation = useNavigation();

  const teams: Team[] = [
    { category: "Senior", players: 25, staff: 8 },
    { category: "U19", players: 22, staff: 5 },
    { category: "U17", players: 20, staff: 4 },
    { category: "U15", players: 18, staff: 3 },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const players: Player[] = [
    { number: 1, name: "Marco Silva", position: "GK", status: "Active" },
    { number: 2, name: "João Santos", position: "RB", status: "Active" },
    { number: 5, name: "Pedro Costa", position: "CB", status: "Active" },
    {
      number: 10,
      name: "Carlos Rodrigues",
      position: "CAM",
      status: "Injured",
    },
    { number: 9, name: "Fernando Pereira", position: "ST", status: "Active" },
  ];

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("AdminDashboard" as never)}
        >
          <ArrowLeft width={20} height={20} color="#999" />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Teams</Text>
        <Pressable style={styles.addCategoryButton}>
          <Plus width={16} height={16} color="#fff" />
          <Text style={styles.addCategoryText}>Add Category</Text>
        </Pressable>
      </View>

      {/* Teams Cards */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        {teams.map((team) => (
          <View key={team.category} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamInfo}>
                <View style={styles.teamIcon}>
                  <Users width={20} height={20} color="#0ea5e9" />
                </View>
                <View>
                  <Text style={styles.teamName}>FC Titans {team.category}</Text>
                  <Text style={styles.teamCategory}>Team Category</Text>
                </View>
              </View>
              <Pressable>
                <Edit width={20} height={20} color="#0ea5e9" />
              </Pressable>
            </View>

            <View style={styles.teamStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{team.players}</Text>
                <Text style={styles.statLabel}>Players</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{team.staff}</Text>
                <Text style={styles.statLabel}>Staff</Text>
              </View>
            </View>

            <Pressable style={styles.manageRosterButton}>
              <Text style={styles.manageRosterText}>Manage Roster</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Player Management */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Senior Team Roster</Text>
        <View style={styles.playerCard}>
          {/* Search and Add */}
          <View style={styles.playerHeader}>
            <TextInput
              placeholder="Search players..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            <Pressable style={styles.addPlayerButton}>
              <Plus width={16} height={16} color="#fff" />
              <Text style={styles.addPlayerText}>Add Player</Text>
            </Pressable>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>#</Text>
            <Text style={[styles.tableHeaderText, { flex: 4 }]}>Name</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Position</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Status</Text>
            <Text
              style={[styles.tableHeaderText, { flex: 2, textAlign: "right" }]}
            >
              Actions
            </Text>
          </View>

          {/* Player Rows */}
          {filteredPlayers.map((player) => (
            <View key={player.number} style={styles.playerRow}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={styles.playerNumber}>
                  <Text style={{ color: "#0ea5e9" }}>{player.number}</Text>
                </View>
              </View>
              <Text style={[styles.playerText, { flex: 4 }]}>
                {player.name}
              </Text>
              <Text style={[styles.playerTextMuted, { flex: 2 }]}>
                {player.position}
              </Text>
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
