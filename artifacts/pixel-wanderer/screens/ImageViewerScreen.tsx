import React from "react";
import {
  Modal,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useColors } from "@/hooks/useColors";
import { PixelButton } from "@/components/PixelButton";
import { PixelText } from "@/components/PixelText";
import { useGame } from "@/context/GameContext";

export function ImageViewerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, closeImageView } = useGame();

  const image = state.viewingImage;
  if (!image) return null;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImageView}
    >
      <View style={[styles.container, { backgroundColor: colors.navy + "CC" }]}>
        <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          <PixelText size="lg" color={colors.gold} bold align="center" shadow>
            {image.title}
          </PixelText>
          <PixelText size="xs" color={colors.teal} align="center">
            {image.origins}
          </PixelText>
          
          <View style={[styles.imageContainer, { borderColor: colors.teal }]}>
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              contentFit="contain"
            />
          </View>

          <PixelButton onPress={closeImageView} variant="primary">
            CLOSE
          </PixelButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxWidth: 500,
    gap: 20,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
