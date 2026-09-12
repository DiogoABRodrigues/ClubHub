import React from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";

/** A bounded modal: keyboard avoidance belongs to the full screen, not the sheet. */
export function FormModal({ visible, onClose, children }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable accessibilityLabel="Fechar janela" accessibilityRole="button"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: COLORS.backgrounds.overlay }]}
          onPress={() => { Keyboard.dismiss(); onClose(); }} />
        <View pointerEvents="box-none" style={{
          flex: 1, justifyContent: "center", alignItems: "center",
          paddingHorizontal: 12,
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 12),
        }}>
          <View pointerEvents="box-none" style={{ width: "100%", maxWidth: 560, maxHeight: "100%", flexShrink: 1 }}>
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
