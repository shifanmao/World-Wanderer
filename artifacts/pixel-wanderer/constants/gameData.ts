export interface Character {
  id: string;
  name: string;
  sprite: string;
  dialogues: string[];
  tip?: string;
  tipAction?: TravelerTipAction;
  earningOnTalk?: EarningOpportunity;
  energyCost?: number; // Energy cost to talk to this character
}

export interface PlayableCharacter {
  id: string;
  name: string;
  sprite: string;
  description: string;
  startingBudget: number;
  startingEnergy: number;
}

export const PLAYABLE_CHARACTERS: PlayableCharacter[] = [
  {
    id: "budget_traveler",
    name: "Budget Backpacker",
    sprite: "🎒",
    description: "Starts with more budget but less energy. Perfect for players who love planning ahead.",
    startingBudget: 600,
    startingEnergy: 40,
  },
  {
    id: "energetic_explorer",
    name: "Energetic Explorer",
    sprite: "🏃",
    description: "High energy but modest budget. Great for players who want to see and do everything.",
    startingBudget: 450,
    startingEnergy: 60,
  },
  {
    id: "balanced_wanderer",
    name: "Balanced Wanderer",
    sprite: "🌍",
    description: "A perfect balance of budget and energy. Ideal for first-time players.",
    startingBudget: 500,
    startingEnergy: 50,
  },
  {
    id: "risk_taker",
    name: "Risk Taker",
    sprite: "🎲",
    description: "Low budget and energy, but you'll earn bonus points for every achievement.",
    startingBudget: 400,
    startingEnergy: 45,
  },
];

export interface TravelerTipAction {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  outcome: string;
  /** Shown in journal / home as the collectible label */
  collectibleName: string;
  /** Memory snapshot after completing the tip (remote URL) */
  rewardImageUri: string;
}

export interface EarningOpportunity {
  id: string;
  type: "scenic" | "work" | "encounter";
  title: string;
  description: string;
  earnings: number;
  actionLabel: string;
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
  flightDurations: Record<string, number>; // in hours
  atmosphere: string;
  collectibleName: string;
  collectibleTheme: string;
  additionalCollectibles?: { name: string; theme: string }[];
  earningOpportunities: EarningOpportunity[];
  people: Character[];
  localMeal: {
    name: string;
    imageUri: string;
  };
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
    flightDurations: {
      tokyo: 12,
      macchu_picchu: 13,
      cairo: 3,
      kyoto: 12,
      santorini: 3,
      marrakech: 3,
      reykjavik: 4,
    },
    atmosphere: "Romantic & Grand",
    collectibleName: "Eiffel Miniature",
    collectibleTheme: "Landmarks",
    additionalCollectibles: [
      { name: "Louvre Sketchbook", theme: "Art" },
      { name: "Montmartre Painting", theme: "Art" },
    ],
    localMeal: {
      name: "Croissant & Café",
      imageUri: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    },
    earningOpportunities: [
      {
        id: "paris_seine_sketch",
        type: "scenic",
        title: "Scenic Spot: The Seine at Dawn",
        description:
          "You stumble upon the perfect golden-hour view along the Seine. A tourist couple asks if you'll take their photo — and insist on paying.",
        earnings: 35,
        actionLabel: "Take the Photo",
      },
      {
        id: "paris_bakery",
        type: "work",
        title: "Work: Morning Shift at a Boulangerie",
        description:
          "The bakery owner is short-handed this morning. He offers you cash to help load bread trays and serve the queue.",
        earnings: 80,
        actionLabel: "Work the Counter",
      },
      {
        id: "paris_busker",
        type: "encounter",
        title: "Encounter: Street Art Contest",
        description:
          "A chalk artist near Montmartre invites you to join a small tourist contest. You draw something passable — the crowd cheers.",
        earnings: 50,
        actionLabel: "Draw Something",
      },
      {
        id: "paris_guide",
        type: "work",
        title: "Work: Unofficial Tour Guide",
        description:
          "A confused group of tourists mistakes you for a local guide. You improvise a walking tour of the Latin Quarter.",
        earnings: 95,
        actionLabel: "Lead the Tour",
      },
    ],
    people: [
      {
        id: "pierre",
        name: "Pierre",
        sprite: "🧑‍🍳",
        energyCost: 10,
        dialogues: [
          "Ah, bienvenue! You have arrived at the most beautiful city in the world.",
          "The croissants at the corner bakery are worth every centime. Try one before you leave!",
          "Many travelers pass through Paris... but few truly see it. Walk slowly, mon ami.",
          "If rain starts, don't hide from it. Paris in the rain is its own postcard.",
          "When the city feels loud, cross a bridge and watch the river for five minutes.",
        ],
        tip: "Stay an extra night — the Louvre alone takes two days.",
        tipAction: {
          id: "paris_louvre_pass",
          title: "Buy a Louvre Night Pass",
          description: "Skip the daytime crowds and explore after-hours galleries.",
          cost: 40,
          icon: "🖼️",
          outcome: "You wander quiet halls and leave with a sketchbook full of ideas.",
          collectibleName: "Louvre Night Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "pierre_work",
          type: "work",
          title: "Pierre's Kitchen Needs Help",
          description:
            "Pierre eyes your capable hands. 'You look like someone who knows hard work. Help me prep tonight's service — I'll pay fairly.'",
          earnings: 70,
          actionLabel: "Help in the Kitchen",
        },
      },
      {
        id: "amelie",
        name: "Amélie",
        sprite: "👩‍🎨",
        energyCost: 12,
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
    flightDurations: {
      paris: 12,
      macchu_picchu: 18,
      cairo: 11,
      kyoto: 2,
      santorini: 12,
      marrakech: 13,
      reykjavik: 14,
    },
    atmosphere: "Electric & Ancient",
    collectibleName: "Torii Gate Charm",
    collectibleTheme: "Landmarks",
    additionalCollectibles: [
      { name: "Suica Card", theme: "Transport" },
      { name: "Maneki Neko", theme: "Cultural" },
    ],
    localMeal: {
      name: "Ramen Bowl",
      imageUri: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
    earningOpportunities: [
      {
        id: "tokyo_ramen",
        type: "work",
        title: "Work: Ramen Shop Extra Hands",
        description:
          "The ramen shop near Shinjuku station is overwhelmed at lunch. The owner motions you behind the counter.",
        earnings: 75,
        actionLabel: "Work the Lunch Rush",
      },
      {
        id: "tokyo_shibuya_photo",
        type: "scenic",
        title: "Scenic Spot: Shibuya Crossing",
        description:
          "You time your photo of the famous crossing perfectly. A magazine scout spots it and wants to license it.",
        earnings: 120,
        actionLabel: "License the Shot",
      },
      {
        id: "tokyo_karaoke",
        type: "encounter",
        title: "Encounter: Karaoke Tournament",
        description:
          "A group of salarymen drag you into a karaoke bar. You somehow win the amateur bracket. Cash prize.",
        earnings: 60,
        actionLabel: "Sing for the Prize",
      },
      {
        id: "tokyo_vending",
        type: "work",
        title: "Work: Vending Machine Restocking",
        description:
          "A logistics worker needs help restocking a vending route across three subway stations.",
        earnings: 55,
        actionLabel: "Help Restock",
      },
    ],
    people: [
      {
        id: "kenji",
        name: "Kenji",
        sprite: "👨‍💼",
        energyCost: 10,
        dialogues: [
          "Welcome to Tokyo. Please enjoy our city.",
          "The ramen in Shibuya — go after midnight when the salarymen arrive.",
          "Quiet hours are between 10pm and 6am. We appreciate consideration.",
          "If the city overwhelms you, find a tiny shrine tucked between buildings.",
          "Always stand on one side of the escalator unless locals tell you otherwise.",
        ],
        tip: "Get a Suica card on day one. The trains go everywhere.",
        tipAction: {
          id: "tokyo_suica_card",
          title: "Purchase a Suica Card",
          description: "Preload transit fare and move through the city like a local.",
          cost: 20,
          icon: "🚉",
          outcome: "Station gates open instantly, and your travel day becomes effortless.",
          collectibleName: "Suica Card Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "kenji_translation",
          type: "encounter",
          title: "Kenji Needs a Translator",
          description:
            "Kenji is meeting a foreign client and asks you to help translate during dinner. He insists on paying you for the evening.",
          earnings: 90,
          actionLabel: "Join the Dinner",
        },
      },
      {
        id: "yuki",
        name: "Yuki",
        sprite: "👩‍🔬",
        energyCost: 15,
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
    flightDurations: {
      paris: 13,
      tokyo: 18,
      cairo: 14,
      kyoto: 19,
      santorini: 14,
      marrakech: 13,
      reykjavik: 12,
    },
    atmosphere: "Mystical & Ancient",
    collectibleName: "Inca Sun Stone",
    collectibleTheme: "Ancient Artifacts",
    additionalCollectibles: [
      { name: "Alpaca Wool Textile", theme: "Crafts" },
      { name: "Coca Tea Tin", theme: "Local" },
    ],
    localMeal: {
      name: "Ceviche",
      imageUri: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400",
    },
    earningOpportunities: [
      {
        id: "machu_carry",
        type: "work",
        title: "Work: Porter for the Day",
        description:
          "A trekking group's porter called in sick. They need someone to carry a pack up to the Sun Gate. Honest work.",
        earnings: 85,
        actionLabel: "Take the Pack",
      },
      {
        id: "machu_sunrise",
        type: "scenic",
        title: "Scenic Spot: Sunrise Over the Ruins",
        description:
          "You wake before dawn and capture the mist lifting over the citadel. A travel magazine editor buys the photo.",
        earnings: 110,
        actionLabel: "Sell the Photo",
      },
      {
        id: "machu_weaving",
        type: "work",
        title: "Work: Textile Market Stall",
        description:
          "A weaver at the Aguas Calientes market is sick. Her daughter asks if you'll mind the stall for the morning.",
        earnings: 50,
        actionLabel: "Mind the Stall",
      },
    ],
    people: [
      {
        id: "inti",
        name: "Inti",
        sprite: "🧑‍🌾",
        energyCost: 10,
        dialogues: [
          "The sun rises differently here. It is why the Inca chose this place.",
          "Coca tea for altitude sickness. Drink it slowly. Rest the first day.",
          "The mountain behind you — Huayna Picchu — very few climb it. If you are able, do it.",
          "Stone by stone, these terraces still teach patience to everyone who visits.",
          "Clouds move fast here. The ruins can vanish and return in a single minute.",
        ],
        tip: "Buy the Huayna Picchu permit in advance. They sell out months ahead.",
        tipAction: {
          id: "machu_permit",
          title: "Buy Huayna Picchu Permit",
          description: "Secure an early climbing slot before tickets run out.",
          cost: 35,
          icon: "⛰️",
          outcome: "Your summit view is breathtaking, and the whole valley opens below you.",
          collectibleName: "Huayna Summit Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "inti_guide",
          type: "encounter",
          title: "Inti Offers You a Guide Job",
          description:
            "Inti says a group of travelers needs a walking companion through the terraces. 'You walk slow enough. That's good.'",
          earnings: 65,
          actionLabel: "Guide the Group",
        },
      },
      {
        id: "rosa",
        name: "Rosa",
        sprite: "👩‍🦱",
        energyCost: 12,
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
    image: { uri: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=400&q=80" },
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
    flightDurations: {
      paris: 3,
      tokyo: 11,
      macchu_picchu: 14,
      kyoto: 11,
      santorini: 4,
      marrakech: 5,
      reykjavik: 6,
    },
    atmosphere: "Ancient & Bustling",
    collectibleName: "Scarab Amulet",
    collectibleTheme: "Ancient Artifacts",
    additionalCollectibles: [
      { name: "Papyrus Scroll", theme: "Art" },
      { name: "Spice Blend", theme: "Local" },
    ],
    localMeal: {
      name: "Koshary",
      imageUri: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400",
    },
    earningOpportunities: [
      {
        id: "cairo_pyramid_photo",
        type: "scenic",
        title: "Scenic Spot: Pyramid at Sunrise",
        description:
          "The pyramids glow orange at dawn. A documentary crew spots your vantage point and pays you as a location scout.",
        earnings: 90,
        actionLabel: "Scout the Location",
      },
      {
        id: "cairo_bazaar",
        type: "work",
        title: "Work: Khan el-Khalili Bazaar Help",
        description:
          "A spice merchant needs someone who speaks a little English to help sell to tourists for the afternoon.",
        earnings: 60,
        actionLabel: "Help at the Stall",
      },
      {
        id: "cairo_camel",
        type: "encounter",
        title: "Encounter: Camel Race Bet",
        description:
          "A local camel handler bets you on a short race. You pick the right animal. He pays up, laughing.",
        earnings: 45,
        actionLabel: "Place the Bet",
      },
      {
        id: "cairo_scribe",
        type: "work",
        title: "Work: Letter Scribe at the Market",
        description:
          "An elderly woman needs someone to transcribe a letter for her grandson. She pays with coin and generosity.",
        earnings: 30,
        actionLabel: "Write the Letter",
      },
    ],
    people: [
      {
        id: "omar",
        name: "Omar",
        sprite: "👨‍🏫",
        dialogues: [
          "The pyramids are 4,500 years old. Let that number sit in your chest for a moment.",
          "Negotiate. Always negotiate. It is part of the conversation here.",
          "Khan el-Khalili bazaar at dawn — no tourists, only merchants setting up.",
          "The desert teaches scale. You realize how small your worries are out there.",
          "In Cairo, history does not live in museums only. It lives on every street corner.",
        ],
        tip: "Early morning is the only time to see the Sphinx without crowds.",
        tipAction: {
          id: "cairo_sunrise_driver",
          title: "Hire a Sunrise Driver",
          description: "Book a predawn ride for a crowd-free Sphinx visit.",
          cost: 30,
          icon: "🐪",
          outcome: "The site is nearly empty, and the first light makes the stone glow gold.",
          collectibleName: "Sphinx Sunrise Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "omar_history_tour",
          type: "encounter",
          title: "Omar Has a Job For You",
          description:
            "'A university group arrives tomorrow. I need a second pair of hands for the museum visit. Good pay, not much work.'",
          earnings: 80,
          actionLabel: "Help Omar",
        },
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
    image: { uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80" },
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
    flightDurations: {
      paris: 12,
      tokyo: 2,
      macchu_picchu: 19,
      cairo: 11,
      santorini: 12,
      marrakech: 13,
      reykjavik: 14,
    },
    atmosphere: "Serene & Sacred",
    collectibleName: "Bamboo Flute",
    collectibleTheme: "Cultural Items",
    additionalCollectibles: [
      { name: "Tea Ceremony Set", theme: "Cultural" },
      { name: "Zen Garden Stone", theme: "Nature" },
    ],
    localMeal: {
      name: "Matcha & Wagashi",
      imageUri: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
    },
    earningOpportunities: [
      {
        id: "kyoto_bamboo",
        type: "scenic",
        title: "Scenic Spot: Arashiyama Bamboo Grove",
        description:
          "At dawn, alone in the grove, you record a short video that goes quietly viral. A travel brand reaches out.",
        earnings: 100,
        actionLabel: "Accept the Deal",
      },
      {
        id: "kyoto_temple",
        type: "work",
        title: "Work: Temple Garden Maintenance",
        description:
          "A Zen monastery needs a day laborer to rake gravel and clear moss. The monk offers a modest, honest payment.",
        earnings: 55,
        actionLabel: "Tend the Garden",
      },
      {
        id: "kyoto_tea",
        type: "encounter",
        title: "Encounter: Tea Ceremony Demonstration",
        description:
          "A tea master needs a volunteer participant for a foreign visitor's ceremony. She pays you for playing the role.",
        earnings: 40,
        actionLabel: "Participate",
      },
    ],
    people: [
      {
        id: "hiroshi",
        name: "Hiroshi",
        sprite: "🧓",
        energyCost: 12,
        dialogues: [
          "I tend the moss garden here. It takes twenty years to look like nothing.",
          "The tea ceremony is not about tea. It is about presence.",
          "Arashiyama bamboo grove — go before seven in the morning. Go alone.",
          "Kyoto rewards quiet footsteps. The city notices when you move gently.",
          "A simple bowl of soba after rain can feel like a full ritual.",
        ],
        tip: "Gion district after dark — geiko lanterns light the alleys.",
        tipAction: {
          id: "kyoto_evening_walk",
          title: "Join a Gion Evening Walk",
          description: "Take a guided twilight route through Kyoto's old districts.",
          cost: 28,
          icon: "🏮",
          outcome: "Lantern-lit lanes and whispered stories make the district unforgettable.",
          collectibleName: "Gion Lantern Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "hiroshi_moss",
          type: "work",
          title: "Hiroshi Needs an Extra Hand",
          description:
            "Hiroshi looks at you steadily. 'The east garden needs clearing before the abbot's visit tomorrow. I cannot do it alone.'",
          earnings: 60,
          actionLabel: "Help Hiroshi",
        },
      },
    ],
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    image: {
      uri: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
    },
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
    flightDurations: {
      paris: 3,
      tokyo: 12,
      macchu_picchu: 14,
      cairo: 4,
      kyoto: 12,
      marrakech: 5,
      reykjavik: 6,
    },
    atmosphere: "Dreamlike & Volcanic",
    collectibleName: "Aegean Blue Tile",
    collectibleTheme: "Natural Wonders",
    additionalCollectibles: [
      { name: "Volcanic Pumice", theme: "Nature" },
      { name: "Oia Sunset Photo", theme: "Art" },
    ],
    localMeal: {
      name: "Greek Salad & Feta",
      imageUri: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    },
    earningOpportunities: [
      {
        id: "santorini_sunset",
        type: "scenic",
        title: "Scenic Spot: Oia Sunset",
        description:
          "You find the perfect rooftop. A couple pays handsomely for you to photograph their proposal at golden hour.",
        earnings: 130,
        actionLabel: "Photograph the Proposal",
      },
      {
        id: "santorini_boat",
        type: "work",
        title: "Work: Boat Tour Deckhand",
        description:
          "A small tour boat needs a deckhand for the volcanic island route. Tourists tip generously here.",
        earnings: 95,
        actionLabel: "Join the Crew",
      },
      {
        id: "santorini_taverna",
        type: "work",
        title: "Work: Evening at the Taverna",
        description:
          "Stavros's cousin needs help serving tables during the dinner rush. Simple work, good pay.",
        earnings: 70,
        actionLabel: "Serve Tables",
      },
    ],
    people: [
      {
        id: "stavros",
        name: "Stavros",
        sprite: "🧑‍🍳",
        dialogues: [
          "My grandfather fished these waters. I run the taverna now.",
          "The sunset from Oia — people weep. I have seen it a thousand times and still I watch.",
          "Swim in the hot springs near the volcano. Strange feeling, like the earth is alive.",
          "White walls, blue domes, black volcanic stone — this island is all contrast.",
          "If the wind picks up, stay near the caldera side. The views are worth it.",
        ],
        tip: "Book a boat tour to the volcanic hot springs — only around $25.",
        tipAction: {
          id: "santorini_boat_tour",
          title: "Book Volcanic Boat Tour",
          description: "Reserve a small-boat trip to the hot springs and caldera cliffs.",
          cost: 25,
          icon: "⛵",
          outcome: "You sail through cobalt water and soak in mineral springs at sunset.",
          collectibleName: "Caldera Boat Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "stavros_kitchen",
          type: "work",
          title: "Stavros Needs Kitchen Help",
          description:
            "Stavros lowers his voice. 'My cook called in sick. You look like someone who can chop. I'll pay well, feed you too.'",
          earnings: 85,
          actionLabel: "Work the Kitchen",
        },
      },
    ],
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    image: { uri: "https://images.unsplash.com/photo-1597213584356-53e5c953d26f?auto=format&fit=crop&w=400&q=80" },
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
    flightDurations: {
      paris: 3,
      tokyo: 13,
      macchu_picchu: 13,
      cairo: 5,
      kyoto: 13,
      santorini: 5,
      reykjavik: 5,
    },
    atmosphere: "Vivid & Labyrinthine",
    collectibleName: "Berber Lantern",
    collectibleTheme: "Cultural Items",
    additionalCollectibles: [
      { name: "Leather Pouf", theme: "Crafts" },
      { name: "Henna Cone Set", theme: "Art" },
    ],
    localMeal: {
      name: "Tagine",
      imageUri: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400",
    },
    earningOpportunities: [
      {
        id: "marrakech_souk_guide",
        type: "encounter",
        title: "Encounter: Lost Tourists in the Medina",
        description:
          "Three tourists are hopelessly lost in the souk. You navigate them to Djemaa el-Fna. They're grateful — very grateful.",
        earnings: 55,
        actionLabel: "Guide Them Out",
      },
      {
        id: "marrakech_leather",
        type: "work",
        title: "Work: Tannery Day Work",
        description:
          "The leather tannery needs hands for a full day of dyeing work. Intense. Smelly. Honest.",
        earnings: 70,
        actionLabel: "Take the Work",
      },
      {
        id: "marrakech_djemaa",
        type: "scenic",
        title: "Scenic Spot: Djemaa el-Fna at Night",
        description:
          "You capture the square's chaos and fire in a single perfect shot. A travel blog buys it immediately.",
        earnings: 85,
        actionLabel: "Sell the Image",
      },
      {
        id: "marrakech_henna",
        type: "work",
        title: "Work: Henna Artist's Assistant",
        description:
          "A henna artist needs someone to hold supplies and manage the queue of tourists.",
        earnings: 40,
        actionLabel: "Help the Artist",
      },
    ],
    people: [
      {
        id: "hassan",
        name: "Hassan",
        sprite: "👨‍🎨",
        dialogues: [
          "The medina is a maze on purpose. It was built to confuse invaders.",
          "My family has made leather here for four generations. The smell never leaves.",
          "Djemaa el-Fna at night — snake charmers, storytellers, the smoke of a hundred fires.",
          "Bargain with a smile. In Marrakech, it is part of the music.",
          "Drink mint tea slowly; rushing it offends both tea and host.",
        ],
        tip: "Stay in a riad. Hotels here miss the whole point of the city.",
        tipAction: {
          id: "marrakech_riad",
          title: "Book a Riad Courtyard Room",
          description: "Move into a family-run riad inside the old medina walls.",
          cost: 32,
          icon: "🕌",
          outcome: "You wake to birdsong in a tiled courtyard and feel the city differently.",
          collectibleName: "Riad Courtyard Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1568735052543-6b7df6b662aa?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "hassan_leather",
          type: "work",
          title: "Hassan Has Work in the Tannery",
          description:
            "Hassan squints at you. 'You want to see the real Marrakech? Come work one day in the tannery. I'll pay you. You'll never forget it.'",
          earnings: 75,
          actionLabel: "Accept Hassan's Offer",
        },
      },
    ],
  },
  {
    id: "reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    image: { uri: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=400&q=80" },
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
    flightDurations: {
      paris: 4,
      tokyo: 14,
      macchu_picchu: 12,
      cairo: 6,
      kyoto: 14,
      santorini: 6,
      marrakech: 5,
    },
    atmosphere: "Wild & Ethereal",
    collectibleName: "Volcanic Obsidian",
    collectibleTheme: "Natural Wonders",
    additionalCollectibles: [
      { name: "Northern Lights Photo", theme: "Nature" },
      { name: "Geothermal Stone", theme: "Nature" },
    ],
    localMeal: {
      name: "Icelandic Lamb Soup",
      imageUri: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    },
    earningOpportunities: [
      {
        id: "reykjavik_aurora",
        type: "scenic",
        title: "Scenic Spot: Northern Lights",
        description:
          "Against all odds the aurora appears. You capture it in a long exposure. A Nordic tourism board buys the rights.",
        earnings: 150,
        actionLabel: "License the Photo",
      },
      {
        id: "reykjavik_fish",
        type: "work",
        title: "Work: Fishing Boat Deckhand",
        description:
          "A fishing captain needs an extra hand for a one-day deep sea trip. Cold, wet, well paid.",
        earnings: 110,
        actionLabel: "Join the Boat",
      },
      {
        id: "reykjavik_hot_spring",
        type: "encounter",
        title: "Encounter: Geothermal Tour Guide",
        description:
          "A group of geologists mistakes you for their guide. You wing it convincingly. They never find out.",
        earnings: 70,
        actionLabel: "Play the Part",
      },
      {
        id: "reykjavik_cafe",
        type: "work",
        title: "Work: Hipster Café Barista",
        description:
          "A downtown café is short-staffed. The owner is desperate. You've made coffee before. Probably.",
        earnings: 65,
        actionLabel: "Work the Shift",
      },
    ],
    people: [
      {
        id: "sigrid",
        name: "Sigrid",
        sprite: "👩‍🦲",
        energyCost: 15,
        dialogues: [
          "Icelanders do not believe in elves officially. We also do not build roads through their hills.",
          "The Blue Lagoon is for tourists. Go to the Secret Lagoon in Flúðir instead.",
          "Northern lights forecast apps lie. Go out at midnight and look anyway.",
          "The weather changes every hour. Carry layers even if the sky looks kind.",
          "Hot dogs here are oddly excellent. Do not ask why, just trust me.",
        ],
        tip: "Rent a car. The Ring Road connects everything that matters.",
        tipAction: {
          id: "reykjavik_rental_car",
          title: "Rent a Ring Road Car",
          description: "Split a compact car rental and unlock remote Iceland sights.",
          cost: 45,
          icon: "🚙",
          outcome: "Waterfalls, lava fields, and empty roads turn your trip into an expedition.",
          collectibleName: "Ring Road Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=300&q=30&blur=2"
        },
        earningOnTalk: {
          id: "sigrid_research",
          type: "encounter",
          title: "Sigrid's Research Needs a Subject",
          description:
            "Sigrid is conducting a study on traveler perception of bioluminescence. She pays participants. You're the right demographic.",
          earnings: 55,
          actionLabel: "Join the Study",
        },
      },
    ],
  },
];

export const getDestinationById = (id: string): Destination | undefined => {
  return DESTINATIONS.find((d) => d.id === id);
};

export function getTipActionById(
  tipId: string,
): {
  action: TravelerTipAction;
  destinationId: string;
  destinationName: string;
  npcName: string;
} | null {
  for (const d of DESTINATIONS) {
    for (const p of d.people) {
      if (p.tipAction?.id === tipId) {
        return {
          action: p.tipAction,
          destinationId: d.id,
          destinationName: d.name,
          npcName: p.name,
        };
      }
    }
  }
  return null;
}

export const getRandomDestination = (): Destination => {
  return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
};

export const STARTING_BUDGET = 500;
export const LODGING_DAYS = 1;
