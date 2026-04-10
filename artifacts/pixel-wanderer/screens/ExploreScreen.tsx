import React, { useRef } from "react";
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
import { DestinationScene } from "@/components/DestinationScene";
import { useGame } from "@/context/GameContext";

export function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, talkToNpc, payLodging, collectItem, setPhase } = useGame();
  const dest = state.currentDestination;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const itemCollected = dest
    ? state.collectedItems.includes(dest.collectibleName)
    : false;

  const canAffordLodging = (dest?.lodgingCost ?? 999) <= state.budget;

  if (!dest) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Scene header */}
      <View style={[styles.sceneHeader, { height: 200 }]}>
        <DestinationScene destination={dest} showOverlay={false} />
        <View
          style={[
            styles.sceneTopOverlay,
            { paddingTop: topPad + 4, paddingHorizontal: 16, backgroundColor: "rgba(10,14,26,0.5)" },
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Collectible */}
        {!itemCollected && (
          <View style={[styles.section, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
            <PixelText size="xs" color={colors.tealLight} bold>FOUND NEARBY</PixelText>
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
          <View style={[styles.section, { backgroundColor: colors.navy, borderColor: colors.border }]}>
            <PixelText size="xs" color={colors.mutedForeground}>COLLECTED</PixelText>
            <PixelText size="sm" color={colors.parchmentDark}>
              {dest.collectibleName} — safely stored in your pack.
            </PixelText>
          </View>
        )}

        {/* NPCs */}
        <View style={styles.sectionHeader}>
          <PixelText size="xs" color={colors.gold} bold>LOCALS TO MEET</PixelText>
        </View>

        {dest.npcs.map((npc, index) => (
          <View
            key={npc.id}
            style={[
              styles.npcCard,
              { backgroundColor: colors.navyLight, borderColor: colors.border },
            ]}
          >
            <View style={[styles.npcSprite, { backgroundColor: colors.navy, borderColor: colors.teal }]}>
              <PixelText size="xl" align="center">{npc.sprite}</PixelText>
            </View>
            <View style={styles.npcInfo}>
              <PixelText size="sm" color={colors.parchment} bold>{npc.name}</PixelText>
              <PixelText size="xs" color={colors.mutedForeground}>
                {npc.dialogues[0].slice(0, 45)}...
              </PixelText>
            </View>
            <PixelButton
              onPress={() => talkToNpc(index)}
              variant="ghost"
              style={{ alignSelf: "center" }}
            >
              TALK
            </PixelButton>
          </View>
        ))}

        {/* Actions */}
        <View style={styles.sectionHeader}>
          <PixelText size="xs" color={colors.gold} bold>ACTIONS</PixelText>
        </View>

        <PixelButton
          onPress={() => setPhase("flying")}
          variant="primary"
        >
          ✈  BOOK A FLIGHT
        </PixelButton>

        <PixelButton
          onPress={() => {
            const success = payLodging();
            if (!success) {
              // Could show a toast — budget too low
            }
          }}
          variant={state.lodgedAtCurrent ? "ghost" : canAffordLodging ? "secondary" : "ghost"}
          disabled={state.lodgedAtCurrent || !canAffordLodging}
        >
          {state.lodgedAtCurrent
            ? "LODGED FOR TONIGHT"
            : canAffordLodging
            ? `LODGE HERE  ($${dest.lodgingCost})`
            : `LODGE ($${dest.lodgingCost}) — INSUFFICIENT FUNDS`}
        </PixelButton>

        <PixelButton
          onPress={() => setPhase("collection")}
          variant="ghost"
        >
          VIEW COLLECTION  ({state.collectedItems.length} items)
        </PixelButton>

        {state.budget < 100 && (
          <View style={[styles.warningBox, { backgroundColor: colors.red + "22", borderColor: colors.red }]}>
            <PixelText size="xs" color={colors.red} bold align="center">
              WARNING: Budget critically low. Consider your next move carefully.
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
    marginTop: 8,
    marginBottom: 4,
  },
  npcCard: {
    borderWidth: 2,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  npcSprite: {
    width: 52,
    height: 52,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  npcInfo: {
    flex: 1,
    gap: 4,
  },
  warningBox: {
    borderWidth: 2,
    padding: 12,
  },
});
