import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles/EmptyState.styles";

interface EmptyStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const EmptyState = ({
  title,
  message,
  onRetry,
  retryLabel = "Tentar novamente",
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {message && <Text style={styles.message}>{message}</Text>}

      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
