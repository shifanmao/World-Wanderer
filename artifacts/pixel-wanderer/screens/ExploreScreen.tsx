import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { BudgetBar } from "@/components/BudgetBar";
import { EarningCard } from "@/components/EarningCard";
import { DestinationScene } from "@/components/DestinationScene";
import { useGame } from "@/context/GameContext";

export function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    state,
    talkToCharacter,
    payLodging,
    collectItem,
    setPhase,
    acceptOpportunity,
    dismissOpportunity,
    clearLastEarned,
  } = useGame();
  const dest = state.currentDestination;

  const earnedAnim = useRef(new Animated.Value(0)).current;
  const earnedOpacity = useRef(new Animated.Value(0)).current;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const itemCollected = dest
    ? state.collectedItems.includes(dest.collectibleName)
    : false;
  const canAffordLodging = (dest?.lodgingCost ?? 999) <= state.budget;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Scene header */}
      <View style={[styles.sceneHeader, { height: 200 }]}>
        <DestinationScene destination={dest} showOverlay={false} />
        <View
          style={[
            styles.sceneTopOverlay,
            {
              paddingTop: topPad + 4,
              paddingHorizontal: 16,
              backgroundColor: "rgba(10,14,26,0.5)",
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
      </View>

      <BudgetBar />

      {/* Earned float toast */}
      {state.lastEarned !== null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.earnedToast,
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
      >
        {/* Active earning opportunity */}
        {state.activeOpportunity && (
          <EarningCard
            opportunity={state.activeOpportunity}
            onAccept={acceptOpportunity}
            onDismiss={dismissOpportunity}
          />
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
              <PixelText size="sm" color={colors.parchment}>
                A {dest.collectibleName} is within reach.
              </PixelText>
              <PixelButton
                onPress={collectItem}
                variant="secondary"
                style={{ alignSelf: "flex-start" }}
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
            <PixelText size="sm" color={colors.parchmentDark}>
              {dest.collectibleName} — safely stored in your pack.
            </PixelText>
          </View>
        )}

        {/* Characters */}
        <View style={styles.sectionHeader}>
          <PixelText size="xs" color={colors.gold} bold>
            PEOPLE TO MEET
          </PixelText>
        </View>

        {dest.people.map((character, index) => (
          <View
            key={character.id}
            style={[
              styles.characterCard,
              {
                backgroundColor: colors.navyLight,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.characterSprite,
                { backgroundColor: colors.navy, borderColor: colors.teal },
              ]}
            >
              <PixelText size="xl" align="center">
                {character.sprite}
              </PixelText>
            </View>
            <View style={styles.characterInfo}>
              <PixelText size="sm" color={colors.parchment} bold>
                {character.name}
              </PixelText>
              <PixelText size="xs" color={colors.mutedForeground}>
                {character.dialogues[0].slice(0, 45)}...
              </PixelText>
              {character.earningOnTalk && (
                <PixelText size="xs" color={colors.gold}>
                  May offer work
                </PixelText>
              )}
            </View>
            <PixelButton
              onPress={() => talkToCharacter(index)}
              variant="ghost"
              style={{ alignSelf: "center" }}
            >
              TALK
            </PixelButton>
          </View>
        ))}

        {/* Actions */}
        <View style={styles.sectionHeader}>
          <PixelText size="xs" color={colors.gold} bold>
            ACTIONS
          </PixelText>
        </View>

        <PixelButton onPress={() => setPhase("flying")} variant="primary">
          ✈  BOOK A FLIGHT
        </PixelButton>

        <PixelButton
          onPress={() => payLodging()}
          variant={
            state.lodgedAtCurrent
              ? "ghost"
              : canAffordLodging
              ? "secondary"
              : "ghost"
          }
          disabled={state.lodgedAtCurrent || !canAffordLodging}
        >
          {state.lodgedAtCurrent
            ? `DAY ${state.dayCount} — LODGED FOR TONIGHT`
            : canAffordLodging
            ? `REST HERE  ($${dest.lodgingCost}/night → Day ${state.dayCount + 1})`
            : `REST ($${dest.lodgingCost}) — INSUFFICIENT FUNDS`}
        </PixelButton>

        <PixelButton
          onPress={() => setPhase("collection")}
          variant="ghost"
        >
          TRAVEL JOURNAL  ({state.collectedItems.length} items)
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
  },
  sceneHeader: {
    position: "relative",
    overflow: "hidden",
  },
  sceneTopOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
  scroll: {
    flex: 1,
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
    gap: 8,
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 2,
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
  warningBox: {
    borderWidth: 2,
    padding: 12,
  },
  earnedToast: {
    position: "absolute",
    alignSelf: "center",
    top: 210,
    zIndex: 99,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
