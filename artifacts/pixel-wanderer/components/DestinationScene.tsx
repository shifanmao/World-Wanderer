import React, { useEffect, useRef } from "react";
import {
  Animated,
<<<<<<< HEAD
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import type { Destination } from "@/constants/gameData";

const { width, height } = Dimensions.get("window");

=======
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import { PixelatedImage } from "./PixelatedImage";
import type { Destination } from "@/constants/gameData";

>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
interface DestinationSceneProps {
  destination: Destination;
  onReady?: () => void;
  showOverlay?: boolean;
<<<<<<< HEAD
=======
  /** Higher = more pixelated city art (fewer samples). Default tuned for headers. */
  pixelBlock?: number;
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
}

const PLACEHOLDER_COLORS: Record<string, string[]> = {
  paris: ["#2C1810", "#8B3A1A", "#D4691E", "#F5A623"],
  tokyo: ["#0D0F1A", "#1A1B3A", "#3A1550", "#7B2D8B"],
  macchu_picchu: ["#0A1A0A", "#1A3A1A", "#2D5C1E", "#5C8C3A"],
  cairo: ["#1A1000", "#3A2800", "#8B6914", "#D4A529"],
  kyoto: ["#1A0A1A", "#2D1A3A", "#8B4513", "#228B22"],
  santorini: ["#050A1A", "#0A1A3A", "#1A3A6B", "#2B6CB0"],
  marrakech: ["#1A0A00", "#3A1A00", "#8B3A00", "#C45C1A"],
  reykjavik: ["#050A14", "#0A1428", "#142850", "#1E3C78"],
};

function PlaceholderScene({ destination }: { destination: Destination }) {
  const colors2 = PLACEHOLDER_COLORS[destination.id] ?? ["#0A0E1A", "#141B2D", "#1A2540", "#2A3550"];

  return (
    <View style={[styles.placeholder]}>
      {colors2.map((c, i) => (
        <View
          key={i}
          style={[
            styles.placeholderBand,
            {
              backgroundColor: c,
              height: `${25}%`,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function DestinationScene({
  destination,
  onReady,
  showOverlay = true,
<<<<<<< HEAD
}: DestinationSceneProps) {
  const colors = useColors();
=======
  pixelBlock = 7,
}: DestinationSceneProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onReady?.();
    });

    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();
  }, [destination.id]);

  const SceneContent = destination.image ? (
<<<<<<< HEAD
    <ImageBackground
      source={destination.image}
      style={styles.image}
      resizeMode="cover"
=======
    <PixelatedImage
      source={destination.image}
      pixelBlock={pixelBlock}
      style={styles.image}
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
    />
  ) : (
    <PlaceholderScene destination={destination} />
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {SceneContent}

      {/* Pixel scanline overlay */}
      <View style={styles.scanlineOverlay} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.scanline,
              { opacity: i % 2 === 0 ? 0.08 : 0 },
            ]}
          />
        ))}
      </View>

      {showOverlay && (
<<<<<<< HEAD
        <View style={[styles.overlay, { backgroundColor: "rgba(10,14,26,0.65)" }]}>
=======
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: "rgba(10,14,26,0.65)",
              paddingTop: insets.top + 12,
            },
          ]}
        >
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
          <Animated.View style={[styles.labelContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.labelBox, { backgroundColor: colors.navy, borderColor: colors.gold }]}>
              <PixelText size="xs" color={colors.gold} bold align="center">
                {destination.country.toUpperCase()} — {destination.continent.toUpperCase()}
              </PixelText>
              <PixelText size="xxl" color={colors.parchment} bold align="center" shadow>
                {destination.name}
              </PixelText>
              <PixelText size="sm" color={colors.parchmentDark} align="center">
                {destination.atmosphere}
              </PixelText>
            </View>
          </Animated.View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  placeholderBand: {
    width: "100%",
  },
  scanlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  scanline: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
<<<<<<< HEAD
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal: 20,
=======
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 20,
>>>>>>> 9f641e7 (Cursor changes with some major experience changes.)
  },
  labelContainer: {
    alignItems: "center",
  },
  labelBox: {
    borderWidth: 3,
    padding: 16,
    width: "100%",
    gap: 4,
  },
});
