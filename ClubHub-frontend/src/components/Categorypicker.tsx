import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategory } from "../contexts/CategoryContext";
import { teamConfig } from "../config/teamConfig";
import { COLORS } from "../theme/colors";
import { styles } from "./styles/Seasonpicker.styles";
import type { Category } from "../contexts/CategoryContext";
import useHelper from "../hooks/useHelper";

export const CategoryPicker: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const { categories } = useHelper();
  const enabledCategories = categories?.filter((c) => c.enabled) || [];
  const [open, setOpen] = useState(false);

  const onlyOne = enabledCategories.length <= 1;
  const current = enabledCategories.find((c) => c.category === selectedCategory);

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => !onlyOne && setOpen(true)} activeOpacity={onlyOne ? 1 : 0.7}>
        <Text style={styles.triggerText}>{current?.label ?? selectedCategory}</Text>
        {!onlyOne && <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />}
      </TouchableOpacity>

      {!onlyOne && (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Escolher Escalão</Text>
            <FlatList
              data={enabledCategories}
              keyExtractor={(item) => item.category}
              renderItem={({ item }) => {
                const isSelected = item.category === selectedCategory;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      setSelectedCategory(item.category as Category);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.label}
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
      )}
    </>
  );
};