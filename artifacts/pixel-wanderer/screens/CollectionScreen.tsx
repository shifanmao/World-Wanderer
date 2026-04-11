import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelatedImage } from "@/components/PixelatedImage";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { BudgetAndEnergyBar } from "@/components/BudgetAndEnergyBar";
import { DESTINATIONS, getTipActionById } from "@/constants/gameData";
import { useGame } from "@/context/GameContext";

export function CollectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, backToExploring, endGame, viewImage } = useGame();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  const friends = useMemo(
    () => {
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
    },
    [state.familiarity],
  );

  const tipMemories = useMemo(
    () =>
      state.collectedTipActionIds
        .map((id) => getTipActionById(id))
        .filter((m): m is NonNullable<typeof m> => m !== null)
        .filter((m) => m.action.rewardImageUri && m.action.rewardImageUri.length > 0),
    [state.collectedTipActionIds],
  );

  const collectedMeals = useMemo(() => {
    const meals: Array<{
      name: string;
      imageUri: string;
      country: string;
      destinationName: string;
    }> = [];

    DESTINATIONS.forEach((dest) => {
      if (state.collectedMeals.includes(dest.localMeal.name)) {
        meals.push({
          name: dest.localMeal.name,
          imageUri: dest.localMeal.imageUri,
          country: dest.country,
          destinationName: dest.name,
        });
      }
    });

    return meals;
  }, [state.collectedMeals]);

  // Group all collectibles by theme
  const collectiblesByTheme = useMemo(() => {
    const themes: Record<string, { name: string; collected: boolean; destination?: string; icon: string }[]> = {};

    const themeIcons: Record<string, string> = {
      "Artifacts": "🏺",
      "Nature": "🌿",
      "Food": "🍽️",
      "Crafts": "🎨",
      "Architecture": "🏛️",
      "Music": "🎵",
      "Clothing": "👕",
      "Jewelry": "💎",
    };

    DESTINATIONS.forEach((dest) => {
      // Main collectible
      const mainCollected = state.collectedItems.includes(dest.collectibleName);
      if (!themes[dest.collectibleTheme]) {
        themes[dest.collectibleTheme] = [];
      }
      themes[dest.collectibleTheme].push({
        name: dest.collectibleName,
        collected: mainCollected,
        destination: dest.name,
        icon: themeIcons[dest.collectibleTheme] || "📦",
      });

      // Additional collectibles
      dest.additionalCollectibles?.forEach((additional) => {
        const additionalCollected = state.collectedItems.includes(additional.name);
        if (!themes[additional.theme]) {
          themes[additional.theme] = [];
        }
        themes[additional.theme].push({
          name: additional.name,
          collected: additionalCollected,
          destination: dest.name,
          icon: themeIcons[additional.theme] || "📦",
        });
      });
    });

    return themes;
  }, [state.collectedItems]);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View style={styles.topFixedColumn}>
        <View
          style={[
            styles.header,
            {
              paddingTop: titleTopPad,
              backgroundColor: colors.navyLight,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <PixelText size="xs" color={colors.gold} bold>
              TRAVELER JOURNAL
            </PixelText>
            <PixelText size="xs" color={colors.gold} bold>
              REP: {state.reputation}
            </PixelText>
          </View>
          <View style={styles.titleRow}>
            <PixelText size="md" color={colors.parchment} bold shadow>
              Your Collection
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
        <BudgetAndEnergyBar />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Travel Memories */}
        <View style={styles.section}>
          <PixelText size="xs" color={colors.gold} bold>
            1. TRAVEL MEMORIES ({tipMemories.length})
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground}>
            Memories from following locals' advice.
          </PixelText>
          {tipMemories.length > 0 ? (
            <View style={styles.tipGrid}>
              {tipMemories.map(({ action, destinationName, npcName }) => (
                <Pressable
                  key={action.id}
                  onPress={() => viewImage(action.rewardImageUri, action.collectibleName)}
                >
                  <View
                    style={[
                      styles.tipCard,
                      {
                        backgroundColor: colors.navyLight,
                        borderColor: colors.gold,
                      },
                    ]}
                  >
                    <View style={styles.tipImageWrap}>
                      <PixelatedImage
                        source={{ uri: action.rewardImageUri }}
                        pixelBlock={8}
                        rounded
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <PixelText size="xs" color={colors.mutedForeground} align="center">
              No travel memories yet. Follow locals' advice to collect memories!
            </PixelText>
          )}
        </View>

        {/* Section 2: Collectables - hide themes if none collected */}
        <View style={styles.section}>
          <PixelText size="xs" color={colors.gold} bold>
            2. COLLECTABLES
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground}>
            Items you've discovered on your journey.
          </PixelText>
          {Object.entries(collectiblesByTheme)
            .filter(([_, collectibles]) => {
              const collectedCount = collectibles.filter((c) => c.collected).length;
              return collectedCount > 0;
            })
            .map(([theme, collectibles]) => {
              const collectedCount = collectibles.filter((c) => c.collected).length;
              const totalCount = collectibles.length;
              const isComplete = collectedCount === totalCount;

              return (
                <View key={theme} style={styles.subsection}>
                  <PixelText size="xs" color={isComplete ? colors.gold : colors.tealLight} bold>
                    {theme} ({collectedCount}/{totalCount})
                    {isComplete && " ✓ COMPLETE"}
                  </PixelText>
                  <View style={styles.itemsGrid}>
                    {collectibles.map((item) => (
                      <View
                        key={item.name}
                        style={[
                          styles.itemChip,
                          {
                            backgroundColor: item.collected ? colors.navyLight : colors.navy + "44",
                            borderColor: item.collected ? colors.teal : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.collectableIconRow}>
                          <PixelText size="xs">{item.icon}</PixelText>
                          <PixelText size="xs" color={item.collected ? colors.parchment : colors.mutedForeground} bold>
                            {item.collected ? item.name : "?"}
                          </PixelText>
                        </View>
                        {item.collected && item.destination && (
                          <PixelText size="xs" color={colors.mutedForeground}>
                            {item.destination}
                          </PixelText>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          {Object.entries(collectiblesByTheme).every(([_, collectibles]) => {
            const collectedCount = collectibles.filter((c) => c.collected).length;
            return collectedCount === 0;
          }) && (
            <PixelText size="xs" color={colors.mutedForeground} align="center">
              No collectables yet. Explore destinations to find items!
            </PixelText>
          )}
        </View>

        {/* Section 3: Meals */}
        <View style={styles.section}>
          <PixelText size="xs" color={colors.gold} bold>
            3. MEALS ({collectedMeals.length})
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground}>
            Local dishes you've tasted.
          </PixelText>
          {collectedMeals.length > 0 ? (
            <View style={styles.tipGrid}>
              {collectedMeals.map((meal) => (
                <Pressable
                  key={meal.name}
                  onPress={() => viewImage(meal.imageUri, meal.name)}
                >
                  <View
                    style={[
                      styles.tipCard,
                      {
                        backgroundColor: colors.navyLight,
                        borderColor: colors.gold,
                      },
                    ]}
                  >
                    <View style={styles.tipImageWrap}>
                      <PixelatedImage
                        source={{ uri: meal.imageUri }}
                        pixelBlock={8}
                        rounded
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <PixelText size="xs" color={colors.mutedForeground} align="center">
              No meals yet. Have a meal to collect local dishes!
            </PixelText>
          )}
        </View>

        {/* Section 4: Friends */}
        <View style={styles.section}>
          <PixelText size="xs" color={colors.gold} bold>
            4. FRIENDS ({friends.length})
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground}>
            People you've gotten to know well.
          </PixelText>
          {friends.length > 0 ? (
            <View style={styles.friendsGrid}>
              {friends.map((friend, index) => (
                <View
                  key={`${friend.name}-${friend.destinationName}-${index}`}
                  style={[
                    styles.friendCard,
                    {
                      backgroundColor: colors.navyLight,
                      borderColor: colors.teal,
                    },
                  ]}
                >
                  <View style={[styles.friendEmoji, { backgroundColor: colors.navy }]}>
                    <PixelText size="xxl">{friend.sprite}</PixelText>
                  </View>
                  <PixelText size="xs" color={colors.parchment} bold align="center">
                    {friend.name}
                  </PixelText>
                  <PixelText size="xs" color={colors.mutedForeground} align="center">
                    {friend.destinationName}
                  </PixelText>
                  <PixelText size="xs" color={colors.teal} align="center">
                    Familiarity: {friend.familiarity}/10
                  </PixelText>
                </View>
              ))}
            </View>
          ) : (
            <PixelText size="xs" color={colors.mutedForeground} align="center">
              No friends yet. Talk to locals to build relationships!
            </PixelText>
          )}
        </View>

        <PixelButton onPress={backToExploring} variant="secondary">
          BACK TO EXPLORING
        </PixelButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  topFixedColumn: {
    flexShrink: 0,
    zIndex: 2,
    elevation: 4,
  },
  header: {
    borderBottomWidth: 3,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quitButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  section: {
    gap: 8,
    marginBottom: 4,
  },
  subsection: {
    gap: 8,
    marginTop: 8,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemChip: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  collectableIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  tipCard: {
    width: "47%",
    aspectRatio: 1,
    borderWidth: 2,
    padding: 0,
    gap: 0,
  },
  tipImageWrap: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  friendsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  friendCard: {
    width: "47%",
    borderWidth: 2,
    padding: 10,
    gap: 4,
    alignItems: "center",
  },
  friendEmoji: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
