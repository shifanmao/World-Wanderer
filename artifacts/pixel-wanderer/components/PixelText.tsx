import React from "react";
import { Text, TextStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface PixelTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
  style?: TextStyle;
  align?: "left" | "center" | "right";
  bold?: boolean;
  shadow?: boolean;
}

const SIZE_MAP = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export function PixelText({
  children,
  size = "md",
  color,
  style,
  align = "left",
  bold = false,
  shadow = false,
}: PixelTextProps) {
  const colors = useColors();
  const fontSize = SIZE_MAP[size];
  const textColor = color ?? colors.parchment;

  return (
    <Text
      style={[
        {
          fontFamily: bold ? "Inter_700Bold" : "Inter_400Regular",
          fontSize,
          color: textColor,
          textAlign: align,
          letterSpacing: bold ? 1 : 0.5,
          lineHeight: fontSize * 1.5,
          textShadowColor: shadow ? "rgba(0,0,0,0.8)" : undefined,
          textShadowOffset: shadow ? { width: 1, height: 1 } : undefined,
          textShadowRadius: shadow ? 2 : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
