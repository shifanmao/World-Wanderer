import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { BudgetAndEnergyBar } from "@/components/BudgetAndEnergyBar";
import { PixelatedImage } from "@/components/PixelatedImage";
import { DESTINATIONS } from "@/constants/gameData";
import { useGame } from "@/context/GameContext";

const SCREEN_W = Dimensions.get("window").width;
const MAP_W = SCREEN_W - 32;
const MAP_H = Math.round(MAP_W * 0.72);

// City positions as percentages of map area (roughly geographic)
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  reykjavik:     { x: 40, y: 11 },
  paris:         { x: 48, y: 25 },
  santorini:     { x: 56, y: 33 },
  marrakech:     { x: 44, y: 46 },
  cairo:         { x: 62, y: 43 },
  istanbul:      { x: 60, y: 35 },
  cape_town:     { x: 58, y: 78 },
  macchu_picchu: { x: 25, y: 65 },
  buenos_aires:  { x: 30, y: 75 },
  tokyo:         { x: 90, y: 29 },
  kyoto:         { x: 85, y: 39 },
};

export function FlyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, flyTo, backToExploring, endGame, setPhase } = useGame();
  const dest = state.currentDestination;
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasCheckedFunds = useRef(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  const selectedDest = DESTINATIONS.find((d) => d.id === selectedId);

  const otherDestinations = DESTINATIONS.filter((d) => d.id !== dest?.id);

  // Check if user can afford any flight (only on mount)
  useEffect(() => {
    if (!dest || hasCheckedFunds.current) return;

    const canAffordAnyFlight = otherDestinations.some((target) => {
      const cost = dest.flightCosts[target.id] ?? 9999;
      const duration = dest.flightDurations[target.id] ?? 0;
      const energyCost = Math.max(10, duration * 2);
      return state.budget >= cost && state.energy >= energyCost;
    });

    hasCheckedFunds.current = true;

    if (!canAffordAnyFlight) {
      setPhase("insufficient_funds");
    }
  }, [state.budget, state.energy, dest, setPhase, otherDestinations]);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View style={styles.topFixedColumn}>
        <View
          style={[
            styles.header,
            {
              paddingTop: titleTopPad,
              backgroundColor: colors.navyLight,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <PixelText size="xs" color={colors.gold} bold>
              DEPARTING FROM
            </PixelText>
            <PixelText size="xs" color={colors.gold} bold>
              REP: {state.reputation}
            </PixelText>
          </View>
          <View style={styles.titleRow}>
            <PixelText size="md" color={colors.parchment} bold shadow>
              {dest?.name ?? "Unknown"}
            </PixelText>
            <PixelButton
              onPress={endGame}
              variant="ghost"
              style={styles.quitButton}
            >
              END GAME
            </PixelButton>
          </View>
        </View>

        <BudgetAndEnergyBar />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.toggleRow}>
        <PixelButton
          onPress={() => setViewMode("list")}
          variant={viewMode === "list" ? "primary" : "ghost"}
          style={styles.toggleButton}
        >
          LIST
        </PixelButton>
        <PixelButton
          onPress={() => setViewMode("map")}
          variant={viewMode === "map" ? "primary" : "ghost"}
          style={styles.toggleButton}
        >
          MAP
        </PixelButton>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === "list" ? (
          otherDestinations.map((target) => {
            const cost = dest?.flightCosts[target.id] ?? 9999;
            const duration = dest?.flightDurations[target.id] ?? 0;
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
                    💰 -${cost}
                  </PixelText>
                  <PixelText size="xs" color={colors.mutedForeground}>
                    {duration}h flight ({Math.max(10, duration * 2)}⚡)
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
          })
        ) : (
          <View>
            {/* Pixel world map */}
            <View style={[styles.mapContainer, { borderColor: colors.teal }]}>
              <Image
                source={require("../assets/images/worldmap.png")}
                style={{ width: MAP_W, height: MAP_H }}
                resizeMode="cover"
              />

              {/* City markers */}
              {otherDestinations.map((target) => {
                const pos = CITY_POSITIONS[target.id];
                if (!pos) return null;
                const cost = dest?.flightCosts[target.id] ?? 9999;
                const duration = dest?.flightDurations[target.id] ?? 0;
                const canAfford = state.budget >= cost;
                const visited = state.visitedDestinations.includes(target.id);
                const isSelected = selectedId === target.id;
                const px = (pos.x / 100) * MAP_W;
                const py = (pos.y / 100) * MAP_H;

                return (
                  <Pressable
                    key={target.id}
                    onPress={() => canAfford && setSelectedId(isSelected ? null : target.id)}
                    style={[
                      styles.cityMarker,
                      {
                        left: px - 14,
                        top: py - 14,
                        backgroundColor: isSelected ? colors.gold : (canAfford ? colors.teal : colors.navy),
                        borderColor: isSelected ? colors.parchment : (canAfford ? colors.navy : colors.border),
                        opacity: canAfford ? 1 : 0.5,
                      },
                    ]}
                  >
                    <PixelText size="xs" color={isSelected ? colors.navy : (canAfford ? colors.parchment : colors.mutedForeground)} bold>
                      ✦
                    </PixelText>
                    {visited && (
                      <View style={[styles.visitedDot, { backgroundColor: colors.teal }]} />
                    )}
                  </Pressable>
                );
              })}

              {/* City name labels */}
              {otherDestinations.map((target) => {
                const pos = CITY_POSITIONS[target.id];
                if (!pos) return null;
                const cost = dest?.flightCosts[target.id] ?? 9999;
                const canAfford = state.budget >= cost;
                const isSelected = selectedId === target.id;
                const px = (pos.x / 100) * MAP_W;
                const py = (pos.y / 100) * MAP_H;
                const labelAbove = py > MAP_H * 0.6;

                return (
                  <View
                    key={`label-${target.id}`}
                    pointerEvents="none"
                    style={[
                      styles.cityLabel,
                      {
                        left: px - 30,
                        top: labelAbove ? py - 26 : py + 16,
                        backgroundColor: isSelected
                          ? colors.gold + "ee"
                          : (canAfford ? colors.navy + "cc" : colors.navy + "66"),
                      },
                    ]}
                  >
                    <PixelText
                      size="xs"
                      color={isSelected ? colors.navy : (canAfford ? colors.parchment : colors.mutedForeground)}
                      bold={isSelected}
                    >
                      {target.name}
                    </PixelText>
                  </View>
                );
              })}
            </View>

            {/* Info panel */}
            {selectedDest ? (
              <View
                style={[
                  styles.infoPanel,
                  { backgroundColor: colors.navyLight, borderColor: colors.gold },
                ]}
              >
                <View style={styles.infoPanelHeader}>
                  <View style={styles.infoTitleGroup}>
                    <PixelText size="md" color={colors.gold} bold>
                      {selectedDest.name}
                    </PixelText>
                    <PixelText size="xs" color={colors.teal}>
                      {selectedDest.country} · {selectedDest.continent}
                    </PixelText>
                  </View>
                  <View
                    style={[
                      styles.costBadge,
                      { backgroundColor: colors.navy, borderColor: colors.teal },
                    ]}
                  >
                    <PixelText size="xs" color={colors.teal} bold>
                      FLIGHT
                    </PixelText>
                    <PixelText size="sm" color={colors.parchment} bold>
                      -${dest?.flightCosts[selectedDest.id]}
                    </PixelText>
                  </View>
                </View>
                <View style={[styles.infoDivider, { backgroundColor: colors.gold }]} />
                <PixelText size="xs" color={colors.mutedForeground}>
                  {dest?.flightDurations[selectedDest.id]}h flight ({Math.max(10, (dest?.flightDurations[selectedDest.id] || 0) * 2)}⚡)
                </PixelText>
                <PixelText size="sm" color={colors.parchmentDark}>
                  {selectedDest.atmosphere}
                </PixelText>
              </View>
            ) : (
              <View
                style={[
                  styles.hintBox,
                  { backgroundColor: colors.navyLight, borderColor: colors.border },
                ]}
              >
                <PixelText size="sm" color={colors.mutedForeground} align="center">
                  Tap a city marker to view flight details
                </PixelText>
              </View>
            )}

            {selectedDest && (
              <PixelButton
                onPress={() => flyTo(selectedDest.id)}
                variant="primary"
              >
                FLY TO {selectedDest.name.toUpperCase()}
              </PixelButton>
            )}
          </View>
        )}

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
    overflow: "hidden",
  },
  topFixedColumn: {
    flexShrink: 0,
    zIndex: 2,
    elevation: 4,
  },
  header: {
    borderBottomWidth: 3,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quitButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: "center",
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
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
  },
  mapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  mapContainer: {
    borderWidth: 3,
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
    width: MAP_W,
    height: MAP_H,
  },
  cityMarker: {
    position: "absolute",
    width: 28,
    height: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  visitedDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cityLabel: {
    position: "absolute",
    paddingHorizontal: 4,
    paddingVertical: 1,
    width: 60,
    alignItems: "center",
  },
  infoPanel: {
    borderWidth: 2,
    padding: 14,
    gap: 10,
  },
  infoPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  infoTitleGroup: {
    flex: 1,
    gap: 2,
  },
  costBadge: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    gap: 2,
  },
  infoDivider: {
    height: 2,
    width: "100%",
  },
  hintBox: {
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  mapCard: {
    width: "47%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  mapImageContainer: {
    width: "100%",
    height: "60%",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapVisitedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
