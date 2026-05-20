// src/components/ZZImage.tsx
import React, { useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

// O Samsung S25 (One UI 7) envia um User-Agent que o zerozero.pt bloqueia com 403.
// Forçamos um User-Agent de browser para contornar.
const ZEROZERO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  Referer: "https://www.zerozero.pt/",
  Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
};

interface ZZImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: "contain" | "cover" | "stretch" | "center";
  onError?: () => void;
  onLoad?: () => void;
}

export const ZZImage = ({
  uri,
  style,
  resizeMode = "contain",
  onError,
  onLoad,
}: ZZImageProps) => {
  if (!uri) return null;

  const isZerozero = uri.includes("zerozero.pt");

  return (
    <Image
      source={{
        uri,
        ...(isZerozero ? { headers: ZEROZERO_HEADERS } : {}),
      }}
      style={style}
      resizeMode={resizeMode}
      onError={onError}
      onLoad={onLoad}
    />
  );
};