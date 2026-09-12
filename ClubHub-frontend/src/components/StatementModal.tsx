import { FormModal } from "./FormModal";
import { FormScrollView } from "./FormScrollView";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminStyles } from "../screens/Admin/AdminMatches/AdminMatchDetail.styles";
import { COLORS } from "../theme/colors";
import { useStatements } from "../hooks/useStatements";
import { DateTimePickerModal } from "../screens/Admin/AdminMatches/Components/DateTimePickerModal";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const StatementModal = ({ visible, onClose }: Props) => {
  const { statements, createStatement, updateStatement, deleteStatement } =
    useStatements();

  const activeStatement = statements?.[0];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dateToExpire, setDateToExpire] = useState<Date | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (activeStatement) {
      setTitle(activeStatement.title || "");
      setContent(activeStatement.message || "");
      setDateToExpire(new Date(activeStatement.dateToExpire));
    } else {
      setTitle("");
      setContent("");
      setDateToExpire(null);
    }
  }, [visible]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

  const handleSave = async () => {
    if (!title || !content || !dateToExpire) {
      Alert.alert("Erro", "Preenche todos os campos.");
      return;
    }
    try {
      if (activeStatement) {
        await updateStatement({
          id: activeStatement.id,
          updates: { title, message: content, dateToExpire },
        });
      } else {
        await createStatement({ title, message: content, dateToExpire });
      }
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar Statement", "Tens a certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteStatement({
            id: activeStatement.id,
            updates: { dateToExpire: new Date(Date.now() - 1) },
          });
          onClose();
        },
      },
    ]);
  };

  return (
    <FormModal visible={visible} onClose={onClose}>
        <View style={adminStyles.sheet}>
          <View style={adminStyles.handle} />

          <View style={adminStyles.sheetHeader}>
            <Text style={adminStyles.sheetTitle}>
              {activeStatement ? "Editar Statement" : "Criar Statement"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ScrollView para o conteúdo subir com o teclado */}
          <FormScrollView
            contentContainerStyle={adminStyles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={adminStyles.fieldLabel}>Título</Text>
            <TextInput
              style={adminStyles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Título do comunicado"
              placeholderTextColor={COLORS.muted}
            />

            <Text style={adminStyles.fieldLabel}>Conteúdo</Text>
            <TextInput
              style={[adminStyles.input, adminStyles.textAreaLarge]}
              multiline
              value={content}
              onChangeText={setContent}
              placeholder="Conteúdo do statement..."
              placeholderTextColor={COLORS.muted}
            />

            <Text style={adminStyles.fieldLabel}>Expira em</Text>
            <TouchableOpacity
              style={adminStyles.input}
              onPress={() => setPickerVisible(true)}
            >
              <Text
                style={{
                  color: dateToExpire ? COLORS.textPrimary : COLORS.muted,
                }}
              >
                {dateToExpire
                  ? `${formatDate(dateToExpire)} às ${formatTime(dateToExpire)}`
                  : "Selecionar data de expiração"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={adminStyles.saveBtn} onPress={handleSave}>
              <Text style={adminStyles.saveBtnText}>
                {activeStatement ? "Atualizar Comunicado" : "Criar Comunicado"}
              </Text>
            </TouchableOpacity>

            {activeStatement && (
              <TouchableOpacity
                style={[
                  adminStyles.saveBtn,
                  { backgroundColor: COLORS.status.errorBright, marginTop: 10 },
                ]}
                onPress={handleDelete}
              >
                <Text style={adminStyles.saveBtnText}>Eliminar Comunicado</Text>
              </TouchableOpacity>
            )}
          </FormScrollView>
        </View>

      <DateTimePickerModal
        visible={pickerVisible}
        initialDate={
          dateToExpire
            ? dateToExpire.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        }
        initialTime={
          dateToExpire ? dateToExpire.toTimeString().slice(0, 5) : "12:00"
        }
        onClose={() => setPickerVisible(false)}
        onSave={async (date: string, time: string) => {
          const [year, month, day] = date.split("-").map(Number);
          const [hour, minute] = time.split(":").map(Number);
          setDateToExpire(new Date(year, month - 1, day, hour, minute));
        }}
      />
    </FormModal>
  );
};
