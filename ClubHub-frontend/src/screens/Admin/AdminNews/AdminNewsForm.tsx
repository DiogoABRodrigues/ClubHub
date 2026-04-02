import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../theme/colors";
import { useNews } from "../../../hooks/useNews";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./AdminNewsForm.styles";

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: "Team" | "Transfers" | "Events";
  image: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "Team",
  image: "",
};

export const AdminNewsForm: React.FC = ({ route, navigation }: any) => {
  const editId: number | undefined = route?.params?.id;
  const isEditing = Boolean(editId);

  const { news, createNews, updateNews } = useNews();

  const existingNews = useMemo(
    () => (editId ? news.find((n) => n.id === editId) : undefined),
    [news, editId],
  );

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Pré-preenche o formulário em modo edição
  useEffect(() => {
    if (isEditing && existingNews) {
      setForm({
        title: existingNews.title ?? "",
        excerpt: existingNews.excerpt ?? "",
        content: existingNews.content ?? "",
        category: existingNews.category ?? "Team",
        image: existingNews.image ?? "",
      });
    }
  }, [isEditing, existingNews]);

  const updateField = useCallback(
    (field: keyof FormData) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Limpa erro do campo quando o utilizador começa a escrever
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.title.trim()) newErrors.title = "O título é obrigatório";
    if (!form.content.trim()) newErrors.content = "O conteúdo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // No AdminNewsForm, ajuste a função handleSave
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditing && editId) {
        // Para edição, verifica se a imagem foi alterada
        const imageUri =
          form.image !== existingNews?.image ? form.image : undefined;
        await updateNews({
          id: editId,
          news: form,
          imageUri,
        });
      } else {
        // Para criação
        const imageUri = form.image || undefined;
        await createNews({
          news: form,
          imageUri,
        });
      }
      navigation.goBack();
    } catch (e) {
      console.error("Erro ao salvar:", e);
      Alert.alert(
        "Erro",
        "Não foi possível guardar a notícia. Tenta novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const hasImagePreview =
    typeof form.image === "string" && form.image.length > 0;

  const pickImage = async () => {
    // Pedir permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisas de permitir acesso às fotos.");
      return;
    }

    // Abre a galeria para escolher imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>News</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* IMAGE PREVIEW */}
          <View style={styles.imageSection}>
            {hasImagePreview ? (
              <Image
                source={{ uri: form.image }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.muted} />
                <Text style={styles.imagePlaceholderText}>
                  Pré-visualização da imagem
                </Text>
              </View>
            )}
          </View>

          {/* IMAGE URL */}
          <Field label="Imagem" optional>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
              <Text style={{ color: "#fff" }}>
                {form.image ? "Alterar imagem" : "Selecionar imagem"}
              </Text>
            </TouchableOpacity>
          </Field>

          {/* TÍTULO */}
          <Field label="Título" error={errors.title}>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={form.title}
              onChangeText={updateField("title")}
              placeholder="Título da notícia"
              placeholderTextColor={COLORS.muted}
              maxLength={120}
            />
            <Text style={styles.charCount}>{form.title.length}/120</Text>
          </Field>

          {/* RESUMO */}
          <Field label="Resumo" error={errors.excerpt}>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.excerpt && styles.inputError,
              ]}
              value={form.excerpt}
              onChangeText={updateField("excerpt")}
              placeholder="Breve descrição da notícia (aparece nos cards)"
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
            <Text style={styles.charCount}>{form.excerpt.length}/300</Text>
          </Field>

          {/* CONTEÚDO */}
          <Field label="Conteúdo" error={errors.content}>
            <TextInput
              style={[
                styles.input,
                styles.textAreaLarge,
                errors.content && styles.inputError,
              ]}
              value={form.content}
              onChangeText={updateField("content")}
              placeholder="Conteúdo completo da notícia..."
              placeholderTextColor={COLORS.muted}
              multiline
              textAlignVertical="top"
            />
          </Field>

          <TouchableOpacity
            style={[styles.bottomSaveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.bottomSaveBtnText}>
                  {isEditing ? "Guardar Alterações" : "Publicar Notícia"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Campo auxiliar ───────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, error, optional, children }) => (
  <View style={styles.field}>
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {optional && <Text style={styles.fieldOptional}>opcional</Text>}
    </View>
    {children}
    {error && <Text style={styles.fieldError}>{error}</Text>}
  </View>
);
