import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
}

export function EnergyBar({ energy, maxEnergy }: EnergyBarProps) {
  const colors = useColors();
  const percentage = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <PixelText size="xs" color={colors.teal} bold>
          ENERGY
        </PixelText>
        <PixelText size="xs" color={colors.parchment} bold>
          {energy} / {maxEnergy}
        </PixelText>
      </View>
      <View style={[styles.barBackground, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: percentage > 30 ? colors.teal : colors.red,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barBackground: {
    height: 16,
    borderWidth: 1,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
});
