import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { usePlayers } from "../../../../contexts/PlayersContext";
import { Player } from "../../../../models/Player";
import { useMatches } from "../../../../contexts/MatchesContext";
import { mapToMainPosition } from "../../../../utils/playerPositionUtils";
import { Lineup } from "../../../../models/Lineup";


interface Props {
  visible: boolean;
  matchId: number | string;
  onClose: () => void;
  existingLineup?: Lineup[];
}

type Phase = "starters" | "subs";

const MAX_STARTERS = 11;

const PlayerCard = ({
  player,
  selected,
  onPress,
}: {
  player: Player;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[adminStyles.playerCard, selected && adminStyles.playerCardSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {player.photoUrl ? (
      <Image source={{ uri: player.photoUrl }} style={adminStyles.playerCardPhoto} />
    ) : (
      <View style={adminStyles.playerCardAvatar}>
        <Text style={adminStyles.playerCardAvatarText}>
          {player.name
            .split(" ")
            .map((w) => w[0])
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
        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
      </View>
    )}
  </TouchableOpacity>
);

export const AddLineupModal = ({
  visible,
  matchId,
  onClose,
  existingLineup = [],
}: Props) => {
  const { players, loading } = usePlayers();
  const { saveLineup } = useMatches();

  const [phase, setPhase] = useState<Phase>("starters");
  const [search, setSearch] = useState("");

  const [starterIds, setStarterIds] = useState<Set<string>>(new Set());
  const [subIds, setSubIds] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);

  // Reset quando abre modal
  useEffect(() => {
    if (!visible) return;

    setPhase("starters");
    setSearch("");

    setStarterIds(
      new Set(
        existingLineup
          .filter((e) => e.isStarting)
          .map((e) => String(e.playerId))
      )
    );

    setSubIds(
      new Set(
        existingLineup
          .filter((e) => !e.isStarting)
          .map((e) => String(e.playerId))
      )
    );
  }, [visible, existingLineup]);

  const eligiblePlayers = useMemo(() => {
    const excluded = ["Treinador", "Outros Técnicos"];
    return players.filter(
      (p) => !excluded.includes(mapToMainPosition(p.stats?.position || ""))
    );
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return eligiblePlayers;
    return eligiblePlayers.filter((p) => p.name.toLowerCase().includes(q));
  }, [eligiblePlayers, search]);

  const displayPlayers = useMemo(() => {
    if (phase === "subs") {
      return filteredPlayers.filter(
        (p) => !starterIds.has(String(p.id))
      );
    }

    return filteredPlayers;
  }, [filteredPlayers, phase, starterIds]);

  const toggleStarter = useCallback((id: string) => {
    setStarterIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_STARTERS) {
          Alert.alert(
            "Limite atingido",
            `Só podes selecionar ${MAX_STARTERS} titulares.`
          );
          return prev;
        }

        next.add(id);
      }

      return next;
    });

    // remove dos suplentes
    setSubIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSub = useCallback((id: string) => {
    setSubIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleAdvance = () => {
    if (starterIds.size < MAX_STARTERS) {
      Alert.alert(
        "Titulares incompletos",
        `Tens ${starterIds.size} de ${MAX_STARTERS} titulares.`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: () => setPhase("subs") },
        ]
      );
      return;
    }

    setPhase("subs");
  };

  const handleSave = async () => {
    const allEntries = [
      ...Array.from(starterIds).map((id) => ({ playerId: id, isStarting: true })),
      ...Array.from(subIds).map((id) => ({ playerId: id, isStarting: false })),
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
  };

  const isStarters = phase === "starters";
  const activeSet = isStarters ? starterIds : subIds;
  const toggle = isStarters ? toggleStarter : toggleSub;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={adminStyles.overlay} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={adminStyles.sheetWrapper}
      >
        <View style={[adminStyles.sheet, adminStyles.sheetTall]}>

          <View style={adminStyles.handle} />

          {/* Header */}
          <View style={adminStyles.sheetHeader}>
            <View>
              <Text style={adminStyles.sheetTitle}>
                {isStarters ? "Titulares" : "Suplentes"}
              </Text>
              <Text style={adminStyles.sheetSubtitle}>
                {isStarters
                  ? `${starterIds.size} / ${MAX_STARTERS} selecionados`
                  : `${subIds.size} selecionados`}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={adminStyles.searchRow}>
            <Ionicons name="search-outline" size={16} color={COLORS.muted} />

            <TextInput
              style={adminStyles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Filtrar jogadores..."
              placeholderTextColor={COLORS.muted}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={COLORS.muted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={adminStyles.playerGrid}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {displayPlayers.length === 0 ? (
                <Text style={adminStyles.emptyText}>
                  Nenhum jogador encontrado
                </Text>
              ) : (
                displayPlayers.map((p) => (
                  <PlayerCard
                    key={String(p.id)}
                    player={p}
                    selected={activeSet.has(String(p.id))}
                    onPress={() => toggle(String(p.id))}
                  />
                ))
              )}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={adminStyles.sheetFooter}>
            {isStarters ? (
              <TouchableOpacity style={adminStyles.saveBtn} onPress={handleAdvance}>
                <Text style={adminStyles.saveBtnText}>
                  Continuar para suplentes →
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={adminStyles.footerRow}>
                <TouchableOpacity
                  style={[adminStyles.saveBtn, adminStyles.saveBtnSecondary]}
                  onPress={() => setPhase("starters")}
                >
                  <Text style={adminStyles.saveBtnSecondaryText}>← Voltar</Text>
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