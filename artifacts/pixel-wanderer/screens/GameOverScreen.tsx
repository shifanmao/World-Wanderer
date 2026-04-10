import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DESTINATIONS, STARTING_BUDGET } from "@/constants/gameData";
import { useGame } from "@/context/GameContext";

export function GameOverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, resetGame } = useGame();

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const spent = STARTING_BUDGET - state.budget;
  const completion = Math.round(
    (state.visitedDestinations.length / DESTINATIONS.length) * 100,
  );

  let rank = "ROOKIE TRAVELER";
  if (state.visitedDestinations.length >= 6) rank = "WORLD WANDERER";
  else if (state.visitedDestinations.length >= 4) rank = "GLOBE TROTTER";
  else if (state.visitedDestinations.length >= 2) rank = "EXPLORER";

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: colors.navy },
      ]}
    >
      <View
        style={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 },
        ]}
      >
        <View style={styles.titleArea}>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            JOURNEY COMPLETE
          </PixelText>
          <PixelText size="xxl" color={colors.gold} bold align="center" shadow>
            THE END
          </PixelText>
          <View style={[styles.divider, { backgroundColor: colors.gold }]} />
          <PixelText size="lg" color={colors.parchment} bold align="center">
            {rank}
          </PixelText>
        </View>

        <View style={[styles.statsBox, { backgroundColor: colors.navyLight, borderColor: colors.gold }]}>
          <PixelText size="xs" color={colors.gold} bold align="center">
            FINAL STATS
          </PixelText>

          {[
            { label: "Destinations Visited", value: `${state.visitedDestinations.length} / ${DESTINATIONS.length}` },
            { label: "World Explored", value: `${completion}%` },
            { label: "Days Traveled", value: `${state.dayCount}` },
            { label: "Budget Spent", value: `$${spent.toLocaleString()}` },
            { label: "Budget Remaining", value: `$${state.budget.toLocaleString()}` },
            { label: "Items Collected", value: `${state.collectedItems.length}` },
          ].map(({ label, value }) => (
            <View key={label} style={[styles.statRow, { borderColor: colors.border }]}>
              <PixelText size="sm" color={colors.parchmentDark}>{label}</PixelText>
              <PixelText size="sm" color={colors.gold} bold>{value}</PixelText>
            </View>
          ))}
        </View>

        {state.collectedItems.length > 0 && (
          <View style={styles.itemsArea}>
            <PixelText size="xs" color={colors.tealLight} bold align="center">
              COLLECTED ITEMS
            </PixelText>
            {state.collectedItems.map((item) => (
              <PixelText key={item} size="xs" color={colors.parchmentDark} align="center">
                · {item}
              </PixelText>
            ))}
          </View>
        )}

        <View style={styles.buttonArea}>
          <PixelButton onPress={resetGame} variant="primary">
            NEW JOURNEY
          </PixelButton>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
    justifyContent: "space-between",
  },
  titleArea: {
    alignItems: "center",
    gap: 8,
  },
  divider: {
    height: 2,
    width: 60,
    marginVertical: 4,
  },
  statsBox: {
    borderWidth: 3,
    padding: 16,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  itemsArea: {
    gap: 4,
    alignItems: "center",
  },
  buttonArea: {
    gap: 8,
  },
});
