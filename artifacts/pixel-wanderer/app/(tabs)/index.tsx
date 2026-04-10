import React from "react";
import { StyleSheet, View } from "react-native";
import { useGame } from "@/context/GameContext";
import { TitleScreen } from "@/screens/TitleScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { ArrivingScreen } from "@/screens/ArrivingScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { NpcScreen } from "@/screens/NpcScreen";
import { FlyScreen } from "@/screens/FlyScreen";
import { CollectionScreen } from "@/screens/CollectionScreen";
import { GameOverScreen } from "@/screens/GameOverScreen";
import { useColors } from "@/hooks/useColors";

export default function GameScreen() {
  const { state } = useGame();
  const colors = useColors();

  const renderScreen = () => {
    switch (state.phase) {
      case "title":
        return <TitleScreen />;
      case "home":
        return <HomeScreen />;
      case "arriving":
        return <ArrivingScreen />;
      case "exploring":
        return <ExploreScreen />;
      case "npc_dialogue":
        return <NpcScreen />;
      case "flying":
        return <FlyScreen />;
      case "collection":
        return <CollectionScreen />;
      case "game_over":
        return <GameOverScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
