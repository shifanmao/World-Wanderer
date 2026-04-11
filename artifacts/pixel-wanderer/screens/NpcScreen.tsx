import React from "react";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DialogueBox } from "@/components/DialogueBox";
import { DestinationScene } from "@/components/DestinationScene";
import { BudgetAndEnergyBar } from "@/components/BudgetAndEnergyBar";
import { useGame } from "@/context/GameContext";

export function NpcScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    state,
    advanceDialogue,
    backToExploring,
    endGame,
  } = useGame();
  const dest = state.currentDestination;
  const character = dest?.people[state.currentNpcIndex];

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  if (!dest || !character) return null;

  const isLastDialogue =
    state.currentDialogueIndex >= character.dialogues.length - 1;
  const currentText =
    character.dialogues[
      (state.currentDialogueIndex + state.currentDialogueOffset) %
        character.dialogues.length
    ] ?? "";

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Background scene dimmed */}
      <View style={styles.sceneBackground}>
        <DestinationScene
          destination={dest}
          showOverlay={false}
          pixelBlock={10}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(10,14,26,0.75)" },
          ]}
        />
      </View>

      {/* City on top, then NPC (matches Explore) */}
      <View
        style={[
          styles.cityBar,
          {
            paddingTop: titleTopPad,
            backgroundColor: colors.navyLight,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <PixelText size="xs" color={colors.gold} bold align="center">
          {dest.country.toUpperCase()} — {dest.continent.toUpperCase()}
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold shadow align="center">
          {dest.name}
        </PixelText>
        <PixelText size="xs" color={colors.gold} bold align="center">
          REPUTATION: {state.reputation}
        </PixelText>
        <PixelButton
          onPress={endGame}
          variant="ghost"
          style={styles.quitButton}
        >
          END GAME
        </PixelButton>
      </View>
      <BudgetAndEnergyBar />
      <View style={[styles.topArea, { paddingTop: 10, paddingHorizontal: 16 }]}>
        <PixelText size="xs" color={colors.mutedForeground}>
          SPEAKING WITH
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold>
          {character.name}
        </PixelText>
        {character.earningOnTalk && isLastDialogue && (
          <PixelText size="xs" color={colors.gold}>
            They may have an offer for you...
          </PixelText>
        )}
      </View>

      {/* Dialogue */}
      <View
        style={[
          styles.dialogueArea,
          {
            paddingBottom: bottomPad + 20,
            paddingHorizontal: 16,
          },
        ]}
      >
        <DialogueBox
          speakerName={character.name}
          speakerSprite={character.sprite}
          text={currentText}
          onNext={advanceDialogue}
          isLast={isLastDialogue}
        />

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {character.dialogues.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === state.currentDialogueIndex
                      ? colors.gold
                      : i < state.currentDialogueIndex
                      ? colors.teal
                      : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {isLastDialogue ? (
            <PixelButton onPress={advanceDialogue} variant="primary">
              FAREWELL
            </PixelButton>
          ) : (
            <PixelButton onPress={advanceDialogue} variant="secondary">
              CONTINUE
            </PixelButton>
          )}
          <PixelButton onPress={backToExploring} variant="ghost">
            LEAVE CONVERSATION
          </PixelButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  cityBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    gap: 8,
    zIndex: 2,
  },
  quitButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: "center",
  },
  topArea: {
    gap: 2,
    zIndex: 2,
  },
  dialogueArea: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 12,
  },
  progressDots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
  },
  buttons: {
    gap: 4,
  },
});
