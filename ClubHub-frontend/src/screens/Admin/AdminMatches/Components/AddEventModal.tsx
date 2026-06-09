import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { Player } from "../../../../models/Player";
import { MatchEvent, MatchEventType } from "../../../../models/MatchEvent";

const PHASE_BASE: Record<string, number> = {
  "1st": 45,
  "2nd": 90,
  extra: 120,
};

const MIN_MINUTE: Record<string, number> = {
  "1st": 1,
  "2nd": 46,
  extra: 91,
};

const MAX_MINUTE: Record<string, number> = {
  "1st": 60,
  "2nd": 105,
  extra: 130,
};

const MINUTE_PLACEHOLDER: Record<string, string> = {
  "1st": "1 até 45+",
  "2nd": "46 até 90+",
  extra: "91 até 120+",
};

export function formatMinute(minute: number, phase?: string): string {
  if (!phase || phase === "penalties") return `${minute}'`;
  const base = PHASE_BASE[phase];
  if (base !== undefined && minute > base) return `${base}+${minute - base}'`;
  return `${minute}'`;
}

const EMPTY_FORM: MatchEvent = {
  matchId: -1,
  type: "goal",
  playerId: null,
  playerOutId: null,
  playerInId: null,
  minute: 0,
  phase: "1st",
  isOpponent: false,
  penaltyScored: true,
};

const EVENT_TYPES: { key: MatchEventType; label: string; icon: string }[] = [
  { key: "goal", label: "Golo", icon: "⚽" },
  { key: "red_card", label: "Vermelho", icon: "🟥" },
  { key: "substitution", label: "Substituição", icon: "🔄" },
  { key: "penalty_shootout", label: "Penaltis", icon: "⚽" },
];

const PHASE_LABELS: Record<string, string> = {
  "1st": "1ª Parte",
  "2nd": "2ª Parte",
  extra: "Prolongamento",
  penalties: "Série de Penaltis",
};

const PlayerPicker = React.memo(
  ({
    label,
    players,
    selected,
    onSelect,
    excludePlayer,
  }: {
    label: string;
    players: Player[];
    selected: number | null | undefined;
    onSelect: (p: Player | null) => void;
    excludePlayer?: number | null;
  }) => {
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
            }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
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
  },
);

export const AddEventModal = ({
  visible,
  onClose,
  onSave,
  startingPlayers,
  substitutePlayers,
  eventToEdit,
  currentPhase,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (event: MatchEvent) => Promise<void>;
  startingPlayers: Player[];
  substitutePlayers: Player[];
  eventToEdit?: MatchEvent;
  currentPhase?: MatchEvent["phase"];
}) => {
  const [form, setForm] = useState<MatchEvent>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const base = eventToEdit
      ? { ...EMPTY_FORM, ...eventToEdit }
      : {
          ...EMPTY_FORM,
          phase: currentPhase ?? "1st",
          type: (currentPhase === "penalties" ? "penalty_shootout" : "goal") as MatchEventType,
        };
    setForm(base);
  }, [visible, eventToEdit, currentPhase]);

  const isOpponent = !!form.isOpponent;
  const isSubstitution = form.type === "substitution";
  const isPenaltyShootout = form.type === "penalty_shootout";
  const supportsOpponent =
    form.type === "goal" || form.type === "red_card" || isPenaltyShootout;

  const allPlayers = useMemo(() => {
    const map = new Map<number, Player>();
    startingPlayers.forEach((p) => map.set(p.id, p));
    substitutePlayers.forEach((p) => map.set(p.id, p));
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [startingPlayers, substitutePlayers]);

  const setField = useCallback(
    <K extends keyof MatchEvent>(key: K, value: MatchEvent[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (saving) return;

    if (isPenaltyShootout) {
      // série de penaltis: só precisa de saber se foi golo ou não (jogador opcional)
    } else {
      if (!form.minute || form.minute < 1) {
        Alert.alert("Atenção", "O minuto é obrigatório.");
        return;
      }
      const minAllowed = MIN_MINUTE[form.phase ?? "1st"] ?? 1;
      if (form.minute < minAllowed) {
        Alert.alert("Atenção", `O minuto mínimo para esta fase é ${minAllowed}.`);
        return;
      }
      if (!isOpponent) {
        if (isSubstitution) {
          if (!form.playerInId || !form.playerOutId) {
            Alert.alert("Atenção", "Seleciona o jogador que sai e o que entra.");
            return;
          }
        } else if (!form.isOwnGoal && !form.playerId) {
          Alert.alert("Atenção", "Seleciona o jogador.");
          return;
        }
      }
    }

    try {
      setSaving(true);
      await onSave(form);
      setForm(EMPTY_FORM);
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar o evento.");
    } finally {
      setSaving(false);
    }
  }, [form, onSave, onClose, isOpponent, isSubstitution, isPenaltyShootout, saving]);

  const handleMinuteChange = (v: string) => {
    const numeric = v.replace(/\D/g, "");
    if (numeric === "") { setField("minute", 0); return; }
    let minute = Number(numeric);
    if (Number.isNaN(minute)) minute = 0;
    const max = MAX_MINUTE[form.phase ?? "1st"] ?? 130;
    if (minute > max) minute = max;
    setField("minute", minute);
  };

  const minutePreview = useMemo(
    () => form.minute > 0 ? formatMinute(form.minute, form.phase ?? "1st") : "",
    [form.minute, form.phase],
  );

  const phaseLabel = PHASE_LABELS[currentPhase ?? "1st"] ?? currentPhase;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={adminStyles.sheetWrapper}
      >
        <View style={[adminStyles.sheet, adminStyles.sheetTall]}>
          <View style={adminStyles.handle} />

          <View style={adminStyles.sheetHeader}>
            <Text style={adminStyles.sheetTitle}>
              {eventToEdit ? "Editar Evento" : "Adicionar Evento"}
            </Text>
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
              {EVENT_TYPES.filter((et) =>
                currentPhase === "penalties"
                  ? et.key === "penalty_shootout"
                  : et.key !== "penalty_shootout"
              ).map((et) => (
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
                      phase: prev.phase,
                      type: et.key,
                      penaltyScored: true,
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

            {/* ── Série de Penaltis ─────────────────────────────────────── */}
            {isPenaltyShootout && (
              <>
                {/* Equipa */}
                <View style={adminStyles.switchRow}>
                  <Text style={adminStyles.fieldLabel}>Equipa adversária</Text>
                  <Switch
                    value={isOpponent}
                    onValueChange={(val) =>
                      setForm((prev) => ({ ...prev, isOpponent: val }))
                    }
                  />
                </View>

                {/* Resultado do penalti */}
                <Text style={adminStyles.fieldLabel}>Resultado</Text>
                <View style={adminStyles.chipRow}>
                  <TouchableOpacity
                    style={[
                      adminStyles.chip,
                      form.penaltyScored === true && adminStyles.chipActive,
                    ]}
                    onPress={() => setField("penaltyScored", true)}
                  >
                    <Text style={adminStyles.chipEmoji}>✅</Text>
                    <Text
                      style={[
                        adminStyles.chipText,
                        form.penaltyScored === true && adminStyles.chipTextActive,
                      ]}
                    >
                      Golo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      adminStyles.chip,
                      form.penaltyScored === false && adminStyles.chipActive,
                    ]}
                    onPress={() => setField("penaltyScored", false)}
                  >
                    <Text style={adminStyles.chipEmoji}>❌</Text>
                    <Text
                      style={[
                        adminStyles.chipText,
                        form.penaltyScored === false && adminStyles.chipTextActive,
                      ]}
                    >
                      Falhado
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Jogador (só se for da nossa equipa) */}
                {!isOpponent && (
                  <PlayerPicker
                    label="Jogador (opcional)"
                    players={allPlayers}
                    selected={form.playerId}
                    onSelect={(p) => setField("playerId", p?.id ?? null)}
                  />
                )}
              </>
            )}

            {/* ── Eventos normais ───────────────────────────────────────── */}
            {!isPenaltyShootout && (
              <>
                {/* Equipa adversária */}
                {supportsOpponent && (
                  <View style={adminStyles.switchRow}>
                    <Text style={adminStyles.fieldLabel}>Equipa adversária</Text>
                    <Switch
                      value={isOpponent}
                      onValueChange={(val) =>
                        setForm((prev) => ({ ...prev, isOpponent: val }))
                      }
                    />
                  </View>
                )}

                {/* Fase — bloqueada pelo statusTime */}
                <View style={adminStyles.switchRow}>
                  <Text style={adminStyles.fieldLabel}>Fase</Text>
                  <View
                    style={[
                      adminStyles.chip,
                      adminStyles.chipActive,
                      { opacity: 0.8 },
                    ]}
                  >
                    <Text style={adminStyles.chipTextActive}>{phaseLabel}</Text>
                  </View>
                </View>

                {/* Minuto */}
                <Text style={adminStyles.fieldLabel}>
                  Minuto{minutePreview ? ` — aparece como ${minutePreview}` : ""}
                </Text>
                <TextInput
                  style={adminStyles.input}
                  value={form.minute ? String(form.minute) : ""}
                  onChangeText={handleMinuteChange}
                  keyboardType="number-pad"
                  placeholder={MINUTE_PLACEHOLDER[form.phase ?? "1st"] ?? "1 até 45+"}
                  placeholderTextColor={COLORS.textMuted}
                />

                {/* Auto-golo */}
                {form.type === "goal" && !isOpponent && (
                  <View style={adminStyles.switchRow}>
                    <Text style={adminStyles.fieldLabel}>Auto-golo</Text>
                    <Switch
                      value={!!form.isOwnGoal}
                      onValueChange={(val) => setField("isOwnGoal", val)}
                    />
                  </View>
                )}

                {/* Jogadores */}
                {!isOpponent &&
                  (isSubstitution ? (
                    <>
                      <PlayerPicker
                        label="🔴 Sai"
                        players={startingPlayers}
                        selected={form.playerOutId}
                        onSelect={(p) => setField("playerOutId", p?.id ?? null)}
                        excludePlayer={form.playerInId}
                      />
                      <PlayerPicker
                        label="🟢 Entra"
                        players={substitutePlayers}
                        selected={form.playerInId}
                        onSelect={(p) => setField("playerInId", p?.id ?? null)}
                        excludePlayer={form.playerOutId}
                      />
                    </>
                  ) : form.isOwnGoal ? null : (
                    <PlayerPicker
                      label="Jogador"
                      players={allPlayers}
                      selected={form.playerId}
                      onSelect={(p) => setField("playerId", p?.id ?? null)}
                    />
                  ))}
              </>
            )}

            <TouchableOpacity
              style={[adminStyles.saveBtn, saving && adminStyles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={adminStyles.saveBtnText}>
                  {eventToEdit ? "Guardar Alterações" : "Adicionar Evento"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};