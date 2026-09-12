import React from "react";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/** Keep focused fields reachable and allow buttons to work with the keyboard open. */
export function FormScrollView(props: React.ComponentProps<typeof KeyboardAwareScrollView>) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraHeight={24}
      extraScrollHeight={12}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      enableResetScrollToCoords={false}
      // The enclosing KeyboardAvoidingView already reserves the iOS keyboard area.
      contentInset={{ bottom: 0 }}
      automaticallyAdjustKeyboardInsets={false}
      style={{ flexShrink: 1 }}
      {...props}
    />
  );
}
