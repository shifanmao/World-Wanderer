import React from "react";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelatedImage } from "@/components/PixelatedImage";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/context/GameContext";

export function MealScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dismissMealReward } = useGame();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  if (!state.mealReward) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: titleTopPad + 8,
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: colors.navyLight,
            borderBottomColor: colors.gold,
          },
        ]}
      >
        <PixelText size="xs" color={colors.gold} bold align="center">
          DELICIOUS!
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold align="center">
          Local Meal Tasted
        </PixelText>
      </View>

      <View
        style={[
          styles.content,
          { paddingTop: 20, paddingBottom: bottomPad + 20, paddingHorizontal: 16 },
        ]}
      >
        {/* Meal Image */}
        <View style={styles.imageContainer}>
          <PixelatedImage
            source={{ uri: state.mealReward.dishImageUri }}
            pixelBlock={8}
            rounded
            style={styles.image}
          />
        </View>

        {/* Meal Details */}
        <View style={styles.details}>
          <PixelText size="xl" color={colors.gold} bold align="center">
            {state.mealReward.dishName}
          </PixelText>
          <PixelText size="sm" color={colors.parchment} align="center">
            {state.mealReward.country}
          </PixelText>
          <PixelText size="xs" color={colors.teal} bold align="center" style={styles.reputation}>
            +{state.mealReward.reputationGain} Reputation
          </PixelText>
        </View>

        {/* Continue Button */}
        <PixelButton onPress={dismissMealReward} variant="primary" style={styles.button}>
          CONTINUE
        </PixelButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 3,
    gap: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    gap: 8,
    alignItems: "center",
  },
  reputation: {
    marginTop: 8,
  },
  button: {
    minWidth: 200,
  },
});
