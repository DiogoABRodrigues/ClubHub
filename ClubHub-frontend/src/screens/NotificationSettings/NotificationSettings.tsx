import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, Pressable, Keyboard, TextInput,
  LayoutAnimation, Platform, Image, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginRequest } from "../../services/AuthService";
import { FeedbackService, FeedbackType } from "../../services/FeedbackService";
import { Linking } from "react-native";
import { teamConfig } from "../../config/teamConfig";
import { useDevicePreferences, DevicePreferences } from "../../hooks/useDevicePreferences";
import { SeasonPicker } from "../../components/Seasonpicker";
import { CategoryPicker } from "../../components/Categorypicker";
import useHelper from "../../hooks/useHelper";
import { CategoryConfig } from "../../models/Category";

type CategoryKey = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

const NOTIFICATION_ROWS: { key: keyof DevicePreferences; icon: string; label: string; desc: string }[] = [
  { key: "matchday" as any, icon: "calendar-outline",       label: "Alerta de jogo",  desc: "Notificação no dia do jogo" },
  { key: "goals"    as any, icon: "football-outline",       label: "Golos",           desc: "Quando há um golo" },
  { key: "result"   as any, icon: "checkmark-done-outline", label: "Resultado final", desc: "Quando o jogo termina" },
];

function categoryPrefKey(cat: CategoryKey, type: "goals" | "matchday" | "result"): keyof DevicePreferences {
  return `${cat}_${type}` as keyof DevicePreferences;
}

// ── EscalaoSection ────────────────────────────────────────────────────────────
function EscalaoSection({
  cfg, preferences, updatePreferences, defaultOpen,
}: {
  cfg: { category: string; label: string; enabled: boolean };
  preferences: DevicePreferences;
  updatePreferences: (p: Partial<DevicePreferences>) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const cat = cfg.category as CategoryKey;

  const toggle = () => {
    if (Platform.OS !== "web") LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={{
      backgroundColor: "#FFFFFF", borderRadius: RADIUS.lg,
      borderWidth: 1, borderColor: "#E5E7EB", marginBottom: SPACING.sm,
      overflow: "hidden", shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    }}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.7} style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
        gap: SPACING.sm, backgroundColor: "#FFFFFF",
      }}>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: open ? "rgba(128,0,0,0.08)" : "#F3F4F6",
          justifyContent: "center", alignItems: "center",
        }}>
          <Ionicons name="trophy-outline" size={16} color={open ? COLORS.primary : "#9CA3AF"} />
        </View>
        <Text style={{ flex: 1, fontSize: FONT_SIZE.md, fontWeight: "600", color: "#111827" }}>
          {cfg.label}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color="#9ca3af" />
      </TouchableOpacity>

      {open && (
        <View style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          <View style={{
            paddingHorizontal: SPACING.md, paddingTop: SPACING.sm,
            paddingBottom: SPACING.xs, backgroundColor: "#FAFAFA",
            borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
          }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.7 }}>
              Jogos
            </Text>
          </View>

          {NOTIFICATION_ROWS.map(({ key: _key, icon, label, desc }, i) => {
            const prefKey = categoryPrefKey(cat, _key as "goals" | "matchday" | "result");
            const value = preferences[prefKey] as boolean;
            return (
              <View key={prefKey} style={{
                flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
                backgroundColor: "#FFFFFF", borderTopWidth: i > 0 ? 1 : 0, borderTopColor: "#F3F4F6",
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: SPACING.sm }}>
                  <View style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: value ? "rgba(128,0,0,0.08)" : "#F3F4F6",
                    justifyContent: "center", alignItems: "center",
                  }}>
                    <Ionicons name={icon as any} size={15} color={value ? COLORS.primary : "#9CA3AF"} />
                  </View>
                  <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                    <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "600", color: "#111827", marginBottom: 1 }}>{label}</Text>
                    <Text style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 15 }}>{desc}</Text>
                  </View>
                </View>
                <Switch value={value} onValueChange={() => updatePreferences({ [prefKey]: !value })} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── FeedbackBox ───────────────────────────────────────────────────────────────
function FeedbackBox({ deviceId }: { deviceId: string | null }) {
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => setImageUri(null);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert("Mensagem em falta", "Por favor escreve uma mensagem antes de enviar.");
      return;
    }

    setSending(true);
    try {
      await FeedbackService.send({
        type,
        message: message.trim(),
        imageUri: imageUri ?? undefined,
        deviceId: deviceId ?? undefined,
      });
      setSent(true);
      setMessage("");
      setImageUri(null);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      Alert.alert("Erro ao enviar", "Não foi possível enviar o feedback. Tenta novamente mais tarde.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{
      backgroundColor: "#FFFFFF", borderRadius: RADIUS.lg,
      borderWidth: 1, borderColor: "#E5E7EB",
      marginBottom: SPACING.sm, overflow: "hidden",
      shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    }}>
      {/* Título */}
      <View style={{
        paddingHorizontal: SPACING.md, paddingTop: SPACING.md,
        paddingBottom: SPACING.sm, flexDirection: "row",
        alignItems: "center", gap: SPACING.sm,
      }}>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: "rgba(128,0,0,0.08)",
          justifyContent: "center", alignItems: "center",
        }}>
          <Ionicons name="chatbubble-ellipses-outline" size={17} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: FONT_SIZE.md, fontWeight: "600", color: "#111827" }}>
            Sugestões & Erros
          </Text>
          <Text style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 15 }}>
            Ajuda-nos a melhorar a app
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: "#F3F4F6" }} />

      <View style={{ padding: SPACING.md, gap: SPACING.sm }}>
        {/* Tipo: Sugestão / Erro */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["suggestion", "bug"] as FeedbackType[]).map((t) => {
            const active = type === t;
            const label = t === "suggestion" ? "💡  Sugestão" : "Erro";
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setType(t)}
                activeOpacity={0.7}
                style={{
                  flex: 1, paddingVertical: 8, borderRadius: RADIUS.md,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: active ? COLORS.primary : "#F3F4F6",
                  borderWidth: active ? 0 : 1, borderColor: "#E5E7EB",
                }}
              >
                <Text style={{
                  fontSize: FONT_SIZE.sm, fontWeight: active ? "700" : "500",
                  color: active ? "#FFFFFF" : "#6B7280",
                }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Texto */}
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={
            type === "suggestion"
              ? "Descreve a tua sugestão..."
              : "Descreve o erro que encontraste..."
          }
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{
            backgroundColor: "#F9FAFB", borderRadius: RADIUS.md,
            borderWidth: 1, borderColor: "#E5E7EB",
            padding: SPACING.sm, fontSize: FONT_SIZE.sm,
            color: "#111827", minHeight: 90, lineHeight: 20,
          }}
        />

        {/* Imagem anexada */}
        {imageUri ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 140, borderRadius: RADIUS.md, resizeMode: "cover" }}
            />
            <TouchableOpacity
              onPress={removeImage}
              style={{
                position: "absolute", top: 6, right: 6,
                backgroundColor: "rgba(0,0,0,0.55)",
                borderRadius: 12, padding: 4,
              }}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            style={{
              flexDirection: "row", alignItems: "center",
              gap: 6, alignSelf: "flex-start",
              paddingHorizontal: SPACING.sm, paddingVertical: 6,
              borderRadius: RADIUS.md, borderWidth: 1, borderColor: "#E5E7EB",
              backgroundColor: "#F9FAFB",
            }}
          >
            <Ionicons name="image-outline" size={16} color="#6B7280" />
            <Text style={{ fontSize: FONT_SIZE.xs, color: "#6B7280", fontWeight: "500" }}>
              Adicionar print
            </Text>
          </TouchableOpacity>
        )}

        {/* Botão enviar */}
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={sending || sent}
          style={{
            backgroundColor: sent ? "#22C55E" : COLORS.primary,
            borderRadius: RADIUS.md, paddingVertical: 12,
            alignItems: "center", justifyContent: "center",
            flexDirection: "row", gap: 8,
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name={sent ? "checkmark" : "send-outline"} size={16} color="#FFFFFF" />
          )}
          <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: FONT_SIZE.sm }}>
            {sent ? "Enviado!" : sending ? "A enviar..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── NotificationSettings ──────────────────────────────────────────────────────
export const NotificationSettings = () => {
  const { loginAsAdmin, setAdminMode } = useAuth();
  const { categories } = useHelper();

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("deviceId").then(setDeviceId);
  }, []);

  const { preferences, loading, updatePreferences } = useDevicePreferences(deviceId);

  const safePrefs: DevicePreferences = preferences ?? {
    news: true,
    over19_goals: true,  over19_matchday: true,  over19_result: true,
    sub19_goals: false,  sub19_matchday: false,  sub19_result: false,
    sub17_goals: false,  sub17_matchday: false,  sub17_result: false,
    sub15_goals: false,  sub15_matchday: false,  sub15_result: false,
    sub13_goals: false,  sub13_matchday: false,  sub13_result: false,
  };

  const handleTitleTap = useCallback(() => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (next >= 5) { setShowLoginModal(true); return 0; }
      tapTimerRef.current = setTimeout(() => setTapCount(0), 1500);
      return next;
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <TouchableOpacity onPress={handleTitleTap} activeOpacity={1}>
              <Text style={styles.headerTitle}>Definições</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Pickers */}
        <View style={{
          backgroundColor: "#FFFFFF", borderRadius: RADIUS.lg,
          padding: SPACING.md, marginBottom: SPACING.lg,
          borderWidth: 1, borderColor: "#E5E7EB",
        }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Escalão</Text>
              <CategoryPicker />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Época</Text>
              <SeasonPicker />
            </View>
          </View>
        </View>

        {/* Notícias */}
        <Text style={styles.sectionTitle}>Notícias</Text>
        <View style={[styles.toggleCard, { marginBottom: SPACING.lg }]}>
          <View style={styles.toggleLeft}>
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: safePrefs.news ? "rgba(128,0,0,0.08)" : "#F3F4F6",
              justifyContent: "center", alignItems: "center",
            }}>
              <Ionicons name="newspaper-outline" size={20} color={safePrefs.news ? COLORS.primary : "#9CA3AF"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Alertas de Notícias</Text>
              <Text style={styles.toggleDescription}>Notificações de novas notícias.</Text>
            </View>
          </View>
          <Switch value={safePrefs.news} onValueChange={() => updatePreferences({ news: !safePrefs.news })} />
        </View>

        {/* Por escalão */}
        <Text style={styles.sectionTitle}>Notificações Por escalão</Text>
        {categories?.map((cfg: CategoryConfig) => (
          <EscalaoSection
            key={cfg.category}
            cfg={cfg}
            preferences={safePrefs}
            updatePreferences={updatePreferences}
            defaultOpen={false}
          />
        ))}

        {/* Sugestões & Erros */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Feedback</Text>
        <FeedbackBox deviceId={deviceId} />

        {/* Instagram */}
        <TouchableOpacity
          style={[styles.instagramBtn, { marginTop: SPACING.lg }]}
          onPress={() => Linking.openURL(teamConfig.instagram_URL)}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
          <Text style={styles.instagramBtnText}>Instagram</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Admin */}
      <Modal visible={showLoginModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Acesso Admin</Text>
            <TextInput
              placeholder="Username" value={userName}
              onChangeText={setUserName} autoCapitalize="none" style={styles.input}
            />
            <TextInput
              placeholder="Password" value={password}
              onChangeText={setPassword} secureTextEntry style={styles.input}
            />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={async () => {
                try {
                  const data = await loginRequest(userName, password);
                  await loginAsAdmin(data.accessToken, data.refreshToken);
                  setShowLoginModal(false);
                  setAdminMode(true);
                } catch (e) {
                  console.log("login error", e);
                }
              }}
            >
              <Text style={styles.loginBtnText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLoginModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
