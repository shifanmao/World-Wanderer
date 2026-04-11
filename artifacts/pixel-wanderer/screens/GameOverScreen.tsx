import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { DESTINATIONS, STARTING_BUDGET } from "@/constants/gameData";
import { useGame } from "@/context/GameContext";

export function GameOverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, resetGame, calculateReputation, loadHighScore, saveLifetimeData } = useGame();

  const [highScore, setHighScore] = useState(0);
  const [finalReputation, setFinalReputation] = useState(0);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Calculate final reputation and load high score
    const reputation = calculateReputation();
    setFinalReputation(reputation);

    loadHighScore().then((score) => {
      setHighScore(score);
    });

    // Save lifetime journal data
    saveLifetimeData();
  }, [calculateReputation, loadHighScore]);

  const spent = STARTING_BUDGET - state.budget;
  const completion = Math.round(
    (state.visitedDestinations.length / DESTINATIONS.length) * 100,
  );

  const friends = useMemo(() => {
    const highFamiliarityThreshold = 5;
    const friendList: Array<{
      name: string;
      sprite: string;
      destinationName: string;
      familiarity: number;
    }> = [];

    DESTINATIONS.forEach((dest) => {
      dest.people.forEach((person) => {
        const familiarityKey = `${dest.id}_${person.id}`;
        const familiarity = state.familiarity[familiarityKey] || 0;
        if (familiarity >= highFamiliarityThreshold) {
          friendList.push({
            name: person.name,
            sprite: person.sprite,
            destinationName: dest.name,
            familiarity,
          });
        }
      });
    });

    return friendList;
  }, [state.familiarity]);

  const topDestinations = useMemo(() => {
    const visited = DESTINATIONS.filter((d) =>
      state.visitedDestinations.includes(d.id)
    );
    // Sort by number of visits (destinationVisitCounts)
    return visited.sort((a, b) => {
      const aVisits = state.destinationVisitCounts[a.id] || 1;
      const bVisits = state.destinationVisitCounts[b.id] || 1;
      return bVisits - aVisits;
    }).slice(0, 3);
  }, [state.visitedDestinations, state.destinationVisitCounts]);

  let rank = "ROOKIE TRAVELER";
  if (finalReputation >= 500) rank = "WORLD WANDERER";
  else if (finalReputation >= 300) rank = "GLOBE TROTTER";
  else if (finalReputation >= 150) rank = "EXPLORER";

  const isNewHighScore = finalReputation > highScore;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: colors.navy },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleArea}>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            JOURNEY COMPLETE
          </PixelText>
          <PixelText size="xxl" color={colors.gold} bold align="center" shadow>
            THE END
          </PixelText>
          <View style={[styles.divider, { backgroundColor: colors.gold }]} />
          {state.outOfActionsMessage && (
            <PixelText size="md" color={colors.red} bold align="center">
              {state.outOfActionsMessage}
            </PixelText>
          )}
          <PixelText size="lg" color={colors.parchment} bold align="center">
            {rank}
          </PixelText>
        </View>

        {isNewHighScore && (
          <View style={[styles.newHighScoreBox, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
            <PixelText size="sm" color={colors.gold} bold align="center">
              🎉 NEW HIGH SCORE! 🎉
            </PixelText>
          </View>
        )}

        <View style={[styles.statsBox, { backgroundColor: colors.navyLight, borderColor: colors.gold }]}>
          <PixelText size="xs" color={colors.gold} bold align="center">
            FINAL STATS
          </PixelText>

          {[
            { label: "Total Reputation", value: finalReputation.toString(), highlight: true },
            { label: "High Score", value: highScore.toString(), highlight: false },
            { label: "Destinations Visited", value: `${state.visitedDestinations.length} / ${DESTINATIONS.length}`, highlight: false },
            { label: "World Explored", value: `${completion}%`, highlight: false },
            { label: "Days Traveled", value: `${state.dayCount}`, highlight: false },
            { label: "Budget Spent", value: `$${spent.toLocaleString()}`, highlight: false },
            { label: "Budget Remaining", value: `$${state.budget.toLocaleString()}`, highlight: false },
            { label: "Items Collected", value: `${state.collectedItems.length}`, highlight: false },
            { label: "Memories Collected", value: `${state.collectedTipActionIds.length}`, highlight: false },
          ].map(({ label, value, highlight }) => (
            <View key={label} style={[styles.statRow, { borderColor: colors.border }]}>
              <PixelText size="sm" color={colors.parchmentDark}>{label}</PixelText>
              <PixelText size="sm" color={highlight ? colors.gold : colors.parchment} bold={highlight}>{value}</PixelText>
            </View>
          ))}
        </View>

        {state.collectedItems.length > 0 && (
          <View style={styles.itemsArea}>
            <PixelText size="xs" color={colors.tealLight} bold align="center">
              COLLECTED ITEMS
            </PixelText>
            {state.collectedItems.map((item) => (
              <PixelText key={item} size="xs" color={colors.parchmentDark} align="center">
                · {item}
              </PixelText>
            ))}
          </View>
        )}

        {friends.length > 0 && (
          <View style={[styles.itemsArea, { backgroundColor: colors.navyLight, borderColor: colors.teal, borderWidth: 2, padding: 12 }]}>
            <PixelText size="xs" color={colors.gold} bold align="center">
              FRIENDS MADE ({friends.length})
            </PixelText>
            {friends.slice(0, 5).map((friend) => (
              <PixelText key={friend.name} size="xs" color={colors.parchment} align="center">
                {friend.sprite} {friend.name} ({friend.destinationName})
              </PixelText>
            ))}
          </View>
        )}

        {topDestinations.length > 0 && (
          <View style={[styles.itemsArea, { backgroundColor: colors.navyLight, borderColor: colors.gold, borderWidth: 2, padding: 12 }]}>
            <PixelText size="xs" color={colors.gold} bold align="center">
              TOP DESTINATIONS
            </PixelText>
            {topDestinations.map((dest) => (
              <PixelText key={dest.id} size="xs" color={colors.parchment} align="center">
                {dest.name} ({state.destinationVisitCounts[dest.id] || 1} visits)
              </PixelText>
            ))}
          </View>
        )}

        <View style={styles.buttonArea}>
          <PixelButton onPress={resetGame} variant="primary">
            NEW JOURNEY
          </PixelButton>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  titleArea: {
    alignItems: "center",
    gap: 8,
  },
  divider: {
    height: 2,
    width: 60,
    marginVertical: 4,
  },
  statsBox: {
    borderWidth: 3,
    padding: 16,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  itemsArea: {
    gap: 4,
    alignItems: "center",
  },
  buttonArea: {
    gap: 8,
  },
  newHighScoreBox: {
    borderWidth: 2,
    padding: 12,
    marginBottom: 16,
  },
});
