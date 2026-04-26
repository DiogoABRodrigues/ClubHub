import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS } from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginRequest } from "../../services/AuthService";
import { Linking } from "react-native";
import { teamConfig } from "../../config/teamConfig";
import { useDevicePreferences } from "../../hooks/useDevicePreferences";

export const NotificationSettings = ({ navigation }: any) => {
  const { loginAsAdmin, setAdminMode } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDeviceId = async () => {
    const storedDeviceId = await AsyncStorage.getItem("deviceId");
    setDeviceId(storedDeviceId);
  };
  useEffect(() => {
    loadDeviceId();
  }, []);

  const { preferences, loading, updatePreferences } =
    useDevicePreferences(deviceId);
  const safePreferences = (preferences ?? {
    gameDayAlerts: false,
    goals: false,
    finalResult: false,
    newsAlerts: false,
  }) as NonNullable<typeof preferences>;

  const handleTitleTap = useCallback(() => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (next >= 5) {
        setShowLoginModal(true);
        return 0;
      }
      tapTimerRef.current = setTimeout(() => setTapCount(0), 1500);
      return next;
    });
  }, []);

  const notificationTypes = useMemo(
    () => [
      {
        key: "gameDayAlerts" as const,
        icon: "calendar-outline",
        title: "Alertas de Jogo",
        description:
          "Recebe notificações no dia dos jogos para não perderes nenhum momento importante",
        color: COLORS.textPrimary,
      },
      {
        key: "goals" as const,
        icon: "football-outline",
        title: "Golos",
        description: "Recebe alertas instantâneos quando há um golo",
        color: COLORS.textPrimary,
      },
      {
        key: "finalResult" as const,
        icon: "checkmark-done-outline",
        title: "Resultado Final",
        description: "Recebe notificação quando um jogo termina",
        color: COLORS.textPrimary,
      },
      {
        key: "newsAlerts" as const,
        icon: "newspaper-outline",
        title: "Alertas de Notícias",
        description: "Mantém-te atualizado com as últimas notícias do clube",
        color: COLORS.textPrimary,
      },
    ],
    [],
  );

  const togglePreference = (key: keyof NonNullable<typeof preferences>) => {
    const newPrefs = {
      ...safePreferences,
      [key]: !safePreferences[key],
    };

    updatePreferences(newPrefs);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        {/* Notification Toggles */}
        <View style={styles.section}>
          {notificationTypes.map(({ key, icon, title, description, color }) => (
            <View key={key} style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={[styles.iconCircle]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>{title}</Text>
                  <Text style={styles.toggleDescription}>{description}</Text>
                </View>
              </View>
              <Switch
                value={safePreferences[key]}
                onValueChange={() => {
                  togglePreference(key);
                }}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.instagramBtn}
            onPress={() => Linking.openURL(teamConfig.instagram_URL)}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
            <Text style={styles.instagramBtnText}>Instagram</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ marginBottom: 15 }}></View>
      <Modal visible={showLoginModal} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Acesso Admin</Text>

            <TextInput
              placeholder="Username"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};
