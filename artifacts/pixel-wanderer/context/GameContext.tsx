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
import type { Destination } from "@/constants/gameData";

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
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  arriveAtDestination: (dest: Destination) => void;
  payLodging: () => boolean;
  flyTo: (destId: string) => boolean;
  talkToNpc: (npcIndex: number) => void;
  advanceDialogue: () => void;
  collectItem: () => void;
  goToCollection: () => void;
  backToExploring: () => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
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
};

const GameContext = createContext<GameContextType | null>(null);

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
          setState(parsed);
        }
      }
    } catch {}
  };

  const save = useCallback(async (newState: GameState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
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
      updateState({
        phase: "exploring",
        currentDestination: dest,
        lodgedAtCurrent: false,
        visitedDestinations: state.visitedDestinations.includes(dest.id)
          ? state.visitedDestinations
          : [...state.visitedDestinations, dest.id],
      });
    },
    [state.visitedDestinations, updateState],
  );

  const payLodging = useCallback((): boolean => {
    if (state.lodgedAtCurrent) return true;
    if (state.budget < (state.currentDestination?.lodgingCost ?? 999)) {
      return false;
    }
    updateState({
      budget: state.budget - (state.currentDestination?.lodgingCost ?? 0),
      dayCount: state.dayCount + 1,
      lodgedAtCurrent: true,
    });
    return true;
  }, [state, updateState]);

  const flyTo = useCallback(
    (destId: string): boolean => {
      const cost =
        state.currentDestination?.flightCosts[destId] ?? 999999;
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

  const talkToNpc = useCallback(
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
    const npc =
      state.currentDestination?.npcs[state.currentNpcIndex];
    if (!npc) {
      updateState({ phase: "exploring" });
      return;
    }
    const nextIndex = state.currentDialogueIndex + 1;
    if (nextIndex >= npc.dialogues.length) {
      updateState({ phase: "exploring" });
    } else {
      updateState({ currentDialogueIndex: nextIndex });
    }
  }, [state, updateState]);

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
        talkToNpc,
        advanceDialogue,
        collectItem,
        goToCollection,
        backToExploring,
        resetGame,
        setPhase,
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
