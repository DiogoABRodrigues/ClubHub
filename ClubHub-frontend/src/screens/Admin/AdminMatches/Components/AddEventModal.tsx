import React, { useEffect, useMemo, useState } from "react";
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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { adminStyles } from "../AdminMatchDetail.styles";
import { eventStyles } from "../../../MatchDetails/MatchDetail.styles";
import { Player, PlayerWithStats } from "../../../../models/Player";
import { MatchEvent, MatchEventType} from "../../../../models/MatchEvent";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (event: MatchEvent) => Promise<void>;
  startingPlayers: PlayerWithStats[];
  substitutePlayers: PlayerWithStats[];
  eventToEdit?: MatchEvent;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const EMPTY_FORM: MatchEvent = {
  matchId: -1,
  type: "goal",
  playerId: null,
  playerOutId: null,
  playerInId: null,
  minute: 0,
  isOpponent: false,
};

const EVENT_TYPES: { key: MatchEventType; label: string; icon: string }[] = [
  { key: "goal", label: "Golo", icon: "⚽" },
  { key: "red_card", label: "Vermelho", icon: "🟥" },
  { key: "substitution", label: "Substituição", icon: "🔄" },
];

// ─── PlayerPicker ─────────────────────────────────────────────────────────────
interface PlayerPickerProps {
  label: string;
  players: Player[];
  selected: number | null | undefined;
  onSelect: (p: Player | null) => void;
  excludePlayer?: number | null;
}

const PlayerPicker = ({
  label,
  players,
  selected,
  onSelect,
  excludePlayer,
}: PlayerPickerProps) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return players.filter(
      (p) =>
        p.id !== excludePlayer && (!q || p.name.toLowerCase().includes(q)),
    );
  }, [players, search, excludePlayer]);

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={adminStyles.fieldLabel}>{label}</Text>
      {filtered.length > 0 ? (
        <ScrollView
          style={{
            maxHeight: 200,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 4,
          }} // altura máxima da box da lista
          nestedScrollEnabled // permite scroll dentro de scroll externo
        >
          {filtered.map((p) => {
            const isSelected = selected === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  eventStyles.playerItem,
                  isSelected && eventStyles.playerItemActive,
                ]}
                onPress={() => onSelect(isSelected ? null : p)}
              >
                <Text
                  style={[
                    eventStyles.playerName,
                    isSelected && eventStyles.playerNameActive,
                  ]}
                >
                  {p.name}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={eventStyles.noResults}>Nenhum jogador encontrado</Text>
      )}
    </View>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export const AddEventModal = ({
  visible,
  onClose,
  onSave,
  startingPlayers,
  substitutePlayers,
  eventToEdit,
}: Props) => {
  const [form, setForm] = useState<MatchEvent>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Reset ao fechar
  React.useEffect(() => {
    if (!visible) setForm(EMPTY_FORM);
  }, [visible]);

  const isOpponent = !!form.isOpponent;
  const isSubstitution = form.type === "substitution";
  // Golo e Vermelho suportam switch de adversário; substituição é sempre da equipa
  const supportsOpponent = form.type === "goal" || form.type === "red_card";

  const handleSave = async () => {
    if (!form.minute) {
      Alert.alert("Atenção", "O minuto é obrigatório.");
      return;
    }

    if (!isOpponent) {
      if (isSubstitution) {
        if (!form.playerInId || !form.playerOutId) {
          Alert.alert("Atenção", "Seleciona o jogador que sai e o que entra.");
          return;
        }
      } else {
        if (!form.isOwnGoal && !form.playerId) {
          Alert.alert("Atenção", "Seleciona o jogador.");
          return;
        }
      }
    }

    setSaving(true);
    try {
      await onSave(form);
      setForm(EMPTY_FORM);
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar o evento.");
    } finally {
      setSaving(false);
    }
  };

  //juntar starting + substitute, garantindo que não há duplicados (jogadores que estão em ambos aparecem só uma vez) e ordenados por nome
  const allPlayers = useMemo(() => {
    const map = new Map<number, Player>();
    startingPlayers.forEach((p) => map.set(p.id, p));
    substitutePlayers.forEach((p) => map.set(p.id, p));
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [startingPlayers, substitutePlayers]);

  const setField = <K extends keyof MatchEvent>(key: K, value: MatchEvent[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const OpPlayer = {
    id: -1,
    externalId: -1,
    name: "Adversário",
    photoUrl: null,
    age: null,
  } as Player;

  useEffect(() => {
    if (eventToEdit) {
      setForm({
        id: eventToEdit.id,
        matchId: eventToEdit.matchId,
        type: eventToEdit.type,
        minute: eventToEdit.minute,
        playerId: eventToEdit.playerId,
        playerOutId: eventToEdit.playerOutId,
        playerInId: eventToEdit.playerInId,
        isOpponent: eventToEdit.isOpponent,
        isOwnGoal: eventToEdit.isOwnGoal,
      });
    }
  }, [eventToEdit]);
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={adminStyles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={adminStyles.sheetWrapper}
      >
        <View style={[adminStyles.sheet, adminStyles.sheetTall]}>
          <View style={adminStyles.handle} />

          {/* Header */}
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
            {/* Tipo de evento */}
            <Text style={adminStyles.fieldLabel}>Tipo</Text>
            <View style={adminStyles.chipRow}>
              {EVENT_TYPES.map((et) => (
                <TouchableOpacity
                  key={et.key}
                  style={[
                    adminStyles.chip,
                    form.type === et.key && adminStyles.chipActive,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({
                      ...EMPTY_FORM,
                      minute: prev.minute,
                      type: et.key,
                    }))
                  }
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

            {/* Switch equipa adversária (só para golo e vermelho) */}
            {supportsOpponent && (
              <View style={adminStyles.switchRow}>
                <View>
                  <Text style={adminStyles.fieldLabel}>Equipa adversária</Text>
                  <Text style={adminStyles.switchSubtext}>
                    {isOpponent
                      ? "Apenas regista o minuto"
                      : "Seleciona o jogador da tua equipa"}
                  </Text>
                </View>
                <Switch
                  value={isOpponent}
                  onValueChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      isOpponent: val,
                      player: OpPlayer, // valor fictício para indicar que é adversário
                    }))
                  }
                  trackColor={{
                    false: COLORS.surface,
                    true: COLORS.primary + "55",
                  }}
                  thumbColor={isOpponent ? COLORS.primary : COLORS.muted}
                />
              </View>
            )}

            {/* Minuto */}
            <Text style={adminStyles.fieldLabel}>Minuto</Text>
            <TextInput
              style={adminStyles.input}
              value={form.minute.toString()}
              onChangeText={(v) => {
                // Remove tudo que não seja dígito
                const numeric = v.replace(/\D/g, "");

                // Converte para número
                let minute = Number(numeric);

                // Limita entre 1 e 90 (ou vazio se apagar)
                if (minute > 90) minute = 90;
                if (minute < 1 && numeric !== "") minute = 1;

                setField("minute", numeric === "" ? 0 : minute);
              }}
              placeholder="Ex: 45"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
            />
            {form.type === "goal" && !isOpponent && (
            <View style={adminStyles.switchRow}>
              <View>
                <Text style={adminStyles.fieldLabel}>Auto-golo</Text>
              </View>
              <Switch
                value={!!form.isOwnGoal}
                onValueChange={(val) => setField("isOwnGoal", val)}
                trackColor={{
                  false: COLORS.surface,
                  true: COLORS.primary + "55",
                }}
                thumbColor={form.isOwnGoal ? COLORS.primary : COLORS.muted}
              />
            </View>
          )}
            {/* Seleção de jogador(es) */}
            {!isOpponent &&
              (isSubstitution ? (
                /* ── Substituição: jogador que sai + que entra ── */
                <>
                  <View style={adminStyles.substitutionDivider}>
                    <View style={adminStyles.substitutionDividerLine} />
                    <Text style={adminStyles.substitutionDividerText}>
                      Substituição
                    </Text>
                    <View style={adminStyles.substitutionDividerLine} />
                  </View>

                  <PlayerPicker
                    label="🔴  Sai"
                    players={startingPlayers}
                    selected={form.playerOutId}
                    onSelect={(p) => setField("playerOutId", p?.id)}
                    excludePlayer={form.playerInId}
                  />

                  <View style={{ height: 12 }} />

                  <PlayerPicker
                    label="🟢  Entra"
                    players={substitutePlayers}
                    selected={form.playerInId}
                    onSelect={(p) => setField("playerInId", p?.id)}
                    excludePlayer={form.playerOutId}
                  />
                </>
              ) : form.isOwnGoal ? null :(
                /* ── Golo / Vermelho: um jogador ── */
                <PlayerPicker
                  label="Jogador"
                  players={allPlayers}
                  selected={form.playerId}
                  onSelect={(p) => setField("playerId", p?.id)}
                />
              ))}

            {/* Botão guardar */}
            <TouchableOpacity
              style={[
                adminStyles.saveBtn,
                saving && adminStyles.saveBtnDisabled,
              ]}
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
