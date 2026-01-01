"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 马名数据库
const horseNames = {
  classic: {
    male: [
      "Thunder", "Storm", "Duke", "King", "Prince", "Baron", "Major", "Apollo",
      "Atlas", "Caesar", "Maximus", "Noble", "Sovereign", "Windsor", "Wellington",
      "Churchill", "Admiral", "Captain", "Titan", "Phoenix", "Legend", "Champion",
      "Victory", "Triumph", "Glory", "Honor", "Valor", "Knight", "Midnight", "Shadow"
    ],
    female: [
      "Lady", "Duchess", "Princess", "Belle", "Star", "Luna", "Aurora", "Grace",
      "Bella", "Diamond", "Pearl", "Ruby", "Sapphire", "Jewel", "Crystal", "Angel",
      "Willow", "Ivy", "Rose", "Lily", "Daisy", "Violet", "Jasmine", "Amber",
      "Scarlett", "Victoria", "Athena", "Empress", "Countess", "Majesty"
    ]
  },
  race: {
    male: [
      "Lightning Bolt", "Fast Track", "Gold Rush", "Winning Streak", "Speed Demon",
      "Thunder Run", "Quick Silver", "Racing Heart", "Blazing Star", "Triple Crown",
      "Photo Finish", "Track Star", "Derby King", "Sprint Master", "Furlong Fury",
      "Pace Setter", "Front Runner", "Finish Line", "American Pharoah", "War Emblem"
    ],
    female: [
      "Speed Queen", "Victory Lane", "Golden Girl", "Racing Belle", "Swift Beauty",
      "Lightning Lady", "Track Princess", "Derby Diva", "Sprint Star", "Winning Grace",
      "Fast Lily", "Quick Rose", "Racing Ruby", "Thunder Rose", "Glory Girl",
      "Finish First", "Lady Lightning", "Swift Sapphire", "Racing Pearl", "Zenyatta"
    ]
  },
  fantasy: {
    male: [
      "Shadowfax", "Pegasus", "Phoenix", "Dragon Rider", "Mystic Storm", "Starfire",
      "Moonshade", "Nightwing", "Stormborn", "Dragonheart", "Thunderbolt", "Stargazer",
      "Celestial", "Enchanted", "Mythical", "Legendary", "Arcane", "Ethereal",
      "Phantom", "Spirit Walker", "Soul Keeper", "Dream Weaver", "Frost Mane", "Sunburst"
    ],
    female: [
      "Moonbeam", "Starlight", "Aurora", "Mystic", "Enchantress", "Fairy Queen",
      "Twilight", "Stardust", "Moonflower", "Celestia", "Seraphina", "Elvira",
      "Mystique", "Dreamer", "Sparkle", "Shimmer", "Glitter", "Fairy", "Pixie",
      "Nymph", "Goddess", "Unicorn Dream", "Starfall", "Moonshadow"
    ]
  },
  funny: {
    any: [
      "Hay There", "Neigh Sayer", "Hoof Hearted", "Sir Gallops-a-Lot", "Mane Event",
      "Hay Girl Hay", "Stable Genius", "Usain Colt", "Pony Soprano", "Hay Jude",
      "Neigh-bor", "Justin Galloper", "Whoa Mama", "Oat Cuisine", "Barn Star",
      "Clip Clop", "Gallop Poll", "Stirrup Trouble", "Mane Attraction", "Foal Play",
      "Rein Man", "Unbridled Joy", "Trotsky", "Horsin Around", "Canter Believe It",
      "Whinny the Pooh", "Bridle Path", "Horse Power", "Quit Horsing", "Mane Squeeze"
    ]
  },
  western: {
    male: [
      "Dusty", "Bandit", "Maverick", "Outlaw", "Ranger", "Sheriff", "Gunner", "Buck",
      "Cowboy", "Tex", "Jesse", "Wyatt", "Clint", "Cash", "Bronco", "Rustler",
      "Wrangler", "Rodeo", "Canyon", "Mesa", "Rio", "Apache", "Comanche", "Dakota"
    ],
    female: [
      "Sierra", "Cheyenne", "Savannah", "Montana", "Arizona", "Nevada", "Dixie",
      "Annie", "Calamity", "Prairie", "Sage", "Autumn", "Sunset", "Mesa Rose",
      "Desert Flower", "Canyon Belle", "Rodeo Queen", "Dusty Rose", "Spirit", "Misty"
    ]
  },
  gaming: {
    any: [
      "Roach", "Buell", "The Count", "Rachel", "Boadicea", "Brown Jack", "Baylock",
      "Silver Dollar", "Midnight Star", "Ghost", "Phantom", "Shadow Runner",
      "Night Mare", "Dark Knight", "Silver Storm", "Golden Arrow", "Black Beauty",
      "White Lightning", "Red Thunder", "Blue Moon", "Wild Fire", "Iron Horse",
      "Epona", "Shadowmere", "Rapidash", "Agro"
    ]
  }
};

const prefixes = [
  "Silver", "Golden", "Midnight", "Royal", "Wild", "Storm", "Thunder", "Shadow",
  "Star", "Moon", "Sun", "Fire", "Ice", "Crystal", "Diamond", "Noble", "Swift",
  "Brave", "Bold", "Proud", "Gentle", "Mystic", "Magic", "Dream", "Lucky"
];

const suffixes = [
  "Star", "Storm", "Spirit", "Dream", "Heart", "Fire", "Wind", "Light", "Shadow",
  "Runner", "Dancer", "Rider", "Walker", "Jumper", "Racer", "Beauty", "Glory",
  "Pride", "Hope", "Joy", "Grace", "Power", "Strength", "Wonder", "Magic"
];

// 风格选项
const styleOptions = [
  { value: "all", label: "🎲 All Styles" },
  { value: "classic", label: "👑 Classic & Elegant" },
  { value: "race", label: "🏇 Race Horse" },
  { value: "fantasy", label: "✨ Fantasy & Mythical" },
  { value: "funny", label: "😄 Funny & Playful" },
  { value: "western", label: "🤠 Western & Cowboy" },
  { value: "gaming", label: "🎮 Gaming (RDR2, etc.)" }
];

// FAQ数据
const faqs = [
  {
    question: "How do I generate a horse name using parents' names?",
    answer: "Select 'By Parents' mode, then enter the sire (father) and dam (mother) names. Our generator will combine elements from both names, add creative prefixes and suffixes, and create unique offspring names that honor the horse's lineage."
  },
  {
    question: "What are good race horse names?",
    answer: "Good race horse names are memorable, powerful, and often reference speed or victory. Popular examples include 'Lightning Bolt', 'Triple Crown', 'Victory Lane', and 'Speed Demon'. Many race horses also have names that combine their sire and dam's names."
  },
  {
    question: "How do I register a horse name with AQHA?",
    answer: "AQHA (American Quarter Horse Association) requires names to be 20 characters or fewer, not currently in use, and not offensive. You can search existing names on AQHA's website before submitting. Names cannot include punctuation marks or numbers."
  },
  {
    question: "What are some fantasy horse names?",
    answer: "Fantasy horse names often draw from mythology and magic. Popular choices include 'Shadowfax' (Lord of the Rings), 'Pegasus', 'Phoenix', 'Moonbeam', 'Stardust', and 'Celestia'. These names evoke mystery and otherworldly beauty."
  },
  {
    question: "What should I name my horse in RDR2?",
    answer: "In Red Dead Redemption 2, popular horse names include 'Roach' (Witcher reference), 'Buell', 'Ghost', 'Shadow', 'Midnight', and funny names like 'Hay There' or 'Neigh Sayer'. The game allows creative freedom, so pick something that matches your horse's appearance!"
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

export default function HorseNameGenerator() {
  // 模式选择
  const [mode, setMode] = useState<"random" | "parents" | "style">("random");
  
  // Random 模式
  const [gender, setGender] = useState<"male" | "female" | "any">("any");
  
  // Parents 模式
  const [sireName, setSireName] = useState("");
  const [damName, setDamName] = useState("");
  
  // Style 模式
  const [selectedStyle, setSelectedStyle] = useState("all");
  
  // 通用
  const [count, setCount] = useState(10);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 从父母名生成
  const generateFromParents = (): string[] => {
    if (!sireName.trim() || !damName.trim()) return [];
    
    const results: string[] = [];
    const sireWords = sireName.trim().split(/\s+/);
    const damWords = damName.trim().split(/\s+/);
    
    // 组合父母名字
    sireWords.forEach(sw => {
      damWords.forEach(dw => {
        results.push(`${sw} ${dw}`);
        results.push(`${dw} ${sw}`);
      });
    });
    
    // 添加前缀后缀变体
    [...sireWords, ...damWords].forEach(word => {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      results.push(`${randomPrefix} ${word}`);
      results.push(`${word} ${randomSuffix}`);
      results.push(`${randomPrefix} ${word}'s ${randomSuffix}`);
    });
    
    // 首字母组合
    const sireInitial = sireWords[0]?.[0] || '';
    const damInitial = damWords[0]?.[0] || '';
    if (sireInitial && damInitial) {
      results.push(`${sireInitial}${damInitial}'s Pride`);
      results.push(`${sireInitial}${damInitial}'s Legacy`);
      results.push(`${sireInitial}${damInitial}'s Dream`);
    }
    
    const unique = [...new Set(results)];
    return unique.sort(() => Math.random() - 0.5).slice(0, count);
  };

  // 随机生成
  const generateRandom = (): string[] => {
    const pool: string[] = [];
    
    const styles = selectedStyle === "all" 
      ? ["classic", "race", "fantasy", "funny", "western", "gaming"]
      : [selectedStyle];
    
    styles.forEach(style => {
      const category = horseNames[style as keyof typeof horseNames];
      if (gender === "any") {
        if ("any" in category) pool.push(...category.any);
        if ("male" in category) pool.push(...category.male);
        if ("female" in category) pool.push(...category.female);
      } else if (gender in category) {
        pool.push(...(category as Record<string, string[]>)[gender]);
      } else if ("any" in category) {
        pool.push(...category.any);
      }
    });
    
    return pool.sort(() => Math.random() - 0.5).slice(0, count);
  };

  // 生成名字
  const generate = () => {
    let names: string[] = [];
    
    if (mode === "parents") {
      if (!sireName.trim() || !damName.trim()) {
        alert("Please enter both sire and dam names");
        return;
      }
      names = generateFromParents();
    } else {
      names = generateRandom();
    }
    
    setGeneratedNames(names);
  };

  // 重置
  const reset = () => {
    setSireName("");
    setDamName("");
    setGeneratedNames([]);
    setGender("any");
    setSelectedStyle("all");
    setCount(10);
  };

  // 复制单个名字
  const copyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // 复制全部
  const copyAll = () => {
    navigator.clipboard.writeText(generatedNames.join("\n"));
    alert("All names copied to clipboard!");
  };

  // 收藏
  const toggleFavorite = (name: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Horse Name Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Horse Name Generator & Creator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free horse name generator and creator tool. Generate unique horse names using parents&apos; names (sire and dam), by style, or completely random. Perfect for foals, race horses, show horses, and gaming.
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

              {/* Mode Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Generation Mode
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { id: "random", label: "🎲 Random" },
                    { id: "parents", label: "👨‍👩‍👧 By Parents" },
                    { id: "style", label: "🎨 By Style" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as "random" | "parents" | "style")}
                      style={{
                        flex: "1",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: mode === m.id ? "2px solid #F97316" : "1px solid #E5E7EB",
                        backgroundColor: mode === m.id ? "#FFF7ED" : "white",
                        color: mode === m.id ? "#EA580C" : "#4B5563",
                        fontWeight: mode === m.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parents Mode Inputs */}
              {mode === "parents" && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Sire Name (Father)
                    </label>
                    <input
                      type="text"
                      value={sireName}
                      onChange={(e) => setSireName(e.target.value)}
                      placeholder="e.g., Thunder King"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Dam Name (Mother)
                    </label>
                    <input
                      type="text"
                      value={damName}
                      onChange={(e) => setDamName(e.target.value)}
                      placeholder="e.g., Silver Star"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Random/Style Mode Options */}
              {mode !== "parents" && (
                <>
                  {/* Gender Selection */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Gender
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { id: "any", label: "Any" },
                        { id: "male", label: "♂ Male (Stallion)" },
                        { id: "female", label: "♀ Female (Mare)" }
                      ].map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setGender(g.id as "male" | "female" | "any")}
                          style={{
                            flex: "1",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: gender === g.id ? "2px solid #F97316" : "1px solid #E5E7EB",
                            backgroundColor: gender === g.id ? "#FFF7ED" : "white",
                            color: gender === g.id ? "#EA580C" : "#4B5563",
                            fontWeight: gender === g.id ? "600" : "400",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                          }}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  {mode === "style" && (
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Name Style
                      </label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          outline: "none",
                          backgroundColor: "white"
                        }}
                      >
                        {styleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Number of Names */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Number of Names
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
                        border: count === n ? "2px solid #F97316" : "1px solid #E5E7EB",
                        backgroundColor: count === n ? "#FFF7ED" : "white",
                        color: count === n ? "#EA580C" : "#4B5563",
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
                  onClick={generate}
                  style={{
                    flex: "1",
                    backgroundColor: "#F97316",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🐴 Generate Names
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
                background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#EA580C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Generated Names
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#EA580C", lineHeight: "1" }}>
                  {generatedNames.length > 0 ? generatedNames.length : "—"}
                </p>
                <p style={{ color: "#C2410C", marginTop: "8px", fontSize: "0.875rem" }}>
                  {generatedNames.length > 0 ? "unique names" : "Click generate to start"}
                </p>
              </div>

              {/* Generated Names List */}
              {generatedNames.length > 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  maxHeight: "320px",
                  overflowY: "auto"
                }}>
                  {generatedNames.map((name, index) => (
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
                        border: favorites.has(name) ? "2px solid #F97316" : "1px solid #E5E7EB"
                      }}
                    >
                      <span style={{ fontWeight: "500", color: "#111827" }}>{name}</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => toggleFavorite(name)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.125rem",
                            padding: "4px"
                          }}
                          title="Add to favorites"
                        >
                          {favorites.has(name) ? "❤️" : "🤍"}
                        </button>
                        <button
                          onClick={() => copyName(name, index)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            padding: "4px"
                          }}
                          title="Copy name"
                        >
                          {copiedIndex === index ? "✅" : "📋"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Copy All Button */}
              {generatedNames.length > 0 && (
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
                    color: "#374151",
                    marginBottom: "16px"
                  }}
                >
                  📋 Copy All Names
                </button>
              )}

              {/* Favorites Section */}
              {favorites.size > 0 && (
                <div style={{ 
                  backgroundColor: "#FFF7ED", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#EA580C", textTransform: "uppercase", marginBottom: "8px" }}>
                    ❤️ Your Favorites ({favorites.size})
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {[...favorites].map((name, index) => (
                      <span
                        key={index}
                        style={{
                          padding: "4px 12px",
                          backgroundColor: "white",
                          borderRadius: "20px",
                          fontSize: "0.875rem",
                          color: "#EA580C",
                          border: "1px solid #FDBA74"
                        }}
                      >
                        {name}
                      </span>
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
            {/* How to Use */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Use This Horse Name Generator
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Our horse name generator offers three powerful ways to find the perfect name for your equine companion:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px", borderLeft: "4px solid #F97316" }}>
                  <p style={{ fontWeight: "600", color: "#EA580C", marginBottom: "4px" }}>🎲 Random Mode</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Generate random names filtered by gender. Great for quick inspiration!</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px", borderLeft: "4px solid #F97316" }}>
                  <p style={{ fontWeight: "600", color: "#EA580C", marginBottom: "4px" }}>👨‍👩‍👧 By Parents Mode</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Enter the sire and dam names to generate offspring names that honor the horse&apos;s lineage.</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px", borderLeft: "4px solid #F97316" }}>
                  <p style={{ fontWeight: "600", color: "#EA580C", marginBottom: "4px" }}>🎨 By Style Mode</p>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Choose a specific style like Classic, Race Horse, Fantasy, Funny, Western, or Gaming.</p>
                </div>
              </div>
            </div>

            {/* Naming by Parents */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Generate Horse Names Using Parents&apos; Names
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Many horse owners, especially those with registered horses, prefer names that reflect the foal&apos;s lineage. Our &quot;By Parents&quot; mode combines elements from both the sire (father) and dam (mother) names to create meaningful offspring names.
              </p>
              
              <div style={{ 
                backgroundColor: "#FFF7ED", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                borderLeft: "4px solid #F97316"
              }}>
                <p style={{ fontWeight: "600", color: "#EA580C", marginBottom: "8px" }}>Example:</p>
                <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                  <strong>Sire:</strong> Thunder King &nbsp;|&nbsp; <strong>Dam:</strong> Silver Star<br/>
                  <strong>Generated:</strong> Thunder Star, Silver King, Royal Thunder, King&apos;s Star Legacy
                </p>
              </div>

              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                This method is commonly used for registered Thoroughbreds, Quarter Horses (AQHA), and show horses where the name should reflect the horse&apos;s prestigious bloodline.
              </p>
            </div>

            {/* Horse Naming Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Horse Naming Tips
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { tip: "Keep it short and easy to call", desc: "Names that are 1-3 syllables are easiest for training" },
                  { tip: "Consider the horse's personality", desc: "A spirited horse might suit 'Thunder' while a gentle one might be 'Willow'" },
                  { tip: "Check registration rules", desc: "AQHA allows 20 characters max, no numbers or punctuation" },
                  { tip: "Think about long-term appeal", desc: "Choose a name that fits a foal and adult horse" },
                  { tip: "Say it out loud", desc: "Make sure it sounds good when called across a field" }
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
                🐴 Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Use 'By Parents' for registered horses",
                  "Funny names are great for gaming",
                  "Classic names never go out of style",
                  "Save your favorites with the ❤️ button",
                  "Generate multiple times for more options"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#F97316", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Styles */}
            <div style={{ 
              backgroundColor: "#FFF7ED", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#EA580C", marginBottom: "12px" }}>
                🎨 Popular Name Styles
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#C2410C" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>Classic</strong> - Elegant, timeless</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Race Horse</strong> - Fast, powerful</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Fantasy</strong> - Mythical, magical</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Funny</strong> - Playful puns</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Western</strong> - Cowboy, rugged</li>
                <li>• <strong>Gaming</strong> - RDR2, Zelda, etc.</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/horse-name-generator" currentCategory="Lifestyle" />
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
