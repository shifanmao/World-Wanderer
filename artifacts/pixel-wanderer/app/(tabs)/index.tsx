import React from "react";
import { StyleSheet, View } from "react-native";
import { useGame } from "@/context/GameContext";
import { TitleScreen } from "@/screens/TitleScreen";
import { TutorialScreen } from "@/screens/TutorialScreen";
import { CharacterSelectScreen } from "@/screens/CharacterSelectScreen";
import { WorldMapScreen } from "@/screens/WorldMapScreen";
import { LifetimeJournalScreen } from "@/screens/LifetimeJournalScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { ArrivingScreen } from "@/screens/ArrivingScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { NpcScreen } from "@/screens/NpcScreen";
import { FlyScreen } from "@/screens/FlyScreen";
import { CollectionScreen } from "@/screens/CollectionScreen";
import { GameOverScreen } from "@/screens/GameOverScreen";
import { ImageViewerScreen } from "@/screens/ImageViewerScreen";
import { FamiliarityAnimationScreen } from "@/screens/FamiliarityAnimationScreen";
import { ActionRewardScreen } from "@/screens/ActionRewardScreen";
import { MealScreen } from "@/screens/MealScreen";
import { HotelScreen } from "@/screens/HotelScreen";
import { TravelMemoryScreen } from "@/screens/TravelMemoryScreen";
import { ThankYouScreen } from "@/screens/ThankYouScreen";
import { useColors } from "@/hooks/useColors";

export default function GameScreen() {
  const { state } = useGame();
  const colors = useColors();

  const renderScreen = () => {
    switch (state.phase) {
      case "title":
        return <TitleScreen />;
      case "tutorial":
        return <TutorialScreen />;
      case "character_select":
        return <CharacterSelectScreen />;
      case "world_map":
        return <WorldMapScreen />;
      case "lifetime_journal":
        return <LifetimeJournalScreen />;
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
      case "image_viewer":
        return <ImageViewerScreen />;
      case "meal":
        return <MealScreen />;
      case "hotel":
        return <HotelScreen />;
      case "travel_memory":
        return <TravelMemoryScreen />;
      case "thank_you":
        return <ThankYouScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      {state.familiarityAnimation && <FamiliarityAnimationScreen />}
      {state.actionReward && <ActionRewardScreen />}
      {!state.familiarityAnimation && !state.actionReward && renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
