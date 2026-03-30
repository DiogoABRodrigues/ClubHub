import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { modalStyles } from "./styles";

interface Props {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (location: string) => Promise<void>;
}

export const LocationModal = ({
  visible,
  initialValue,
  onClose,
  onSave,
}: Props) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleSave = async () => {
    setSaving(true);

    try {
      await onSave(value.trim());
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={modalStyles.overlay} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={modalStyles.sheetWrapper}
      >
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.sheetHeader}>
            <Text style={modalStyles.sheetTitle}>Editar Localização</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.sheetContent}>
            <Text style={modalStyles.fieldLabel}>Local do jogo</Text>

            <TextInput
              style={modalStyles.input}
              value={value}
              onChangeText={setValue}
              placeholder="Ex: Estádio Municipal"
              autoFocus
            />

            <TouchableOpacity
              style={[
                modalStyles.saveBtn,
                saving && modalStyles.saveBtnDisabled,
              ]}
              onPress={handleSave}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={modalStyles.saveBtnText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
