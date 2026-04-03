import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminStyles } from "../screens/Admin/AdminMatches/AdminMatchDetail.styles";
import { COLORS } from "../theme/colors";
import { useCreateNotification } from "../hooks/useCreateNotification";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal = ({ visible, onClose }: Props) => {
  const { createNotification, loading } = useCreateNotification();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleClose = () => {
    setTitle("");
    setBody("");
    onClose();
  };

  const handleSend = () => {
    if (!title || !body) {
      Alert.alert("Erro", "Preenche todos os campos.");
      return;
    }

    Alert.alert(
      "Confirmar envio",
      "Tens a certeza que queres enviar esta notificação para todos os utilizadores?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () => {
            createNotification(
              { title, body, type: "manual" },
              {
                onSuccess: () => {
                  Alert.alert("Sucesso", "Notificação enviada com sucesso!");
                  handleClose();
                },
                onError: () => {
                  Alert.alert("Erro", "Não foi possível enviar a notificação.");
                },
              }
            );
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={adminStyles.overlay} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={adminStyles.sheetWrapper}
      >
        <View style={adminStyles.sheet}>
          <View style={adminStyles.handle} />

          {/* Header */}
          <View style={adminStyles.sheetHeader}>
            <Text style={adminStyles.sheetTitle}>Enviar Notificação</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={adminStyles.sheetContent}>
            {/* Título */}
            <Text style={adminStyles.fieldLabel}>Título</Text>
            <TextInput
              style={adminStyles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Título da notificação"
              placeholderTextColor={COLORS.muted}
            />

            {/* Mensagem */}
            <Text style={adminStyles.fieldLabel}>Mensagem</Text>
            <TextInput
              style={[adminStyles.input, adminStyles.textAreaLarge]}
              multiline
              value={body}
              onChangeText={setBody}
              placeholder="Escreve a mensagem..."
              placeholderTextColor={COLORS.muted}
            />

            {/* Botão enviar */}
            <TouchableOpacity
              style={[
                adminStyles.saveBtn,
                (!title || !body || loading) && { opacity: 0.5 },
              ]}
              onPress={handleSend}
              disabled={!title || !body || loading}
            >
              <Text style={adminStyles.saveBtnText}>
                {loading ? "A enviar..." : "Enviar Notificação"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};