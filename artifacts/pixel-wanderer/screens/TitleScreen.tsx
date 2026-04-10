import React, { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/context/GameContext";

export function TitleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { startGame } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const starAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(Math.random()),
      y: new Animated.Value(Math.random()),
      opacity: new Animated.Value(Math.random()),
    })),
  ).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    starAnims.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  const topPad =
    Platform.OS === "web"
      ? insets.top + 67
      : insets.top;
  const bottomPad =
    Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: colors.navy },
      ]}
    >
      {/* Starfield */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {starAnims.map((star, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                left: `${(i * 17 + i * 11) % 100}%` as any,
                top: `${(i * 13 + i * 7) % 100}%` as any,
                opacity: star.opacity,
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                backgroundColor:
                  i % 5 === 0 ? colors.gold : colors.parchment,
              },
            ]}
          />
        ))}
      </View>

      <View
        style={[
          styles.content,
          {
            paddingTop: topPad + 40,
            paddingBottom: bottomPad + 20,
          },
        ]}
      >
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View
            style={[
              styles.globePixel,
              { backgroundColor: colors.navyLight, borderColor: colors.teal },
            ]}
          >
            <PixelText size="xxl" align="center">
              🌍
            </PixelText>
          </View>

          <PixelText size="xs" color={colors.teal} bold align="center">
            A SIMULATED JOURNEY
          </PixelText>
          <PixelText
            size="xxl"
            color={colors.gold}
            bold
            align="center"
            shadow
          >
            PIXEL
          </PixelText>
          <PixelText
            size="xxl"
            color={colors.parchment}
            bold
            align="center"
            shadow
          >
            WANDERER
          </PixelText>
          <View
            style={[styles.divider, { backgroundColor: colors.gold }]}
          />
          <PixelText size="sm" color={colors.parchmentDark} align="center">
            Explore the world. Meet strangers.
          </PixelText>
          <PixelText size="sm" color={colors.parchmentDark} align="center">
            Spend your budget wisely.
          </PixelText>
        </View>

        {/* Start button */}
        <Animated.View
          style={[styles.startArea, { transform: [{ scale: pulseAnim }] }]}
        >
          <PixelButton onPress={startGame} variant="primary">
            BEGIN JOURNEY
          </PixelButton>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <PixelText size="xs" color={colors.mutedForeground} align="center">
            Budget: $2,000 · 8 Destinations · Infinite Stories
          </PixelText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  star: {
    position: "absolute",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  logoArea: {
    alignItems: "center",
    gap: 8,
  },
  globePixel: {
    width: 88,
    height: 88,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  divider: {
    height: 2,
    width: 60,
    marginVertical: 8,
  },
  startArea: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: "center",
  },
});
