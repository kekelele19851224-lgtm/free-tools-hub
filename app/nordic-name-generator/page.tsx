"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Nordic/Viking Names Database
// ============================================

interface NameData {
  name: string;
  meaning: string;
  origin: string;
  style: string[];
}

// Male Names Database
const maleNames: NameData[] = [
  // Warrior Style
  { name: "Ragnar", meaning: "Warrior, army counsel", origin: "Old Norse", style: ["warrior", "traditional"] },
  { name: "Ivar", meaning: "Bow warrior, archer", origin: "Old Norse", style: ["warrior"] },
  { name: "Gunnar", meaning: "Bold warrior", origin: "Old Norse", style: ["warrior", "traditional"] },
  { name: "Sigurd", meaning: "Victory guardian", origin: "Old Norse", style: ["warrior", "noble"] },
  { name: "Halfdan", meaning: "Half Dane", origin: "Old Norse", style: ["warrior"] },
  { name: "Rollo", meaning: "Famous wolf", origin: "Old Norse", style: ["warrior"] },
  { name: "Torstein", meaning: "Thor's stone", origin: "Old Norse", style: ["warrior", "mythological"] },
  { name: "Eirik", meaning: "Eternal ruler", origin: "Old Norse", style: ["warrior", "noble"] },
  { name: "Styrbjorn", meaning: "Battle bear", origin: "Old Norse", style: ["warrior"] },
  { name: "Gorm", meaning: "He who worships god", origin: "Old Norse", style: ["warrior", "traditional"] },
  { name: "Hakon", meaning: "High son", origin: "Old Norse", style: ["warrior", "noble"] },
  { name: "Knut", meaning: "Knot", origin: "Old Norse", style: ["warrior", "traditional"] },
  { name: "Svein", meaning: "Young warrior", origin: "Old Norse", style: ["warrior"] },
  
  // Noble Style
  { name: "Harald", meaning: "Army ruler", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Erik", meaning: "Eternal ruler", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Olaf", meaning: "Ancestor's descendant", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Magnus", meaning: "Great", origin: "Latin/Norse", style: ["noble"] },
  { name: "Sven", meaning: "Young man, boy", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Sigvard", meaning: "Victory guardian", origin: "Old Norse", style: ["noble"] },
  { name: "Ragnvald", meaning: "Ruler's advisor", origin: "Old Norse", style: ["noble"] },
  { name: "Haakon", meaning: "High-born", origin: "Old Norse", style: ["noble"] },
  { name: "Canute", meaning: "Knot", origin: "Old Norse", style: ["noble"] },
  { name: "Valdemar", meaning: "Famous ruler", origin: "Old Norse", style: ["noble"] },
  
  // Nature Style
  { name: "Bjorn", meaning: "Bear", origin: "Old Norse", style: ["nature", "warrior"] },
  { name: "Ulf", meaning: "Wolf", origin: "Old Norse", style: ["nature", "warrior"] },
  { name: "Orm", meaning: "Serpent, dragon", origin: "Old Norse", style: ["nature"] },
  { name: "Arn", meaning: "Eagle", origin: "Old Norse", style: ["nature"] },
  { name: "Raven", meaning: "Raven bird", origin: "Old Norse", style: ["nature", "skyrim"] },
  { name: "Birger", meaning: "One who helps", origin: "Old Norse", style: ["nature", "traditional"] },
  { name: "Brand", meaning: "Sword, fire", origin: "Old Norse", style: ["nature", "warrior"] },
  { name: "Sten", meaning: "Stone", origin: "Old Norse", style: ["nature"] },
  { name: "Storm", meaning: "Storm", origin: "Old Norse", style: ["nature", "skyrim"] },
  { name: "Frost", meaning: "Frost, ice", origin: "Old Norse", style: ["nature", "skyrim"] },
  
  // Mythological Style
  { name: "Thor", meaning: "Thunder", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Odin", meaning: "Fury, inspiration", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Loki", meaning: "Trickster", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Tyr", meaning: "God of war", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Freyr", meaning: "Lord", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Balder", meaning: "Bold, brave", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Heimdall", meaning: "World brightener", origin: "Norse Mythology", style: ["mythological", "skyrim"] },
  { name: "Vidar", meaning: "Forest warrior", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Bragi", meaning: "Poet", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Njord", meaning: "Strong", origin: "Norse Mythology", style: ["mythological"] },
  
  // Traditional Style
  { name: "Leif", meaning: "Heir, descendant", origin: "Old Norse", style: ["traditional"] },
  { name: "Arvid", meaning: "Eagle tree", origin: "Old Norse", style: ["traditional"] },
  { name: "Aksel", meaning: "Father of peace", origin: "Old Norse", style: ["traditional"] },
  { name: "Anders", meaning: "Strong and manly", origin: "Old Norse", style: ["traditional"] },
  { name: "Asger", meaning: "God's spear", origin: "Old Norse", style: ["traditional"] },
  { name: "Dag", meaning: "Day", origin: "Old Norse", style: ["traditional"] },
  { name: "Einar", meaning: "Lone warrior", origin: "Old Norse", style: ["traditional", "warrior"] },
  { name: "Finn", meaning: "From Finland, wanderer", origin: "Old Norse", style: ["traditional"] },
  { name: "Gustav", meaning: "Staff of the Goths", origin: "Old Norse", style: ["traditional"] },
  { name: "Helge", meaning: "Holy, blessed", origin: "Old Norse", style: ["traditional"] },
  { name: "Ingvar", meaning: "Ing's warrior", origin: "Old Norse", style: ["traditional"] },
  { name: "Jarl", meaning: "Earl, nobleman", origin: "Old Norse", style: ["traditional", "noble"] },
  { name: "Karl", meaning: "Free man", origin: "Old Norse", style: ["traditional"] },
  { name: "Lars", meaning: "Crowned with laurel", origin: "Old Norse", style: ["traditional"] },
  { name: "Nils", meaning: "Victory of the people", origin: "Old Norse", style: ["traditional"] },
  
  // Skyrim Style
  { name: "Ulfric", meaning: "Wolf ruler", origin: "Old Norse", style: ["skyrim", "warrior"] },
  { name: "Kodlak", meaning: "Battle wolf", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Vilkas", meaning: "Wolf (Lithuanian)", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Farkas", meaning: "Wolf (Hungarian)", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Torvar", meaning: "Thor's warrior", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Skjor", meaning: "Shield", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Galmar", meaning: "Battle singer", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Ralof", meaning: "Wolf counsel", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Hadvar", meaning: "Battle protection", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Balgruuf", meaning: "Fire ruler", origin: "Fantasy Norse", style: ["skyrim", "noble"] },
  { name: "Arngeir", meaning: "Eagle spear", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Wulfgar", meaning: "Wolf spear", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Grimvar", meaning: "Masked warrior", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Fenrik", meaning: "Fen ruler", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Valdyr", meaning: "Ruler of the slain", origin: "Fantasy Norse", style: ["skyrim", "mythological"] }
];

// Female Names Database
const femaleNames: NameData[] = [
  // Warrior Style
  { name: "Lagertha", meaning: "Shield maiden", origin: "Old Norse", style: ["warrior"] },
  { name: "Brynhild", meaning: "Armored battle maiden", origin: "Old Norse", style: ["warrior", "mythological"] },
  { name: "Sigrun", meaning: "Victory rune", origin: "Old Norse", style: ["warrior"] },
  { name: "Gunnhild", meaning: "Battle maiden", origin: "Old Norse", style: ["warrior"] },
  { name: "Hervor", meaning: "Army guardian", origin: "Old Norse", style: ["warrior"] },
  { name: "Thora", meaning: "Thunder", origin: "Old Norse", style: ["warrior", "mythological"] },
  { name: "Svanhild", meaning: "Swan battle", origin: "Old Norse", style: ["warrior"] },
  { name: "Alfhild", meaning: "Elf battle", origin: "Old Norse", style: ["warrior"] },
  { name: "Vigdis", meaning: "War goddess", origin: "Old Norse", style: ["warrior"] },
  { name: "Ragnhild", meaning: "Battle counsel", origin: "Old Norse", style: ["warrior", "noble"] },
  
  // Noble Style
  { name: "Astrid", meaning: "Divine strength", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Sigrid", meaning: "Victory, beautiful", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Ingrid", meaning: "Beautiful goddess", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Gudrun", meaning: "God's secret lore", origin: "Old Norse", style: ["noble"] },
  { name: "Thyra", meaning: "Thor's warrior", origin: "Old Norse", style: ["noble"] },
  { name: "Estrid", meaning: "God's beauty", origin: "Old Norse", style: ["noble"] },
  { name: "Greta", meaning: "Pearl", origin: "Old Norse", style: ["noble", "traditional"] },
  { name: "Solveig", meaning: "Daughter of the sun", origin: "Old Norse", style: ["noble"] },
  { name: "Eira", meaning: "Mercy", origin: "Old Norse", style: ["noble"] },
  { name: "Dagny", meaning: "New day", origin: "Old Norse", style: ["noble"] },
  
  // Nature Style
  { name: "Ylva", meaning: "She-wolf", origin: "Old Norse", style: ["nature"] },
  { name: "Yrsa", meaning: "She-bear", origin: "Old Norse", style: ["nature"] },
  { name: "Runa", meaning: "Secret lore", origin: "Old Norse", style: ["nature", "traditional"] },
  { name: "Liv", meaning: "Life, protection", origin: "Old Norse", style: ["nature", "traditional"] },
  { name: "Embla", meaning: "Elm tree", origin: "Norse Mythology", style: ["nature", "mythological"] },
  { name: "Saga", meaning: "Story, seeing one", origin: "Old Norse", style: ["nature"] },
  { name: "Signy", meaning: "New victory", origin: "Old Norse", style: ["nature"] },
  { name: "Revna", meaning: "Raven", origin: "Old Norse", style: ["nature", "skyrim"] },
  { name: "Asta", meaning: "Love, divine beauty", origin: "Old Norse", style: ["nature"] },
  { name: "Brynja", meaning: "Armor", origin: "Old Norse", style: ["nature", "warrior"] },
  
  // Mythological Style
  { name: "Freya", meaning: "Noble woman", origin: "Norse Mythology", style: ["mythological", "traditional"] },
  { name: "Frigg", meaning: "Beloved", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Sif", meaning: "Bride, wife", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Skadi", meaning: "Damage, shadow", origin: "Norse Mythology", style: ["mythological", "skyrim"] },
  { name: "Idun", meaning: "To love, to renew", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Hel", meaning: "Hidden, concealed", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Nanna", meaning: "Daring, brave", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Eir", meaning: "Mercy, help", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Var", meaning: "Pledge, beloved", origin: "Norse Mythology", style: ["mythological"] },
  { name: "Sigyn", meaning: "Victorious girl-friend", origin: "Norse Mythology", style: ["mythological"] },
  
  // Traditional Style
  { name: "Helga", meaning: "Holy, blessed", origin: "Old Norse", style: ["traditional"] },
  { name: "Inga", meaning: "Guarded by Ing", origin: "Old Norse", style: ["traditional"] },
  { name: "Kari", meaning: "Pure", origin: "Old Norse", style: ["traditional"] },
  { name: "Birgitta", meaning: "Strength", origin: "Old Norse", style: ["traditional"] },
  { name: "Torunn", meaning: "Thor's love", origin: "Old Norse", style: ["traditional"] },
  { name: "Oddny", meaning: "New point", origin: "Old Norse", style: ["traditional"] },
  { name: "Jorunn", meaning: "Horse love", origin: "Old Norse", style: ["traditional"] },
  { name: "Tove", meaning: "Beautiful Thor", origin: "Old Norse", style: ["traditional"] },
  { name: "Hilde", meaning: "Battle", origin: "Old Norse", style: ["traditional", "warrior"] },
  { name: "Bodil", meaning: "Battle remedy", origin: "Old Norse", style: ["traditional"] },
  { name: "Gunnvor", meaning: "Cautious in battle", origin: "Old Norse", style: ["traditional"] },
  { name: "Magnhild", meaning: "Strong battle maiden", origin: "Old Norse", style: ["traditional", "warrior"] },
  { name: "Ragnborg", meaning: "Protecting counsel", origin: "Old Norse", style: ["traditional"] },
  
  // Skyrim Style
  { name: "Aela", meaning: "Huntress", origin: "Fantasy Norse", style: ["skyrim", "warrior"] },
  { name: "Lydia", meaning: "Noble one", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Mjoll", meaning: "Fresh snow", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Uthgerd", meaning: "Dawn strength", origin: "Fantasy Norse", style: ["skyrim", "warrior"] },
  { name: "Rikke", meaning: "Peaceful ruler", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Karliah", meaning: "Strong woman", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Serana", meaning: "Serene one", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Hroki", meaning: "Spirit girl", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Elisif", meaning: "God's promise", origin: "Fantasy Norse", style: ["skyrim", "noble"] },
  { name: "Frea", meaning: "Free one", origin: "Fantasy Norse", style: ["skyrim"] },
  { name: "Valdis", meaning: "Goddess of the slain", origin: "Fantasy Norse", style: ["skyrim", "mythological"] },
  { name: "Skjorta", meaning: "Shield maiden", origin: "Fantasy Norse", style: ["skyrim", "warrior"] }
];

// Father names for patronymic surnames
const fatherNames = [
  "Erik", "Ragnar", "Bjorn", "Olaf", "Harald", "Leif", "Sven", "Ivar", 
  "Gunnar", "Ulf", "Thor", "Magnus", "Sigurd", "Halfdan", "Knut", "Gorm",
  "Hakon", "Rolf", "Stein", "Brand", "Odd", "Finn", "Karl", "Arn"
];

// Epithets (nicknames)
const epithets = [
  { epithet: "the Bold", meaning: "Known for bravery and courage" },
  { epithet: "the Wise", meaning: "Known for wisdom and counsel" },
  { epithet: "the Strong", meaning: "Known for great physical strength" },
  { epithet: "the Fearless", meaning: "Known for facing danger without fear" },
  { epithet: "Bloodaxe", meaning: "Fierce and deadly warrior" },
  { epithet: "Ironside", meaning: "Impenetrable in battle" },
  { epithet: "the Red", meaning: "Red-haired or fierce temper" },
  { epithet: "the Great", meaning: "Famous and powerful leader" },
  { epithet: "Fairhair", meaning: "Beautiful golden hair" },
  { epithet: "Serpent-Eye", meaning: "Piercing, intimidating gaze" },
  { epithet: "the Black", meaning: "Dark-haired or mysterious" },
  { epithet: "Skull-Splitter", meaning: "Deadly in combat" },
  { epithet: "the Swift", meaning: "Known for speed and agility" },
  { epithet: "Storm-Born", meaning: "Born during a great storm" },
  { epithet: "Raven-Feeder", meaning: "Leaves many enemies for ravens" },
  { epithet: "the Silent", meaning: "Quiet and deadly" },
  { epithet: "Wolf-Heart", meaning: "Fierce and loyal like a wolf" },
  { epithet: "the Wanderer", meaning: "Traveled far and wide" },
  { epithet: "Shield-Breaker", meaning: "Powerful enough to break shields" },
  { epithet: "the Merchant", meaning: "Skilled trader and negotiator" },
  { epithet: "Forkbeard", meaning: "Has a forked beard" },
  { epithet: "Bluetooth", meaning: "Had a dead tooth that looked blue" },
  { epithet: "the Boneless", meaning: "Extremely flexible or cunning" },
  { epithet: "Lothbrok", meaning: "Hairy breeches" },
  { epithet: "the Bear", meaning: "Strong and fierce like a bear" },
  { epithet: "Ice-Veined", meaning: "Cold and calculating" },
  { epithet: "Thunder-Fist", meaning: "Powerful punches" },
  { epithet: "Dragon-Slayer", meaning: "Killed a great serpent or enemy" },
  { epithet: "the Shieldmaiden", meaning: "Female warrior (for women)" },
  { epithet: "the Valkyrie", meaning: "Warrior woman (for women)" }
];

// FAQ data
const faqs = [
  {
    question: "What is a Nordic/Viking name?",
    answer: "Nordic or Viking names come from the Old Norse language spoken by Scandinavian peoples during the Viking Age (793-1066 AD). These names often have powerful meanings related to warriors, gods, nature, and strength. Examples include Ragnar (warrior), Bjorn (bear), Freya (noble woman), and Astrid (divine strength)."
  },
  {
    question: "How did Vikings name their children?",
    answer: "Vikings typically gave children names with meaningful elements. Names often honored gods (Thor, Freya), described desired qualities (Sigurd = victory guardian), or referenced nature (Bjorn = bear, Ulf = wolf). Children might also be named after deceased relatives to carry on their spirit and honor."
  },
  {
    question: "What does -son and -dottir mean in Viking names?",
    answer: "These are patronymic suffixes used to create surnames. '-son' means 'son of' and '-dottir' (or -dóttir) means 'daughter of.' For example, 'Eriksson' means 'son of Erik' and 'Eriksdottir' means 'daughter of Erik.' This naming tradition is still used in Iceland today."
  },
  {
    question: "What are some famous Viking names from history?",
    answer: "Famous historical Vikings include: Ragnar Lothbrok (legendary warrior), Erik the Red (explorer who founded Greenland), Leif Erikson (first European to reach North America), Harald Fairhair (first King of Norway), Ivar the Boneless (renowned tactician), and Lagertha (legendary shieldmaiden)."
  },
  {
    question: "Can I use these names for games like Skyrim?",
    answer: "Absolutely! Our generator includes a 'Skyrim-style' option specifically designed for fantasy games. These names maintain Nordic authenticity while fitting the fantasy setting. Many names are directly inspired by The Elder Scrolls series and similar Norse-themed games."
  },
  {
    question: "What are Viking epithets and nicknames?",
    answer: "Vikings often earned epithets (bynames or nicknames) based on their deeds, appearance, or personality. Famous examples include Erik 'the Red' (red hair), Harald 'Bluetooth' (dark tooth), Ivar 'the Boneless' (possibly double-jointed), and Ragnar 'Lothbrok' (hairy breeches). Our generator can add authentic epithets to names."
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

// Helper function
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GeneratedName {
  fullName: string;
  firstName: string;
  meaning: string;
  origin: string;
  surname?: string;
  epithet?: string;
  epithetMeaning?: string;
}

export default function NordicNameGenerator() {
  const [gender, setGender] = useState("male");
  const [nameType, setNameType] = useState("full");
  const [nameStyle, setNameStyle] = useState("all");
  const [count, setCount] = useState(10);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Style labels
  const styleLabels: { [key: string]: { label: string; emoji: string; desc: string } } = {
    all: { label: "All Styles", emoji: "🎲", desc: "Mix of all name styles" },
    warrior: { label: "Warrior", emoji: "⚔️", desc: "Battle and strength names" },
    noble: { label: "Noble", emoji: "👑", desc: "Royal and dignified names" },
    nature: { label: "Nature", emoji: "🐺", desc: "Animal and nature names" },
    mythological: { label: "Mythological", emoji: "⚡", desc: "Gods and legends" },
    traditional: { label: "Traditional", emoji: "📜", desc: "Classic Nordic names" },
    skyrim: { label: "Skyrim-style", emoji: "🎮", desc: "Fantasy game names" }
  };

  // Generate function
  const generateNames = () => {
    const results: GeneratedName[] = [];
    
    // Get name pool based on gender
    let namePool: NameData[] = [];
    if (gender === "male") {
      namePool = [...maleNames];
    } else if (gender === "female") {
      namePool = [...femaleNames];
    } else {
      namePool = [...maleNames, ...femaleNames];
    }

    // Filter by style if not "all"
    if (nameStyle !== "all") {
      namePool = namePool.filter(n => n.style.includes(nameStyle));
    }

    // Get random names
    const selectedNames = getRandomItems(namePool, count);

    selectedNames.forEach((nameData) => {
      const result: GeneratedName = {
        fullName: nameData.name,
        firstName: nameData.name,
        meaning: nameData.meaning,
        origin: nameData.origin
      };

      // Add surname for full name type
      if (nameType === "full") {
        const fatherName = getRandomItem(fatherNames);
        const isMale = maleNames.some(n => n.name === nameData.name);
        const suffix = isMale ? "sson" : "sdottir";
        result.surname = fatherName + suffix;
        result.fullName = `${nameData.name} ${result.surname}`;
      }

      // Add epithet for epithet type
      if (nameType === "epithet") {
        const isFemale = femaleNames.some(n => n.name === nameData.name);
        // Filter epithets for gender appropriateness
        let availableEpithets = epithets.filter(e => {
          if (isFemale && (e.epithet === "the Shieldmaiden" || e.epithet === "the Valkyrie")) return true;
          if (!isFemale && (e.epithet === "the Shieldmaiden" || e.epithet === "the Valkyrie")) return false;
          return true;
        });
        const selectedEpithet = getRandomItem(availableEpithets);
        result.epithet = selectedEpithet.epithet;
        result.epithetMeaning = selectedEpithet.meaning;
        result.fullName = `${nameData.name} ${selectedEpithet.epithet}`;
      }

      results.push(result);
    });

    setGeneratedNames(results);
    setCopiedIndex(null);
  };

  // Copy function
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy all function
  const copyAllNames = async () => {
    const allNames = generatedNames.map(n => n.fullName).join("\n");
    try {
      await navigator.clipboard.writeText(allNames);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #D6D3D1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Nordic Name Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>⚔️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Nordic Name Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate authentic Viking and Norse names with meanings. Perfect for fantasy games, 
            creative writing, or discovering your Nordic alter ego.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: "#292524",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #44403C"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
            <div>
              <p style={{ fontWeight: "600", color: "#FAFAF9", margin: "0 0 4px 0" }}>
                <strong>Viking Naming Tradition</strong>
              </p>
              <p style={{ color: "#A8A29E", margin: 0, fontSize: "0.95rem" }}>
                Vikings used patronymic surnames: &quot;-son&quot; (son of) and &quot;-dottir&quot; (daughter of). 
                Leif Eriksson = Leif, son of Erik.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #D6D3D1",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#292524", padding: "16px 24px" }}>
              <h2 style={{ color: "#FAFAF9", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Name Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Gender */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  ⚔️ Gender
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "male", label: "Male", emoji: "👨" },
                    { value: "female", label: "Female", emoji: "👩" },
                    { value: "any", label: "Any", emoji: "🎲" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setGender(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: gender === option.value ? "2px solid #292524" : "1px solid #D6D3D1",
                        backgroundColor: gender === option.value ? "#292524" : "white",
                        color: gender === option.value ? "#FAFAF9" : "#374151",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.9rem",
                        fontWeight: gender === option.value ? "600" : "400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Type */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📜 Name Type
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { value: "first", label: "First Name Only", desc: "e.g. Ragnar, Freya" },
                    { value: "full", label: "Full Name (with patronymic)", desc: "e.g. Ragnar Eriksson" },
                    { value: "epithet", label: "First Name + Epithet", desc: "e.g. Ragnar the Bold" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNameType(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: nameType === option.value ? "2px solid #292524" : "1px solid #D6D3D1",
                        backgroundColor: nameType === option.value ? "#F5F5F4" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: nameType === option.value ? "#292524" : "#374151", fontSize: "0.9rem" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "2px" }}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Style */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎭 Name Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(styleLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setNameStyle(key)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: nameStyle === key ? "2px solid #292524" : "1px solid #D6D3D1",
                        backgroundColor: nameStyle === key ? "#292524" : "white",
                        color: nameStyle === key ? "#FAFAF9" : "#374151",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: nameStyle === key ? "600" : "400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {styleLabels[nameStyle]?.desc}
                </p>
              </div>

              {/* Count */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📊 Number of Names
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCount(num)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: count === num ? "2px solid #292524" : "1px solid #D6D3D1",
                        backgroundColor: count === num ? "#292524" : "white",
                        color: count === num ? "#FAFAF9" : "#374151",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.9rem",
                        fontWeight: count === num ? "600" : "400"
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateNames}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#292524",
                  color: "#FAFAF9",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                ⚔️ Generate Names
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #D6D3D1",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#44403C", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#FAFAF9", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📜 Generated Names
              </h2>
              {generatedNames.length > 0 && (
                <button
                  onClick={copyAllNames}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: copiedIndex === -1 ? "#10B981" : "#57534E",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  {copiedIndex === -1 ? "✓ Copied All!" : "📋 Copy All"}
                </button>
              )}
            </div>

            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {generatedNames.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🛡️</p>
                  <p style={{ margin: 0 }}>Choose your settings and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>Discover your Viking name!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {generatedNames.map((name, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "14px 16px",
                        backgroundColor: "#FAFAF9",
                        borderRadius: "10px",
                        border: "1px solid #E7E5E4",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", color: "#292524", fontSize: "1.05rem", marginBottom: "4px" }}>
                          ⚔️ {name.fullName}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#57534E", lineHeight: "1.5" }}>
                          <span style={{ fontWeight: "500" }}>{name.firstName}:</span> {name.meaning}
                          {name.surname && (
                            <span> • <span style={{ fontWeight: "500" }}>{name.surname}:</span> {name.surname.endsWith("sson") ? "Son of" : "Daughter of"} {name.surname.replace(/s?son$|sdottir$/, "")}</span>
                          )}
                          {name.epithet && (
                            <span> • <span style={{ fontWeight: "500" }}>{name.epithet}:</span> {name.epithetMeaning}</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#A8A29E", marginTop: "4px" }}>
                          Origin: {name.origin}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(name.fullName, index)}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: copiedIndex === index ? "#10B981" : "#292524",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {copiedIndex === index ? "✓" : "📋"}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={generateNames}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#57534E",
                      border: "2px dashed #D6D3D1",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More Names
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D6D3D1", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ⚔️ Viking Naming Traditions
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Viking names were more than just identifiers—they were declarations of heritage, destiny, and power. 
                  Understanding Norse naming conventions helps create authentic characters for games, stories, or exploring 
                  your Nordic roots.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Patronymic Surnames</h3>
                <div style={{
                  backgroundColor: "#FAFAF9",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E7E5E4"
                }}>
                  <p style={{ margin: "0 0 12px 0" }}>
                    Vikings didn&apos;t have fixed family surnames like we do today. Instead, they used patronymic names 
                    based on their father&apos;s first name:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>-son:</strong> &quot;Son of&quot; (Erik + son = Eriksson)</li>
                    <li><strong>-dottir:</strong> &quot;Daughter of&quot; (Erik + dottir = Eriksdottir)</li>
                  </ul>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                    Example: Leif Eriksson = Leif, son of Erik the Red
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Epithets (Bynames)</h3>
                <p>
                  Vikings often earned descriptive nicknames based on their appearance, deeds, or personality. 
                  These epithets followed the first name:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "12px", backgroundColor: "#FAFAF9", borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                    <strong>Erik the Red</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>Red hair or fierce temper</p>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#FAFAF9", borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                    <strong>Harald Fairhair</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>Beautiful golden hair</p>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#FAFAF9", borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                    <strong>Ivar the Boneless</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>Extremely flexible or cunning</p>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#FAFAF9", borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                    <strong>Bjorn Ironside</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>Impenetrable in battle</p>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Name Meanings</h3>
                <p>
                  Norse names often contained powerful meanings related to gods, nature, and warfare:
                </p>
                <ul style={{ margin: "12px 0", paddingLeft: "20px", lineHeight: "2" }}>
                  <li><strong>Thor-</strong> names honored the thunder god (Thorsten, Thora)</li>
                  <li><strong>-ulf/-olf</strong> meant wolf (Rolf, Ulf, Ingolf)</li>
                  <li><strong>-bjorn</strong> meant bear (Torbjorn, Styrbjorn)</li>
                  <li><strong>Sig-/Sigr-</strong> meant victory (Sigurd, Sigrid)</li>
                  <li><strong>-hild</strong> meant battle (Brunhild, Gunnhild)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Famous Vikings */}
            <div style={{ backgroundColor: "#292524", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "#FAFAF9" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🏆 Famous Vikings</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>⚔️ Ragnar Lothbrok</p>
                <p style={{ margin: 0 }}>🧭 Leif Eriksson</p>
                <p style={{ margin: 0 }}>👑 Harald Fairhair</p>
                <p style={{ margin: 0 }}>🔴 Erik the Red</p>
                <p style={{ margin: 0 }}>🛡️ Lagertha</p>
                <p style={{ margin: 0 }}>🦴 Ivar the Boneless</p>
                <p style={{ margin: 0 }}>🐻 Bjorn Ironside</p>
              </div>
            </div>

            {/* Popular Name Meanings */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📖 Popular Meanings</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>Bjorn:</strong> Bear</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Ulf:</strong> Wolf</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Erik:</strong> Eternal ruler</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Freya:</strong> Noble woman</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Astrid:</strong> Divine strength</p>
                <p style={{ margin: 0 }}><strong>Thor:</strong> Thunder</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/nordic-name-generator" currentCategory="Social" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D6D3D1", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FAFAF9", borderRadius: "8px", border: "1px solid #E7E5E4" }}>
          <p style={{ fontSize: "0.75rem", color: "#57534E", textAlign: "center", margin: 0 }}>
            ⚔️ <strong>Note:</strong> Names are based on historical Old Norse naming conventions and mythology. 
            Skyrim-style names are inspired by The Elder Scrolls series. All names are free to use for games, 
            stories, characters, or any creative project.
          </p>
        </div>
      </div>
    </div>
  );
}