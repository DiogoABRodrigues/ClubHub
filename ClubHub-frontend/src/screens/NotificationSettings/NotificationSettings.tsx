import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, Pressable, Keyboard, TextInput, LayoutAnimation, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginRequest } from "../../services/AuthService";
import { Linking } from "react-native";
import { teamConfig } from "../../config/teamConfig";
import { useDevicePreferences, DevicePreferences } from "../../hooks/useDevicePreferences";
import { SeasonPicker } from "../../components/Seasonpicker";
import { CategoryPicker } from "../../components/Categorypicker";

type CategoryKey = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

const NOTIFICATION_ROWS: { key: keyof DevicePreferences; icon: string; label: string; desc: string }[] = [
  { key: "matchday" as any, icon: "calendar-outline",        label: "Alerta de jogo",  desc: "Notificação no dia do jogo" },
  { key: "goals"    as any, icon: "football-outline",        label: "Golos",            desc: "Quando há um golo" },
  { key: "result"   as any, icon: "checkmark-done-outline",  label: "Resultado final",  desc: "Quando o jogo termina" },
];

function categoryPrefKey(cat: CategoryKey, type: "goals" | "matchday" | "result"): keyof DevicePreferences {
  return `${cat}_${type}` as keyof DevicePreferences;
}

function EscalaoSection({
  cfg,
  preferences,
  updatePreferences,
  defaultOpen,
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
      backgroundColor: "#FFFFFF",
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginBottom: SPACING.sm,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    }}>
      {/* Header colapsável */}
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
          gap: SPACING.sm,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: open ? "rgba(128,0,0,0.08)" : "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Ionicons
            name="trophy-outline"
            size={16}
            color={open ? COLORS.primary : "#9CA3AF"}
          />
        </View>
        <Text style={{
          flex: 1,
          fontSize: FONT_SIZE.md,
          fontWeight: "600",
          color: "#111827",
        }}>{cfg.label}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#9ca3af"
        />
      </TouchableOpacity>

      {/* Rows de toggles */}
      {open && (
        <View style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          {/* Label da secção */}
          <View style={{
            paddingHorizontal: SPACING.md,
            paddingTop: SPACING.sm,
            paddingBottom: SPACING.xs,
            backgroundColor: "#FAFAFA",
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}>
            <Text style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: 0.7,
            }}>Jogos</Text>
          </View>

          {NOTIFICATION_ROWS.map(({ key: _key, icon, label, desc }, i) => {
            const prefKey = categoryPrefKey(cat, _key as "goals" | "matchday" | "result");
            const value = preferences[prefKey] as boolean;
            return (
              <View
                key={prefKey}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm + 2,
                  backgroundColor: "#FFFFFF",
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: "#F3F4F6",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: SPACING.sm }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: value ? "rgba(128,0,0,0.08)" : "#F3F4F6",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Ionicons name={icon as any} size={15} color={value ? COLORS.primary : "#9CA3AF"} />
                  </View>
                  <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                    <Text style={{
                      fontSize: FONT_SIZE.sm,
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: 1,
                    }}>{label}</Text>
                    <Text style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      lineHeight: 15,
                    }}>{desc}</Text>
                  </View>
                </View>
                <Switch
                  value={value}
                  onValueChange={() => updatePreferences({ [prefKey]: !value })}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export const NotificationSettings = ({ navigation }: any) => {
  const { loginAsAdmin, setAdminMode } = useAuth();
  const enabledCategories = teamConfig.categories.filter((c) => c.enabled);

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
    over19_goals: true,    over19_matchday: true,   over19_result: true,
    sub19_goals: false,    sub19_matchday: false,   sub19_result: false,
    sub17_goals: false,    sub17_matchday: false,   sub17_result: false,
    sub15_goals: false,    sub15_matchday: false,   sub15_result: false,
    sub13_goals: false,    sub13_matchday: false,   sub13_result: false,
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

        {/* ── Pickers de escalão e época ── */}
        <View style={{
          backgroundColor: "#FFFFFF",
          borderRadius: RADIUS.lg,
          padding: SPACING.md,
          marginBottom: SPACING.lg,
          borderWidth: 1,
          borderColor: "#E5E7EB",
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

        {/* ── Notícias (global) ── */}
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
              <Text style={styles.toggleDescription}>
                Notificações de novas notícias.
              </Text>
            </View>
          </View>
          <Switch
            value={safePrefs.news}
            onValueChange={() => updatePreferences({ news: !safePrefs.news })}
          />
        </View>

        {/* ── Notificações por escalão ── */}
        <Text style={styles.sectionTitle}>Por escalão</Text>
        {enabledCategories.map((cfg) => (
          <EscalaoSection
            key={cfg.category}
            cfg={cfg}
            preferences={safePrefs}
            updatePreferences={updatePreferences}
            defaultOpen={cfg.category === "over19"}
          />
        ))}

        <TouchableOpacity
          style={[styles.instagramBtn, { marginTop: SPACING.lg }]}
          onPress={() => Linking.openURL(teamConfig.instagram_URL)}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
          <Text style={styles.instagramBtnText}>Instagram</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modal Admin ── */}
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
