import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DESTINATIONS,
  STARTING_BUDGET,
  getRandomDestination,
} from "@/constants/gameData";
import type { Destination, EarningOpportunity } from "@/constants/gameData";

export type GamePhase =
  | "title"
  | "arriving"
  | "exploring"
  | "npc_dialogue"
  | "flying"
  | "collection"
  | "game_over";

export interface GameState {
  phase: GamePhase;
  budget: number;
  currentDestination: Destination | null;
  visitedDestinations: string[];
  collectedItems: string[];
  dayCount: number;
  currentNpcIndex: number;
  currentDialogueIndex: number;
  lodgedAtCurrent: boolean;
  activeOpportunity: EarningOpportunity | null;
  usedOpportunityIds: string[];
  lastEarned: number | null;
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  arriveAtDestination: (dest: Destination) => void;
  payLodging: () => boolean;
  flyTo: (destId: string) => boolean;
  talkToCharacter: (npcIndex: number) => void;
  advanceDialogue: () => void;
  collectItem: () => void;
  goToCollection: () => void;
  backToExploring: () => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
  acceptOpportunity: () => void;
  dismissOpportunity: () => void;
  rollOpportunity: (fromCharacterIndex?: number) => void;
  clearLastEarned: () => void;
}

const STORAGE_KEY = "@pixel_wanderer_save";

const initialState: GameState = {
  phase: "title",
  budget: STARTING_BUDGET,
  currentDestination: null,
  visitedDestinations: [],
  collectedItems: [],
  dayCount: 1,
  currentNpcIndex: 0,
  currentDialogueIndex: 0,
  lodgedAtCurrent: false,
  activeOpportunity: null,
  usedOpportunityIds: [],
  lastEarned: null,
};

const GameContext = createContext<GameContextType | null>(null);

function pickOpportunity(
  dest: Destination,
  usedIds: string[],
  fromCharacterIndex?: number,
): EarningOpportunity | null {
  // Try character-specific opportunity first
  if (fromCharacterIndex !== undefined) {
    const charOpp = dest.people[fromCharacterIndex]?.earningOnTalk;
    if (charOpp && !usedIds.includes(charOpp.id)) {
      return charOpp;
    }
  }
  // Pick from destination pool
  const available = dest.earningOpportunities.filter(
    (o) => !usedIds.includes(o.id),
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  useEffect(() => {
    loadSave();
  }, []);

  const loadSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phase !== "title") {
          // Re-attach image refs (can't serialize require())
          if (parsed.currentDestination) {
            const live = DESTINATIONS.find(
              (d) => d.id === parsed.currentDestination.id,
            );
            if (live) parsed.currentDestination = live;
          }
          setState(parsed);
        }
      }
    } catch {}
  };

  const save = useCallback(async (newState: GameState) => {
    try {
      // Don't serialize the image ref
      const toSave = {
        ...newState,
        currentDestination: newState.currentDestination
          ? { ...newState.currentDestination, image: null }
          : null,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, []);

  const updateState = useCallback(
    (updates: Partial<GameState>) => {
      setState((prev) => {
        const next = { ...prev, ...updates };
        save(next);
        return next;
      });
    },
    [save],
  );

  const startGame = useCallback(() => {
    const dest = getRandomDestination();
    const newState: GameState = {
      ...initialState,
      phase: "arriving",
      currentDestination: dest,
      visitedDestinations: [dest.id],
      budget: STARTING_BUDGET,
    };
    setState(newState);
    save(newState);
  }, [save]);

  const arriveAtDestination = useCallback(
    (dest: Destination) => {
      // Roll for an immediate opportunity on arrival (40% chance)
      const roll = Math.random();
      const opportunity =
        roll < 0.4
          ? pickOpportunity(dest, state.usedOpportunityIds)
          : null;

      updateState({
        phase: "exploring",
        currentDestination: dest,
        lodgedAtCurrent: false,
        activeOpportunity: opportunity,
        lastEarned: null,
        visitedDestinations: state.visitedDestinations.includes(dest.id)
          ? state.visitedDestinations
          : [...state.visitedDestinations, dest.id],
      });
    },
    [state.visitedDestinations, state.usedOpportunityIds, updateState],
  );

  const payLodging = useCallback((): boolean => {
    if (state.lodgedAtCurrent) return true;
    const cost = state.currentDestination?.lodgingCost ?? 999;
    if (state.budget < cost) return false;

    const newDay = state.dayCount + 1;
    const newUsedIds = state.usedOpportunityIds;

    // Roll for new opportunity next morning (55% chance)
    const roll = Math.random();
    const opportunity =
      roll < 0.55 && state.currentDestination
        ? pickOpportunity(state.currentDestination, newUsedIds)
        : null;

    updateState({
      budget: state.budget - cost,
      dayCount: newDay,
      lodgedAtCurrent: true,
      activeOpportunity: opportunity,
      lastEarned: null,
    });
    return true;
  }, [state, updateState]);

  const flyTo = useCallback(
    (destId: string): boolean => {
      const cost = state.currentDestination?.flightCosts[destId] ?? 999999;
      if (state.budget < cost) return false;

      const dest = DESTINATIONS.find((d) => d.id === destId);
      if (!dest) return false;

      const alreadyVisited = state.visitedDestinations.includes(destId);
      const newState: GameState = {
        ...state,
        phase: "arriving",
        budget: state.budget - cost,
        currentDestination: dest,
        lodgedAtCurrent: false,
        activeOpportunity: null,
        lastEarned: null,
        visitedDestinations: alreadyVisited
          ? state.visitedDestinations
          : [...state.visitedDestinations, destId],
      };
      setState(newState);
      save(newState);
      return true;
    },
    [state, save],
  );

  const talkToCharacter = useCallback(
    (npcIndex: number) => {
      updateState({
        phase: "npc_dialogue",
        currentNpcIndex: npcIndex,
        currentDialogueIndex: 0,
      });
    },
    [updateState],
  );

  const advanceDialogue = useCallback(() => {
    const character =
      state.currentDestination?.people[state.currentNpcIndex];
    if (!character) {
      updateState({ phase: "exploring" });
      return;
    }
    const nextIndex = state.currentDialogueIndex + 1;
    if (nextIndex >= character.dialogues.length) {
      // End of dialogue — 60% chance to surface a character-specific earning opportunity
      const roll = Math.random();
      const opportunity =
        roll < 0.6 && state.currentDestination
          ? pickOpportunity(
              state.currentDestination,
              state.usedOpportunityIds,
              state.currentNpcIndex,
            )
          : null;
      updateState({
        phase: "exploring",
        activeOpportunity: opportunity ?? state.activeOpportunity,
      });
    } else {
      updateState({ currentDialogueIndex: nextIndex });
    }
  }, [state, updateState]);

  const rollOpportunity = useCallback(
    (fromCharacterIndex?: number) => {
      if (!state.currentDestination) return;
      const roll = Math.random();
      if (roll < 0.45) {
        const opportunity = pickOpportunity(
          state.currentDestination,
          state.usedOpportunityIds,
          fromCharacterIndex,
        );
        if (opportunity) updateState({ activeOpportunity: opportunity });
      }
    },
    [state, updateState],
  );

  const acceptOpportunity = useCallback(() => {
    const opp = state.activeOpportunity;
    if (!opp) return;
    updateState({
      budget: state.budget + opp.earnings,
      usedOpportunityIds: [...state.usedOpportunityIds, opp.id],
      activeOpportunity: null,
      lastEarned: opp.earnings,
    });
  }, [state, updateState]);

  const dismissOpportunity = useCallback(() => {
    const opp = state.activeOpportunity;
    updateState({
      activeOpportunity: null,
      usedOpportunityIds: opp
        ? [...state.usedOpportunityIds, opp.id]
        : state.usedOpportunityIds,
    });
  }, [state, updateState]);

  const clearLastEarned = useCallback(() => {
    updateState({ lastEarned: null });
  }, [updateState]);

  const collectItem = useCallback(() => {
    const item = state.currentDestination?.collectibleName;
    if (!item || state.collectedItems.includes(item)) return;
    updateState({
      collectedItems: [...state.collectedItems, item],
    });
  }, [state, updateState]);

  const goToCollection = useCallback(() => {
    updateState({ phase: "collection" });
  }, [updateState]);

  const backToExploring = useCallback(() => {
    updateState({ phase: "exploring" });
  }, [updateState]);

  const resetGame = useCallback(() => {
    setState(initialState);
    save(initialState);
  }, [save]);

  const setPhase = useCallback(
    (phase: GamePhase) => {
      updateState({ phase });
    },
    [updateState],
  );

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        arriveAtDestination,
        payLodging,
        flyTo,
        talkToCharacter,
        advanceDialogue,
        collectItem,
        goToCollection,
        backToExploring,
        resetGame,
        setPhase,
        acceptOpportunity,
        dismissOpportunity,
        rollOpportunity,
        clearLastEarned,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
