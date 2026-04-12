import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/context/GameContext";

export function LetterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dismissLetter } = useGame();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  if (!state.pendingLetter) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: titleTopPad + 8,
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: colors.navyLight,
            borderBottomColor: colors.gold,
          },
        ]}
      >
        <PixelText size="xs" color={colors.gold} bold align="center">
          LETTER FROM A FRIEND
        </PixelText>
      </View>

      <View
        style={[
          styles.content,
          { paddingTop: 20, paddingBottom: bottomPad + 20, paddingHorizontal: 16 },
        ]}
      >
        {/* Character Sprite */}
        <View style={styles.characterContainer}>
          <PixelText size="xxl" align="center">
            {state.pendingLetter.characterSprite}
          </PixelText>
          <PixelText size="sm" color={colors.parchment} bold align="center">
            {state.pendingLetter.characterName}
          </PixelText>
          <PixelText size="xs" color={colors.gold} align="center">
            ❤️ Close Friend
          </PixelText>
        </View>

        {/* Letter Content */}
        <View
          style={[
            styles.letterBox,
            { backgroundColor: colors.parchment, borderColor: colors.teal },
          ]}
        >
          <PixelText size="sm" color={colors.navy} align="center">
            {state.pendingLetter.message}
          </PixelText>
        </View>

        {/* Continue Button */}
        <PixelButton
          onPress={dismissLetter}
          variant="primary"
          style={styles.button}
        >
          CONTINUE
        </PixelButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 2,
  },
  content: {
    flex: 1,
  },
  characterContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  letterBox: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: "center",
  },
  button: {
    alignSelf: "center",
    minWidth: 200,
  },
});
