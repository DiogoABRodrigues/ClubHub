import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { adminStyles } from "../AdminMatchDetail.styles";
import { eventStyles } from "../../../MatchDetails/MatchDetail.styles";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type EventType = "goal" | "yellow_card" | "red_card" | "substitution";

export interface EventForm {
  type: EventType;
  minute: string;
  player: string;
  description: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (event: EventForm) => Promise<void>;
  players: string[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EMPTY_EVENT: EventForm = {
  type: "goal",
  minute: "",
  player: "",
  description: "",
};

const EVENT_TYPES: { key: EventType; label: string; icon: string }[] = [
  { key: "goal", label: "Golo", icon: "⚽" },
  { key: "yellow_card", label: "Amarelo", icon: "🟨" },
  { key: "red_card", label: "Vermelho", icon: "🟥" },
  { key: "substitution", label: "Substituição", icon: "🔄" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export const AddEventModal = ({ visible, onClose, onSave, players }: Props) => {
  const [form, setForm] = useState<EventForm>(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");

  React.useEffect(() => {
    if (!visible) {
      setForm(EMPTY_EVENT);
      setPlayerSearch("");
    }
  }, [visible]);

  const filteredPlayers = useMemo(() => {
    const q = playerSearch.toLowerCase();
    return q ? players.filter((p) => p.toLowerCase().includes(q)) : players;
  }, [players, playerSearch]);

  const updateField = (field: keyof EventForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.minute || !form.player) {
      Alert.alert("Atenção", "Minuto e jogador são obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      setForm(EMPTY_EVENT);
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar o evento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={adminStyles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={adminStyles.sheetWrapper}
      >
        <View style={adminStyles.sheet}>
          <View style={adminStyles.handle} />

          <View style={adminStyles.sheetHeader}>
            <Text style={adminStyles.sheetTitle}>Adicionar Evento</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={adminStyles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Tipo */}
            <Text style={adminStyles.fieldLabel}>Tipo</Text>
            <View style={adminStyles.chipRow}>
              {EVENT_TYPES.map((et) => (
                <TouchableOpacity
                  key={et.key}
                  style={[adminStyles.chip, form.type === et.key && adminStyles.chipActive]}
                  onPress={() => setForm((p) => ({ ...p, type: et.key }))}
                >
                  <Text style={adminStyles.chipEmoji}>{et.icon}</Text>
                  <Text
                    style={[
                      adminStyles.chipText,
                      form.type === et.key && adminStyles.chipTextActive,
                    ]}
                  >
                    {et.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Minuto */}
            <Text style={adminStyles.fieldLabel}>Minuto</Text>
            <TextInput
              style={adminStyles.input}
              value={form.minute}
              onChangeText={updateField("minute")}
              placeholder="Ex: 45"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
            />

            {/* Jogador */}
            <Text style={adminStyles.fieldLabel}>Jogador</Text>
            {players.length > 0 ? (
              <>
                <View style={eventStyles.searchRow}>
                  <Ionicons name="search-outline" size={16} color={COLORS.muted} />
                  <TextInput
                    style={eventStyles.searchInput}
                    value={playerSearch}
                    onChangeText={setPlayerSearch}
                    placeholder="Filtrar jogadores..."
                    placeholderTextColor={COLORS.muted}
                  />
                  {playerSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setPlayerSearch("")}>
                      <Ionicons name="close-circle" size={16} color={COLORS.muted} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={eventStyles.playerList}>
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[
                          eventStyles.playerItem,
                          form.player === p && eventStyles.playerItemActive,
                        ]}
                        onPress={() => setForm((prev) => ({ ...prev, player: p }))}
                      >
                        <View style={eventStyles.playerAvatar}>
                          <Text style={eventStyles.playerAvatarText}>
                            {p.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                          </Text>
                        </View>
                        <Text
                          style={[
                            eventStyles.playerName,
                            form.player === p && eventStyles.playerNameActive,
                          ]}
                        >
                          {p}
                        </Text>
                        {form.player === p && (
                          <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={eventStyles.noResults}>Nenhum jogador encontrado</Text>
                  )}
                </View>
                {form.player ? (
                  <View style={eventStyles.selectedBadge}>
                    <Ionicons name="person-circle-outline" size={15} color={COLORS.primary} />
                    <Text style={eventStyles.selectedBadgeText}>{form.player}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <TextInput
                style={adminStyles.input}
                value={form.player}
                onChangeText={updateField("player")}
                placeholder="Nome do jogador"
                placeholderTextColor={COLORS.muted}
              />
            )}

            {/* Descrição */}
            <Text style={adminStyles.fieldLabel}>Descrição (opcional)</Text>
            <TextInput
              style={[adminStyles.input, adminStyles.textArea]}
              value={form.description}
              onChangeText={updateField("description")}
              placeholder="Detalhe adicional..."
              placeholderTextColor={COLORS.muted}
              multiline
            />

            <TouchableOpacity
              style={[adminStyles.saveBtn, saving && adminStyles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={adminStyles.saveBtnText}>Adicionar Evento</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};