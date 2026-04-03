import React, { useCallback,  } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { modalStyles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Keyboard, Platform } from "react-native";
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

    const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
  <Pressable style={modalStyles.overlay} onPress={handleClose} />

  <KeyboardAwareScrollView
    contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
    enableOnAndroid
    keyboardShouldPersistTaps="handled"
  >
    <View
      style={[
        modalStyles.sheet,
        { marginBottom: keyboardHeight },
      ]}
  >
      <View style={modalStyles.handle} />

      <View style={modalStyles.sheetHeader}>
        <Text style={modalStyles.sheetTitle}>Editar Localização</Text>

        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={modalStyles.sheetContent}>
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={modalStyles.saveBtnText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAwareScrollView>
</Modal>
    );
  },
);
