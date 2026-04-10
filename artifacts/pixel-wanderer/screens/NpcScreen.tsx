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
import { useGame } from "@/context/GameContext";

export function NpcScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, advanceDialogue, backToExploring } = useGame();
  const dest = state.currentDestination;
  const character = dest?.people[state.currentNpcIndex];

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;

  if (!dest || !character) return null;

  const isLastDialogue =
    state.currentDialogueIndex >= character.dialogues.length - 1;
  const currentText = character.dialogues[state.currentDialogueIndex] ?? "";
  const tip = isLastDialogue ? character.tip : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Background scene dimmed */}
      <View style={styles.sceneBackground}>
        <DestinationScene destination={dest} showOverlay={false} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(10,14,26,0.75)" },
          ]}
        />
      </View>

      {/* Top status */}
      <View
        style={[
          styles.topArea,
          { paddingTop: topPad + 8, paddingHorizontal: 16 },
        ]}
      >
        <PixelText size="xs" color={colors.mutedForeground}>
          {dest.name} — Speaking with...
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
          tip={tip}
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
  topArea: {
    gap: 2,
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
