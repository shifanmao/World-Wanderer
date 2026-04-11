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
import { useGame } from "@/context/GameContext";

export function TutorialScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setPhase } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const titleTopPad = Platform.OS === "web" ? 8 : insets.top;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.navy }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: titleTopPad + 40,
            paddingBottom: bottomPad + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <PixelText size="xxl" color={colors.gold} bold align="center" shadow>
            🌍
          </PixelText>
          <PixelText size="lg" color={colors.parchment} bold align="center">
            WELCOME TO PIXEL WANDERER
          </PixelText>
          <View style={[styles.divider, { backgroundColor: colors.gold }]} />
        </View>

        <View style={styles.section}>
          <PixelText size="md" color={colors.tealLight} bold align="center">
            🎯 YOUR GOAL
          </PixelText>
          <PixelText size="sm" color={colors.parchment} align="center">
            Maximize your reputation!
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            Everything you do during your trip helps increase it
          </PixelText>
        </View>

        <View style={styles.section}>
          <PixelText size="md" color={colors.gold} bold align="center">
            ⚡ 💰 WATCH YOUR RESOURCES
          </PixelText>
          <PixelText size="sm" color={colors.parchment} align="center">
            Energy and Budget are limited
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            If you run out of either, the game is over!
          </PixelText>
        </View>

        <View style={styles.section}>
          <PixelText size="md" color={colors.tealLight} bold align="center">
            💕 ENJOY YOUR TRIP
          </PixelText>
          <PixelText size="sm" color={colors.parchment} align="center">
            Collect memories and make friends
          </PixelText>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            Talk to locals, explore cities, and have fun!
          </PixelText>
        </View>

        <View style={styles.buttonArea}>
          <PixelButton onPress={() => setPhase("character_select")} variant="primary">
            BEGIN YOUR JOURNEY
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  divider: {
    height: 2,
    width: 60,
    marginVertical: 8,
  },
  section: {
    gap: 8,
    paddingVertical: 16,
  },
  buttonArea: {
    alignItems: "center",
    paddingTop: 20,
  },
});
