import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { COLORS } from "../theme/colors";
import { Season } from "../models/Season";
import { styles } from "./styles/Seasonpicker.styles";

export const SeasonPicker: React.FC = () => {
  const { selectedSeason, setSelectedSeason, availableSeasons } =
    useSelectedSeason();
  const [open, setOpen] = useState(false);

  // Ordena da mais recente para a mais antiga
  const sorted = [...availableSeasons].sort((a, b) => {
    const aYear = parseInt(a.year.split("/")?.[0] ?? "0");
    const bYear = parseInt(b.year.split("/")?.[0] ?? "0");
    return bYear - aYear;
  });

  const handleSelect = (season: Season) => {
    setSelectedSeason(season);
    setOpen(false);
  };

  const onlyOne = sorted.length <= 1;

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => !onlyOne && setOpen(true)}
        activeOpacity={onlyOne ? 1 : 0.7}
      >
        <Text style={styles.triggerText}>{selectedSeason?.year ?? "-"}</Text>
        {!onlyOne && (
          <Ionicons
            name="chevron-down"
            size={14}
            color={COLORS.textSecondary}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
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
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.year}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={COLORS.primary}
                      />
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
