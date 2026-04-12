import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
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
    key: string;
    name: string;
    sprite: string;
    destName: string;
    familiarity: number;
  }>;
  friendFrequency: Record<string, number>;
  gamesPlayed: number;
  bestScore: number;
  cityVisitCounts: Record<string, number>;
  dishCounts: Record<string, number>;
  dishes: Array<{
    name: string;
    imageUri: string;
    origin: string;
  }>;
  scenicSpots: Array<{
    name: string;
    imageUri: string;
    origin: string;
  }>;
}

const EMPTY: LifetimeData = {
  memories: [],
  friends: [],
  friendFrequency: {},
  gamesPlayed: 0,
  bestScore: 0,
  cityVisitCounts: {},
  dishCounts: {},
  dishes: [],
  scenicSpots: [],
};

export function LifetimeJournalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setPhase, viewImage, clearLifetimeData } = useGame();
  const [data, setData] = useState<LifetimeData | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const formatCityName = (cityId: string): string => {
    return cityId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

        {Object.keys(data.cityVisitCounts).length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              CITY VISITS
            </PixelText>
            <View style={[styles.sectionCard, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
              {Object.entries(data.cityVisitCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([cityId, count]) => (
                <View
                  key={cityId}
                  style={[
                    styles.statRow,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <PixelText size="sm" color={colors.parchment}>
                    {formatCityName(cityId)}
                  </PixelText>
                  <PixelText size="sm" color={colors.teal} bold>
                    {count}x
                  </PixelText>
                </View>
              ))}
            </View>
          </View>
        )}

        {Object.keys(data.dishCounts).length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              DISHES TASTED
            </PixelText>
            <View style={[styles.sectionCard, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
              {Object.entries(data.dishCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([dish, count]) => (
                <View
                  key={dish}
                  style={[
                    styles.statRow,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <PixelText size="sm" color={colors.parchment}>
                    {dish}
                  </PixelText>
                  <PixelText size="sm" color={colors.teal} bold>
                    {count}x
                  </PixelText>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.friends.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
              CLOSE FRIENDS
            </PixelText>
            <View style={[styles.sectionCard, { backgroundColor: colors.navyLight, borderColor: colors.teal }]}>
              {data.friends
                .filter(f => f.familiarity >= 3)
                .sort((a, b) => (data.friendFrequency[b.key] || 0) - (data.friendFrequency[a.key] || 0))
                .map((friend, i) => (
                <View
                  key={`${friend.key}-${i}`}
                  style={[
                    styles.statRow,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <PixelText size="sm" color={colors.parchment}>
                    {friend.sprite} {friend.name}
                  </PixelText>
                  <View style={styles.friendMeta}>
                    <PixelText size="xs" color={colors.mutedForeground}>
                      {friend.destName}
                    </PixelText>
                    <PixelText size="xs" color={colors.teal} bold>
                      {data.friendFrequency[friend.key] || 0}x
                    </PixelText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.memories.length > 0 && (
          <View style={styles.section}>
            <PixelText size="xs" color={colors.gold} bold>
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
        <PixelButton onPress={() => setShowResetConfirm(true)} variant="danger">
          RESET LIFETIME DATA
        </PixelButton>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetConfirm(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.navy + "cc" }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.navyLight, borderColor: colors.gold }]}>
            <PixelText size="lg" color={colors.gold} bold align="center">
              ⚠️ Reset Lifetime Data?
            </PixelText>
            <PixelText size="sm" color={colors.parchment} align="center" style={styles.modalMessage}>
              Are you sure you want to delete all your lifetime travel history? This cannot be undone.
            </PixelText>
            <View style={styles.modalButtons}>
              <PixelButton
                onPress={() => setShowResetConfirm(false)}
                variant="ghost"
                style={styles.modalButton}
              >
                CANCEL
              </PixelButton>
              <PixelButton
                onPress={() => {
                  clearLifetimeData();
                  setData(EMPTY);
                  setShowResetConfirm(false);
                }}
                variant="danger"
                style={styles.modalButton}
              >
                RESET
              </PixelButton>
            </View>
          </View>
        </View>
      </Modal>
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
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  friendMeta: {
    alignItems: "flex-end",
    gap: 2,
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
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});
