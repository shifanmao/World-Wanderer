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
  PLAYABLE_CHARACTERS,
} from "@/constants/gameData";
import type {
  Destination,
  EarningOpportunity,
  TravelerTipAction,
  PlayableCharacter,
} from "@/constants/gameData";

export type GamePhase =
  | "title"
  | "tutorial"
  | "character_select"
  | "world_map"
  | "lifetime_journal"
  | "home"
  | "arriving"
  | "exploring"
  | "npc_dialogue"
  | "flying"
  | "collection"
  | "game_over"
  | "image_viewer"
  | "meal"
  | "hotel"
  | "travel_memory"
  | "thank_you"
  | "action_reward"
  | "tip_action_reward"
  | "familiarity_animation";

export interface GameState {
  phase: GamePhase;
  budget: number;
  energy: number;
  maxEnergy: number;
  reputation: number;
  selectedCharacter: PlayableCharacter | null;
  currentDestination: Destination | null;
  visitedDestinations: string[];
  collectedItems: string[];
  collectedMeals: string[];
  dayCount: number;
  currentNpcIndex: number;
  currentDialogueIndex: number;
  activeOpportunity: EarningOpportunity | null;
  usedOpportunityIds: string[];
  lastEarned: number | null;
  currentDialogueOffset: number;
  lastTipActionResult: {
    title: string;
    detail: string;
    icon: string;
  } | null;
  /** After paying for a tip action, show this until the player taps through */
  pendingTipReward: {
    tipId: string;
    imageUri: string;
    title: string;
    outcome: string;
    collectibleName: string;
    destinationId: string;
  } | null;
  /** Tip action ids the player has completed (journal + home screen) */
  collectedTipActionIds: string[];
  /** Familiarity with locals: map of "destinationId_characterId" to familiarity level (0-10) */
  familiarity: Record<string, number>;
  /** Track actions per city visit: map of "destinationId_visitCount" to number of actions */
  actionCounts: Record<string, number>;
  /** Track current visit number per destination */
  destinationVisitCounts: Record<string, number>;
  /** Track shown dialogues per character per visit to prevent repetition */
  shownDialogues: Record<string, number[]>;
  /** High score */
  highScore: number;
  /** Image viewer state */
  viewingImage: {
    uri: string;
    title: string;
  } | null;
  /** Message shown when player runs out of actions */
  outOfActionsMessage: string | null;
  /** Track which NPC the player last talked to for familiarity bonuses */
  lastTalkedNpcIndex: number | null;
  /** Show familiarity animation */
  familiarityAnimation: {
    npcName: string;
    familiarityIncrease: number;
  } | null;
  /** Show NPC thank you dialogue after work opportunity */
  pendingThankYouDialogue: boolean;
  /** Show travel memory after scenic spot visit */
  pendingTravelMemory: boolean;
  travelMemoryTitle: string;
  travelMemoryDescription: string;
  travelMemoryImageUri: string;
  /** Show action reward screen */
  actionReward: {
    earnings: number;
    description: string;
  } | null;
  actionBarAnimation: boolean;
  mealReward: {
    dishName: string;
    dishImageUri: string;
    country: string;
    reputationGain: number;
  } | null;
  travelMemory: {
    title: string;
    description: string;
    imageUri: string;
    reputationGain: number;
  } | null;
  /** Accumulated travel memories this game */
  memories: Array<{
    title: string;
    description: string;
    destName: string;
    imageUri: string;
  }>;
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  selectCharacter: (characterId: string) => void;
  startFromCity: (destId: string) => void;
  arriveAtDestination: (dest: Destination) => void;
  payLodging: () => boolean;
  haveMeal: () => boolean;
  flyTo: (destId: string) => boolean;
  talkToCharacter: (npcIndex: number) => void;
  advanceDialogue: () => void;
  collectItem: () => void;
  goToCollection: () => void;
  backToExploring: () => void;
  resetGame: () => void;
  endGame: () => void;
  setPhase: (phase: GamePhase) => void;
  acceptOpportunity: () => void;
  dismissOpportunity: () => void;
  rollOpportunity: (fromCharacterIndex?: number) => void;
  clearLastEarned: () => void;
  performTipAction: () => boolean;
  clearTipActionResult: () => void;
  dismissTipReward: () => void;
  calculateReputation: () => number;
  checkGameOver: () => boolean;
  viewImage: (uri: string, title: string) => void;
  closeImageView: () => void;
  loadHighScore: () => Promise<number>;
  saveHighScore: (score: number) => Promise<void>;
  dismissFamiliarityAnimation: () => void;
  dismissActionReward: () => void;
  triggerActionBarAnimation: () => void;
  dismissMealReward: () => void;
  dismissTravelMemory: () => void;
  saveLifetimeData: () => Promise<void>;
}

const STORAGE_KEY = "@pixel_wanderer_save";

const initialState: GameState = {
  phase: "title",
  budget: STARTING_BUDGET,
  energy: 50,
  maxEnergy: 50,
  reputation: 0,
  selectedCharacter: null,
  currentDestination: null,
  visitedDestinations: [],
  collectedItems: [],
  collectedMeals: [],
  dayCount: 1,
  currentNpcIndex: 0,
  currentDialogueIndex: 0,
  activeOpportunity: null,
  usedOpportunityIds: [],
  lastEarned: null,
  currentDialogueOffset: 0,
  lastTipActionResult: null,
  pendingTipReward: null,
  collectedTipActionIds: [],
  familiarity: {},
  actionCounts: {},
  destinationVisitCounts: {},
  shownDialogues: {},
  highScore: 0,
  viewingImage: null,
  outOfActionsMessage: null,
  lastTalkedNpcIndex: null,
  familiarityAnimation: null,
  pendingThankYouDialogue: false,
  pendingTravelMemory: false,
  travelMemoryTitle: "",
  travelMemoryDescription: "",
  travelMemoryImageUri: "",
  actionReward: null,
  actionBarAnimation: false,
  mealReward: null,
  travelMemory: null,
  memories: [],
};

const GameContext = createContext<GameContextType | null>(null);

function pickOpportunity(
  dest: Destination,
  usedIds: string[] | undefined,
  fromCharacterIndex?: number,
): EarningOpportunity | null {
  const safeUsed = usedIds ?? [];
  // Try character-specific opportunity first
  if (fromCharacterIndex !== undefined) {
    const charOpp = dest.people[fromCharacterIndex]?.earningOnTalk;
    if (charOpp && !safeUsed.includes(charOpp.id)) {
      return charOpp;
    }
  }
  // Pick from destination pool
  const available = dest.earningOpportunities.filter(
    (o) => !safeUsed.includes(o.id),
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
        if (parsed.phase !== "title" && parsed.phase !== "world_map" && parsed.phase !== "lifetime_journal") {
          // Merge with initialState so any new fields always have defaults
          const merged: GameState = { ...initialState, ...parsed };
          if (!Array.isArray(merged.collectedTipActionIds)) {
            merged.collectedTipActionIds = [];
          }
          merged.pendingTipReward = null;
          if (!Array.isArray(merged.shownDialogues)) {
            merged.shownDialogues = {};
          }
          if (!merged.actionCounts) {
            merged.actionCounts = {};
          }
          delete (merged as unknown as Record<string, unknown>).lodgedAtCurrent;
          // Re-attach image refs (can't serialize require())
          if (merged.currentDestination) {
            const live = DESTINATIONS.find(
              (d) => d.id === (merged.currentDestination as any).id,
            );
            if (live) merged.currentDestination = live;
          }
          setState(merged);
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
    const newState: GameState = {
      ...initialState,
      phase: "character_select",
    };
    setState(newState);
    save(newState);
  }, [save]);

  const selectCharacter = useCallback((characterId: string) => {
    const character = PLAYABLE_CHARACTERS.find(c => c.id === characterId);
    if (!character) return;
    const newState: GameState = {
      ...initialState,
      phase: "world_map",
      selectedCharacter: character,
      budget: character.startingBudget,
      energy: character.startingEnergy,
      maxEnergy: character.startingEnergy,
    };
    setState(newState);
    save(newState);
  }, [save]);

  const startFromCity = useCallback((destId: string) => {
    const dest = DESTINATIONS.find((d) => d.id === destId);
    if (!dest || !state.selectedCharacter) return;
    const shuffledPeople = [...dest.people].sort(() => Math.random() - 0.5);
    const availableLocals = shuffledPeople.slice(0, Math.min(2, shuffledPeople.length));
    const newState: GameState = {
      ...initialState,
      phase: "home",
      selectedCharacter: state.selectedCharacter,
      budget: state.selectedCharacter.startingBudget,
      energy: state.selectedCharacter.startingEnergy,
      maxEnergy: state.selectedCharacter.startingEnergy,
      currentDestination: { ...dest, people: availableLocals },
      visitedDestinations: [dest.id],
      destinationVisitCounts: { [dest.id]: 1 },
    };
    setState(newState);
    save(newState);
  }, [state.selectedCharacter, save]);

  const arriveAtDestination = useCallback(
    (dest: Destination) => {
      // Shuffle locals on arrival
      const shuffledDest = {
        ...dest,
        people: [...dest.people].sort(() => Math.random() - 0.5),
      };

      // Roll for an immediate opportunity on arrival (40% chance)
      const roll = Math.random();
      const opportunity =
        roll < 0.4
          ? pickOpportunity(dest, state.usedOpportunityIds)
          : null;

      updateState({
        phase: "exploring",
        currentDestination: shuffledDest,
        activeOpportunity: opportunity,
        lastEarned: null,
        visitedDestinations: state.visitedDestinations.includes(dest.id)
          ? state.visitedDestinations
          : [...state.visitedDestinations, dest.id],
      });
    },
    [state.visitedDestinations, state.usedOpportunityIds, updateState],
  );

  const checkIfOutOfActions = useCallback(() => {
    if (!state.currentDestination) return false;

    const dest = state.currentDestination;
    const visitCount = state.destinationVisitCounts[dest.id] || 1;
    const actionKey = `${dest.id}_${visitCount}`;
    const currentActions = state.actionCounts[actionKey] || 0;

    // Check if player has used all actions for this visit
    if (currentActions >= 5) {
      // Can still fly to other destinations
      const canFlyAnywhere = Object.entries(dest.flightCosts).some(
        ([destId, cost]) => cost <= state.budget && state.energy >= 20
      );
      if (!canFlyAnywhere) {
        return true;
      }
      return false;
    }

    // Check if player can afford lodging
    const canAffordLodging = dest.lodgingCost <= state.budget;

    // Check if player can talk to any character
    const canTalkToAnyone = dest.people.some(
      (person) => (person.energyCost || 10) <= state.energy
    );

    // Check if player can fly anywhere
    const canFlyAnywhere = Object.entries(dest.flightCosts).some(
      ([destId, cost]) => cost <= state.budget && state.energy >= 20
    );

    // Check if player can accept current opportunity
    const canAcceptOpportunity =
      state.activeOpportunity &&
      state.activeOpportunity.earnings > 0 &&
      state.energy >= 1;

    // Check if player can perform tip action
    const canPerformTipAction = dest.people.some(
      (person) =>
        person.tipAction &&
        !state.collectedTipActionIds.includes(person.tipAction.id) &&
        person.tipAction.cost <= state.budget &&
        state.energy >= 10
    );

    // If player cannot do anything, they're out of actions
    const canDoAnything =
      canAffordLodging ||
      canTalkToAnyone ||
      canFlyAnywhere ||
      canAcceptOpportunity ||
      canPerformTipAction;

    return !canDoAnything;
  }, [state]);

  const payLodging = useCallback(() => {
    if (!state.currentDestination) return false;
    const cost = state.currentDestination.lodgingCost;
    if (state.budget < cost) return false;

    const destId = state.currentDestination.id;
    const visitCount = state.destinationVisitCounts[destId] || 1;
    const actionKey = `${destId}_${visitCount}`;
    const currentActions = state.actionCounts[actionKey] || 0;

    // Limit to 5 actions per city visit
    if (currentActions >= 5) {
      updateState({
        lastTipActionResult: {
          title: "No more actions",
          detail: "You've used all your actions for this visit. Fly elsewhere to continue.",
          icon: "🚫",
        },
      });
      return false;
    }

    updateState({
      budget: state.budget - cost,
      energy: Math.min(state.maxEnergy, state.energy + 20),
      dayCount: state.dayCount + 1,
      lodgedAtCurrent: true,
      reputation: state.reputation + 5,
      actionCounts: {
        ...state.actionCounts,
        [actionKey]: currentActions + 1,
      },
      phase: "hotel",
      mealReward: null, // Use mealReward state for hotel screen dismissal
    });

    // Check if out of actions after lodging
    if (checkIfOutOfActions()) {
      setTimeout(() => {
        updateState({
          phase: "game_over",
          outOfActionsMessage: "You're out of actions",
        });
      }, 100);
    }

    return true;
  }, [state.currentDestination, state.budget, state.maxEnergy, state.dayCount, state.reputation, state.actionCounts, state.destinationVisitCounts, updateState, checkIfOutOfActions]);

  const haveMeal = useCallback(() => {
    const mealCost = 15;
    const energyGain = 10;
    const reputationGain = 2;
    
    if (state.budget < mealCost) {
      updateState({
        lastTipActionResult: {
          title: "Not enough budget",
          detail: `You need $${mealCost} for a meal.`,
          icon: "💰",
        },
      });
      return false;
    }

    const dest = state.currentDestination;
    if (!dest) return false;

    const destId = dest.id;
    const visitCount = destId ? state.destinationVisitCounts[destId] || 1 : 1;
    const actionKey = destId ? `${destId}_${visitCount}` : '';
    const currentActions = actionKey ? state.actionCounts[actionKey] || 0 : 0;

    // Limit to 5 actions per city visit
    if (currentActions >= 5) {
      updateState({
        lastTipActionResult: {
          title: "No more actions",
          detail: "You've used all your actions for this visit. Fly elsewhere to continue.",
          icon: "🚫",
        },
      });
      return false;
    }

    // Collect the meal if not already collected
    const newCollectedMeals = state.collectedMeals.includes(dest.localMeal.name)
      ? state.collectedMeals
      : [...state.collectedMeals, dest.localMeal.name];

    updateState({
      budget: state.budget - mealCost,
      energy: Math.min(state.maxEnergy, state.energy + energyGain),
      reputation: state.reputation + reputationGain,
      actionCounts: actionKey ? {
        ...state.actionCounts,
        [actionKey]: currentActions + 1,
      } : state.actionCounts,
      collectedMeals: newCollectedMeals,
      phase: "meal",
      mealReward: {
        dishName: dest.localMeal.name,
        dishImageUri: dest.localMeal.imageUri,
        country: dest.country,
        reputationGain,
      },
    });

    // Check if out of actions after meal
    if (checkIfOutOfActions()) {
      setTimeout(() => {
        updateState({
          phase: "game_over",
          outOfActionsMessage: "You're out of actions",
        });
      }, 100);
    }

    return true;
  }, [state.budget, state.maxEnergy, state.energy, state.reputation, state.actionCounts, state.destinationVisitCounts, state.currentDestination, state.collectedMeals, updateState, checkIfOutOfActions]);

  const flyTo = useCallback(
    (destId: string): boolean => {
      const cost = state.currentDestination?.flightCosts[destId] ?? 999999;
      if (state.budget < cost) return false;

      const dest = DESTINATIONS.find((d) => d.id === destId);
      if (!dest) return false;

      // Energy cost proportional to flight duration (2 energy per hour)
      const duration = state.currentDestination?.flightDurations[destId] ?? 0;
      const energyCost = Math.max(10, duration * 2);
      if (state.energy < energyCost) return false;

      const alreadyVisited = state.visitedDestinations.includes(destId);
      const newVisitCount = (state.destinationVisitCounts[destId] || 0) + 1;

      // Rotate locals after flight
      const shuffledPeople = [...dest.people].sort(() => Math.random() - 0.5);
      const availableLocals = shuffledPeople.slice(0, Math.min(2, shuffledPeople.length));

      const newState: GameState = {
        ...state,
        phase: "arriving",
        budget: state.budget - cost,
        energy: state.energy - energyCost,
        currentDestination: { ...dest, people: availableLocals },
        activeOpportunity: null,
        lastEarned: null,
        visitedDestinations: alreadyVisited
          ? state.visitedDestinations
          : [...state.visitedDestinations, destId],
        destinationVisitCounts: {
          ...state.destinationVisitCounts,
          [destId]: newVisitCount,
        },
      };
      setState(newState);
      save(newState);

      // Check game over after flight
      if (state.budget - cost <= 0 || state.energy - energyCost <= 0) {
        setTimeout(() => {
          setState((prev) => ({ ...prev, phase: "game_over" }));
          save({ ...newState, phase: "game_over" });
        }, 100);
      }

      // Check if out of actions after flight
      setTimeout(() => {
        if (checkIfOutOfActions()) {
          setState((prev) => ({
            ...prev,
            phase: "game_over",
            outOfActionsMessage: "You're out of actions",
          }));
          save({ ...newState, phase: "game_over", outOfActionsMessage: "You're out of actions" });
        }
      }, 150);

      return true;
    },
    [state, save, checkIfOutOfActions],
  );

  const talkToCharacter = useCallback(
    (npcIndex: number) => {
      const character = state.currentDestination?.people[npcIndex];
      if (!character || !state.currentDestination) return;

      const destId = state.currentDestination.id;
      const charId = character.id;
      const visitCount = state.destinationVisitCounts[destId] || 1;
      const actionKey = `${destId}_${visitCount}`;
      const currentActions = state.actionCounts[actionKey] || 0;

      // Limit actions per city per visit (max 5 actions per city per visit)
      if (currentActions >= 5) {
        updateState({
          lastTipActionResult: {
            title: "No more actions",
            detail: "You've used all your actions for this visit. Fly elsewhere to continue.",
            icon: "�",
          },
        });
        return;
      }

      // Consume energy when talking (character-specific, default 10)
      const energyCost = character.energyCost || 10;
      if (state.energy < energyCost) {
        updateState({
          lastTipActionResult: {
            title: "Too tired",
            detail: `You need at least ${energyCost} energy to talk to ${character.name}. Rest at a lodging to recover.`,
            icon: "⚡",
          },
        });
        return;
      }

      // Get dialogues not yet shown for this character this visit
      const characterDialogueKey = `${destId}_${charId}_${visitCount}`;
      const shownForThisVisit = state.shownDialogues[characterDialogueKey] || [];
      const allDialogues = character.dialogues;
      const availableIndices = allDialogues.map((_, idx) => idx).filter(idx => !shownForThisVisit.includes(idx));
      
      // If all dialogues have been shown, reset and allow repetition
      let dialogueIndex: number;
      if (availableIndices.length === 0) {
        dialogueIndex = Math.floor(Math.random() * allDialogues.length);
        updateState({
          shownDialogues: {
            ...state.shownDialogues,
            [characterDialogueKey]: [],
          },
        });
      } else {
        dialogueIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const newShown = [...shownForThisVisit, dialogueIndex];
        updateState({
          shownDialogues: {
            ...state.shownDialogues,
            [characterDialogueKey]: newShown,
          },
        });
      }

      updateState({
        phase: "npc_dialogue",
        currentNpcIndex: npcIndex,
        currentDialogueIndex: 0,
        currentDialogueOffset: dialogueIndex,
        lastTipActionResult: null,
        pendingTipReward: null,
        energy: state.energy - energyCost,
        reputation: state.reputation + 2,
        actionCounts: {
          ...state.actionCounts,
          [actionKey]: currentActions + 1,
        },
        lastTalkedNpcIndex: npcIndex,
      });

      // Check if out of actions after talking
      if (checkIfOutOfActions()) {
        setTimeout(() => {
          updateState({
            phase: "game_over",
            outOfActionsMessage: "You're out of actions",
          });
        }, 100);
      }
    },
    [state.currentDestination, state.destinationVisitCounts, state.actionCounts, state.energy, state.reputation, updateState, state.shownDialogues, checkIfOutOfActions],
  );

  const advanceDialogue = useCallback(() => {
    const character =
      state.currentDestination?.people[state.currentNpcIndex];
    if (!character || !state.currentDestination) {
      updateState({ phase: "exploring" });
      return;
    }

    // Handle NPC thank you dialogue (after work opportunity)
    if (state.pendingThankYouDialogue) {
      // Show simple thank you message and return to exploring
      const character = state.currentDestination?.people[state.currentNpcIndex];
      updateState({
        pendingThankYouDialogue: false,
        lastEarned: null, // Clear any earned display
        phase: "exploring",
      });
      return;
    }

    const destId = state.currentDestination.id;
    const charId = character.id;
    const familiarityKey = `${destId}_${charId}`;
    const currentFamiliarity = state.familiarity[familiarityKey] || 0;

    const nextIndex = state.currentDialogueIndex + 1;
    if (nextIndex >= character.dialogues.length) {
      // End of dialogue — increase familiarity
      const newFamiliarity = Math.min(currentFamiliarity + 1, 10);
      const familiarityIncrease = newFamiliarity - currentFamiliarity;

      // 50% chance to trigger either work or scenic opportunity (not both)
      const roll = Math.random();
      let opportunity = null;
      if (roll < 0.5 && state.currentDestination) {
        const allOpportunities = pickOpportunity(
          state.currentDestination,
          state.usedOpportunityIds,
          state.currentNpcIndex,
        );
        // Filter to only work or scenic types
        if (allOpportunities && (allOpportunities.type === "work" || allOpportunities.type === "scenic")) {
          opportunity = allOpportunities;
        }
      }

      updateState({
        activeOpportunity: opportunity ?? state.activeOpportunity,
        lastTipActionResult: null,
        pendingTipReward: null,
        familiarity: {
          ...state.familiarity,
          [familiarityKey]: newFamiliarity,
        },
        familiarityAnimation: {
          npcName: character.name,
          familiarityIncrease,
        },
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
    if (!state.activeOpportunity || !state.currentDestination) return;
    const earnings = state.activeOpportunity.earnings;

    const destId = state.currentDestination.id;
    const visitCount = state.destinationVisitCounts[destId] || 1;
    const actionKey = `${destId}_${visitCount}`;
    const currentActions = state.actionCounts[actionKey] || 0;

    // Limit to 5 actions per city visit
    if (currentActions >= 5) {
      updateState({
        lastTipActionResult: {
          title: "No more actions",
          detail: "You've used all your actions for this visit. Fly elsewhere to continue.",
          icon: "🚫",
        },
      });
      return;
    }

    // Consume energy for work actions (1 energy)
    const energyCost = 1;
    if (state.energy < energyCost) {
      updateState({
        lastTipActionResult: {
          title: "Too tired",
          detail: "You need at least 1 energy for this action. Rest at a lodging to recover.",
          icon: "⚡",
          },
        });
      return;
    }

    // Increase familiarity with last talked NPC
    let familiarityUpdate = state.familiarity;
    if (state.lastTalkedNpcIndex !== null) {
      const character = state.currentDestination.people[state.lastTalkedNpcIndex];
      if (character) {
        const charId = character.id;
        const familiarityKey = `${destId}_${charId}`;
        const currentFamiliarity = state.familiarity[familiarityKey] || 0;
        familiarityUpdate = {
          ...state.familiarity,
          [familiarityKey]: Math.min(currentFamiliarity + 1, 10),
        };
      }
    }

    updateState({
      budget: state.budget + earnings,
      lastEarned: earnings,
      activeOpportunity: null,
      usedOpportunityIds: [
        ...(state.usedOpportunityIds || []),
        state.activeOpportunity.id,
      ],
      energy: state.energy - energyCost,
      reputation: state.reputation + 3,
      actionCounts: {
        ...state.actionCounts,
        [actionKey]: currentActions + 1,
      },
      familiarity: familiarityUpdate,
      actionReward: {
        earnings,
        description: state.activeOpportunity.description,
      },
      // For work opportunities, set flag to show NPC thank you dialogue after reward screen
      ...(state.activeOpportunity.type === "work" && state.lastTalkedNpcIndex !== null
        ? {
            pendingThankYouDialogue: true,
            lastTalkedNpcIndex: state.lastTalkedNpcIndex,
          }
        : {}),
      // For scenic opportunities, trigger travel memory after reward screen
      ...(state.activeOpportunity.type === "scenic"
        ? {
            pendingTravelMemory: true,
            travelMemoryTitle: state.activeOpportunity.title,
            travelMemoryDescription: state.activeOpportunity.description,
            travelMemoryImageUri: state.currentDestination?.image as string || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            memories: [
              ...state.memories,
              {
                title: state.activeOpportunity.title,
                description: state.activeOpportunity.description,
                destName: state.currentDestination?.name ?? "",
                imageUri: state.currentDestination?.image as string || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              },
            ],
          }
        : {}),
    });

    // Check if out of actions after accepting opportunity
    if (checkIfOutOfActions()) {
      setTimeout(() => {
        updateState({
          phase: "game_over",
          outOfActionsMessage: "You're out of actions",
        });
      }, 100);
    }
  }, [state.activeOpportunity, state.budget, state.usedOpportunityIds, state.energy, state.reputation, state.actionCounts, state.destinationVisitCounts, state.currentDestination, state.familiarity, state.lastTalkedNpcIndex, updateState, checkIfOutOfActions]);

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

  const performTipAction = useCallback((): boolean => {
    const character = state.currentDestination?.people[state.currentNpcIndex];
    const action: TravelerTipAction | undefined = character?.tipAction;
    const dest = state.currentDestination;
    if (!action || !dest) return false;

    const energyCost = 10;
    if (state.energy < energyCost) {
      updateState({
        lastTipActionResult: {
          title: "Not enough energy",
          detail: `You need ${energyCost} energy for ${action.title}. Rest at a lodging to recover.`,
          icon: "⚡",
        },
      });
      return false;
    }

    if (state.collectedTipActionIds.includes(action.id)) {
      updateState({
        lastTipActionResult: {
          title: "Already in your journal",
          detail: `You already collected "${action.collectibleName}".`,
          icon: "📓",
        },
      });
      return false;
    }

    if (state.budget < action.cost) {
      updateState({
        lastTipActionResult: {
          title: "Not enough budget",
          detail: `You need $${action.cost} for ${action.title}.`,
          icon: "⚠️",
        },
      });
      return false;
    }

    updateState({
      budget: state.budget - action.cost,
      energy: state.energy - energyCost,
      lastTipActionResult: null,
      pendingTipReward: {
        tipId: action.id,
        imageUri: action.rewardImageUri,
        title: action.title,
        outcome: action.outcome,
        collectibleName: action.collectibleName,
        destinationId: dest.id,
      },
    });

    // Check game over after tip action
    if (state.budget - action.cost <= 0 || state.energy - energyCost <= 0) {
      setTimeout(() => {
        updateState({ phase: "game_over" });
      }, 100);
    }

    // Check if out of actions after tip action
    if (checkIfOutOfActions()) {
      setTimeout(() => {
        updateState({
          phase: "game_over",
          outOfActionsMessage: "You're out of actions",
        });
      }, 150);
    }

    return true;
  }, [state, updateState, checkIfOutOfActions]);

  const clearTipActionResult = useCallback(() => {
    updateState({ lastTipActionResult: null });
  }, [updateState]);

  const dismissTipReward = useCallback(() => {
    const pending = state.pendingTipReward;
    if (!pending) return;
    const already = state.collectedTipActionIds.includes(pending.tipId);
    updateState({
      phase: "exploring",
      pendingTipReward: null,
      lastTipActionResult: null,
      collectedTipActionIds: already
        ? state.collectedTipActionIds
        : [...state.collectedTipActionIds, pending.tipId],
    });
  }, [state, updateState]);

  const calculateReputation = useCallback(() => {
    let reputation = 0;

    // Reputation for collected items (50 reputation each)
    reputation += state.collectedItems.length * 50;

    // Reputation for visited destinations (100 reputation each)
    reputation += state.visitedDestinations.length * 100;

    // Reputation for tip memories (75 reputation each)
    reputation += state.collectedTipActionIds.length * 75;

    // Reputation for familiarity with locals (5 reputation per familiarity level)
    const totalFamiliarity = Object.values(state.familiarity).reduce((sum, val) => sum + val, 0);
    reputation += totalFamiliarity * 5;

    // Additional bonus for friends with high familiarity (familiarity >= 5)
    const highFamiliarityFriends = Object.values(state.familiarity).filter((val) => val >= 5).length;
    reputation += highFamiliarityFriends * 50;

    // Bonus for completing collectable themes (200 reputation per completed theme)
    const themes: Record<string, { total: number; collected: number }> = {};
    DESTINATIONS.forEach((dest) => {
      // Main collectible
      if (!themes[dest.collectibleTheme]) {
        themes[dest.collectibleTheme] = { total: 0, collected: 0 };
      }
      themes[dest.collectibleTheme].total++;
      if (state.collectedItems.includes(dest.collectibleName)) {
        themes[dest.collectibleTheme].collected++;
      }

      // Additional collectibles
      if (dest.additionalCollectibles) {
        dest.additionalCollectibles.forEach((additional) => {
          if (!themes[additional.theme]) {
            themes[additional.theme] = { total: 0, collected: 0 };
          }
          themes[additional.theme].total++;
          if (state.collectedItems.includes(additional.name)) {
            themes[additional.theme].collected++;
          }
        });
      }
    });

    const completedThemes = Object.values(themes).filter((t) => t.collected === t.total).length;
    reputation += completedThemes * 200;

    // Bonus for risk taker character
    if (state.selectedCharacter?.id === "risk_taker") {
      reputation = Math.floor(reputation * 1.2);
    }

    return reputation;
  }, [state]);

  const checkGameOver = useCallback(() => {
    if (state.budget <= 0 || state.energy <= 0) {
      const finalReputation = calculateReputation();
      if (finalReputation > state.highScore) {
        saveHighScore(finalReputation);
      }
      return true;
    }
    return false;
  }, [state.budget, state.energy, state.highScore, calculateReputation]);

  const viewImage = useCallback((uri: string, title: string) => {
    updateState({
      phase: "image_viewer",
      viewingImage: { uri, title },
    });
  }, [updateState]);

  const closeImageView = useCallback(() => {
    updateState({
      phase: "exploring",
      viewingImage: null,
    });
  }, [updateState]);

  const HIGH_SCORE_KEY = "@pixel_wanderer_high_score";

  const loadHighScore = useCallback(async (): Promise<number> => {
    try {
      const saved = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }, []);

  const saveHighScore = useCallback(async (score: number) => {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch {}
  }, []);

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
    if (state.pendingTipReward) {
      dismissTipReward();
      return;
    }
    updateState({ phase: "exploring" });
  }, [state.pendingTipReward, dismissTipReward, updateState]);

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

  const endGame = useCallback(() => {
    updateState({ phase: "game_over" });
  }, [updateState]);

  const dismissFamiliarityAnimation = useCallback(() => {
    updateState({
      familiarityAnimation: null,
      currentNpcIndex: 0,
      currentDialogueIndex: 0,
      currentDialogueOffset: 0,
      phase: "exploring",
    });
  }, [updateState]);

  const dismissActionReward = useCallback(() => {
    if (state.pendingThankYouDialogue && state.lastTalkedNpcIndex !== null) {
      const character = state.currentDestination?.people[state.lastTalkedNpcIndex];
      updateState({
        actionReward: null,
        phase: "thank_you",
        pendingThankYouDialogue: false,
      });
    } else if (state.pendingTravelMemory) {
      updateState({
        actionReward: null,
        phase: "travel_memory",
        travelMemory: {
          title: state.travelMemoryTitle,
          description: state.travelMemoryDescription,
          imageUri: state.travelMemoryImageUri,
          reputationGain: 3,
        },
        reputation: state.reputation + 3,
        pendingTravelMemory: false,
      });
    } else {
      updateState({ actionReward: null });
    }
  }, [state.pendingThankYouDialogue, state.lastTalkedNpcIndex, state.pendingTravelMemory, state.travelMemoryTitle, state.travelMemoryDescription, state.travelMemoryImageUri, state.reputation, updateState]);

  const triggerActionBarAnimation = useCallback(() => {
    updateState({ actionBarAnimation: true });
    setTimeout(() => {
      updateState({ actionBarAnimation: false });
    }, 200);
  }, [updateState]);

  const dismissMealReward = useCallback(() => {
    updateState({ mealReward: null, phase: "exploring" });
  }, [updateState]);

  const dismissTravelMemory = useCallback(() => {
    updateState({ travelMemory: null, phase: "exploring" });
  }, [updateState]);

  const LIFETIME_KEY = "@pixel_wanderer_lifetime";

  const saveLifetimeData = useCallback(async () => {
    try {
      const existingRaw = await AsyncStorage.getItem(LIFETIME_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : { memories: [], friends: [], gamesPlayed: 0, bestScore: 0 };
      // Merge memories (deduplicate by title)
      const existingTitles = new Set(existing.memories.map((m: any) => m.title));
      const newMemories = state.memories.filter((m) => !existingTitles.has(m.title));
      // Collect familiar friends (familiarity >= 1)
      const newFriends: any[] = [];
      DESTINATIONS.forEach((dest) => {
        dest.people.forEach((person) => {
          const key = `${dest.id}_${person.id}`;
          const fam = state.familiarity[key] || 0;
          if (fam >= 1) {
            const alreadyIn = existing.friends.some((f: any) => f.name === person.name && f.destName === dest.name);
            if (!alreadyIn) {
              newFriends.push({ name: person.name, sprite: person.sprite, destName: dest.name, familiarity: fam });
            } else {
              // Update familiarity if higher
              existing.friends = existing.friends.map((f: any) =>
                f.name === person.name && f.destName === dest.name ? { ...f, familiarity: Math.max(f.familiarity, fam) } : f
              );
            }
          }
        });
      });
      const finalReputation = calculateReputation();
      const merged = {
        memories: [...existing.memories, ...newMemories].slice(-50),
        friends: [...existing.friends, ...newFriends],
        gamesPlayed: existing.gamesPlayed + 1,
        bestScore: Math.max(existing.bestScore, finalReputation),
      };
      await AsyncStorage.setItem(LIFETIME_KEY, JSON.stringify(merged));
    } catch {}
  }, [state.memories, state.familiarity, calculateReputation]);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        selectCharacter,
        startFromCity,
        arriveAtDestination,
        payLodging,
        haveMeal,
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
        performTipAction,
        clearTipActionResult,
        dismissTipReward,
        calculateReputation,
        checkGameOver,
        endGame,
        viewImage,
        closeImageView,
        loadHighScore,
        saveHighScore,
        dismissFamiliarityAnimation,
        dismissActionReward,
        triggerActionBarAnimation,
        dismissMealReward,
        dismissTravelMemory,
        saveLifetimeData,
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
