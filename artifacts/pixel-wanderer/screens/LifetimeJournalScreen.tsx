import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/context/GameContext";

const LIFETIME_KEY = "@pixel_wanderer_lifetime";

interface LifetimeData {
  memories: Array<{
    title: string;
    description: string;
    destName: string;
  }>;
  friends: Array<{
    name: string;
    sprite: string;
    destName: string;
    familiarity: number;
  }>;
  gamesPlayed: number;
  bestScore: number;
}

const EMPTY: LifetimeData = {
  memories: [],
  friends: [],
  gamesPlayed: 0,
  bestScore: 0,
};

export function LifetimeJournalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setPhase } = useGame();
  const [data, setData] = useState<LifetimeData | null>(null);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    AsyncStorage.getItem(LIFETIME_KEY)
      .then((raw) => {
        if (raw) setData(JSON.parse(raw));
        else setData(EMPTY);
      })
      .catch(() => setData(EMPTY));
  }, []);

  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.navy, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  const isEmpty = data.memories.length === 0 && data.friends.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleArea}>
          <PixelText size="xs" color={colors.teal} bold align="center">
            YOUR TRAVEL HISTORY
          </PixelText>
          <PixelText size="xl" color={colors.gold} bold align="center" shadow>
            LIFETIME JOURNAL
          </PixelText>
          <View style={[styles.divider, { backgroundColor: colors.gold }]} />
        </View>

        {data.gamesPlayed > 0 && (
          <View style={[styles.statsBar, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
            <View style={styles.statItem}>
              <PixelText size="xs" color={colors.teal} bold align="center">
                JOURNEYS
              </PixelText>
              <PixelText size="lg" color={colors.parchment} bold align="center">
                {data.gamesPlayed}
              </PixelText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <PixelText size="xs" color={colors.gold} bold align="center">
                BEST SCORE
              </PixelText>
              <PixelText size="lg" color={colors.gold} bold align="center">
                {data.bestScore}
              </PixelText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <PixelText size="xs" color={colors.teal} bold align="center">
                MEMORIES
              </PixelText>
              <PixelText size="lg" color={colors.parchment} bold align="center">
                {data.memories.length}
              </PixelText>
            </View>
          </View>
        )}

        {isEmpty && (
          <View style={[styles.emptyBox, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
            <PixelText size="md" color={colors.mutedForeground} align="center">
              No journeys yet.
            </PixelText>
            <PixelText size="sm" color={colors.mutedForeground} align="center">
              Complete a journey to fill your lifetime travel journal.
            </PixelText>
          </View>
        )}

        {data.friends.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              FAMILIAR FRIENDS ({data.friends.length})
            </PixelText>
            <View style={[styles.sectionCard, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
              {data.friends.map((friend, i) => (
                <View
                  key={`${friend.name}-${i}`}
                  style={[
                    styles.friendRow,
                    i < data.friends.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <PixelText size="lg">{friend.sprite}</PixelText>
                  <View style={styles.friendInfo}>
                    <PixelText size="sm" color={colors.parchment} bold>
                      {friend.name}
                    </PixelText>
                    <PixelText size="xs" color={colors.mutedForeground}>
                      {friend.destName}
                    </PixelText>
                  </View>
                  <View style={styles.familiarityDots}>
                    {Array.from({ length: Math.min(friend.familiarity, 5) }).map((_, j) => (
                      <View
                        key={j}
                        style={[styles.dot, { backgroundColor: colors.gold }]}
                      />
                    ))}
                    {Array.from({ length: Math.max(0, 5 - friend.familiarity) }).map((_, j) => (
                      <View
                        key={`empty-${j}`}
                        style={[styles.dot, { backgroundColor: colors.border }]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.memories.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.teal} bold>
              TRAVEL MEMORIES ({data.memories.length})
            </PixelText>
            {data.memories.map((memory, i) => (
              <View
                key={`${memory.title}-${i}`}
                style={[
                  styles.memoryCard,
                  { backgroundColor: colors.navyLight, borderColor: colors.border },
                ]}
              >
                <View style={styles.memoryHeader}>
                  <PixelText size="sm" color={colors.parchment} bold>
                    {memory.title}
                  </PixelText>
                  <PixelText size="xs" color={colors.teal}>
                    {memory.destName}
                  </PixelText>
                </View>
                <PixelText size="xs" color={colors.mutedForeground}>
                  {memory.description}
                </PixelText>
              </View>
            ))}
          </View>
        )}

        <PixelButton onPress={() => setPhase("title")} variant="ghost">
          BACK TO TITLE
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 20,
    alignItems: "stretch",
  },
  titleArea: {
    alignItems: "center",
    gap: 6,
  },
  divider: {
    height: 2,
    width: 60,
    marginTop: 4,
  },
  statsBar: {
    borderWidth: 2,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
  },
  emptyBox: {
    borderWidth: 2,
    padding: 24,
    gap: 8,
    alignItems: "center",
  },
  section: {
    gap: 10,
  },
  sectionCard: {
    borderWidth: 2,
    overflow: "hidden",
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  friendInfo: {
    flex: 1,
    gap: 2,
  },
  familiarityDots: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
  },
  memoryCard: {
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  memoryHeader: {
    gap: 2,
  },
});
