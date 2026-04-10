import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "@/components/PixelText";
import { PixelButton } from "@/components/PixelButton";
import { DestinationScene } from "@/components/DestinationScene";
import { useGame } from "@/context/GameContext";

const { height } = Dimensions.get("window");

export function ArrivingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, arriveAtDestination } = useGame();
  const [sceneReady, setSceneReady] = useState(false);
  const dest = state.currentDestination;

  const curtainLeft = useRef(new Animated.Value(0)).current;
  const curtainRight = useRef(new Animated.Value(0)).current;
  const infoFade = useRef(new Animated.Value(0)).current;
  const flightFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setSceneReady(false);
    curtainLeft.setValue(0);
    curtainRight.setValue(0);
    infoFade.setValue(0);
    flightFade.setValue(1);

    // Show flight animation, then open curtains
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(flightFade, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);
  }, [dest?.id]);

  const handleSceneReady = () => {
    setSceneReady(true);
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(curtainLeft, {
          toValue: -1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(curtainRight, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(infoFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (dest) arriveAtDestination(dest);
  };

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!dest) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {/* Scene */}
      <View style={styles.scene}>
        <DestinationScene
          destination={dest}
          onReady={handleSceneReady}
          showOverlay
        />
      </View>

      {/* Curtains */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.curtainLeft,
          {
            backgroundColor: colors.navy,
            transform: [
              {
                translateX: curtainLeft.interpolate({
                  inputRange: [-1, 0],
                  outputRange: [-500, 0],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.curtainRight,
          {
            backgroundColor: colors.navy,
            transform: [
              {
                translateX: curtainRight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                }),
              },
            ],
          },
        ]}
      />

      {/* Flight overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flightOverlay,
          {
            opacity: flightFade,
            backgroundColor: colors.navy,
          },
        ]}
      >
        <PixelText size="xxl" align="center">
          ✈
        </PixelText>
        <PixelText size="md" color={colors.gold} bold align="center">
          BOARDING...
        </PixelText>
        <PixelText size="sm" color={colors.mutedForeground} align="center">
          Destination: {dest.name}
        </PixelText>
      </Animated.View>

      {/* Bottom CTA */}
      {sceneReady && (
        <Animated.View
          style={[
            styles.bottomArea,
            {
              opacity: infoFade,
              paddingBottom: bottomPad + 20,
              backgroundColor: "transparent",
            },
          ]}
        >
          <View style={[styles.descBox, { backgroundColor: colors.navy, borderColor: colors.border }]}>
            <PixelText size="sm" color={colors.parchmentDark} align="center">
              {dest.description}
            </PixelText>
          </View>
          <View style={[styles.statsRow]}>
            <View style={[styles.statChip, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
              <PixelText size="xs" color={colors.mutedForeground}>LODGING</PixelText>
              <PixelText size="sm" color={colors.gold} bold>${dest.lodgingCost}/night</PixelText>
            </View>
            <View style={[styles.statChip, { backgroundColor: colors.navyLight, borderColor: colors.border }]}>
              <PixelText size="xs" color={colors.mutedForeground}>PEOPLE</PixelText>
              <PixelText size="sm" color={colors.tealLight} bold>{dest.people.length} to meet</PixelText>
            </View>
          </View>
          <PixelButton onPress={handleContinue} variant="primary">
            EXPLORE {dest.name.toUpperCase()}
          </PixelButton>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
  },
  curtainLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "50%",
  },
  curtainRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "50%",
  },
  flightOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 12,
  },
  descBox: {
    borderWidth: 2,
    padding: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statChip: {
    flex: 1,
    borderWidth: 2,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
});
