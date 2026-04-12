import React, { useState } from "react";
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
import { DESTINATIONS } from "@/constants/gameData";
import { PixelButton } from "@/components/PixelButton";
import { PixelText } from "@/components/PixelText";
import { useColors } from "@/hooks/useColors";
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

export function WorldMapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, startFromCity, setPhase } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const selectedDest = DESTINATIONS.find((d) => d.id === selectedId);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleArea}>
          <PixelText size="xs" color={colors.teal} bold align="center">
            {state.selectedCharacter?.name
              ? `${state.selectedCharacter.name.toUpperCase()} · `
              : ""}
            CHOOSE YOUR STARTING CITY
          </PixelText>
          <PixelText size="lg" color={colors.gold} bold align="center" shadow>
            WHERE DOES YOUR STORY BEGIN?
          </PixelText>
        </View>

        {/* Pixel world map */}
        <View style={[styles.mapContainer, { borderColor: colors.teal }]}>
          <Image
            source={require("../assets/images/worldmap.png")}
            style={{ width: MAP_W, height: MAP_H }}
            resizeMode="cover"
          />

          {/* City markers */}
          {DESTINATIONS.map((dest) => {
            const pos = CITY_POSITIONS[dest.id];
            if (!pos) return null;
            const isSelected = selectedId === dest.id;
            const px = (pos.x / 100) * MAP_W;
            const py = (pos.y / 100) * MAP_H;

            return (
              <Pressable
                key={dest.id}
                onPress={() => setSelectedId(isSelected ? null : dest.id)}
                style={[
                  styles.cityMarker,
                  {
                    left: px - 14,
                    top: py - 14,
                    backgroundColor: isSelected ? colors.gold : colors.teal,
                    borderColor: isSelected ? colors.parchment : colors.navy,
                  },
                ]}
              >
                <PixelText size="xs" color={isSelected ? colors.navy : colors.parchment} bold>
                  ✦
                </PixelText>
              </Pressable>
            );
          })}

          {/* City name labels */}
          {DESTINATIONS.map((dest) => {
            const pos = CITY_POSITIONS[dest.id];
            if (!pos) return null;
            const isSelected = selectedId === dest.id;
            const px = (pos.x / 100) * MAP_W;
            const py = (pos.y / 100) * MAP_H;
            const labelAbove = py > MAP_H * 0.6;

            return (
              <View
                key={`label-${dest.id}`}
                pointerEvents="none"
                style={[
                  styles.cityLabel,
                  {
                    left: px - 30,
                    top: labelAbove ? py - 26 : py + 16,
                    backgroundColor: isSelected
                      ? colors.gold + "ee"
                      : colors.navy + "cc",
                  },
                ]}
              >
                <PixelText
                  size="xs"
                  color={isSelected ? colors.navy : colors.parchment}
                  bold={isSelected}
                >
                  {dest.name}
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
                <PixelText size="lg" color={colors.gold} bold>
                  {selectedDest.name}
                </PixelText>
                <PixelText size="xs" color={colors.teal}>
                  {selectedDest.country} · {selectedDest.continent}
                </PixelText>
              </View>
              <View
                style={[
                  styles.lodgingBadge,
                  { backgroundColor: colors.navy, borderColor: colors.teal },
                ]}
              >
                <PixelText size="xs" color={colors.teal} bold>
                  LODGING
                </PixelText>
                <PixelText size="sm" color={colors.parchment} bold>
                  ${selectedDest.lodgingCost}/night
                </PixelText>
              </View>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.gold }]} />
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
              Tap a city marker to preview your starting point
            </PixelText>
          </View>
        )}

        {selectedDest && (
          <PixelButton
            onPress={() => startFromCity(selectedDest.id)}
            variant="primary"
          >
            DEPART TO {selectedDest.name.toUpperCase()}
          </PixelButton>
        )}

        <PixelButton onPress={() => setPhase("character_select")} variant="ghost">
          BACK
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
    alignItems: "stretch",
  },
  titleArea: {
    alignItems: "center",
    gap: 4,
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
  lodgingBadge: {
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
});
