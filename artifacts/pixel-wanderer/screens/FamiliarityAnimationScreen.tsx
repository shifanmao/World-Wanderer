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

export function FamiliarityAnimationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dismissFamiliarityAnimation } = useGame();
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
    dismissFamiliarityAnimation();
  };

  if (!state.familiarityAnimation) return null;

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
          💕
        </PixelText>
        <PixelText size="lg" color={colors.parchment} bold align="center">
          Familiarity Increased!
        </PixelText>
        <PixelText size="md" color={colors.tealLight} align="center">
          +{state.familiarityAnimation.familiarityIncrease} with {state.familiarityAnimation.npcName}
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
