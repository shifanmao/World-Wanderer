import React, { useEffect, useRef, useMemo } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTipActionById } from "@/constants/gameData";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { BudgetAndEnergyBar } from "@/components/BudgetAndEnergyBar";
import { EarningCard } from "@/components/EarningCard";
import { PixelatedImage } from "@/components/PixelatedImage";
import { DestinationScene } from "@/components/DestinationScene";
import { useGame } from "@/context/GameContext";

export function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    state,
    talkToCharacter,
    payLodging,
    haveMeal,
    collectItem,
    setPhase,
    acceptOpportunity,
    dismissOpportunity,
    clearLastEarned,
    viewImage,
    endGame,
  } = useGame();
  const dest = state.currentDestination;

  const earnedAnim = useRef(new Animated.Value(0)).current;
  const earnedOpacity = useRef(new Animated.Value(0)).current;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  /** Keep city title flush to top (status bar / safe area only — no extra web gap) */
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  const itemCollected = dest
    ? state.collectedItems.includes(dest.collectibleName)
    : false;
  const canAffordLodging = (dest?.lodgingCost ?? 999) <= state.budget;
  const visitCount = dest ? state.destinationVisitCounts[dest.id] || 1 : 1;
  const actionKey = dest ? `${dest.id}_${visitCount}` : '';
  const actionCount = dest && actionKey ? state.actionCounts[actionKey] || 0 : 0;

  const localTipMemories = useMemo(() => {
    if (!dest) return [];
    return state.collectedTipActionIds
      .map((id) => getTipActionById(id))
      .filter(
        (meta): meta is NonNullable<typeof meta> =>
          meta !== null && meta.destinationId === dest.id,
      );
  }, [dest, state.collectedTipActionIds]);

  // Flash earned amount
  useEffect(() => {
    if (state.lastEarned !== null) {
      earnedAnim.setValue(-20);
      earnedOpacity.setValue(1);
      Animated.parallel([
        Animated.timing(earnedAnim, {
          toValue: -50,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(700),
          Animated.timing(earnedOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => clearLastEarned());
    }
  }, [state.lastEarned]);

  if (!dest) return null;

  const HEADER_SCENE_H = 100;
  /** Title strip: safe top + padding + two lines */
  const CITY_TITLE_BLOCK_H = 40;
  const BUDGET_BAR_EST_H = 58;
  const toastTop =
    titleTopPad + CITY_TITLE_BLOCK_H + HEADER_SCENE_H + BUDGET_BAR_EST_H;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* City name first (top), then scene — scroll list cannot sit over the title */}
      <View style={styles.topFixedColumn}>
        <View
          style={[
            styles.cityTitleStrip,
            {
              paddingTop: titleTopPad,
              backgroundColor: colors.navyLight,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <PixelText size="xs" color={colors.gold} bold>
              {dest.country.toUpperCase()} — {dest.continent.toUpperCase()}
            </PixelText>
            <PixelText size="xs" color={colors.gold} bold>
                REP: {state.reputation}
              </PixelText>
          </View>
          <View style={styles.titleRow}>
            <PixelText size="md" color={colors.parchment} bold shadow>
              {dest.name}
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
        <View style={styles.sceneHeader}>
          <DestinationScene destination={dest} showOverlay={false} pixelBlock={10} />
        </View>
        <BudgetAndEnergyBar />
      </View>

      {/* Earned float toast */}
      {state.lastEarned !== null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.earnedToast,
            { top: toastTop },
            {
              opacity: earnedOpacity,
              transform: [{ translateY: earnedAnim }],
            },
          ]}
        >
          <PixelText size="lg" color={colors.tealLight} bold>
            +${state.lastEarned} EARNED
          </PixelText>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Active earning opportunity */}
        {state.activeOpportunity && (
          <EarningCard
            opportunity={state.activeOpportunity}
            onAccept={acceptOpportunity}
            onDismiss={dismissOpportunity}
          />
        )}

        {localTipMemories.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              LOCAL MEMORIES ({localTipMemories.length})
            </PixelText>
            <PixelText size="xs" color={colors.mutedForeground}>
              From tips you followed in {dest.name}.
            </PixelText>
            <View style={styles.memoryGrid}>
              {localTipMemories.map(({ action }) => (
                <Pressable
                  key={action.id}
                  onPress={() => viewImage(action.rewardImageUri, action.collectibleName, `Tip from ${dest.name}`)}
                >
                  <View
                    style={[
                      styles.memoryCard,
                      { borderColor: colors.teal, backgroundColor: colors.navyLight },
                    ]}
                  >
                    <View style={styles.memoryThumb}>
                      <PixelatedImage
                        source={{ uri: action.rewardImageUri }}
                        pixelBlock={8}
                        rounded
                      />
                    </View>
                    <PixelText size="xs" color={colors.parchment} bold align="center">
                      {action.collectibleName}
                    </PixelText>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Collectible */}
        {!itemCollected && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.navyLight, borderColor: colors.teal },
            ]}
          >
            <PixelText size="xs" color={colors.tealLight} bold>
              FOUND NEARBY
            </PixelText>
            <View style={styles.collectRow}>
              <View style={styles.collectEmoji}>
                <PixelText size="xxl">🎁</PixelText>
              </View>
              <View style={styles.collectInfo}>
                <PixelText size="sm" color={colors.parchment}>
                  {dest.collectibleName}
                </PixelText>
                <PixelText size="xs" color={colors.mutedForeground}>
                  Within reach
                </PixelText>
              </View>
              <PixelButton
                onPress={collectItem}
                variant="secondary"
                style={{ alignSelf: "center" }}
              >
                COLLECT
              </PixelButton>
            </View>
          </View>
        )}

        {itemCollected && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.navy, borderColor: colors.border },
            ]}
          >
            <PixelText size="xs" color={colors.mutedForeground}>
              COLLECTED
            </PixelText>
            <View style={styles.collectRow}>
              <View style={[styles.collectEmoji, { backgroundColor: colors.navyLight }]}>
                <PixelText size="xxl">✓</PixelText>
              </View>
              <PixelText size="sm" color={colors.parchmentDark}>
                {dest.collectibleName} — safely stored in your pack.
              </PixelText>
            </View>
          </View>
        )}

        {/* Characters */}
        <View style={styles.sectionHeader}>
          <PixelText size="xs" color={colors.gold} bold>
            PEOPLE TO MEET
          </PixelText>
        </View>

        {dest.people.map((character, index) => {
          const familiarityKey = `${dest.id}_${character.id}`;
          const familiarity = state.familiarity[familiarityKey] || 0;
          const energyCost = character.energyCost || 5;
          const canTalk = actionCount < 5 && state.energy >= energyCost;
          const isCloseFriend = state.closeFriends.includes(familiarityKey);

          return (
            <View
              key={character.id}
              style={[
                styles.characterCard,
                {
                  backgroundColor: colors.navyLight,
                  borderColor: isCloseFriend ? colors.gold : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.characterSprite,
                  { backgroundColor: colors.navy, borderColor: isCloseFriend ? colors.gold : colors.teal },
                ]}
              >
                <PixelText size="xl" align="center">
                  {character.sprite}
                </PixelText>
              </View>
              <View style={styles.characterInfo}>
                <PixelText size="sm" color={colors.parchment} bold>
                  {character.name} {isCloseFriend && "❤️"}
                </PixelText>
                <PixelText size="xs" color={colors.mutedForeground}>
                  {character.dialogues[0].slice(0, 45)}...
                </PixelText>
                <View style={styles.familiarityRow}>
                  <PixelText size="xs" color={colors.teal}>
                    Familiarity: {familiarity}/5
                  </PixelText>
                </View>
                {character.earningOnTalk && (
                  <PixelText size="xs" color={colors.gold}>
                    May offer work
                  </PixelText>
                )}
              </View>
              <PixelButton
                onPress={() => talkToCharacter(index)}
                variant={canTalk ? "ghost" : "ghost"}
                disabled={!canTalk}
                style={{ alignSelf: "center", opacity: canTalk ? 1 : 0.5 }}
              >
                {actionCount >= 5 ? "DONE" : `TALK (${energyCost}⚡)`}
              </PixelButton>
            </View>
          );
        })}

        <View style={styles.buttonRow}>
          <PixelButton
            onPress={() => haveMeal()}
            variant={state.budget >= 15 ? "secondary" : "ghost"}
            disabled={state.budget < 15 || actionCount >= 5}
            style={{ flex: 1 }}
          >
            {state.budget >= 15 ? "🍽️ HAVE MEAL ($15, +10⚡)" : "🍽️ MEAL ($15)"}
          </PixelButton>
          <PixelButton
            onPress={() => payLodging()}
            variant={canAffordLodging ? "secondary" : "ghost"}
            disabled={!canAffordLodging || actionCount >= 5}
            style={{ flex: 1 }}
          >
            {canAffordLodging
              ? `🏨 REST ($${dest.lodgingCost}, FULL⚡)`
              : `🏨 REST ($${dest.lodgingCost})`}
          </PixelButton>
        </View>

        <PixelButton onPress={() => setPhase("flying")} variant="primary">
          ✈️ BOOK A FLIGHT
        </PixelButton>

        <PixelButton
          onPress={() => setPhase("collection")}
          variant="ghost"
        >
          📖 TRAVEL JOURNAL ({state.collectedItems.length} items)
        </PixelButton>

        {state.budget < 100 && (
          <View
            style={[
              styles.warningBox,
              {
                backgroundColor: colors.red + "22",
                borderColor: colors.red,
              },
            ]}
          >
            <PixelText size="xs" color={colors.red} bold align="center">
              WARNING: Budget critically low. Look for work or move somewhere cheaper.
            </PixelText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  /** Header does not shrink; ScrollView gets remaining height only */
  topFixedColumn: {
    flexShrink: 0,
    zIndex: 2,
    elevation: 4,
  },
  sceneHeader: {
    height: 100,
    overflow: "hidden",
  },
  cityTitleStrip: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quitButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    zIndex: 0,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  section: {
    borderWidth: 2,
    padding: 12,
    gap: 8,
  },
  collectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  collectEmoji: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  collectInfo: {
    flex: 1,
    gap: 2,
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  characterCard: {
    borderWidth: 2,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  characterSprite: {
    width: 52,
    height: 52,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  characterInfo: {
    flex: 1,
    gap: 4,
  },
  familiarityRow: {
    marginTop: 2,
  },
  warningBox: {
    borderWidth: 2,
    padding: 12,
  },
  memoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  memoryCard: {
    width: "47%",
    borderWidth: 2,
    padding: 8,
    gap: 6,
    alignItems: "center",
  },
  memoryThumb: {
    width: "100%",
    height: 56,
    borderRadius: 4,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderWidth: 3,
    padding: 24,
    gap: 16,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  modalMessage: {
    textAlign: "center",
  },
  modalButton: {
    minWidth: 150,
  },
  earnedToast: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 99,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
