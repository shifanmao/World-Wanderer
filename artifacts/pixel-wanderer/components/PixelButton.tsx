import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";

interface PixelButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export function PixelButton({
  onPress,
  children,
  variant = "primary",
  disabled = false,
  style,
  icon,
}: PixelButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const bgColor = {
    primary: colors.gold,
    secondary: colors.navyLight,
    danger: colors.red,
    ghost: "transparent",
  }[variant];

  const textColor = {
    primary: colors.navy,
    secondary: colors.parchment,
    danger: colors.parchment,
    ghost: colors.parchment,
  }[variant];

  const borderColor = {
    primary: colors.parchmentDark,
    secondary: colors.border,
    danger: "#8B0000",
    ghost: colors.border,
  }[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? `${bgColor}cc` : bgColor,
          borderColor,
          opacity: disabled ? 0.4 : 1,
          transform: [{ translateY: pressed ? 2 : 0 }],
        },
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon ? (
          <Text style={[styles.icon, { color: textColor }]}>{icon}</Text>
        ) : null}
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontFamily: "Inter_700Bold",
            },
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
