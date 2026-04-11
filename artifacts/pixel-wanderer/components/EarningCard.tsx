import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import { PixelButton } from "./PixelButton";
import type { EarningOpportunity } from "@/constants/gameData";

interface EarningCardProps {
  opportunity: EarningOpportunity;
  onAccept: () => void;
  onDismiss: () => void;
}

const TYPE_LABEL: Record<EarningOpportunity["type"], string> = {
  scenic: "SCENIC SPOT",
  work: "WORK OPPORTUNITY",
  encounter: "CHANCE ENCOUNTER",
};

const TYPE_COLOR_KEY: Record<EarningOpportunity["type"], string> = {
  scenic: "skyBlue",
  work: "teal",
  encounter: "gold",
};

export function EarningCard({ opportunity, onAccept, onDismiss }: EarningCardProps) {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const accentColor =
    opportunity.type === "scenic"
      ? colors.skyBlue
      : opportunity.type === "work"
      ? colors.tealLight
      : colors.gold;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opportunity.id]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: colors.navyLight,
          borderColor: accentColor,
        },
      ]}
    >
      {/* Header strip */}
      <View style={[styles.typeStrip, { backgroundColor: accentColor }]}>
        <PixelText size="xs" color={colors.navy} bold>
          {TYPE_LABEL[opportunity.type]}
        </PixelText>
        <PixelText size="md" color={colors.navy} bold>
          +${opportunity.earnings}
        </PixelText>
      </View>

      {/* Content */}
      <View style={styles.body}>
        <PixelText size="sm" color={colors.parchment} bold>
          {opportunity.title}
        </PixelText>
        <PixelText size="xs" color={colors.parchmentDark} style={styles.desc}>
          {opportunity.description}
        </PixelText>
      </View>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <PixelButton
          onPress={onAccept}
          variant="primary"
          style={{ flex: 1 }}
        >
          {opportunity.actionLabel} (1⚡)
        </PixelButton>
        <PixelButton
          onPress={onDismiss}
          variant="ghost"
          style={{ flex: 1 }}
        >
          PASS
        </PixelButton>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    overflow: "hidden",
  },
  typeStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  desc: {
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
});
