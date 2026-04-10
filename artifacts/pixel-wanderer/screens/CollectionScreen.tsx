<<<<<<< HEAD
import React from "react";
=======
import React, { useMemo } from "react";
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
<<<<<<< HEAD
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DESTINATIONS } from "@/constants/gameData";
=======
import { PixelatedImage } from "@/components/PixelatedImage";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DESTINATIONS, getTipActionById } from "@/constants/gameData";
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
import { useGame } from "@/context/GameContext";

export function CollectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, backToExploring } = useGame();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const completion = Math.round(
    (state.visitedDestinations.length / DESTINATIONS.length) * 100,
  );

<<<<<<< HEAD
=======
  const tipMemories = useMemo(
    () =>
      state.collectedTipActionIds
        .map((id) => getTipActionById(id))
        .filter((m): m is NonNullable<typeof m> => m !== null),
    [state.collectedTipActionIds],
  );

>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: colors.navyLight,
            borderBottomColor: colors.gold,
          },
        ]}
      >
        <PixelText size="lg" color={colors.gold} bold align="center">
          TRAVELER JOURNAL
        </PixelText>
        <PixelText size="xs" color={colors.mutedForeground} align="center">
          {state.visitedDestinations.length} of {DESTINATIONS.length} destinations · {completion}% explored
        </PixelText>
        <View style={[styles.progressBar, { backgroundColor: colors.navy }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completion}%` as any,
                backgroundColor: colors.gold,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
<<<<<<< HEAD
=======
        {tipMemories.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              TIP MEMORIES ({tipMemories.length})
            </PixelText>
            <PixelText size="xs" color={colors.mutedForeground}>
              Moments from following locals’ advice.
            </PixelText>
            <View style={styles.tipGrid}>
              {tipMemories.map(({ action, destinationName, npcName }) => (
                <View
                  key={action.id}
                  style={[
                    styles.tipCard,
                    {
                      backgroundColor: colors.navyLight,
                      borderColor: colors.gold,
                    },
                  ]}
                >
                  <View style={styles.tipImageWrap}>
                    <PixelatedImage
                      source={{ uri: action.rewardImageUri }}
                      pixelBlock={8}
                      rounded
                    />
                  </View>
                  <PixelText size="xs" color={colors.parchment} bold>
                    {action.collectibleName}
                  </PixelText>
                  <PixelText size="xs" color={colors.mutedForeground}>
                    {destinationName} · {npcName}
                  </PixelText>
                </View>
              ))}
            </View>
          </View>
        )}

>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
        {/* Collectibles */}
        {state.collectedItems.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.tealLight} bold>
              COLLECTIBLES ({state.collectedItems.length})
            </PixelText>
            <View style={styles.itemsGrid}>
              {state.collectedItems.map((item) => (
                <View
                  key={item}
                  style={[
                    styles.itemChip,
                    {
                      backgroundColor: colors.navyLight,
                      borderColor: colors.teal,
                    },
                  ]}
                >
                  <PixelText size="xs" color={colors.parchment} bold>
                    {item}
                  </PixelText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Destination stamps */}
        <PixelText size="xs" color={colors.gold} bold>
          DESTINATIONS
        </PixelText>

        {DESTINATIONS.map((dest) => {
          const visited = state.visitedDestinations.includes(dest.id);
          const collected = state.collectedItems.includes(dest.collectibleName);
          const isCurrent = state.currentDestination?.id === dest.id;

          return (
            <View
              key={dest.id}
              style={[
                styles.destCard,
                {
                  backgroundColor: visited
                    ? colors.navyLight
                    : colors.navy,
                  borderColor: isCurrent
                    ? colors.gold
                    : visited
                    ? colors.teal
                    : colors.border,
                  opacity: visited ? 1 : 0.4,
                },
              ]}
            >
              <View
                style={[
                  styles.destStamp,
                  {
                    backgroundColor: visited ? colors.teal : colors.border,
                    borderColor: visited ? colors.tealLight : colors.border,
                  },
                ]}
              >
                <PixelText size="xs" color={visited ? colors.parchment : colors.mutedForeground} bold align="center">
                  {visited ? "STAMP" : "?"}
                </PixelText>
              </View>
              <View style={styles.destInfo}>
                <View style={styles.destNameRow}>
                  <PixelText
                    size="md"
                    color={visited ? colors.parchment : colors.mutedForeground}
                    bold
                  >
                    {visited ? dest.name : "???"}
                  </PixelText>
                  {isCurrent && (
                    <View style={[styles.hereBadge, { backgroundColor: colors.gold }]}>
                      <PixelText size="xs" color={colors.navy} bold>
                        HERE
                      </PixelText>
                    </View>
                  )}
                </View>
                <PixelText size="xs" color={colors.mutedForeground}>
                  {visited ? `${dest.country} · ${dest.continent}` : "Undiscovered"}
                </PixelText>
                {visited && (
                  <PixelText size="xs" color={collected ? colors.teal : colors.mutedForeground}>
                    {collected ? `Collected: ${dest.collectibleName}` : `Collectible: ${dest.collectibleName}`}
                  </PixelText>
                )}
              </View>
            </View>
          );
        })}

        <PixelButton onPress={backToExploring} variant="secondary">
          BACK TO EXPLORING
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
    gap: 8,
  },
  progressBar: {
    height: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  section: {
    gap: 8,
    marginBottom: 4,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemChip: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
<<<<<<< HEAD
=======
  tipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  tipCard: {
    width: "47%",
    borderWidth: 2,
    padding: 8,
    gap: 4,
  },
  tipImageWrap: {
    width: "100%",
    height: 72,
    borderRadius: 4,
    overflow: "hidden",
  },
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
  destCard: {
    borderWidth: 2,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  destStamp: {
    width: 52,
    height: 52,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  destInfo: {
    flex: 1,
    gap: 3,
  },
  destNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  hereBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
