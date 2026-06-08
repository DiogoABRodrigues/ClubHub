import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSeasons } from "../hooks/useSeasons";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { COLORS } from "../theme/colors";
import { Season } from "../models/Season";
import { styles } from "./styles/Seasonpicker.styles";

export const SeasonPicker: React.FC = () => {
  const { seasons } = useSeasons();
  const { selectedSeason, setSelectedSeason } = useSelectedSeason();
  const [open, setOpen] = useState(false);

  // Ordena épocas da mais recente para a mais antiga
  const sorted = [...seasons].sort((a, b) => {
    const aYear = parseInt(a.year.split("/")?.[0] ?? "0");
    const bYear = parseInt(b.year.split("/")?.[0] ?? "0");
    return bYear - aYear;
  });

  const handleSelect = (season: Season) => {
    setSelectedSeason(season);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{selectedSeason?.year ?? "—"}</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Escolher Época</Text>
            <FlatList
              data={sorted}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedSeason?.id;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.year}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};