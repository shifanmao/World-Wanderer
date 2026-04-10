export interface NPC {
  id: string;
  name: string;
  sprite: string;
  dialogues: string[];
  tip?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: any;
  description: string;
  lodgingCost: number;
  flightCosts: Record<string, number>;
  npcs: NPC[];
  collectibleName: string;
  atmosphere: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    continent: "Europe",
    image: require("../assets/images/paris.png"),
    description:
      "The city of lights. Cobblestone streets wind between grand Haussmann buildings and hidden boulangeries.",
    lodgingCost: 120,
    flightCosts: {
      tokyo: 850,
      macchu_picchu: 720,
      cairo: 280,
      kyoto: 860,
      santorini: 180,
      marrakech: 200,
      reykjavik: 220,
    },
    atmosphere: "Romantic & Grand",
    collectibleName: "Eiffel Miniature",
    npcs: [
      {
        id: "pierre",
        name: "Pierre",
        sprite: "🧑‍🍳",
        dialogues: [
          "Ah, bienvenue! You have arrived at the most beautiful city in the world.",
          "The croissants at the corner bakery are worth every centime. Try one before you leave!",
          "Many travelers pass through Paris... but few truly see it. Walk slowly, mon ami.",
        ],
        tip: "Stay an extra night — the Louvre alone takes two days.",
      },
      {
        id: "amelie",
        name: "Amélie",
        sprite: "👩‍🎨",
        dialogues: [
          "I paint the Seine every morning. Each day it looks different.",
          "Tourists rush to the Eiffel Tower, but the real Paris is in Montmartre.",
          "If you speak even a little French, the city opens up like a flower.",
        ],
      },
    ],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    image: require("../assets/images/tokyo.png"),
    description:
      "Neon lights meet ancient temples. A metropolis that never sleeps, yet breathes with quiet ceremony.",
    lodgingCost: 95,
    flightCosts: {
      paris: 850,
      macchu_picchu: 1200,
      cairo: 900,
      kyoto: 60,
      santorini: 980,
      marrakech: 1000,
      reykjavik: 1050,
    },
    atmosphere: "Electric & Ancient",
    collectibleName: "Torii Gate Charm",
    npcs: [
      {
        id: "kenji",
        name: "Kenji",
        sprite: "👨‍💼",
        dialogues: [
          "Welcome to Tokyo. Please enjoy our city.",
          "The ramen in Shibuya — go after midnight when the salarymen arrive.",
          "Quiet hours are between 10pm and 6am. We appreciate consideration.",
        ],
        tip: "Get a Suica card on day one. The trains go everywhere.",
      },
      {
        id: "yuki",
        name: "Yuki",
        sprite: "👩‍🔬",
        dialogues: [
          "I study bioluminescence. Tokyo glows differently than other cities.",
          "Akihabara is overwhelming on purpose. Take breaks.",
          "Kyoto is only two hours by shinkansen. Many travelers miss it.",
        ],
      },
    ],
  },
  {
    id: "macchu_picchu",
    name: "Machu Picchu",
    country: "Peru",
    continent: "South America",
    image: require("../assets/images/macchu_picchu.png"),
    description:
      "The lost city in the clouds. Incan stonework clings to mountain ridges above the sacred valley.",
    lodgingCost: 65,
    flightCosts: {
      paris: 720,
      tokyo: 1200,
      cairo: 980,
      kyoto: 1250,
      santorini: 800,
      marrakech: 850,
      reykjavik: 750,
    },
    atmosphere: "Mystical & Ancient",
    collectibleName: "Inca Sun Stone",
    npcs: [
      {
        id: "inti",
        name: "Inti",
        sprite: "🧑‍🌾",
        dialogues: [
          "The sun rises differently here. It is why the Inca chose this place.",
          "Coca tea for altitude sickness. Drink it slowly. Rest the first day.",
          "The mountain behind you — Huayna Picchu — very few climb it. If you are able, do it.",
        ],
        tip: "Buy the Huayna Picchu permit in advance. They sell out months ahead.",
      },
      {
        id: "rosa",
        name: "Rosa",
        sprite: "👩‍🦱",
        dialogues: [
          "I carry goods up this path every week. The travelers complain about the altitude.",
          "There is a town at the base — Aguas Calientes. The hot springs help tired legs.",
          "Take nothing from the ruins. The spirits here remember everything.",
        ],
      },
    ],
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    continent: "Africa",
    image: null,
    description:
      "Pyramids rise from the desert edge. A city ancient beyond measure where old meets chaotic new.",
    lodgingCost: 45,
    flightCosts: {
      paris: 280,
      tokyo: 900,
      macchu_picchu: 980,
      kyoto: 950,
      santorini: 250,
      marrakech: 350,
      reykjavik: 400,
    },
    atmosphere: "Ancient & Bustling",
    collectibleName: "Scarab Amulet",
    npcs: [
      {
        id: "omar",
        name: "Omar",
        sprite: "👨‍🏫",
        dialogues: [
          "The pyramids are 4,500 years old. Let that number sit in your chest for a moment.",
          "Negotiate. Always negotiate. It is part of the conversation here.",
          "Khan el-Khalili bazaar at dawn — no tourists, only merchants setting up.",
        ],
        tip: "Early morning is the only time to see the Sphinx without crowds.",
      },
      {
        id: "fatima",
        name: "Fatima",
        sprite: "👩‍🦳",
        dialogues: [
          "I sell spices my grandmother blended. Thirty years at this stall.",
          "The Nile at dusk. Sit and watch the feluccas. You will feel something.",
          "Be careful with the sun. It is not forgiving to travelers who underestimate it.",
        ],
      },
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    image: null,
    description:
      "Temples, geisha districts, bamboo forests. Japan's ancient capital moves in whispers and ceremony.",
    lodgingCost: 85,
    flightCosts: {
      paris: 860,
      tokyo: 60,
      macchu_picchu: 1250,
      cairo: 950,
      santorini: 990,
      marrakech: 1010,
      reykjavik: 1060,
    },
    atmosphere: "Serene & Sacred",
    collectibleName: "Bamboo Flute",
    npcs: [
      {
        id: "hiroshi",
        name: "Hiroshi",
        sprite: "🧓",
        dialogues: [
          "I tend the moss garden here. It takes twenty years to look like nothing.",
          "The tea ceremony is not about tea. It is about presence.",
          "Arashiyama bamboo grove — go before seven in the morning. Go alone.",
        ],
        tip: "Gion district after dark — geiko lanterns light the alleys.",
      },
    ],
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    image: null,
    description:
      "White-washed villages cling to a volcanic caldera rim. The Aegean shimmers endlessly below.",
    lodgingCost: 150,
    flightCosts: {
      paris: 180,
      tokyo: 980,
      macchu_picchu: 800,
      cairo: 250,
      kyoto: 990,
      marrakech: 230,
      reykjavik: 300,
    },
    atmosphere: "Dreamlike & Volcanic",
    collectibleName: "Aegean Blue Tile",
    npcs: [
      {
        id: "stavros",
        name: "Stavros",
        sprite: "🧑‍🍳",
        dialogues: [
          "My grandfather fished these waters. I run the taverna now.",
          "The sunset from Oia — people weep. I have seen it a thousand times and still I watch.",
          "Swim in the hot springs near the volcano. Strange feeling, like the earth is alive.",
        ],
        tip: "Book a boat tour to the volcanic hot springs — only around $25.",
      },
    ],
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    image: null,
    description:
      "A sensory labyrinth of souks, palaces, and riads. The medina has been alive for a thousand years.",
    lodgingCost: 55,
    flightCosts: {
      paris: 200,
      tokyo: 1000,
      macchu_picchu: 850,
      cairo: 350,
      kyoto: 1010,
      santorini: 230,
      reykjavik: 280,
    },
    atmosphere: "Vivid & Labyrinthine",
    collectibleName: "Berber Lantern",
    npcs: [
      {
        id: "hassan",
        name: "Hassan",
        sprite: "👨‍🎨",
        dialogues: [
          "The medina is a maze on purpose. It was built to confuse invaders.",
          "My family has made leather here for four generations. The smell never leaves.",
          "Djemaa el-Fna at night — snake charmers, storytellers, the smoke of a hundred fires.",
        ],
        tip: "Stay in a riad. Hotels here miss the whole point of the city.",
      },
    ],
  },
  {
    id: "reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    image: null,
    description:
      "The world's northernmost capital. Geysers, aurora borealis, and a city that never quite gets dark in summer.",
    lodgingCost: 180,
    flightCosts: {
      paris: 220,
      tokyo: 1050,
      macchu_picchu: 750,
      cairo: 400,
      kyoto: 1060,
      santorini: 300,
      marrakech: 280,
    },
    atmosphere: "Wild & Ethereal",
    collectibleName: "Volcanic Obsidian",
    npcs: [
      {
        id: "sigrid",
        name: "Sigrid",
        sprite: "👩‍🦲",
        dialogues: [
          "Icelanders do not believe in elves officially. We also do not build roads through their hills.",
          "The Blue Lagoon is for tourists. Go to the Secret Lagoon in Flúðir instead.",
          "Northern lights forecast apps lie. Go out at midnight and look anyway.",
        ],
        tip: "Rent a car. The Ring Road connects everything that matters.",
      },
    ],
  },
];

export const getDestinationById = (id: string): Destination | undefined => {
  return DESTINATIONS.find((d) => d.id === id);
};

export const getRandomDestination = (): Destination => {
  return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
};

export const STARTING_BUDGET = 2000;
export const LODGING_DAYS = 1;
