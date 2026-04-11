import React, { useState } from "react";
import {
  type ImageSourcePropType,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { PixelText } from "./PixelText";
import { useColors } from "@/hooks/useColors";

export type PixelatedImageSource =
  | ImageSourcePropType
  | { uri: string };

type Props = {
  source: PixelatedImageSource;
  /** Larger = chunkier pixels (fewer samples). Typical 5–14. */
  pixelBlock?: number;
  style?: ViewStyle;
  /** When true, clips to rounded rect (memory cards). */
  rounded?: boolean;
};

/**
 * Renders a photo with a retro pixel look by sampling at low resolution
 * and scaling up so enlarged pixels read as chunky blocks.
 */
export function PixelatedImage({
  source,
  pixelBlock = 8,
  style,
  rounded = false,
}: Props) {
  const colors = useColors();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hasError, setHasError] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setSize({ w: width, h: height });
    }
  };

  const { w, h } = size;
  const block = Math.max(3, pixelBlock);
  const smallW = Math.max(1, Math.ceil(w / block));
  const smallH = Math.max(1, Math.ceil(h / block));
  /** Cover the box (same as resizeMode cover) so no empty bands. */
  const scale = Math.max(w / smallW, h / smallH);

  const webPixelStyle =
    Platform.OS === "web"
      ? ({
          imageRendering: "pixelated",
          msInterpolationMode: "nearest-neighbor",
        } as Record<string, string>)
      : undefined;

  return (
    <View
      style={[
        styles.fill,
        rounded && styles.rounded,
        style,
      ]}
      onLayout={onLayout}
    >
      {w > 0 && h > 0 && (
        <>
          {!hasError ? (
            <View
              style={[
                styles.pixelWrap,
                {
                  width: smallW,
                  height: smallH,
                  transform: [{ scale }],
                  transformOrigin: "left top",
                },
              ]}
            >
              <Image
                source={source as ImageSourcePropType}
                style={[
                  { width: smallW, height: smallH },
                  webPixelStyle,
                ]}
                contentFit="cover"
                cachePolicy="memory-disk"
                onError={() => setHasError(true)}
              />
            </View>
          ) : (
            <View
              style={[
                styles.fallback,
                {
                  width: smallW,
                  height: smallH,
                  transform: [{ scale }],
                  transformOrigin: "left top",
                  backgroundColor: colors.navyLight,
                },
              ]}
            >
              <PixelText size="xs" color={colors.mutedForeground} align="center">
                📷
              </PixelText>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#0A0E1A",
  },
  rounded: {
    borderRadius: 4,
  },
  pixelWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  fallback: {
    position: "absolute",
    left: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
});
