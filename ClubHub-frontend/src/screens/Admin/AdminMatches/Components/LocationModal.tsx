import { FormModal } from "../../../../components/FormModal";
import { FormScrollView } from "../../../../components/FormScrollView";
import React, { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { modalStyles } from "./styles";
import { useEffect, useState } from "react";
interface Props {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (location: string) => Promise<void>;
}

export const LocationModal = React.memo(
  ({ visible, initialValue, onClose, onSave }: Props) => {
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
      <FormModal visible={visible} onClose={handleClose}>
        <View style={[modalStyles.sheet, { maxHeight: "100%", flexShrink: 1, borderRadius: 20, paddingBottom: 12 }]}>
            <View style={modalStyles.handle} />

            <View style={modalStyles.sheetHeader}>
              <Text style={modalStyles.sheetTitle}>Editar Localização</Text>

              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <FormScrollView contentContainerStyle={modalStyles.sheetContent}>
              <Text style={modalStyles.fieldLabel}>Local do jogo</Text>

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
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={modalStyles.saveBtnText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </FormScrollView>
          </View>
      </FormModal>
    );
  },
);
