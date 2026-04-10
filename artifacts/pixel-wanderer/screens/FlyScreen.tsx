import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { BudgetBar } from "@/components/BudgetBar";
import { DESTINATIONS } from "@/constants/gameData";
import { useGame } from "@/context/GameContext";

export function FlyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, flyTo, backToExploring } = useGame();
  const dest = state.currentDestination;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
<<<<<<< HEAD
  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
=======
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)

  const otherDestinations = DESTINATIONS.filter((d) => d.id !== dest?.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
<<<<<<< HEAD
            paddingTop: topPad + 8,
=======
            paddingTop: titleTopPad + 8,
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: colors.navyLight,
            borderBottomColor: colors.gold,
          },
        ]}
      >
        <PixelText size="xs" color={colors.gold} bold>
          DEPARTING FROM
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold>
          {dest?.name ?? "Unknown"}
        </PixelText>
        <PixelText size="xs" color={colors.mutedForeground}>
          Select your next destination
        </PixelText>
      </View>

      <BudgetBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {otherDestinations.map((target) => {
          const cost = dest?.flightCosts[target.id] ?? 9999;
          const canAfford = state.budget >= cost;
          const visited = state.visitedDestinations.includes(target.id);

          return (
            <View
              key={target.id}
              style={[
                styles.flightCard,
                {
                  backgroundColor: colors.navyLight,
                  borderColor: canAfford ? colors.border : colors.navy,
                  opacity: canAfford ? 1 : 0.5,
                },
              ]}
            >
              <View style={styles.flightInfo}>
                <View style={styles.destinationLabel}>
                  <PixelText size="md" color={canAfford ? colors.parchment : colors.mutedForeground} bold>
                    {target.name}
                  </PixelText>
                  {visited && (
                    <View style={[styles.visitedBadge, { backgroundColor: colors.teal }]}>
                      <PixelText size="xs" color={colors.parchment} bold>
                        VISITED
                      </PixelText>
                    </View>
                  )}
                </View>
                <PixelText size="xs" color={colors.mutedForeground}>
                  {target.country} · {target.continent}
                </PixelText>
                <PixelText size="xs" color={colors.parchmentDark}>
                  {target.atmosphere}
                </PixelText>
              </View>

              <View style={styles.flightRight}>
                <PixelText
                  size="md"
                  color={canAfford ? colors.gold : colors.red}
                  bold
                >
                  ${cost}
                </PixelText>
                <PixelText size="xs" color={colors.mutedForeground}>
                  flight
                </PixelText>
                <PixelText size="xs" color={colors.mutedForeground}>
                  +${target.lodgingCost}/night
                </PixelText>
              </View>

              <PixelButton
                onPress={() => flyTo(target.id)}
                variant={canAfford ? "primary" : "ghost"}
                disabled={!canAfford}
                style={{ alignSelf: "center", minWidth: 70 }}
              >
                {canAfford ? "FLY" : "N/A"}
              </PixelButton>
            </View>
          );
        })}

        <PixelButton onPress={backToExploring} variant="ghost">
          STAY IN {dest?.name?.toUpperCase() ?? "CURRENT CITY"}
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 3,
    gap: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  flightCard: {
    borderWidth: 2,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flightInfo: {
    flex: 1,
    gap: 3,
  },
  destinationLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  visitedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  flightRight: {
    alignItems: "flex-end",
    gap: 2,
  },
});
