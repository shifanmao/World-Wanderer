import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import { useGame } from "@/context/GameContext";
import { STARTING_BUDGET } from "@/constants/gameData";

export function BudgetAndEnergyBar() {
  const colors = useColors();
  const { state } = useGame();
  const budgetPct = Math.max(0, Math.min(1, state.budget / STARTING_BUDGET));
  const energyPct = Math.max(0, Math.min(100, (state.energy / state.maxEnergy) * 100));

  const dest = state.currentDestination;
  const visitCount = dest ? state.destinationVisitCounts[dest.id] || 1 : 1;
  const actionKey = dest ? `${dest.id}_${visitCount}` : '';
  const actionCount = dest && actionKey ? state.actionCounts[actionKey] || 0 : 0;
  const remainingActions = 5 - actionCount;
  const actionPct = Math.max(0, Math.min(1, remainingActions / 5));

  const budgetBarColor =
    budgetPct > 0.5 ? colors.teal : budgetPct > 0.25 ? colors.gold : colors.red;
  const energyBarColor = energyPct > 30 ? colors.teal : colors.red;
  const actionBarColor = actionPct > 0.6 ? colors.teal : actionPct > 0.3 ? colors.gold : colors.red;
  const isOutOfActions = actionCount >= 5;

  const actionAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state.actionBarAnimation) {
      Animated.sequence([
        Animated.timing(actionAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(actionAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state.actionBarAnimation, actionAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
      {/* Budget Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <PixelText size="xs" color={colors.mutedForeground}>
            💰 BUDGET
          </PixelText>
          <PixelText size="xs" color={colors.gold} bold>
            ${state.budget.toLocaleString()}
          </PixelText>
        </View>
        <View style={[styles.track, { backgroundColor: colors.navy }]}>
          <View
            style={[
              styles.fill,
              { width: `${budgetPct * 100}%` as any, backgroundColor: budgetBarColor },
            ]}
          />
        </View>
      </View>

      {/* Energy Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <PixelText size="xs" color={colors.teal} bold>
            ⚡ ENERGY
          </PixelText>
          <PixelText size="xs" color={colors.parchment} bold>
            {state.energy} / {state.maxEnergy}
          </PixelText>
        </View>
        <View style={[styles.track, { backgroundColor: colors.navy }]}>
          <View
            style={[
              styles.fill,
              { width: `${energyPct}%`, backgroundColor: energyBarColor },
            ]}
          />
        </View>
      </View>

      {/* Actions Section */}
      <Animated.View style={[styles.section, { transform: [{ scale: actionAnim }] }]}>
        <View style={styles.row}>
          <PixelText size="xs" color={isOutOfActions ? colors.red : colors.gold} bold>
            🎯 ACTIONS
          </PixelText>
          <PixelText size="xs" color={isOutOfActions ? colors.red : colors.parchment} bold>
            {remainingActions} / 5
          </PixelText>
        </View>
        <View style={[styles.track, { backgroundColor: colors.navy }]}>
          <View
            style={[
              styles.fill,
              { width: `${actionPct * 100}%`, backgroundColor: actionBarColor },
            ]}
          />
        </View>
        {isOutOfActions && (
          <PixelText size="xs" color={colors.red} align="center">
            Book a flight to continue
          </PixelText>
        )}
      </Animated.View>

      {/* Info Row */}
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
    gap: 8,
  },
  section: {
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
