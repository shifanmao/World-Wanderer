import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import { useGame } from "@/context/GameContext";
import { STARTING_BUDGET } from "@/constants/gameData";

export function BudgetBar() {
  const colors = useColors();
  const { state } = useGame();
  const pct = Math.max(0, Math.min(1, state.budget / STARTING_BUDGET));

  const barColor =
    pct > 0.5 ? colors.teal : pct > 0.25 ? colors.gold : colors.red;

  return (
    <View style={[styles.container, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
      <View style={styles.row}>
        <PixelText size="xs" color={colors.mutedForeground}>
          BUDGET
        </PixelText>
        <PixelText size="xs" color={colors.gold} bold>
          ${state.budget.toLocaleString()}
        </PixelText>
      </View>
      <View style={[styles.track, { backgroundColor: colors.navy }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct * 100}%` as any, backgroundColor: barColor },
          ]}
        />
      </View>
      <View style={styles.row}>
        <PixelText size="xs" color={colors.mutedForeground}>
          DAY {state.dayCount}
        </PixelText>
        <PixelText size="xs" color={colors.mutedForeground}>
          {state.visitedDestinations.length} VISITED
        </PixelText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    height: 6,
    borderRadius: 0,
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 0,
  },
});
