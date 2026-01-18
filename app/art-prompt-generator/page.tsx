"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Art Prompt Templates Database
// ============================================

const templates = {
  character: {
    subjects: [
      "warrior", "princess", "merchant", "thief", "scholar", "farmer", "knight", "pirate",
      "witch", "wizard", "archer", "bard", "monk", "assassin", "healer", "blacksmith",
      "hunter", "queen", "king", "prince", "beggar", "sailor", "chef", "librarian",
      "explorer", "inventor", "musician", "dancer", "guard", "messenger", "hermit", "oracle"
    ],
    traits: [
      "with battle scars", "wearing a mysterious cloak", "carrying an ancient lantern",
      "with mismatched eyes", "covered in tattoos", "with silver hair", "missing one arm",
      "wearing ornate armor", "with a gentle smile", "looking tired and weary",
      "with piercing gaze", "holding a treasured locket", "with flowers in their hair",
      "wearing a mask", "with a mechanical limb", "draped in silk robes",
      "with wild untamed hair", "carrying a heavy burden", "with glowing markings",
      "dressed in rags", "wearing royal jewelry", "with a loyal pet companion"
    ],
    actions: [
      "standing proudly", "kneeling in prayer", "running through rain",
      "reading an old letter", "sharpening a blade", "gazing at the horizon",
      "preparing for battle", "resting by a campfire", "climbing a cliff",
      "hiding in shadows", "laughing joyfully", "crying silently",
      "meditating peacefully", "fighting fiercely", "dancing gracefully",
      "cooking a meal", "playing an instrument", "writing in a journal"
    ],
    locations: [
      "in a bustling marketplace", "on a mountain peak", "inside a cozy tavern",
      "in a dark dungeon", "at the edge of a cliff", "in a royal throne room",
      "by a peaceful river", "in a mysterious forest", "on a ship deck",
      "in a hidden cave", "at a crossroads", "in an ancient library",
      "on a battlefield", "in a flower garden", "at a village festival"
    ]
  },
  fantasy: {
    subjects: [
      "dragon", "elf", "dwarf", "unicorn", "phoenix", "mermaid", "centaur", "fairy",
      "goblin", "troll", "giant", "sprite", "nymph", "pegasus", "griffin", "basilisk",
      "elemental", "demon", "angel", "werewolf", "vampire", "lich", "golem", "dryad",
      "siren", "minotaur", "satyr", "djinn", "kitsune", "thunderbird", "hydra", "kraken"
    ],
    traits: [
      "with shimmering scales", "glowing with inner light", "ancient and wise",
      "young and curious", "battle-scarred", "majestic and proud", "mischievous",
      "with crystal horns", "wreathed in flames", "covered in moss and vines",
      "translucent and ethereal", "armored in gold", "with multiple eyes",
      "wielding elemental magic", "shape-shifting", "with feathered wings",
      "with a long flowing mane", "corruption spreading across body"
    ],
    actions: [
      "breathing fire", "casting a powerful spell", "guarding a treasure hoard",
      "soaring through clouds", "emerging from water", "resting in a cave",
      "hunting prey", "protecting young ones", "battling a hero",
      "granting a wish", "transforming", "absorbing magic",
      "singing an enchanting melody", "weaving illusions", "summoning minions"
    ],
    locations: [
      "in an enchanted forest", "atop a crystal mountain", "in a dragon's lair",
      "by a magical waterfall", "in an ancient temple", "floating in the sky",
      "deep underwater", "in a fairy ring", "at the edge of realms",
      "in a volcanic crater", "within a dream world", "at a magical academy"
    ]
  },
  scifi: {
    subjects: [
      "robot", "cyborg", "android", "alien", "space pilot", "bounty hunter",
      "hacker", "scientist", "colonist", "smuggler", "mech pilot", "AI construct",
      "time traveler", "clone soldier", "space marine", "engineer", "diplomat",
      "rebel fighter", "corporate agent", "psychic operative", "xenobiologist"
    ],
    traits: [
      "with glowing circuit patterns", "partially mechanical", "in a sleek suit",
      "with multiple arms", "wearing a high-tech visor", "with holographic displays",
      "battle-damaged", "with alien features", "in cryogenic state",
      "merged with technology", "with bioluminescent skin", "wearing power armor",
      "with neural implants visible", "carrying advanced weapons"
    ],
    actions: [
      "piloting a spacecraft", "hacking a terminal", "fighting off enemies",
      "exploring a new planet", "repairing machinery", "analyzing alien artifacts",
      "leading a squad", "negotiating peace", "escaping pursuit",
      "conducting experiments", "communicating with aliens", "calibrating weapons"
    ],
    locations: [
      "on a space station", "inside a massive spaceship", "on an alien planet",
      "in a neon-lit cyberpunk city", "in a research laboratory", "on a moon base",
      "in a derelict ship", "at a spaceport", "in a virtual reality world",
      "on a terraformed world", "in zero gravity", "at the edge of a black hole"
    ]
  },
  animal: {
    subjects: [
      "cat", "wolf", "owl", "fox", "deer", "rabbit", "bear", "eagle", "tiger",
      "lion", "elephant", "whale", "dolphin", "horse", "raven", "snake", "frog",
      "butterfly", "dragonfly", "hummingbird", "peacock", "swan", "octopus",
      "jellyfish", "turtle", "koala", "panda", "penguin", "flamingo", "parrot"
    ],
    traits: [
      "with unusual coloring", "majestic and powerful", "small and delicate",
      "old and wise", "young and playful", "scarred from battles",
      "with beautiful markings", "albino", "with heterochromia eyes",
      "fluffy and soft", "sleek and elegant", "muscular and strong",
      "with seasonal coat", "bioluminescent", "with unique patterns"
    ],
    actions: [
      "hunting", "sleeping peacefully", "playing", "running swiftly",
      "flying gracefully", "swimming", "eating", "grooming", "fighting",
      "caring for young", "calling to others", "hiding", "stalking prey",
      "basking in sunlight", "drinking water", "migrating"
    ],
    locations: [
      "in a dense forest", "on a snowy mountain", "in a peaceful meadow",
      "by a calm lake", "in a tropical jungle", "on an African savanna",
      "deep in the ocean", "in a cozy burrow", "on rocky cliffs",
      "in a bamboo forest", "at a watering hole", "in autumn leaves"
    ]
  },
  landscape: {
    subjects: [
      "mountain range", "enchanted forest", "peaceful village", "ancient ruins",
      "crystal cave", "floating islands", "volcanic landscape", "frozen tundra",
      "desert oasis", "underwater city", "treehouse village", "castle on a cliff",
      "hidden waterfall", "mystical garden", "abandoned temple", "coastal cliffs",
      "rolling hills", "deep canyon", "bioluminescent cave", "sky kingdom"
    ],
    traits: [
      "bathed in golden sunset light", "shrouded in mysterious fog",
      "covered in fresh snow", "blooming with spring flowers",
      "during a thunderstorm", "under a starry night sky",
      "with aurora borealis", "at the break of dawn", "in autumn colors",
      "under a double moon", "with magical floating lights",
      "overgrown with vegetation", "crystallized and sparkling"
    ],
    elements: [
      "with a winding river running through", "featuring ancient stone monuments",
      "with mythical creatures in the distance", "surrounded by cherry blossoms",
      "with a lone traveler walking through", "featuring a dramatic bridge",
      "with ruins of an old civilization", "surrounded by towering trees",
      "with mysterious portals", "featuring a hidden sanctuary"
    ]
  },
  object: {
    subjects: [
      "ancient sword", "magical staff", "treasure chest", "crystal ball",
      "spell book", "enchanted mirror", "mysterious potion", "ancient key",
      "magical compass", "ornate crown", "legendary shield", "cursed ring",
      "glowing orb", "enchanted instrument", "mechanical device", "ancient scroll",
      "magical lantern", "mysterious box", "sacred relic", "elemental gem"
    ],
    traits: [
      "glowing with inner power", "covered in ancient runes", "partially broken",
      "wrapped in ethereal energy", "ornately decorated", "simple but powerful",
      "corrupted by darkness", "blessed by light", "frozen in time",
      "dripping with magical essence", "pulsing with energy", "ancient and weathered"
    ],
    settings: [
      "displayed on a velvet cushion", "floating in midair", "hidden in shadows",
      "resting on an altar", "surrounded by candles", "locked in a glass case",
      "buried in sand", "underwater", "in the hands of its wielder",
      "emerging from stone", "surrounded by magical symbols"
    ]
  },
  creature: {
    subjects: [
      "forest spirit", "sea monster", "sky serpent", "shadow beast", "light elemental",
      "plant creature", "crystal being", "fire salamander", "ice wyrm", "storm hawk",
      "earth golem", "dream walker", "nightmare creature", "cosmic entity",
      "swamp dweller", "mountain guardian", "desert scarab", "void creature"
    ],
    traits: [
      "with multiple heads", "covered in living moss", "made of pure energy",
      "with crystalline body", "shifting and formless", "ancient beyond measure",
      "newborn and innocent", "corrupted and twisted", "noble and protective",
      "hungry and predatory", "playful and curious", "mysterious and aloof",
      "massive in size", "tiny and delicate", "partially invisible"
    ],
    actions: [
      "emerging from its domain", "hunting its prey", "protecting its territory",
      "communing with nature", "absorbing energy", "transforming",
      "sleeping in its lair", "traveling between worlds", "granting blessings",
      "cursing intruders", "building a nest", "calling to its kind"
    ],
    locations: [
      "in the heart of an ancient forest", "at the bottom of the ocean",
      "floating among clouds", "in a dimension between worlds",
      "at the peak of the highest mountain", "in a sacred grove",
      "within a volcano", "at the edge of reality", "in eternal darkness",
      "in a realm of pure light", "in a forgotten temple"
    ]
  },
  scene: {
    subjects: [
      "a cozy tavern filled with adventurers", "a royal coronation ceremony",
      "a magical duel between wizards", "a peaceful village market day",
      "a dragon attack on a castle", "a secret meeting of thieves",
      "a hero's triumphant return", "a funeral for a fallen warrior",
      "a festival celebration with fireworks", "a tense negotiation between kingdoms",
      "a group of travelers camping", "a library with floating books",
      "an alchemist's workshop", "a blacksmith's forge", "a witch's cottage",
      "a ship battling a storm", "an underground smugglers' den",
      "a gladiator arena", "a magical academy classroom", "a fortune teller's tent"
    ],
    atmospheres: [
      "with warm candlelight", "bathed in moonlight", "during a celebration",
      "in tense silence", "filled with laughter", "shrouded in mystery",
      "charged with magical energy", "peaceful and serene", "chaotic and dangerous",
      "melancholic and quiet", "vibrant and colorful", "dark and foreboding"
    ],
    details: [
      "with interesting characters in the background", "showing intricate architecture",
      "featuring magical effects", "with animals present", "showing cultural details",
      "with food and drinks visible", "featuring weapons and armor",
      "with books and scrolls", "showing nature elements", "with mystical symbols"
    ]
  }
};

// Style modifiers
const styles: { [key: string]: string[] } = {
  any: [""],
  anime: ["in anime style", "with anime aesthetics", "manga-inspired"],
  realistic: ["in realistic style", "photorealistic", "with detailed realism"],
  cartoon: ["in cartoon style", "with exaggerated features", "stylized and playful"],
  sketch: ["as a pencil sketch", "in line art style", "with rough sketch lines"],
  watercolor: ["in watercolor style", "with soft watercolor washes", "painted with watercolors"],
  pixel: ["in pixel art style", "as retro pixel art", "8-bit style"]
};

// Mood modifiers
const moods: { [key: string]: string[] } = {
  any: [""],
  happy: ["cheerful", "joyful", "bright and happy", "lighthearted"],
  dark: ["dark", "ominous", "sinister", "shadowy"],
  mysterious: ["mysterious", "enigmatic", "cryptic", "otherworldly"],
  epic: ["epic", "grand", "majestic", "awe-inspiring"],
  peaceful: ["peaceful", "serene", "calm", "tranquil"],
  dramatic: ["dramatic", "intense", "powerful", "striking"]
};

// Color palettes
const colorPalettes = [
  "warm sunset colors (orange, pink, gold)",
  "cool ocean tones (blue, teal, seafoam)",
  "forest palette (green, brown, gold)",
  "pastel colors (soft pink, lavender, mint)",
  "monochromatic (shades of one color)",
  "high contrast (black, white, one accent color)",
  "autumn colors (red, orange, brown, gold)",
  "winter palette (white, silver, ice blue)",
  "neon cyberpunk (pink, cyan, purple)",
  "earthy naturals (terracotta, sage, cream)"
];

// Difficulty descriptions
const difficultyTips: { [key: string]: string } = {
  easy: "Focus on simple shapes and basic composition. Great for warm-ups!",
  medium: "Add more details and consider lighting. Good practice for skills.",
  advanced: "Challenge yourself with complex poses, perspectives, and details."
};

// Category labels
const categoryLabels: { [key: string]: { label: string; emoji: string; description: string } } = {
  character: { label: "Character", emoji: "👤", description: "People and humanoid figures" },
  fantasy: { label: "Fantasy", emoji: "🐉", description: "Magical creatures and beings" },
  scifi: { label: "Sci-Fi", emoji: "🚀", description: "Futuristic and space themes" },
  animal: { label: "Animal", emoji: "🦊", description: "Wildlife and pets" },
  landscape: { label: "Landscape", emoji: "🏔️", description: "Scenery and environments" },
  object: { label: "Object", emoji: "⚔️", description: "Items and artifacts" },
  creature: { label: "Creature", emoji: "👹", description: "Mythical and original beings" },
  scene: { label: "Scene", emoji: "🎭", description: "Complex compositions" }
};

// FAQ data
const faqs = [
  {
    question: "What is an art prompt generator?",
    answer: "An art prompt generator is a creative tool that provides random ideas and suggestions for artwork. It helps artists overcome creative blocks by offering fresh concepts for characters, scenes, creatures, and more. Simply select your preferences and generate unique prompts to inspire your next drawing or painting."
  },
  {
    question: "How do I use these drawing prompts?",
    answer: "Use the prompts as a starting point for your artwork. You don't have to follow them exactly - feel free to interpret them in your own style, combine elements from multiple prompts, or use just one aspect that inspires you. The goal is to spark creativity, not to limit it!"
  },
  {
    question: "What should I draw when I have art block?",
    answer: "When experiencing art block, try using random prompts to break out of your routine. Start with something simple like an object or animal prompt. Set a timer for 10-15 minutes and do a quick sketch without worrying about perfection. Sometimes the best way to overcome a block is to just start drawing anything."
  },
  {
    question: "Are these prompts good for beginners?",
    answer: "Yes! We offer three difficulty levels. 'Easy' prompts focus on simpler subjects and compositions perfect for beginners. As you improve, try 'Medium' and 'Advanced' prompts that include more complex poses, lighting, and details."
  },
  {
    question: "Can I use these prompts for AI art generation?",
    answer: "Absolutely! These prompts work great with AI art tools like Midjourney, DALL-E, and Stable Diffusion. The detailed descriptions and style options help create more specific and interesting AI-generated images. Just copy the prompt and paste it into your preferred AI art tool."
  },
  {
    question: "How do I come up with character design ideas?",
    answer: "Use our Character category and enable all the detail options (action, location). Combine unexpected elements - like a shy warrior or a cheerful assassin. Think about your character's backstory, personality, and what makes them unique. Visual details like scars, clothing, and accessories can tell a story."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

// Helper function to get random item from array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ArtPromptGenerator() {
  const [category, setCategory] = useState<string>("character");
  const [style, setStyle] = useState<string>("any");
  const [mood, setMood] = useState<string>("any");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [includeAction, setIncludeAction] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeColors, setIncludeColors] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate prompts function
  const generatePrompts = () => {
    const prompts: string[] = [];
    const categoryData = templates[category as keyof typeof templates];

    for (let i = 0; i < 3; i++) {
      let prompt = "Draw ";

      // Add mood
      const moodOptions = moods[mood];
      const selectedMood = getRandomItem(moodOptions);
      if (selectedMood) {
        prompt += `a ${selectedMood} `;
      } else {
        prompt += "a ";
      }

      // Build prompt based on category
      if (category === "character") {
        const data = categoryData as typeof templates.character;
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction) {
          prompt += ", " + getRandomItem(data.actions);
        }
        if (includeLocation) {
          prompt += " " + getRandomItem(data.locations);
        }
      } else if (category === "fantasy") {
        const data = categoryData as typeof templates.fantasy;
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction) {
          prompt += ", " + getRandomItem(data.actions);
        }
        if (includeLocation) {
          prompt += " " + getRandomItem(data.locations);
        }
      } else if (category === "scifi") {
        const data = categoryData as typeof templates.scifi;
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction) {
          prompt += ", " + getRandomItem(data.actions);
        }
        if (includeLocation) {
          prompt += " " + getRandomItem(data.locations);
        }
      } else if (category === "animal") {
        const data = categoryData as typeof templates.animal;
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction) {
          prompt += ", " + getRandomItem(data.actions);
        }
        if (includeLocation) {
          prompt += " " + getRandomItem(data.locations);
        }
      } else if (category === "landscape") {
        const data = categoryData as typeof templates.landscape;
        prompt = "Draw " + getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction || includeLocation) {
          prompt += ", " + getRandomItem(data.elements);
        }
      } else if (category === "object") {
        const data = categoryData as typeof templates.object;
        prompt = "Draw " + (selectedMood ? `a ${selectedMood} ` : "an ");
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeLocation) {
          prompt += ", " + getRandomItem(data.settings);
        }
      } else if (category === "creature") {
        const data = categoryData as typeof templates.creature;
        prompt += getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.traits);
        if (includeAction) {
          prompt += ", " + getRandomItem(data.actions);
        }
        if (includeLocation) {
          prompt += " " + getRandomItem(data.locations);
        }
      } else if (category === "scene") {
        const data = categoryData as typeof templates.scene;
        prompt = "Draw " + getRandomItem(data.subjects);
        prompt += " " + getRandomItem(data.atmospheres);
        if (includeAction || includeLocation) {
          prompt += ", " + getRandomItem(data.details);
        }
      }

      // Add style
      const styleOptions = styles[style];
      const selectedStyle = getRandomItem(styleOptions);
      if (selectedStyle) {
        prompt += ", " + selectedStyle;
      }

      // Add color palette if selected
      if (includeColors) {
        prompt += ". Use " + getRandomItem(colorPalettes);
      }

      // Capitalize first letter and add period if not present
      prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
      if (!prompt.endsWith(".")) {
        prompt += ".";
      }

      prompts.push(prompt);
    }

    setGeneratedPrompts(prompts);
    setCopiedIndex(null);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF4FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #F5D0FE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Art Prompt Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🎨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Art Prompt Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate creative drawing prompts and art ideas instantly. Choose from 8 categories, 
            customize your style and mood, and get inspired to create your next masterpiece.
          </p>
        </div>

        {/* Quick Tip Box */}
        <div style={{
          backgroundColor: "#FAE8FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #F5D0FE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#86198F", margin: "0 0 4px 0" }}>
                <strong>Pro Tip:</strong> Overcome art block instantly!
              </p>
              <p style={{ color: "#A21CAF", margin: 0, fontSize: "0.95rem" }}>
                Don&apos;t overthink - pick a prompt and start sketching. Even a quick 5-minute doodle can spark creativity.
              </p>
            </div>
          </div>
        </div>

        {/* Main Generator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #F5D0FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#A855F7", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Prompt Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Category Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Category
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(categoryLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: category === key ? "2px solid #A855F7" : "1px solid #E5E7EB",
                        backgroundColor: category === key ? "#FAE8FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: category === key ? "600" : "400",
                        color: category === key ? "#7E22CE" : "#4B5563",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {categoryLabels[category]?.description}
                </p>
              </div>

              {/* Style Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  ✨ Art Style
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { value: "any", label: "Any" },
                    { value: "anime", label: "Anime" },
                    { value: "realistic", label: "Realistic" },
                    { value: "cartoon", label: "Cartoon" },
                    { value: "sketch", label: "Sketch" },
                    { value: "watercolor", label: "Watercolor" },
                    { value: "pixel", label: "Pixel Art" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStyle(option.value)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: style === option.value ? "2px solid #A855F7" : "1px solid #E5E7EB",
                        backgroundColor: style === option.value ? "#FAE8FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: style === option.value ? "600" : "400",
                        color: style === option.value ? "#7E22CE" : "#4B5563"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🌙 Mood / Atmosphere
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { value: "any", label: "Any" },
                    { value: "happy", label: "Happy" },
                    { value: "dark", label: "Dark" },
                    { value: "mysterious", label: "Mysterious" },
                    { value: "epic", label: "Epic" },
                    { value: "peaceful", label: "Peaceful" },
                    { value: "dramatic", label: "Dramatic" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMood(option.value)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: mood === option.value ? "2px solid #A855F7" : "1px solid #E5E7EB",
                        backgroundColor: mood === option.value ? "#FAE8FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: mood === option.value ? "600" : "400",
                        color: mood === option.value ? "#7E22CE" : "#4B5563"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Options */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📝 Include Details
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeAction}
                      onChange={(e) => setIncludeAction(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#A855F7" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>Action / Pose</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeLocation}
                      onChange={(e) => setIncludeLocation(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#A855F7" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>Setting / Location</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeColors}
                      onChange={(e) => setIncludeColors(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#A855F7" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>Color Palette Suggestion</span>
                  </label>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📊 Difficulty
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["easy", "medium", "advanced"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: difficulty === level ? "2px solid #A855F7" : "1px solid #E5E7EB",
                        backgroundColor: difficulty === level ? "#FAE8FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: difficulty === level ? "600" : "400",
                        color: difficulty === level ? "#7E22CE" : "#4B5563",
                        flex: "1",
                        textTransform: "capitalize"
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {difficultyTips[difficulty]}
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generatePrompts}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#A855F7",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#9333EA"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#A855F7"}
              >
                ✨ Generate Prompts
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #F5D0FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7E22CE", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🖼️ Your Art Prompts
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {generatedPrompts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🎨</p>
                  <p style={{ margin: 0 }}>Select your options and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>You&apos;ll get 3 unique prompts to inspire your art</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {generatedPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        backgroundColor: "#FAF5FF",
                        borderRadius: "12px",
                        border: "1px solid #E9D5FF",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.5rem" }}>🎨</span>
                        <p style={{ margin: 0, color: "#111827", fontSize: "1rem", lineHeight: "1.6", flex: 1 }}>
                          {prompt}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(prompt, index)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: copiedIndex === index ? "#10B981" : "#A855F7",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s"
                        }}
                      >
                        {copiedIndex === index ? (
                          <>✓ Copied!</>
                        ) : (
                          <>📋 Copy Prompt</>
                        )}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={generatePrompts}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#A855F7",
                      border: "2px dashed #E9D5FF",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More Prompts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F5D0FE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🎨 How to Use Art Prompts Effectively
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Art prompts are powerful tools for sparking creativity and overcoming artist&apos;s block. 
                  Whether you&apos;re a beginner looking for drawing ideas or a professional artist seeking fresh inspiration, 
                  prompts can help you explore new concepts and styles.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Using Drawing Prompts</h3>
                <div style={{
                  backgroundColor: "#FAF5FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E9D5FF"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Don&apos;t overthink it:</strong> Start sketching as soon as you get a prompt</li>
                    <li><strong>Interpret freely:</strong> The prompt is a starting point, not a strict rule</li>
                    <li><strong>Time yourself:</strong> Try 10-15 minute quick sketches for practice</li>
                    <li><strong>Combine prompts:</strong> Mix elements from different prompts for unique ideas</li>
                    <li><strong>Keep a sketchbook:</strong> Document your prompt drawings to track progress</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Overcoming Art Block</h3>
                <p>
                  Art block happens to every artist. When you&apos;re feeling stuck, random prompts can help break 
                  the cycle of perfectionism and self-doubt. The key is to start drawing without judgment - 
                  even a &quot;bad&quot; sketch is better than a blank page.
                </p>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#065F46" }}>Quick Art Block Exercise:</p>
                  <ol style={{ margin: "12px 0 0 0", paddingLeft: "20px", color: "#047857" }}>
                    <li>Generate a random &quot;Easy&quot; prompt</li>
                    <li>Set a 5-minute timer</li>
                    <li>Sketch without lifting your pen/pencil</li>
                    <li>Don&apos;t erase - embrace imperfection</li>
                    <li>Repeat with a new prompt</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Using Prompts for AI Art</h3>
                <p>
                  These prompts also work great with AI art generators like Midjourney, DALL-E, and Stable Diffusion. 
                  The detailed descriptions help create more specific and interesting AI-generated images. 
                  Simply copy the prompt and paste it into your preferred AI art tool.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Drawing Challenge Ideas */}
            <div style={{ backgroundColor: "#FAF5FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #E9D5FF" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#7E22CE", marginBottom: "16px" }}>🏆 Drawing Challenges</h3>
              <div style={{ fontSize: "0.9rem", color: "#6B21A8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Daily sketch: 1 prompt/day</p>
                <p style={{ margin: 0 }}>• Speed drawing: 5-min limit</p>
                <p style={{ margin: 0 }}>• Style swap: same prompt, 3 styles</p>
                <p style={{ margin: 0 }}>• Inktober: ink-only October</p>
                <p style={{ margin: 0 }}>• Character-a-day challenge</p>
              </div>
            </div>

            {/* Popular Styles */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🖌️ Popular Art Styles</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>Anime:</strong> Big eyes, dynamic poses</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Realistic:</strong> True-to-life details</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Cartoon:</strong> Exaggerated, fun</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Watercolor:</strong> Soft, flowing</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Pixel Art:</strong> Retro, blocky</p>
                <p style={{ margin: 0 }}><strong>Sketch:</strong> Quick, loose lines</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/art-prompt-generator" currentCategory="Social" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F5D0FE", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FAF5FF", borderRadius: "8px", border: "1px solid #E9D5FF" }}>
          <p style={{ fontSize: "0.75rem", color: "#7E22CE", textAlign: "center", margin: 0 }}>
            💡 <strong>Tip:</strong> These prompts are meant to inspire, not restrict. Feel free to modify, 
            combine, or completely reimagine any prompt to fit your artistic vision. Happy creating!
          </p>
        </div>
      </div>
    </div>
  );
}