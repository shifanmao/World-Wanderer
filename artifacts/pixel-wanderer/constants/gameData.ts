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
    id: "jake",
    name: "Jake",
    sprite: "🎒",
    description: "An experienced backpacker who's conquered every hostel from Bangkok to Bogotá. Speaks three languages badly, one fluently, and somehow always finds the cheapest noodle shop in town.",
    startingBudget: 550,
    startingEnergy: 60,
  },
  {
    id: "margot",
    name: "Margot",
    sprite: "👒",
    description: "A retired French teacher who finally cashed in her pension for the trip she deferred thirty years. Packs three novels, reads menus like literature, and always tips generously.",
    startingBudget: 750,
    startingEnergy: 35,
  },
  {
    id: "ryo",
    name: "Ryo",
    sprite: "📸",
    description: "A food blogger with 200K followers, an experimental palate, and a backup credit card from his uncle. Documents everything, eats everything, and is mildly embarrassed about the selfie stick.",
    startingBudget: 620,
    startingEnergy: 48,
  },
  {
    id: "petra",
    name: "Petra",
    sprite: "💼",
    description: "A corporate lawyer on a very aggressively scheduled sabbatical. Strong opinions about boutique hotels, has never eaten street food before this trip, and writes detailed itineraries she never follows.",
    startingBudget: 900,
    startingEnergy: 28,
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
  imageUri?: string;
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
      buenos_aires: 950,
      istanbul: 250,
      cape_town: 920,
    },
    flightDurations: {
      tokyo: 12,
      macchu_picchu: 13,
      cairo: 3,
      kyoto: 12,
      santorini: 3,
      marrakech: 3,
      reykjavik: 4,
      buenos_aires: 14,
      istanbul: 4,
      cape_town: 12,
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
        imageUri: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
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
        energyCost: 5,
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
        energyCost: 5,
        dialogues: [
          "I paint the Seine every morning. Each day it looks different.",
          "Tourists rush to the Eiffel Tower, but the real Paris is in Montmartre.",
          "If you speak even a little French, the city opens up like a flower.",
        ],
      },
      {
        id: "henri",
        name: "Henri",
        sprite: "👨‍🎓",
        energyCost: 5,
        dialogues: [
          "I study history at the Sorbonne. Paris has layers upon layers of stories.",
          "The Latin Quarter — students, cafés, revolution. It never changes.",
          "Shakespeare and Company bookstore — writers still go there seeking inspiration.",
          "The metro is the city's veins. Learn the lines, you learn Paris.",
        ],
      },
      {
        id: "camille",
        name: "Camille",
        sprite: "👩‍🦰",
        energyCost: 5,
        dialogues: [
          "I work in fashion. Paris style is not about brands, it's about attitude.",
          "Le Marais — the old Jewish quarter, now the hippest neighborhood.",
          "The best macarons are in a tiny shop near Place des Vosges. Secret.",
          "Parisians dress up for everything. Even grocery shopping.",
        ],
      },
      {
        id: "louis",
        name: "Louis",
        sprite: "👨‍🦳",
        energyCost: 5,
        dialogues: [
          "I've lived in Paris my whole life. The city changes, but the soul remains.",
          "The catacombs beneath us — millions of bones, a city of the dead.",
          "Every corner has a story. I've collected hundreds of them.",
          "The Seine at midnight — when the tourists sleep, the city belongs to us.",
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
      buenos_aires: 1350,
      istanbul: 920,
      cape_town: 1400,
    },
    flightDurations: {
      paris: 12,
      macchu_picchu: 18,
      cairo: 11,
      kyoto: 2,
      santorini: 12,
      marrakech: 13,
      reykjavik: 14,
      buenos_aires: 20,
      istanbul: 11,
      cape_town: 18,
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
        imageUri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80",
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
        energyCost: 5,
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
      {
        id: "takeshi",
        name: "Takeshi",
        sprite: "👨‍🎨",
        energyCost: 5,
        dialogues: [
          "I design video games. Tokyo is my inspiration and my laboratory.",
          "Harajuku on Sundays — the fashion is wild, but the energy is pure creativity.",
          "The convenience stores here are better than supermarkets in other countries.",
          "Omoide Yokocho in Shinjuku — tiny bars, old Tokyo atmosphere.",
        ],
      },
      {
        id: "sakura",
        name: "Sakura",
        sprite: "👩‍🦳",
        energyCost: 5,
        dialogues: [
          "I've lived in Tokyo for forty years. The city never stops changing.",
          "Cherry blossom season in Ueno Park — crowded, but worth every moment.",
          "The fish market at 5am — tuna auctions, chaos, energy.",
          "Old Tokyo survives in pockets. Yanaka district, Asakusa backstreets.",
        ],
      },
      {
        id: "hiro",
        name: "Hiro",
        sprite: "👨‍💻",
        energyCost: 5,
        dialogues: [
          "I work in tech. Tokyo is where the future happens first.",
          "Robot restaurants, capsule hotels, vending machines for everything.",
          "The city moves at its own rhythm. Find your pace or it will crush you.",
          "Shinjuku station — 3.5 million people pass through daily. Unbelievable.",
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
      buenos_aires: 380,
      istanbul: 950,
      cape_town: 820,
    },
    flightDurations: {
      paris: 13,
      tokyo: 18,
      cairo: 14,
      kyoto: 19,
      santorini: 14,
      marrakech: 13,
      reykjavik: 12,
      buenos_aires: 4,
      istanbul: 14,
      cape_town: 10,
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
        imageUri: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&q=80",
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
        energyCost: 5,
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
        energyCost: 5,
        dialogues: [
          "I carry goods up this path every week. The travelers complain about the altitude.",
          "There is a town at the base — Aguas Calientes. The hot springs help tired legs.",
          "Take nothing from the ruins. The spirits here remember everything.",
        ],
      },
      {
        id: "mateo",
        name: "Mateo",
        sprite: "👨‍🔧",
        energyCost: 5,
        dialogues: [
          "I maintain the trails. It takes constant work against the mountain.",
          "The train ride up is beautiful but expensive. The hike is free but hard.",
          "My grandfather worked here when Hiram Bingham rediscovered the site.",
          "The llamas here are sacred. They keep the grass short, naturally.",
        ],
      },
      {
        id: "elena",
        name: "Elena",
        sprite: "👩‍🏫",
        energyCost: 5,
        dialogues: [
          "I teach Incan history. This site is our classroom, our heritage.",
          "The precision of the stonework — no mortar, just perfect fit. How did they do it?",
          "Every solstice, the sun aligns with specific windows. The Inca were astronomers.",
          "The Spanish never found Machu Picchu. That's why it survived.",
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
      buenos_aires: 1050,
      istanbul: 320,
      cape_town: 880,
    },
    flightDurations: {
      paris: 3,
      tokyo: 11,
      macchu_picchu: 14,
      kyoto: 11,
      santorini: 4,
      marrakech: 5,
      reykjavik: 6,
      buenos_aires: 15,
      istanbul: 2,
      cape_town: 10,
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
        imageUri: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=400&q=80",
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
      {
        id: "ahmed",
        name: "Ahmed",
        sprite: "👨‍🎨",
        energyCost: 5,
        dialogues: [
          "I make papyrus the old way. From the reed to the scroll, by hand.",
          "Islamic Cairo — mosques, madrasas, the heart of medieval Cairo.",
          "The traffic here has its own rules. Horns are conversation, not aggression.",
          "Egyptian coffee — strong, sweet, sipped slowly. It's a ritual.",
        ],
      },
      {
        id: "layla",
        name: "Layla",
        sprite: "👩‍🦱",
        energyCost: 5,
        dialogues: [
          "I work at the Egyptian Museum. Every artifact has a story waiting to be told.",
          "The mummies — kings, queens, preserved for eternity. It humbles you.",
          "Cairo never sleeps. The city is alive at 3am, just as at 3pm.",
          "Street food here is an adventure. Koshary, ful, falafel — try everything.",
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
      buenos_aires: 1400,
      istanbul: 970,
      cape_town: 1450,
    },
    flightDurations: {
      paris: 12,
      tokyo: 2,
      macchu_picchu: 19,
      cairo: 11,
      santorini: 12,
      marrakech: 13,
      reykjavik: 14,
      buenos_aires: 21,
      istanbul: 11,
      cape_town: 19,
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
        imageUri: "https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?auto=format&fit=crop&w=400&q=80",
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
        energyCost: 5,
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
      {
        id: "akiko",
        name: "Akiko",
        sprite: "👩‍🎨",
        energyCost: 5,
        dialogues: [
          "I study ikebana — Japanese flower arrangement. It is meditation with flowers.",
          "Kinkaku-ji — the Golden Pavilion. It reflects in the pond like a dream.",
          "Fushimi Inari shrine — thousands of torii gates. Hike to the top if you can.",
          "Kyoto seasons matter. Cherry blossoms in spring, maples in autumn.",
        ],
      },
      {
        id: "ren",
        name: "Ren",
        sprite: "👨‍🎓",
        energyCost: 5,
        dialogues: [
          "I work in a traditional ryokan. We serve kaiseki — multi-course meals as art.",
          "The philosophers' path — a canal lined with cherry trees. Walk it slowly.",
          "Nishiki market — food, crafts, the stomach of Kyoto.",
          "Old Kyoto survives in narrow lanes. Pontocho, Hanamikoji.",
        ],
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
      buenos_aires: 900,
      istanbul: 280,
      cape_town: 870,
    },
    flightDurations: {
      paris: 3,
      tokyo: 12,
      macchu_picchu: 14,
      cairo: 4,
      kyoto: 12,
      marrakech: 5,
      reykjavik: 6,
      buenos_aires: 14,
      istanbul: 2,
      cape_town: 11,
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
        imageUri: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?auto=format&fit=crop&w=400&q=80",
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
      {
        id: "elena",
        name: "Elena",
        sprite: "👩‍🦰",
        energyCost: 5,
        dialogues: [
          "I was born in the caldera. My family has lived here for generations.",
          "The volcano erupted in 1956. My grandmother tells stories of that day.",
          "Red Beach — the volcanic sand burns your feet, but the color is worth it.",
          "Santorini wine — volcanic soil makes it unique. Try the Assyrtiko.",
        ],
      },
      {
        id: "nikos",
        name: "Nikos",
        sprite: "👨‍🎨",
        energyCost: 5,
        dialogues: [
          "I paint the sunset every evening. Each one is different.",
          "Akrotiri — the Pompeii of the Aegean. Ancient Minoan city preserved in ash.",
          "The donkeys here are stubborn but sure-footed. They know the steep paths better than anyone.",
          "Fira at night — the caldera lights up like a bowl of stars.",
        ],
      },
    ],
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    image: { uri: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=400&q=80" },
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
      buenos_aires: 920,
      istanbul: 330,
      cape_town: 750,
    },
    flightDurations: {
      paris: 3,
      tokyo: 13,
      macchu_picchu: 13,
      cairo: 5,
      kyoto: 13,
      santorini: 5,
      reykjavik: 5,
      buenos_aires: 14,
      istanbul: 4,
      cape_town: 10,
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
      imageUri: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80",
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
        imageUri: "https://images.unsplash.com/photo-1597212691661-ec9e2377e59a?auto=format&fit=crop&w=400&q=80",
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
      {
        id: "amina",
        name: "Amina",
        sprite: "👩‍🦱",
        energyCost: 5,
        dialogues: [
          "I weave carpets. Each pattern tells a story of my ancestors.",
          "The Bahia Palace — the gardens are my favorite place in the city.",
          "Majorelle Garden — the blue paint was imported specially from France.",
          "Call to prayer echoes five times a day. The city pauses, then continues.",
        ],
      },
      {
        id: "youssef",
        name: "Youssef",
        sprite: "👨‍🏫",
        energyCost: 5,
        dialogues: [
          "I teach Arabic calligraphy. Every letter has meaning beyond sound.",
          "The souks — spices, textiles, metalwork. Each section has its own rhythm.",
          "Saadian Tombs — hidden for centuries, now discovered. The tiles are incredible.",
          "Moroccan hospitality is real. If invited to tea, always accept.",
        ],
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
      buenos_aires: 980,
      istanbul: 380,
      cape_town: 1020,
    },
    flightDurations: {
      paris: 4,
      tokyo: 14,
      macchu_picchu: 12,
      cairo: 6,
      kyoto: 14,
      santorini: 6,
      marrakech: 5,
      buenos_aires: 16,
      istanbul: 5,
      cape_town: 14,
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
        imageUri: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=400&q=80",
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
      {
        id: "jon",
        name: "Jón",
        sprite: "👨‍🔧",
        energyCost: 5,
        dialogues: [
          "I work in geothermal energy. Iceland runs on heat from the earth.",
          "The water here smells like sulfur. You get used to it.",
          "Summer midnight sun — the sun never sets. Winter is the opposite.",
          "Icelandic horses are unique. They have five gaits, not four like other horses.",
        ],
      },
      {
        id: "thora",
        name: "Þóra",
        sprite: "👩‍🎨",
        energyCost: 5,
        dialogues: [
          "I knit lopapeysa — Icelandic wool sweaters. Each pattern has regional meaning.",
          "Hallgrímskirkja — the church looks like basalt columns. It's our landmark.",
          "Harpa concert hall — glass reflects the sky and harbor. Beautiful at night.",
          "Icelandic language is ancient. We can still read sagas from a thousand years ago.",
        ],
      },
    ],
  },
  {
    id: "buenos_aires",
    name: "Buenos Aires",
    country: "Argentina",
    continent: "South America",
    image: { uri: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=400&q=80" },
    description:
      "The Paris of South America. Tango, steak, and colonial architecture blend with modern energy.",
    lodgingCost: 70,
    flightCosts: {
      paris: 950,
      tokyo: 1350,
      macchu_picchu: 380,
      cairo: 1050,
      kyoto: 1400,
      santorini: 900,
      marrakech: 920,
      reykjavik: 980,
    },
    flightDurations: {
      paris: 14,
      tokyo: 20,
      macchu_picchu: 4,
      cairo: 15,
      kyoto: 21,
      santorini: 14,
      marrakech: 14,
      reykjavik: 16,
    },
    atmosphere: "Passionate & Elegant",
    collectibleName: "Tango Shoes",
    collectibleTheme: "Cultural Items",
    additionalCollectibles: [
      { name: "Mate Gourd", theme: "Cultural" },
      { name: "Evita Portrait", theme: "Art" },
    ],
    localMeal: {
      name: "Asado & Malbec",
      imageUri: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    },
    earningOpportunities: [
      {
        id: "buenos_cafe",
        type: "work",
        title: "Work: Historic Café Server",
        description:
          "A century-old café in San Telmo needs extra staff for the afternoon rush. The tips are generous.",
        earnings: 65,
        actionLabel: "Serve Coffee",
      },
      {
        id: "buenos_street_art",
        type: "encounter",
        title: "Encounter: Street Art Tour",
        description:
          "A local artist invites you to join a street art tour group. You help translate for English-speaking tourists.",
        earnings: 55,
        actionLabel: "Join the Tour",
      },
    ],
    people: [
      {
        id: "mateo",
        name: "Mateo",
        sprite: "👨‍🎤",
        energyCost: 5,
        dialogues: [
          "Buenos Aires breathes tango. You can hear it in the streets at night.",
          "The best steaks are in the parrillas, not the fancy restaurants. Ask the locals.",
          "San Telmo market on Sundays — antiques, music, and the soul of the city.",
          "Drink mate like we do: slowly, with friends, never alone.",
          "The architecture here tells stories of wealth, ambition, and reinvention.",
        ],
        tip: "Take a tango lesson in La Boca. It's worth the tourist crowds.",
        tipAction: {
          id: "buenos_tango_lesson",
          title: "Take a Tango Lesson",
          description: "Learn the basics of Argentina's most famous dance in a historic milonga.",
          cost: 35,
          icon: "💃",
          outcome: "You stumble through the steps but feel the passion in every movement.",
          collectibleName: "Tango Lesson Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1589331598759-34585c09e77f?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "mateo_music",
          type: "encounter",
          title: "Mateo's Band Needs Help",
          description:
            "Mateo's band is playing at a local venue tonight. 'We need someone to handle the door. You look trustworthy.'",
          earnings: 60,
          actionLabel: "Help at the Door",
        },
      },
      {
        id: "sofia",
        name: "Sofía",
        sprite: "👩‍🍳",
        energyCost: 5,
        dialogues: [
          "My grandmother taught me to cook empanadas. Each fold tells a story.",
          "The Recoleta cemetery is where history sleeps. Eva Perón rests there.",
          "Sunday afternoon in Palermo — everyone is drinking mate in the parks.",
          "Argentinos are passionate. We argue loudly, we love loudly, we live loudly.",
        ],
      },
      {
        id: "javier",
        name: "Javier",
        sprite: "👨‍🎓",
        energyCost: 5,
        dialogues: [
          "I study literature at the University of Buenos Aires. Borges is our god.",
          "El Ateneo bookstore — it's inside an old theater. The most beautiful in the world.",
          "Puerto Madero — the old port, now the modern district. Great for walking.",
          "The café culture here — we spend hours talking over coffee. It's our tradition.",
        ],
      },
      {
        id: "lucia",
        name: "Lucía",
        sprite: "👩‍🎨",
        energyCost: 5,
        dialogues: [
          "I work in fashion. Buenos Aires style is European with Latin flair.",
          "Palermo Soho — boutiques, design, the creative heart of the city.",
          "La Boca's colorful houses — the immigrants painted with leftover ship paint.",
          "Teatro Colón — one of the world's great opera houses. The acoustics are perfect.",
        ],
      },
    ],
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    continent: "Asia/Europe",
    image: { uri: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400&q=80" },
    description:
      "Where East meets West. Minarets pierce the sky while the Bosphorus divides continents.",
    lodgingCost: 75,
    flightCosts: {
      paris: 250,
      tokyo: 920,
      macchu_picchu: 950,
      cairo: 320,
      kyoto: 970,
      santorini: 280,
      marrakech: 330,
      reykjavik: 380,
    },
    flightDurations: {
      paris: 4,
      tokyo: 11,
      macchu_picchu: 14,
      cairo: 2,
      kyoto: 11,
      santorini: 2,
      marrakech: 4,
      reykjavik: 5,
    },
    atmosphere: "Exotic & Historic",
    collectibleName: "Turkish Lantern",
    collectibleTheme: "Cultural Items",
    additionalCollectibles: [
      { name: "Evil Eye Charm", theme: "Cultural" },
      { name: "Turkish Rug", theme: "Crafts" },
    ],
    localMeal: {
      name: "Kebab & Baklava",
      imageUri: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400",
    },
    earningOpportunities: [
      {
        id: "istanbul_bazaar",
        type: "work",
        title: "Work: Grand Bazaar Guide",
        description:
          "A carpet merchant needs someone to guide English-speaking tourists through his section of the bazaar.",
        earnings: 70,
        actionLabel: "Guide Tourists",
      },
      {
        id: "istanbul_bosphorus",
        type: "scenic",
        title: "Scenic Spot: Bosphorus Sunset",
        description:
          "You capture the perfect sunset over the strait. A cruise line wants to use it for their marketing.",
        earnings: 95,
        actionLabel: "Sell the Photo",
        imageUri: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "istanbul_tea",
        type: "encounter",
        title: "Encounter: Tea Garden Host",
        description:
          "A traditional tea garden needs help serving tourists during peak hours. The owner is kind.",
        earnings: 45,
        actionLabel: "Serve Tea",
      },
    ],
    people: [
      {
        id: "ahmet",
        name: "Ahmet",
        sprite: "👨‍🏭",
        energyCost: 5,
        dialogues: [
          "Istanbul has been the center of the world for 2,000 years. Everyone wanted this city.",
          "The Grand Bazaar — 4,000 shops, 60 streets, one labyrinth. Get lost on purpose.",
          "Turkish tea is not just drink. It is conversation. It is friendship.",
          "Between continents you can stand. One foot in Europe, one in Asia.",
          "The call to prayer echoes from hundreds of minarets. The city bows together.",
        ],
        tip: "Take a Bosphorus ferry at sunset. It costs almost nothing.",
        tipAction: {
          id: "istanbul_ferry",
          title: "Take Bosphorus Ferry",
          description: "Board a public ferry for a scenic cruise between continents.",
          cost: 15,
          icon: "⛴️",
          outcome: "You pass palaces, mosques, and fishing villages as the sun sets over the water.",
          collectibleName: "Bosphorus Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "ahmet_spices",
          type: "work",
          title: "Ahmet's Spice Shop Needs Help",
          description:
            "Ahmet runs a family spice shop in the Egyptian Bazaar. 'Tourists ask too many questions. Help me today?'",
          earnings: 55,
          actionLabel: "Help at the Shop",
        },
      },
      {
        id: "ayse",
        name: "Ayşe",
        sprite: "👩‍🦰",
        energyCost: 5,
        dialogues: [
          "I weave carpets. Each knot takes years to learn. My grandmother taught me.",
          "Hagia Sophia was a church, then a mosque, then a museum. Now it is a mosque again.",
          "The Blue Mosque at prayer time — the carpet is filled with bowed heads.",
          "Turkish hospitality is real. If we offer you tea, we mean it.",
        ],
      },
      {
        id: "mehmet",
        name: "Mehmet",
        sprite: "👨‍🎓",
        energyCost: 5,
        dialogues: [
          "I study Ottoman history. This city is my classroom.",
          "Topkapi Palace — where sultans lived for centuries. The harem is fascinating.",
          "The Basilica Cistern — underground water storage, mysterious and beautiful.",
          "Istanbul cats — they belong to everyone and no one. The city takes care of them.",
        ],
      },
      {
        id: "zeynep",
        name: "Zeynep",
        sprite: "👩‍🎨",
        energyCost: 5,
        dialogues: [
          "I work in a hammam — Turkish bath. It's not just washing, it's ritual.",
          "Galata Tower — climb it for the view. The Golden Horn spreads below you.",
          "Istiklal Street — tram, shops, crowds. The heart of modern Istanbul.",
          "Turkish breakfast is an event. Olives, cheese, tomatoes, tea. It takes hours.",
        ],
      },
    ],
  },
  {
    id: "cape_town",
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    image: { uri: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=400&q=80" },
    description:
      "Table Mountain watches over a city of oceans and vineyards. Where nature meets urban life.",
    lodgingCost: 65,
    flightCosts: {
      paris: 920,
      tokyo: 1400,
      macchu_picchu: 820,
      cairo: 880,
      kyoto: 1450,
      santorini: 870,
      marrakech: 750,
      reykjavik: 1020,
    },
    flightDurations: {
      paris: 12,
      tokyo: 18,
      macchu_picchu: 10,
      cairo: 10,
      kyoto: 19,
      santorini: 11,
      marrakech: 10,
      reykjavik: 14,
    },
    atmosphere: "Natural & Vibrant",
    collectibleName: "Protea Flower",
    collectibleTheme: "Natural Wonders",
    additionalCollectibles: [
      { name: "Shweshwe Fabric", theme: "Crafts" },
      { name: "Wine Bottle", theme: "Local" },
    ],
    localMeal: {
      name: "Bobotie",
      imageUri: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80",
    },
    earningOpportunities: [
      {
        id: "cape_wine",
        type: "scenic",
        title: "Scenic Spot: Vineyard at Sunset",
        description:
          "You photograph the Stellenbosch vineyards at golden hour. A wine label wants to use your image.",
        earnings: 85,
        actionLabel: "License the Photo",
        imageUri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "cape_table_mountain",
        type: "encounter",
        title: "Encounter: Hiking Guide",
        description:
          "A hiking group needs an extra guide for Table Mountain. You know the trail from yesterday's research.",
        earnings: 70,
        actionLabel: "Lead the Hike",
      },
      {
        id: "cape_market",
        type: "work",
        title: "Work: V&A Waterfront Market",
        description:
          "The craft market at the waterfront needs help setting up stalls for the weekend crowd.",
        earnings: 50,
        actionLabel: "Help Set Up",
      },
    ],
    people: [
      {
        id: "thabo",
        name: "Thabo",
        sprite: "👨‍🎓",
        energyCost: 5,
        dialogues: [
          "Table Mountain is the heart of this city. When the clouds cover it, we say the tablecloth is on.",
          "The wine regions here — Stellenbosch, Franschhoek — world-class wines at local prices.",
          "Robben Island is where Mandela was imprisoned. The ferry ride there changes you.",
          "South Africa has eleven official languages. We find ways to understand each other.",
          "The sunset over Camps Bay — tourists love it. Locals still love it too.",
        ],
        tip: "Take the cable car up Table Mountain. Go on a clear day.",
        tipAction: {
          id: "cape_cable_car",
          title: "Ride Table Mountain Cable Car",
          description: "Ascend to the summit for panoramic views of the city and ocean.",
          cost: 40,
          icon: "🚠",
          outcome: "The rotating car gives you 360-degree views of the peninsula below.",
          collectibleName: "Table Mountain Memory",
          rewardImageUri:
            "https://images.unsplash.com/photo-1580060839134-75a5edca2e67?auto=format&fit=crop&w=300&q=30&blur=2",
        },
        earningOnTalk: {
          id: "thabo_tour",
          type: "encounter",
          title: "Thabo Needs a Tour Assistant",
          description:
            "Thabo runs a small tour company. 'My regular guide is sick. Can you help with the city tour?'",
          earnings: 80,
          actionLabel: "Help with the Tour",
        },
      },
      {
        id: "zara",
        name: "Zara",
        sprite: "👩‍🎨",
        energyCost: 5,
        dialogues: [
          "I make beadwork. Each pattern has meaning. Colors tell stories of my ancestors.",
          "The Bo-Kaap neighborhood — colorful houses, Cape Malay cooking, the smell of spices.",
          "Penguins at Boulders Beach. They waddle right past you on the sand.",
          "Apartheid ended, but the wounds are still healing. We work on it every day.",
        ],
      },
      {
        id: "sipho",
        name: "Sipho",
        sprite: "👨‍🔧",
        energyCost: 5,
        dialogues: [
          "I work on the waterfront. The V&A is where the city meets the ocean.",
          "Kirstenbosch Botanical Gardens — on the mountain, plants from across the continent.",
          "The Cape of Good Hope — where two oceans meet. The wind never stops.",
          "Braai is our word for barbecue. It's social, it's tradition, it's essential.",
        ],
      },
      {
        id: "nomvula",
        name: "Nomvula",
        sprite: "👩‍🦳",
        energyCost: 5,
        dialogues: [
          "I was born in the Cape Flats during apartheid. The city has changed since then.",
          "Company's Garden — the oldest garden in the country, near Parliament.",
          "The Castle of Good Hope — the oldest colonial building. Complex history.",
          "Rainbow Nation — we're still learning what that means, learning together.",
        ],
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
