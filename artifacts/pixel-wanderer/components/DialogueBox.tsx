import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { PixelText } from "./PixelText";
import { PixelButton } from "./PixelButton";

interface DialogueBoxProps {
  speakerName: string;
  speakerSprite: string;
  text: string;
  onNext: () => void;
  isLast: boolean;
  tip?: string;
}

export function DialogueBox({
  speakerName,
  speakerSprite,
  text,
  onNext,
  isLast,
  tip,
}: DialogueBoxProps) {
  const colors = useColors();
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current!);
        setDone(true);
      }
    }, 28);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]);

  useEffect(() => {
    if (done) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
    return () => blinkAnim.stopAnimation();
  }, [done, blinkAnim]);

  const skipOrAdvance = () => {
    if (!done) {
      clearInterval(timerRef.current!);
      setDisplayed(text);
      setDone(true);
    } else {
      onNext();
    }
  };

  return (
    <Pressable onPress={skipOrAdvance} style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.navyLight,
            borderColor: colors.gold,
          },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.sprite, { backgroundColor: colors.navy, borderColor: colors.teal }]}>
            <PixelText size="xl" align="center">
              {speakerSprite}
            </PixelText>
          </View>
          <PixelText size="sm" color={colors.gold} bold>
            {speakerName}
          </PixelText>
        </View>

        <View style={styles.textArea}>
          <PixelText size="sm" color={colors.parchment} style={styles.dialogueText}>
            {displayed}
          </PixelText>
          {done && (
            <Animated.View style={{ opacity: blinkAnim, alignSelf: "flex-end" }}>
              <PixelText size="xs" color={colors.gold}>
                {isLast ? "[ END ]" : "[ NEXT ]"}
              </PixelText>
            </Animated.View>
          )}
        </View>

        {done && tip && (
          <View style={[styles.tipBox, { backgroundColor: colors.navy, borderColor: colors.teal }]}>
            <PixelText size="xs" color={colors.tealLight} bold>
              TRAVELER TIP
            </PixelText>
            <PixelText size="xs" color={colors.parchment}>
              {tip}
            </PixelText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    borderWidth: 3,
    marginHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  sprite: {
    width: 48,
    height: 48,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    padding: 16,
    minHeight: 80,
    gap: 8,
  },
  dialogueText: {
    lineHeight: 22,
  },
  tipBox: {
    margin: 12,
    marginTop: 0,
    padding: 10,
    borderWidth: 2,
    gap: 4,
  },
});
