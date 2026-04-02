import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";
import { adminStyles } from "../AdminMatchDetail.styles";
import { usePlayers } from "../../../../hooks/usePlayers";
import { useMatches } from "../../../../hooks/useMatches";
import { isFieldPlayer } from "../../../../utils/playerPositionUtils";

interface Props {
  visible: boolean;
  matchId: number | string;
  onClose: () => void;
  existingLineup?: any[];
}

type Phase = "starters" | "subs";
const MAX_STARTERS = 11;

/* ───────── PlayerCard MEMO ───────── */
const PlayerCard = React.memo(
  ({
    player,
    selected,
    onPress,
  }: {
    player: any;
    selected: boolean;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        style={[
          adminStyles.playerCard,
          selected && adminStyles.playerCardSelected,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {player.photoUrl ? (
          <Image
            source={{ uri: player.photoUrl }}
            style={adminStyles.playerCardPhoto}
          />
        ) : (
          <View style={adminStyles.playerCardAvatar}>
            <Text style={adminStyles.playerCardAvatarText}>
              {player.name
                .split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        )}

        <Text
          style={[
            adminStyles.playerCardName,
            selected && adminStyles.playerCardNameSelected,
          ]}
          numberOfLines={2}
        >
          {player.name}
        </Text>

        {selected && (
          <View style={adminStyles.playerCardCheck}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.primary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

export const AddLineupModal = ({
  visible,
  matchId,
  onClose,
  existingLineup = [],
}: Props) => {
  const { getActivePlayers, loading } = usePlayers();
  const { saveLineup } = useMatches();

  const players = getActivePlayers();

  const [phase, setPhase] = useState<Phase>("starters");
  const [search, setSearch] = useState("");

  const [starterIds, setStarterIds] = useState<Set<string>>(new Set());
  const [subIds, setSubIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  /* ───────── RESET ───────── */
  useEffect(() => {
    if (!visible) return;

    setPhase("starters");
    setSearch("");

    setStarterIds(
      new Set(
        existingLineup
          .filter((e) => e.isStarting)
          .map((e) => String(e.playerId)),
      ),
    );

    setSubIds(
      new Set(
        existingLineup
          .filter((e) => !e.isStarting)
          .map((e) => String(e.playerId)),
      ),
    );
  }, [visible, existingLineup]);

  /* ───────── FILTERS ───────── */
  const eligiblePlayers = useMemo(
    () => players.filter(isFieldPlayer),
    [players],
  );

  const filteredPlayers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return eligiblePlayers;

    return eligiblePlayers.filter((p) => p.name.toLowerCase().includes(q));
  }, [eligiblePlayers, search]);

  const displayPlayers = useMemo(() => {
    if (phase === "subs") {
      return filteredPlayers.filter((p) => !starterIds.has(String(p.id)));
    }
    return filteredPlayers;
  }, [filteredPlayers, phase, starterIds]);

  /* ───────── TOGGLES ───────── */
  const toggleStarter = useCallback((id: string) => {
    setStarterIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_STARTERS) {
          Alert.alert(
            "Limite atingido",
            `Só podes selecionar ${MAX_STARTERS} titulares.`,
          );
          return prev;
        }
        next.add(id);
      }

      return next;
    });

    setSubIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSub = useCallback((id: string) => {
    setSubIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggle = phase === "starters" ? toggleStarter : toggleSub;
  const activeSet = phase === "starters" ? starterIds : subIds;

  /* ───────── SAVE ───────── */
  const handleSave = useCallback(async () => {
    const allEntries = [
      ...Array.from(starterIds).map((id) => ({
        playerId: id,
        isStarting: true,
      })),
      ...Array.from(subIds).map((id) => ({
        playerId: id,
        isStarting: false,
      })),
    ];

    if (allEntries.length === 0) {
      Alert.alert("Atenção", "Seleciona pelo menos um jogador.");
      return;
    }

    try {
      setSaving(true);
      await saveLineup(Number(matchId), allEntries);
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível guardar a formação.");
    } finally {
      setSaving(false);
    }
  }, [starterIds, subIds, matchId, saveLineup, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={adminStyles.overlay} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={adminStyles.sheetWrapper}
      >
        <View style={[adminStyles.sheet, adminStyles.sheetTall]}>
          <View style={adminStyles.handle} />

          {/* HEADER */}
          <View style={adminStyles.sheetHeader}>
            <View>
              <Text style={adminStyles.sheetTitle}>
                {phase === "starters" ? "Titulares" : "Suplentes"}
              </Text>
              <Text style={adminStyles.sheetSubtitle}>
                {phase === "starters"
                  ? `${starterIds.size} / ${MAX_STARTERS} selecionados`
                  : `${subIds.size} selecionados`}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <View style={adminStyles.searchRow}>
            <TextInput
              style={adminStyles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Filtrar jogadores..."
            />
          </View>

          {/* LIST */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} />
          ) : (
            <ScrollView contentContainerStyle={adminStyles.playerGrid}>
              {displayPlayers.map((p) => (
                <PlayerCard
                  key={String(p.id)}
                  player={p}
                  selected={activeSet.has(String(p.id))}
                  onPress={() => toggle(String(p.id))}
                />
              ))}
            </ScrollView>
          )}

          {/* FOOTER (RESTAURADO EXACTAMENTE COMO ORIGINAL) */}
          <View style={adminStyles.sheetFooter}>
            {phase === "starters" ? (
              <TouchableOpacity
                style={adminStyles.saveBtn}
                onPress={() => setPhase("subs")}
              >
                <Text style={adminStyles.saveBtnText}>
                  Continuar para suplentes →
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={adminStyles.footerRow}>
                <TouchableOpacity
                  onPress={() => setPhase("starters")}
                  style={[adminStyles.saveBtn, adminStyles.saveBtnSecondary]}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    adminStyles.saveBtn,
                    adminStyles.saveBtnFlex,
                    saving && adminStyles.saveBtnDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={adminStyles.saveBtnText}>
                      Guardar Formação
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
