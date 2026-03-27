import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react-native";
import { mockMatches, TeamCategory } from "../../../data/mockData";
import { MatchCard } from "../../../components/MatchCard";
import { styles } from "./AdminMatches.styles";

export const AdminMatches: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TeamCategory | "All"
  >("All");

  const categories: Array<TeamCategory | "All"> = [
    "All",
    "Senior",
    "U19",
    "U17",
    "U15",
  ];

  const filteredMatches = mockMatches.filter((match) => {
    const matchesCategory =
      selectedCategory === "All" || match.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.navigate("AdminDashboard" as never)}
            style={styles.backButton}
          >
            <ArrowLeft width={20} height={20} color="#999" />
          </Pressable>
          <Text style={styles.headerTitle}>Manage Matches</Text>
          <Pressable style={styles.addButton}>
            <Plus width={16} height={16} color="#fff" />
            <Text style={styles.addButtonText}>Add Match</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            width={20}
            height={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search matches..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Matches List */}
      <View style={styles.matchesContainer}>
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <View key={match.id} style={styles.matchWrapper}>
              <MatchCard match={match} />
              <View style={styles.matchActions}>
                <Pressable style={styles.editButton}>
                  <Edit width={16} height={16} color="#0ea5e9" />
                </Pressable>
                <Pressable style={styles.deleteButton}>
                  <Trash2 width={16} height={16} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 32 }}>⚽</Text>
            </View>
            <Text style={styles.emptyText}>No matches found</Text>
            <Pressable style={styles.createButton}>
              <Text style={styles.createButtonText}>Create First Match</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
