# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Pixel Wanderer (iOS Game)

- **Directory**: `artifacts/pixel-wanderer/`
- **Type**: Expo (React Native)
- **Preview**: `/` (root)
- **Description**: Immersive pixelated travel simulation game with Octopath Traveler aesthetic.

#### Game Features

- 8 real-world destinations (Paris, Tokyo, Machu Picchu, Cairo, Kyoto, Santorini, Marrakech, Reykjavik)
- Each destination has pixel art scene, 1-2 NPCs with multi-line dialogue, collectible items
- $2,000 starting budget with realistic flight and lodging costs
- Animated arrival curtain reveal, typewriter dialogue, travel journal/collection screen
- All state persisted via AsyncStorage

#### Key Files

- `context/GameContext.tsx` — all game state, actions, AsyncStorage persistence
- `constants/gameData.ts` — all destinations, NPCs, dialogues, costs
- `constants/colors.ts` — pixel game dark palette (navy, gold, teal, parchment)
- `screens/TitleScreen.tsx` — animated title with starfield
- `screens/ArrivingScreen.tsx` — curtain reveal arrival animation
- `screens/ExploreScreen.tsx` — main exploration with NPCs and actions
- `screens/NpcScreen.tsx` — typewriter dialogue with NPC
- `screens/FlyScreen.tsx` — flight booking with budget constraints
- `screens/CollectionScreen.tsx` — travel journal / stamps
- `screens/GameOverScreen.tsx` — final stats and ranking
- `components/DestinationScene.tsx` — pixel art scene renderer with scanlines
- `components/DialogueBox.tsx` — RPG dialogue box with typewriter effect
- `components/PixelButton.tsx` — retro bordered button
- `components/PixelText.tsx` — pixel-style text component
- `components/BudgetBar.tsx` — live budget HUD
