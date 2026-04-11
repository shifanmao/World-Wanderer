import React from "react";
import {
  Platform,
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
  const { selectCharacter } = useGame();

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 32, paddingBottom: bottomPad + 20 },
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
          <PixelText size="sm" color={colors.parchmentDark} align="center">
            Each character starts with different resources.
          </PixelText>
        </View>

        {PLAYABLE_CHARACTERS.map((character) => (
          <View
            key={character.id}
            style={[
              styles.characterCard,
              { backgroundColor: colors.navyLight, borderColor: colors.teal },
            ]}
          >
            <View
              style={[
                styles.characterSprite,
                { backgroundColor: colors.navy, borderColor: colors.gold },
              ]}
            >
              <PixelText size="xxl" align="center">
                {character.sprite}
              </PixelText>
            </View>
            <View style={styles.characterInfo}>
              <PixelText size="lg" color={colors.parchment} bold>
                {character.name}
              </PixelText>
              <PixelText size="xs" color={colors.mutedForeground}>
                {character.description}
              </PixelText>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <PixelText size="xs" color={colors.gold} bold>
                    Budget
                  </PixelText>
                  <PixelText size="sm" color={colors.parchment}>
                    ${character.startingBudget}
                  </PixelText>
                </View>
                <View style={styles.statItem}>
                  <PixelText size="xs" color={colors.teal} bold>
                    Energy
                  </PixelText>
                  <PixelText size="sm" color={colors.parchment}>
                    {character.startingEnergy}
                  </PixelText>
                </View>
              </View>
            </View>
            <PixelButton
              onPress={() => selectCharacter(character.id)}
              variant="primary"
              style={{ alignSelf: "center" }}
            >
              SELECT
            </PixelButton>
          </View>
        ))}

        <PixelButton
          onPress={() => selectCharacter("balanced_wanderer")}
          variant="ghost"
        >
          BACK TO TITLE
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "stretch",
  },
  titleArea: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  characterCard: {
    borderWidth: 2,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  characterSprite: {
    width: 64,
    height: 64,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  characterInfo: {
    flex: 1,
    gap: 6,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  statItem: {
    gap: 2,
  },
});
