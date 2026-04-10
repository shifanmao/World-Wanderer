import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelatedImage } from "@/components/PixelatedImage";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DialogueBox } from "@/components/DialogueBox";
import { DestinationScene } from "@/components/DestinationScene";
import { useGame } from "@/context/GameContext";

export function NpcScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    state,
    advanceDialogue,
    backToExploring,
    performTipAction,
    clearTipActionResult,
    dismissTipReward,
  } = useGame();
  const dest = state.currentDestination;
  const character = dest?.people[state.currentNpcIndex];

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  if (!dest || !character) return null;

  const reward = state.pendingTipReward;
  if (reward) {
    return (
      <Pressable
        style={[styles.rewardRoot, { backgroundColor: colors.navy }]}
        onPress={dismissTipReward}
        accessibilityRole="button"
        accessibilityLabel="Continue to city"
      >
        <PixelatedImage
          source={{ uri: reward.imageUri }}
          pixelBlock={11}
          style={styles.rewardImage}
        />
        <View
          style={[
            styles.rewardGradient,
            { paddingBottom: bottomPad + 24, paddingTop: titleTopPad + 16 },
          ]}
        >
          <PixelText size="xs" color={colors.tealLight} bold align="center">
            MEMORY UNLOCKED
          </PixelText>
          <PixelText size="lg" color={colors.gold} bold align="center">
            {reward.collectibleName}
          </PixelText>
          <PixelText size="sm" color={colors.parchment} align="center">
            {reward.outcome}
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            Tap anywhere to return to {dest.name}
          </PixelText>
        </View>
      </Pressable>
    );
  }

  const isLastDialogue =
    state.currentDialogueIndex >= character.dialogues.length - 1;
  const currentText =
    character.dialogues[
      (state.currentDialogueIndex + state.currentDialogueOffset) %
        character.dialogues.length
    ] ?? "";
  const tip = isLastDialogue ? character.tip : undefined;
  const tipAction = isLastDialogue ? character.tipAction : undefined;
  const tipAlreadyDone =
    tipAction && state.collectedTipActionIds.includes(tipAction.id);

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
        <PixelText size="xs" color={colors.gold} bold>
          {dest.country.toUpperCase()} — {dest.continent.toUpperCase()}
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold shadow>
          {dest.name}
        </PixelText>
      </View>
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
          tip={tip}
        />

        {tipAction && (
          <View
            style={[
              styles.tipActionBox,
              { backgroundColor: colors.navyLight, borderColor: colors.teal },
            ]}
          >
            <PixelText size="xs" color={colors.tealLight} bold>
              TIP ACTION
            </PixelText>
            <PixelText size="sm" color={colors.parchment} bold>
              {tipAction.icon} {tipAction.title}
            </PixelText>
            <PixelText size="xs" color={colors.mutedForeground}>
              {tipAction.description}
            </PixelText>
            {tipAlreadyDone ? (
              <PixelText size="xs" color={colors.gold}>
                Collected: {tipAction.collectibleName}
              </PixelText>
            ) : (
              <PixelButton
                onPress={() => {
                  clearTipActionResult();
                  performTipAction();
                }}
                variant="secondary"
                disabled={state.budget < tipAction.cost}
              >
                {state.budget < tipAction.cost
                  ? `NEED $${tipAction.cost} (YOU HAVE $${state.budget})`
                  : `DO THIS NOW (-$${tipAction.cost})`}
              </PixelButton>
            )}
          </View>
        )}

        {state.lastTipActionResult && (
          <View
            style={[
              styles.tipResultBox,
              { backgroundColor: colors.navy, borderColor: colors.gold },
            ]}
          >
            <PixelText size="sm" color={colors.gold} bold>
              {state.lastTipActionResult.icon} {state.lastTipActionResult.title}
            </PixelText>
            <PixelText size="xs" color={colors.parchment}>
              {state.lastTipActionResult.detail}
            </PixelText>
          </View>
        )}

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
  rewardRoot: {
    flex: 1,
  },
  rewardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  rewardGradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: "rgba(10,14,26,0.45)",
  },
  sceneBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  cityBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    gap: 4,
    zIndex: 2,
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
  tipActionBox: {
    borderWidth: 2,
    padding: 10,
    gap: 6,
  },
  tipResultBox: {
    borderWidth: 2,
    padding: 10,
    gap: 4,
  },
});
