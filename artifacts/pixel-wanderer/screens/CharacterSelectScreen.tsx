import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PLAYABLE_CHARACTERS } from "@/constants/gameData";
import { PixelButton } from "@/components/PixelButton";
import { PixelText } from "@/components/PixelText";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export function CharacterSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectCharacter, setPhase } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const selected = PLAYABLE_CHARACTERS.find((c) => c.id === selectedId);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleArea}>
          <PixelText size="xs" color={colors.teal} bold align="center">
            CHOOSE YOUR TRAVELER
          </PixelText>
          <PixelText size="lg" color={colors.gold} bold align="center" shadow>
            WHO WILL YOU BE?
          </PixelText>
        </View>

        <View style={styles.cardRow}>
          {PLAYABLE_CHARACTERS.map((character) => {
            const isSelected = selectedId === character.id;
            return (
              <Pressable
                key={character.id}
                onPress={() => setSelectedId(isSelected ? null : character.id)}
                style={[
                  styles.characterCard,
                  {
                    backgroundColor: isSelected ? colors.navyLight : colors.navy,
                    borderColor: isSelected ? colors.gold : colors.border,
                    borderWidth: isSelected ? 3 : 2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.spriteBox,
                    {
                      backgroundColor: isSelected ? colors.navy : colors.navyLight,
                      borderColor: isSelected ? colors.gold : colors.teal,
                    },
                  ]}
                >
                  <PixelText size="xl" align="center">
                    {character.sprite}
                  </PixelText>
                </View>
                <PixelText
                  size="md"
                  color={isSelected ? colors.gold : colors.parchment}
                  bold
                  align="center"
                >
                  {character.name}
                </PixelText>
                {isSelected && (
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: colors.gold },
                    ]}
                  >
                    <PixelText size="xs" color={colors.navy} bold>
                      CHOSEN
                    </PixelText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View
            style={[
              styles.detailPanel,
              { backgroundColor: colors.navyLight, borderColor: colors.gold },
            ]}
          >
            <View style={styles.detailHeader}>
              <PixelText size="xxl">{selected.sprite}</PixelText>
              <View style={styles.detailHeadText}>
                <PixelText size="lg" color={colors.gold} bold>
                  {selected.name}
                </PixelText>
                <View style={styles.statsRow}>
                  <View
                    style={[
                      styles.statPill,
                      { backgroundColor: colors.navy, borderColor: colors.gold },
                    ]}
                  >
                    <PixelText size="xs" color={colors.gold} bold>
                      BUDGET
                    </PixelText>
                    <PixelText size="sm" color={colors.parchment} bold>
                      ${selected.startingBudget}
                    </PixelText>
                  </View>
                  <View
                    style={[
                      styles.statPill,
                      { backgroundColor: colors.navy, borderColor: colors.teal },
                    ]}
                  >
                    <PixelText size="xs" color={colors.teal} bold>
                      ENERGY
                    </PixelText>
                    <PixelText size="sm" color={colors.parchment} bold>
                      {selected.startingEnergy}
                    </PixelText>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.gold }]} />
            <PixelText size="sm" color={colors.parchmentDark}>
              {selected.description}
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
              Tap a traveler to learn more
            </PixelText>
          </View>
        )}

        {selected && (
          <PixelButton
            onPress={() => selectCharacter(selected.id)}
            variant="primary"
          >
            BEGIN ADVENTURE AS {selected.name.toUpperCase()}
          </PixelButton>
        )}

        <PixelButton onPress={() => setPhase("title")} variant="ghost">
          BACK
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "stretch",
  },
  titleArea: {
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  characterCard: {
    width: "47%",
    alignItems: "center",
    padding: 12,
    gap: 8,
    minHeight: 110,
  },
  spriteBox: {
    width: 56,
    height: 56,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  detailPanel: {
    borderWidth: 2,
    padding: 16,
    gap: 12,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailHeadText: {
    flex: 1,
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    gap: 2,
  },
  divider: {
    height: 2,
    width: "100%",
  },
  hintBox: {
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
});
