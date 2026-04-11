import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/context/GameContext";

export function HotelScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dismissMealReward } = useGame();
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConfirm = () => {
    dismissMealReward();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: anim,
            transform: [{ scale: scaleAnim }],
            paddingTop: titleTopPad + 100,
            paddingBottom: bottomPad + 20,
          },
        ]}
      >
        <PixelText size="xxl" color={colors.gold} bold align="center" shadow>
          🛏️
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold align="center">
          Rest Well
        </PixelText>
        <PixelText size="md" color={colors.tealLight} align="center">
          Energy restored. Ready for another day of exploration.
        </PixelText>
        <PixelButton onPress={handleConfirm} variant="primary">
          CONTINUE
        </PixelButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
});
