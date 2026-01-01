"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 字母词汇数据库
const wordDatabase: Record<string, { adjectives: string[]; nouns: string[]; verbs: string[]; adverbs: string[] }> = {
  A: {
    adjectives: ["amazing", "awesome", "ancient", "angry", "adorable", "anxious", "artistic", "ambitious", "agile", "adventurous"],
    nouns: ["apple", "alligator", "astronaut", "artist", "adventure", "airplane", "angel", "ant", "arrow", "acorn"],
    verbs: ["ask", "answer", "arrive", "admire", "achieve", "accept", "advance", "announce", "appear", "applaud"],
    adverbs: ["always", "anxiously", "amazingly", "actively", "awkwardly", "adorably", "artfully", "abruptly", "accurately", "angrily"]
  },
  B: {
    adjectives: ["beautiful", "brave", "bright", "bold", "brilliant", "busy", "big", "blue", "bouncy", "blissful"],
    nouns: ["bear", "butterfly", "bridge", "boat", "boy", "bird", "bee", "balloon", "beach", "book"],
    verbs: ["bounce", "build", "bring", "believe", "become", "begin", "bake", "bark", "bloom", "blow"],
    adverbs: ["boldly", "bravely", "brightly", "beautifully", "busily", "briefly", "broadly", "brilliantly", "blissfully", "blindly"]
  },
  C: {
    adjectives: ["clever", "calm", "cool", "curious", "colorful", "creative", "cute", "cheerful", "cozy", "caring"],
    nouns: ["cat", "castle", "cloud", "cake", "car", "captain", "candle", "camel", "crow", "cookie"],
    verbs: ["catch", "climb", "create", "carry", "call", "cook", "clap", "chase", "cheer", "choose"],
    adverbs: ["carefully", "calmly", "cleverly", "cheerfully", "clearly", "closely", "constantly", "correctly", "curiously", "cautiously"]
  },
  D: {
    adjectives: ["daring", "delightful", "dramatic", "dreamy", "dazzling", "determined", "decent", "deep", "devoted", "dynamic"],
    nouns: ["dog", "dragon", "dancer", "daisy", "dolphin", "diamond", "door", "drum", "duck", "deer"],
    verbs: ["dance", "dream", "discover", "deliver", "draw", "dig", "dive", "drive", "dash", "describe"],
    adverbs: ["daily", "daringly", "deeply", "delightfully", "dramatically", "dreamily", "differently", "directly", "deliberately", "desperately"]
  },
  E: {
    adjectives: ["elegant", "eager", "exciting", "enormous", "enchanting", "excellent", "energetic", "endless", "extraordinary", "exotic"],
    nouns: ["elephant", "eagle", "engine", "earth", "egg", "elf", "explorer", "echo", "emperor", "evening"],
    verbs: ["explore", "enjoy", "embrace", "escape", "express", "eat", "enter", "earn", "examine", "extend"],
    adverbs: ["eagerly", "easily", "elegantly", "endlessly", "enormously", "entirely", "equally", "especially", "eventually", "exactly"]
  },
  F: {
    adjectives: ["friendly", "funny", "fantastic", "fearless", "fluffy", "fast", "fancy", "fierce", "famous", "fabulous"],
    nouns: ["fox", "flower", "fish", "frog", "fairy", "farmer", "feather", "flame", "forest", "friend"],
    verbs: ["fly", "find", "follow", "float", "flip", "finish", "feed", "fight", "fix", "forgive"],
    adverbs: ["fast", "freely", "frequently", "fiercely", "finally", "firmly", "fondly", "foolishly", "formally", "fortunately"]
  },
  G: {
    adjectives: ["gentle", "great", "golden", "graceful", "gorgeous", "gigantic", "generous", "glad", "gleaming", "glorious"],
    nouns: ["giant", "garden", "goat", "ghost", "girl", "grape", "guitar", "grasshopper", "gift", "gold"],
    verbs: ["grow", "give", "gather", "glow", "glide", "grab", "greet", "guard", "guide", "gallop"],
    adverbs: ["gently", "gracefully", "greatly", "gladly", "generously", "gloriously", "gradually", "gratefully", "greedily", "grimly"]
  },
  H: {
    adjectives: ["happy", "helpful", "humble", "huge", "handsome", "honest", "hopeful", "hungry", "harmless", "heroic"],
    nouns: ["horse", "house", "hero", "heart", "hill", "hammer", "hawk", "honey", "hare", "hat"],
    verbs: ["help", "hop", "hide", "hug", "hurry", "hunt", "hold", "hope", "heal", "howl"],
    adverbs: ["happily", "hopefully", "honestly", "hungrily", "hurriedly", "heavily", "highly", "heroically", "humbly", "hastily"]
  },
  I: {
    adjectives: ["intelligent", "incredible", "imaginative", "impressive", "innocent", "interesting", "icy", "ideal", "immense", "important"],
    nouns: ["island", "ice", "insect", "inventor", "ink", "igloo", "image", "infant", "instrument", "idea"],
    verbs: ["imagine", "improve", "invent", "inspire", "include", "increase", "investigate", "invite", "identify", "illustrate"],
    adverbs: ["immediately", "incredibly", "innocently", "intensely", "intelligently", "interestingly", "internally", "ironically", "ideally", "immensely"]
  },
  J: {
    adjectives: ["jolly", "joyful", "jazzy", "jumpy", "just", "jealous", "jubilant", "jovial", "junior", "juicy"],
    nouns: ["jaguar", "jungle", "jester", "jewel", "journey", "jet", "jacket", "jam", "judge", "juggler"],
    verbs: ["jump", "join", "joke", "juggle", "jog", "journey", "judge", "jingle", "jostle", "justify"],
    adverbs: ["joyfully", "jovially", "justly", "jauntily", "jealously", "jokingly", "jubilantly", "jointly", "jumpily", "judiciously"]
  },
  K: {
    adjectives: ["kind", "keen", "kingly", "knowledgeable", "known", "kinetic", "key", "kaleidoscopic", "kempt", "kickass"],
    nouns: ["king", "knight", "kitten", "kite", "kangaroo", "key", "kitchen", "kingdom", "koala", "kettle"],
    verbs: ["keep", "kick", "kiss", "knock", "knit", "know", "kindle", "kneel", "kidnap", "kill"],
    adverbs: ["kindly", "keenly", "knowingly", "kingly", "kinetically", "knowledgeably", "kookily", "killingly", "kissingly", "kittenishly"]
  },
  L: {
    adjectives: ["lovely", "lucky", "lively", "little", "loud", "lazy", "laughing", "loving", "long", "luminous"],
    nouns: ["lion", "leaf", "lake", "lamb", "lamp", "ladder", "lemon", "letter", "lizard", "lighthouse"],
    verbs: ["laugh", "learn", "leap", "listen", "love", "lift", "live", "look", "lead", "land"],
    adverbs: ["loudly", "lovingly", "lazily", "lively", "luckily", "largely", "lastly", "lately", "legally", "literally"]
  },
  M: {
    adjectives: ["magical", "mighty", "mysterious", "merry", "magnificent", "modest", "modern", "majestic", "massive", "marvelous"],
    nouns: ["mountain", "moon", "monkey", "mouse", "magician", "mirror", "monster", "meadow", "mermaid", "musician"],
    verbs: ["make", "move", "march", "mix", "melt", "measure", "meet", "mention", "motivate", "multiply"],
    adverbs: ["magically", "mysteriously", "merrily", "magnificently", "mightily", "mostly", "merely", "madly", "majestically", "masterfully"]
  },
  N: {
    adjectives: ["nice", "noble", "neat", "natural", "nervous", "noisy", "nimble", "notable", "numerous", "nutritious"],
    nouns: ["night", "ninja", "nest", "nurse", "needle", "novel", "neighbor", "nature", "necklace", "notebook"],
    verbs: ["notice", "nap", "navigate", "need", "nibble", "nod", "note", "nurture", "name", "narrow"],
    adverbs: ["nicely", "nobly", "naturally", "nervously", "noisily", "notably", "normally", "nearly", "neatly", "narrowly"]
  },
  O: {
    adjectives: ["old", "open", "outstanding", "ordinary", "odd", "optimistic", "original", "outgoing", "obvious", "orange"],
    nouns: ["owl", "ocean", "orange", "otter", "octopus", "officer", "opera", "orbit", "orchid", "oven"],
    verbs: ["open", "observe", "offer", "obtain", "overcome", "operate", "order", "organize", "originate", "overflow"],
    adverbs: ["openly", "obviously", "occasionally", "oddly", "officially", "often", "only", "originally", "outwardly", "overly"]
  },
  P: {
    adjectives: ["pretty", "proud", "playful", "peaceful", "perfect", "patient", "polite", "powerful", "precious", "pleasant"],
    nouns: ["penguin", "princess", "prince", "panda", "parrot", "pilot", "pirate", "puppy", "painter", "planet"],
    verbs: ["play", "paint", "parade", "push", "pull", "practice", "prepare", "protect", "prove", "provide"],
    adverbs: ["proudly", "perfectly", "peacefully", "playfully", "patiently", "politely", "powerfully", "properly", "precisely", "purely"]
  },
  Q: {
    adjectives: ["quick", "quiet", "quirky", "queenly", "qualified", "quaint", "quintessential", "questionable", "quizzical", "quotable"],
    nouns: ["queen", "quest", "question", "quilt", "quail", "quarter", "quartet", "quiz", "quote", "quarry"],
    verbs: ["question", "quest", "quicken", "quiet", "quit", "quote", "qualify", "quarrel", "quench", "query"],
    adverbs: ["quickly", "quietly", "quirkily", "questionably", "quaintly", "quarterly", "queerly", "quotably", "quantitatively", "qualitatively"]
  },
  R: {
    adjectives: ["radiant", "remarkable", "royal", "rapid", "rare", "reliable", "rich", "romantic", "rowdy", "rustic"],
    nouns: ["rabbit", "rainbow", "robot", "rocket", "river", "rose", "ruler", "runner", "ranger", "raccoon"],
    verbs: ["run", "reach", "read", "ride", "rise", "roar", "roll", "race", "rescue", "remember"],
    adverbs: ["rapidly", "rarely", "really", "remarkably", "repeatedly", "richly", "rightly", "roughly", "royally", "rudely"]
  },
  S: {
    adjectives: ["silly", "sweet", "smart", "strong", "shiny", "sleepy", "swift", "sunny", "spectacular", "splendid"],
    nouns: ["sun", "star", "snake", "sailor", "spider", "swan", "scientist", "singer", "snowflake", "superhero"],
    verbs: ["sing", "swim", "smile", "skip", "sleep", "spin", "sparkle", "sprint", "soar", "search"],
    adverbs: ["slowly", "swiftly", "sweetly", "silently", "smoothly", "suddenly", "softly", "simply", "surely", "splendidly"]
  },
  T: {
    adjectives: ["tall", "tiny", "tremendous", "terrific", "thoughtful", "tricky", "true", "tender", "talented", "trusty"],
    nouns: ["tiger", "tree", "turtle", "teacher", "train", "treasure", "tornado", "trumpet", "traveler", "tower"],
    verbs: ["talk", "teach", "travel", "think", "throw", "try", "turn", "trust", "tickle", "transform"],
    adverbs: ["truly", "tremendously", "tenderly", "thoughtfully", "totally", "terribly", "thankfully", "tightly", "timely", "typically"]
  },
  U: {
    adjectives: ["unique", "unusual", "ultimate", "upbeat", "useful", "understanding", "united", "universal", "unstoppable", "ultra"],
    nouns: ["unicorn", "umbrella", "universe", "uncle", "uniform", "unit", "umpire", "union", "utensil", "utopia"],
    verbs: ["use", "understand", "unite", "unveil", "update", "upgrade", "upload", "uplift", "urge", "utter"],
    adverbs: ["usually", "uniquely", "ultimately", "unfortunately", "unexpectedly", "unusually", "urgently", "utterly", "universally", "undoubtedly"]
  },
  V: {
    adjectives: ["vibrant", "valiant", "valuable", "vast", "victorious", "vivid", "vocal", "vigilant", "virtuous", "vital"],
    nouns: ["vampire", "violin", "volcano", "village", "valley", "veteran", "viking", "vine", "visitor", "voice"],
    verbs: ["visit", "view", "value", "vanish", "venture", "vote", "volunteer", "verify", "visualize", "voyage"],
    adverbs: ["very", "vibrantly", "victoriously", "vigilantly", "violently", "virtually", "visually", "vividly", "voluntarily", "vastly"]
  },
  W: {
    adjectives: ["wonderful", "wild", "wise", "warm", "wacky", "wealthy", "witty", "weird", "willing", "worthy"],
    nouns: ["wizard", "wolf", "whale", "warrior", "witch", "wind", "waterfall", "wagon", "writer", "walrus"],
    verbs: ["walk", "watch", "wave", "whisper", "wiggle", "wander", "win", "wish", "wonder", "work"],
    adverbs: ["wisely", "wildly", "warmly", "well", "weirdly", "willingly", "wonderfully", "widely", "wickedly", "worthily"]
  },
  X: {
    adjectives: ["xenial", "x-ray", "xeric", "xyloid", "extreme", "excellent", "exotic", "exciting", "extra", "expert"],
    nouns: ["xylophone", "x-ray", "xenon", "xerox", "expert", "explorer", "extreme", "example", "exercise", "existence"],
    verbs: ["x-ray", "xerox", "exert", "excel", "excite", "explore", "express", "extend", "examine", "execute"],
    adverbs: ["extremely", "exactly", "excellently", "excitedly", "exclusively", "extensively", "externally", "expertly", "expressly", "excessively"]
  },
  Y: {
    adjectives: ["young", "youthful", "yellow", "yummy", "yearly", "yielding", "yappy", "yearning", "yogic", "yokel"],
    nouns: ["yak", "yacht", "yard", "yarn", "year", "yeti", "yogurt", "youngster", "youth", "yodel"],
    verbs: ["yell", "yearn", "yield", "yawn", "yap", "yodel", "yoke", "yank", "yelp", "yip"],
    adverbs: ["yearly", "yesterday", "yet", "youthfully", "yawningly", "yearningly", "yieldingly", "yellowly", "yappily", "yonder"]
  },
  Z: {
    adjectives: ["zany", "zealous", "zesty", "zippy", "zen", "zigzag", "zero", "zodiac", "zonal", "zonked"],
    nouns: ["zebra", "zombie", "zoo", "zephyr", "zipper", "zone", "zenith", "zeppelin", "zodiac", "zucchini"],
    verbs: ["zoom", "zip", "zigzag", "zap", "zero", "zone", "zest", "zonk", "zealously", "zinc"],
    adverbs: ["zealously", "zestfully", "zippily", "zanily", "zonally", "zestily", "zenlike", "zigzaggedly", "zoologically", "zestingly"]
  }
};

// 句型模板
const templates = {
  general: [
    "{adj} {noun} {verb} {adv}",
    "{adj} {adj} {noun} {verb}",
    "The {adj} {noun} {verb} the {adj} {noun}",
    "{noun} and {noun} {verb} {adv}",
    "{adj} {noun} {verb} and {verb}"
  ],
  poetry: [
    "{adj} {noun} {verb} in {adj} {noun}",
    "The {adj} {noun} {verb} {adv}, {verb} {adv}",
    "Through {adj} {noun}, the {noun} {verb}",
    "{noun} of {noun}, {verb} {adv}",
    "In {adj} {noun}, {adj} {noun} {verb}"
  ],
  business: [
    "{adj} {noun} Solutions",
    "{adj} {adj} Services",
    "{noun} & {noun} Co.",
    "{adj} {noun} Group",
    "The {adj} {noun}"
  ],
  kids: [
    "{adj} {noun} {verb}",
    "The {adj} {noun} goes {adv}",
    "{noun} {verb} with {noun}",
    "Little {adj} {noun} {verb}",
    "Happy {adj} {noun} {verb}"
  ],
  funny: [
    "{adj} {noun} {verb} {adj} {noun} {adv}",
    "The {adj} {noun} {adv} {verb} the {adj} {noun}",
    "Why did the {adj} {noun} {verb}? Because it was {adj}!",
    "{noun} {verb} while {noun} {verb}",
    "Super {adj} {noun} {verb} {adv}"
  ],
  tongue: [
    "{noun} {verb} {adj} {noun} that {verb} {adv}",
    "She {verb} {adj} {noun} by the {adj} {noun}",
    "{adj} {noun} {verb} {adj} {noun} {adv}",
    "How much {noun} could a {adj} {noun} {verb}",
    "Peter {verb} a peck of {adj} {noun}"
  ]
};

// 风格选项
const styleOptions = [
  { value: "general", label: "📝 General", desc: "All-purpose phrases" },
  { value: "poetry", label: "📜 Poetry", desc: "Poetic expressions" },
  { value: "business", label: "💼 Business", desc: "Brand names & slogans" },
  { value: "kids", label: "👶 For Kids", desc: "Simple & fun" },
  { value: "funny", label: "😄 Funny", desc: "Humorous phrases" },
  { value: "tongue", label: "👅 Tongue Twister", desc: "Try saying these fast!" }
];

// FAQ数据
const faqs = [
  {
    question: "What is alliteration and how does it work?",
    answer: "Alliteration is a literary device where consecutive words begin with the same consonant sound. For example, 'Peter Piper picked a peck of pickled peppers.' It creates rhythm, makes phrases memorable, and adds a musical quality to writing. It's commonly used in poetry, advertising, and children's books."
  },
  {
    question: "How can I use alliteration in poetry?",
    answer: "In poetry, alliteration adds rhythm and musicality. Use it to emphasize key words, create mood, or make lines more memorable. For example, 'silent sea' or 'whispering winds.' Don't overuse it—sprinkle alliteration throughout your poem for maximum effect without overwhelming the reader."
  },
  {
    question: "What are good alliteration examples for kids?",
    answer: "Kids love simple, fun alliterations like 'Silly Sally sang songs,' 'Big brown bears bounce,' or 'Funny frogs flip.' Tongue twisters are especially popular: 'She sells seashells by the seashore.' These help children learn phonics and make reading enjoyable."
  },
  {
    question: "How do I create a business name with alliteration?",
    answer: "Alliterative business names are memorable and catchy. Think of famous examples like Coca-Cola, Dunkin' Donuts, or Best Buy. Choose words that reflect your business values: 'Creative Concepts,' 'Quality Quest,' or 'Swift Solutions.' Keep it short, easy to pronounce, and relevant to your industry."
  },
  {
    question: "What are some funny alliteration tongue twisters?",
    answer: "Classic tongue twisters include: 'She sells seashells by the seashore,' 'Peter Piper picked a peck of pickled peppers,' 'How much wood would a woodchuck chuck,' and 'Betty Botter bought some butter.' These are fun challenges that test pronunciation and speaking speed!"
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function AlliterationGenerator() {
  const [selectedLetter, setSelectedLetter] = useState<string>("B");
  const [selectedStyle, setSelectedStyle] = useState<string>("general");
  const [count, setCount] = useState<number>(10);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // 首字母大写
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // 生成头韵短语
  const generateAlliterations = () => {
    const letterData = wordDatabase[selectedLetter];
    if (!letterData) return;

    const styleTemplates = templates[selectedStyle as keyof typeof templates];
    const generated: string[] = [];

    for (let i = 0; i < count; i++) {
      const template = styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
      
      let phrase = template
        .replace(/{adj}/g, () => letterData.adjectives[Math.floor(Math.random() * letterData.adjectives.length)])
        .replace(/{noun}/g, () => letterData.nouns[Math.floor(Math.random() * letterData.nouns.length)])
        .replace(/{verb}/g, () => letterData.verbs[Math.floor(Math.random() * letterData.verbs.length)])
        .replace(/{adv}/g, () => letterData.adverbs[Math.floor(Math.random() * letterData.adverbs.length)]);
      
      // 首字母大写
      phrase = capitalize(phrase);
      
      // 避免重复
      if (!generated.includes(phrase)) {
        generated.push(phrase);
      } else {
        i--; // 重试
        if (generated.length > 50) break; // 防止无限循环
      }
    }

    setResults(generated);
  };

  // 复制单个
  const copyPhrase = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // 复制全部
  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
    alert("All phrases copied to clipboard!");
  };

  // 重置
  const reset = () => {
    setSelectedLetter("B");
    setSelectedStyle("general");
    setCount(10);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Alliteration Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Alliteration Generator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create catchy alliterative phrases instantly. Perfect for poetry, business names, tongue twisters, children&apos;s writing, and creative projects.
          </p>
        </div>

        {/* Generator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Generation Settings
              </h2>

              {/* Letter Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🔤 Choose a Letter
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: selectedLetter === letter ? "2px solid #8B5CF6" : "1px solid #E5E7EB",
                        backgroundColor: selectedLetter === letter ? "#EDE9FE" : "white",
                        color: selectedLetter === letter ? "#7C3AED" : "#4B5563",
                        fontWeight: selectedLetter === letter ? "700" : "500",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🎨 Style / Purpose
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: selectedStyle === style.value ? "2px solid #8B5CF6" : "1px solid #E5E7EB",
                        backgroundColor: selectedStyle === style.value ? "#EDE9FE" : "white",
                        color: selectedStyle === style.value ? "#7C3AED" : "#4B5563",
                        fontWeight: selectedStyle === style.value ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textAlign: "left"
                      }}
                    >
                      <div>{style.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Results */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Number of Phrases
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: count === n ? "2px solid #8B5CF6" : "1px solid #E5E7EB",
                        backgroundColor: count === n ? "#EDE9FE" : "white",
                        color: count === n ? "#7C3AED" : "#4B5563",
                        fontWeight: count === n ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={generateAlliterations}
                  style={{
                    flex: "1",
                    backgroundColor: "#8B5CF6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  ✨ Generate Alliterations
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Result Header */}
              <div style={{ 
                background: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Generated Phrases
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#7C3AED", lineHeight: "1" }}>
                  {results.length > 0 ? results.length : "—"}
                </p>
                <p style={{ color: "#6D28D9", marginTop: "8px", fontSize: "0.875rem" }}>
                  {results.length > 0 ? `Starting with "${selectedLetter}"` : "Click generate to start"}
                </p>
              </div>

              {/* Generated Results List */}
              {results.length > 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  maxHeight: "320px",
                  overflowY: "auto"
                }}>
                  {results.map((phrase, index) => (
                    <div 
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <span style={{ fontWeight: "500", color: "#111827", flex: 1 }}>{phrase}</span>
                      <button
                        onClick={() => copyPhrase(phrase, index)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: "4px 8px",
                          marginLeft: "8px"
                        }}
                        title="Copy phrase"
                      >
                        {copiedIndex === index ? "✅" : "📋"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Copy All Button */}
              {results.length > 0 && (
                <button
                  onClick={copyAll}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151"
                  }}
                >
                  📋 Copy All Phrases
                </button>
              )}

              {/* Example Preview */}
              {results.length === 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    Example "{selectedLetter}" Alliterations
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      `${wordDatabase[selectedLetter]?.adjectives[0] || ""} ${wordDatabase[selectedLetter]?.nouns[0] || ""} ${wordDatabase[selectedLetter]?.verbs[0] || ""}`,
                      `${wordDatabase[selectedLetter]?.adjectives[1] || ""} ${wordDatabase[selectedLetter]?.adjectives[2] || ""} ${wordDatabase[selectedLetter]?.nouns[1] || ""}`
                    ].map((ex, i) => (
                      <div key={i} style={{ padding: "8px 12px", backgroundColor: "white", borderRadius: "6px", fontSize: "0.875rem", color: "#4B5563" }}>
                        {capitalize(ex)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Alliteration */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is Alliteration?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Alliteration is a literary device where words in close succession begin with the same consonant sound. It creates rhythm, makes phrases memorable, and adds a musical quality to writing.
              </p>
              <div style={{ 
                backgroundColor: "#EDE9FE", 
                padding: "16px", 
                borderRadius: "12px",
                borderLeft: "4px solid #8B5CF6"
              }}>
                <p style={{ fontWeight: "600", color: "#6D28D9", marginBottom: "8px" }}>Famous Examples:</p>
                <ul style={{ margin: "0", paddingLeft: "20px", color: "#6D28D9", fontSize: "0.875rem" }}>
                  <li>&quot;Peter Piper picked a peck of pickled peppers&quot;</li>
                  <li>&quot;She sells seashells by the seashore&quot;</li>
                  <li>&quot;Betty Botter bought some butter&quot;</li>
                </ul>
              </div>
            </div>

            {/* Alliteration for Different Purposes */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Alliteration for Different Purposes
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #8B5CF6" }}>
                  <p style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "4px" }}>📜 Poetry & Creative Writing</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Add rhythm and musicality to poems, stories, and songs. Makes lines memorable and emphasizes key words.</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #8B5CF6" }}>
                  <p style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "4px" }}>💼 Business & Branding</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Create catchy company names and slogans. Think Coca-Cola, PayPal, Dunkin&apos; Donuts, Best Buy.</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #8B5CF6" }}>
                  <p style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "4px" }}>👶 Education & Kids</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Help children learn phonics and reading. Simple alliterations make learning fun and engaging.</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #8B5CF6" }}>
                  <p style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "4px" }}>👅 Tongue Twisters</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Challenge pronunciation skills with fun, tricky phrases. Great for speech practice and entertainment.</p>
                </div>
              </div>
            </div>

            {/* Tips for Using Alliteration */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Tips for Using Alliteration
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { tip: "Don't overdo it", desc: "Use alliteration sparingly for maximum impact" },
                  { tip: "Focus on stressed syllables", desc: "The alliterative sound should fall on emphasized words" },
                  { tip: "Consider meaning", desc: "The phrase should make sense, not just sound good" },
                  { tip: "Read it aloud", desc: "Test how the phrase sounds when spoken" },
                  { tip: "Match the mood", desc: "Soft sounds (S, M) feel gentle; hard sounds (B, K) feel strong" }
                ].map((item, index) => (
                  <div key={index} style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <p style={{ fontWeight: "600", color: "#111827", marginBottom: "2px" }}>{item.tip}</p>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✨ Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Choose letters that match your mood",
                  "B, P, T sound bold and powerful",
                  "S, M, L sound soft and gentle",
                  "Generate multiple times for variety",
                  "Mix and match generated phrases"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#8B5CF6", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Letters */}
            <div style={{ 
              backgroundColor: "#EDE9FE", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6D28D9", marginBottom: "12px" }}>
                🔤 Popular Letters
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#6D28D9" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>S</strong> - Smooth, soft sounds</li>
                <li style={{ marginBottom: "8px" }}>• <strong>B</strong> - Bold, bouncy phrases</li>
                <li style={{ marginBottom: "8px" }}>• <strong>P</strong> - Playful, punchy words</li>
                <li style={{ marginBottom: "8px" }}>• <strong>M</strong> - Melodic, memorable</li>
                <li style={{ marginBottom: "8px" }}>• <strong>C</strong> - Crisp, clear sounds</li>
                <li>• <strong>T</strong> - Strong, tongue twisters</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/alliteration-generator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
