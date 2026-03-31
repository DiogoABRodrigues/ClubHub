import React, { useCallback, useEffect, useState } from "react";
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

export const LocationModal = React.memo(({
  visible,
  initialValue,
  onClose,
  onSave,
}: Props) => {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔥 sincronização correta (evita stale state)
  useEffect(() => {
    if (visible) {
      setValue(initialValue ?? "");
      setSaving(false);
    }
  }, [visible, initialValue]);

  // 🔥 evita double save / race condition
  const handleSave = useCallback(async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      Alert.alert("Erro", "Localização não pode estar vazia.");
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      await onSave(trimmed);
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  }, [value, saving, onSave, onClose]);

  // 🔥 evita re-criação do handler
  const handleChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const handleClose = useCallback(() => {
    if (saving) return; // evita fechar no meio do save
    onClose();
  }, [saving, onClose]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      
      {/* overlay separado (evita re-render do sheet ao tocar fora) */}
      <Pressable style={modalStyles.overlay} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={modalStyles.sheetWrapper}
      >
        <View style={modalStyles.sheet}>
          
          <View style={modalStyles.handle} />

          <View style={modalStyles.sheetHeader}>
            <Text style={modalStyles.sheetTitle}>
              Editar Localização
            </Text>

            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={22}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.sheetContent}>
            <Text style={modalStyles.fieldLabel}>
              Local do jogo
            </Text>

            <TextInput
              style={modalStyles.input}
              value={value}
              onChangeText={handleChangeText}
              placeholder="Ex: Estádio Municipal"
              autoFocus
              returnKeyType="done"
              editable={!saving}
            />

            <TouchableOpacity
              style={[
                modalStyles.saveBtn,
                saving && modalStyles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={modalStyles.saveBtnText}>
                  Guardar
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});