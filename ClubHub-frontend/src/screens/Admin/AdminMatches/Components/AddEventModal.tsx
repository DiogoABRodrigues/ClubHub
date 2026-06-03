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

const PlayerPicker = React.memo(
  ({ label, players, selected, onSelect, excludePlayer }: {
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
        (p) => p.id !== excludePlayer && (!q || p.name.toLowerCase().includes(q)),
      );
    }, [players, search, excludePlayer]);

    return (
      <View style={{ marginTop: 8 }}>
        <Text style={adminStyles.fieldLabel}>{label}</Text>
        {filtered.length > 0 ? (
          <ScrollView
            style={{ maxHeight: 200, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {filtered.map((p) => {
              const isSelected = selected === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[eventStyles.playerItem, isSelected && eventStyles.playerItemActive]}
                  onPress={() => onSelect(isSelected ? null : p)}
                >
                  <Text style={[eventStyles.playerName, isSelected && eventStyles.playerNameActive]}>
                    {p.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
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
  visible, onClose, onSave, startingPlayers, substitutePlayers, eventToEdit,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (event: MatchEvent) => Promise<void>;
  startingPlayers: Player[];
  substitutePlayers: Player[];
  eventToEdit?: MatchEvent;
}) => {
  const [form, setForm] = useState<MatchEvent>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setForm(eventToEdit ? { ...EMPTY_FORM, ...eventToEdit } : EMPTY_FORM);
  }, [visible, eventToEdit]);

  const isOpponent = !!form.isOpponent;
  const isSubstitution = form.type === "substitution";
  const supportsOpponent = form.type === "goal" || form.type === "red_card";

  const allPlayers = useMemo(() => {
    const map = new Map<number, Player>();
    startingPlayers.forEach((p) => map.set(p.id, p));
    substitutePlayers.forEach((p) => map.set(p.id, p));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [startingPlayers, substitutePlayers]);

  const setField = useCallback(<K extends keyof MatchEvent>(key: K, value: MatchEvent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!form.minute || form.minute < 1) { Alert.alert("Atenção", "O minuto é obrigatório."); return; }
    if (!isOpponent) {
      if (isSubstitution) {
        if (!form.playerInId || !form.playerOutId) { Alert.alert("Atenção", "Seleciona o jogador que sai e o que entra."); return; }
      } else if (!form.isOwnGoal && !form.playerId) {
        Alert.alert("Atenção", "Seleciona o jogador."); return;
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
  }, [form, onSave, onClose, isOpponent, isSubstitution, saving]);

  const handleMinuteChange = (v: string) => {
    const numeric = v.replace(/\D/g, "");
    if (numeric === "") { setField("minute", 0); return; }
    let minute = Number(numeric);
    if (Number.isNaN(minute)) minute = 0;
    if (minute > 90) minute = 90;
    if (minute < 1) minute = 1;
    setField("minute", minute);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Overlay fecha ao tocar fora */}
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      {/* KeyboardAvoidingView colado ao fundo, fora do Pressable */}
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
            <Text style={adminStyles.fieldLabel}>Tipo</Text>
            <View style={adminStyles.chipRow}>
              {EVENT_TYPES.map((et) => (
                <TouchableOpacity
                  key={et.key}
                  style={[adminStyles.chip, form.type === et.key && adminStyles.chipActive]}
                  onPress={() => setForm((prev) => ({ ...EMPTY_FORM, minute: prev.minute, type: et.key }))}
                >
                  <Text style={adminStyles.chipEmoji}>{et.icon}</Text>
                  <Text style={[adminStyles.chipText, form.type === et.key && adminStyles.chipTextActive]}>
                    {et.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {supportsOpponent && (
              <View style={adminStyles.switchRow}>
                <Text style={adminStyles.fieldLabel}>Equipa adversária</Text>
                <Switch value={isOpponent} onValueChange={(val) => setForm((prev) => ({ ...prev, isOpponent: val }))} />
              </View>
            )}

            <Text style={adminStyles.fieldLabel}>Minuto</Text>
            <TextInput
              style={adminStyles.input}
              value={form.minute ? String(form.minute) : ""}
              onChangeText={handleMinuteChange}
              keyboardType="number-pad"
            />

            {form.type === "goal" && !isOpponent && (
              <View style={adminStyles.switchRow}>
                <Text style={adminStyles.fieldLabel}>Auto-golo</Text>
                <Switch value={!!form.isOwnGoal} onValueChange={(val) => setField("isOwnGoal", val)} />
              </View>
            )}

            {!isOpponent && (
              isSubstitution ? (
                <>
                  <PlayerPicker label="🔴 Sai" players={startingPlayers} selected={form.playerOutId} onSelect={(p) => setField("playerOutId", p?.id)} excludePlayer={form.playerInId} />
                  <PlayerPicker label="🟢 Entra" players={substitutePlayers} selected={form.playerInId} onSelect={(p) => setField("playerInId", p?.id)} excludePlayer={form.playerOutId} />
                </>
              ) : form.isOwnGoal ? null : (
                <PlayerPicker label="Jogador" players={allPlayers} selected={form.playerId} onSelect={(p) => setField("playerId", p?.id)} />
              )
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