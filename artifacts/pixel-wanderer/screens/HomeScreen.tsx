import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelatedImage } from "@/components/PixelatedImage";
import { PixelButton } from "@/components/PixelButton";
import { PixelText } from "@/components/PixelText";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, setPhase, resetGame } = useGame();
  const dest = state.currentDestination;
  const character = state.selectedCharacter;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  if (!dest || !character) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: titleTopPad + 8, paddingBottom: bottomPad + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.badge, { borderColor: colors.gold, backgroundColor: colors.navyLight }]}>
          <PixelText size="xs" color={colors.gold} bold align="center">
            NEW TRANSMISSION
          </PixelText>
        </View>

        <PixelText size="lg" color={colors.parchment} bold align="center" shadow>
          FIRST DROP CONFIRMED
        </PixelText>

        <PixelText size="sm" color={colors.parchmentDark} align="center">
          Your first landing zone is locked in. Review the brief, then deploy when
          ready.
        </PixelText>

        <View style={[styles.preview, { borderColor: colors.teal }]}>
          <View style={styles.previewImage}>
            {dest.image ? (
              <PixelatedImage
                source={dest.image}
                pixelBlock={9}
                rounded
              />
            ) : (
              <View
                style={[
                  styles.previewFallback,
                  { backgroundColor: colors.navyLight },
                ]}
              />
            )}
          </View>
          <View style={styles.previewText}>
            <PixelText size="xs" color={colors.gold} bold>
              {dest.country.toUpperCase()} · {dest.continent.toUpperCase()}
            </PixelText>
            <PixelText size="xxl" color={colors.parchment} bold shadow>
              {dest.name}
            </PixelText>
            <PixelText size="xs" color={colors.mutedForeground}>
              {dest.atmosphere}
            </PixelText>
          </View>
        </View>

        <View style={[styles.characterBadge, { borderColor: colors.gold, backgroundColor: colors.navyLight }]}>
          <PixelText size="xs" color={colors.gold} bold align="center">
            {character.sprite} {character.name}
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            {character.description}
          </PixelText>
        </View>

        <View style={[styles.notice, { borderColor: colors.border, backgroundColor: colors.navyLight }]}>
          <PixelText size="xs" color={colors.tealLight} bold>
            STARTING KIT
          </PixelText>
          <View style={styles.statRow}>
            <PixelText size="sm" color={colors.parchmentDark}>
              💰 Budget:
            </PixelText>
            <PixelText size="sm" color={colors.gold} bold>
              ${character.startingBudget.toLocaleString()}
            </PixelText>
          </View>
          <View style={styles.statRow}>
            <PixelText size="sm" color={colors.parchmentDark}>
              ⚡ Energy:
            </PixelText>
            <PixelText size="sm" color={colors.teal} bold>
              {character.startingEnergy}
            </PixelText>
          </View>
          <View style={styles.statRow}>
            <PixelText size="sm" color={colors.parchmentDark}>
              Day:
            </PixelText>
            <PixelText size="sm" color={colors.parchment}>
              {state.dayCount}
            </PixelText>
          </View>
        </View>

        <PixelButton onPress={() => setPhase("arriving")} variant="primary">
          DEPLOY — BEGIN ARRIVAL
        </PixelButton>

        <PixelButton onPress={resetGame} variant="ghost">
          BACK TO TITLE
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "stretch",
  },
  badge: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
  },
  preview: {
    borderWidth: 2,
    overflow: "hidden",
    flexDirection: "row",
    gap: 0,
  },
  previewImage: {
    width: 112,
    height: 112,
  },
  previewFallback: {
    flex: 1,
    minHeight: 112,
  },
  previewText: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  notice: {
    borderWidth: 2,
    padding: 12,
    gap: 6,
  },
  characterBadge: {
    borderWidth: 2,
    padding: 12,
    gap: 4,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
