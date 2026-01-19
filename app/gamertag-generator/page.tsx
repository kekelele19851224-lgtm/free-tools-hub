"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

interface GeneratedTag {
  name: string;
  length: number;
  xboxOk: boolean;
  psnOk: boolean;
}

// Platform options
const platforms = [
  { id: 'all', label: 'All Platforms', emoji: '🎮' },
  { id: 'xbox', label: 'Xbox', emoji: '🟢' },
  { id: 'playstation', label: 'PlayStation', emoji: '🔵' },
  { id: 'steam', label: 'Steam', emoji: '💨' },
  { id: 'discord', label: 'Discord', emoji: '💬' },
  { id: 'fortnite', label: 'Fortnite', emoji: '🏝️' },
];

// Style options
const styles = [
  { id: 'cool', label: 'Cool', emoji: '😎', description: 'Badass & Powerful' },
  { id: 'funny', label: 'Funny', emoji: '😂', description: 'Memes & LOL' },
  { id: 'aesthetic', label: 'Aesthetic', emoji: '✨', description: 'Cute & Pretty' },
  { id: 'dark', label: 'Dark', emoji: '💀', description: 'Edgy & Mysterious' },
  { id: 'og', label: 'OG', emoji: '👑', description: 'Classic & Clean' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🐉', description: 'RPG & Magic' },
  { id: 'scifi', label: 'Sci-Fi', emoji: '🚀', description: 'Cyber & Futuristic' },
  { id: 'pro', label: 'Pro', emoji: '🏆', description: 'Competitive & Elite' },
];

// Gender options
const genders = [
  { id: 'any', label: 'Any', emoji: '🎲' },
  { id: 'male', label: 'Male', emoji: '♂️' },
  { id: 'female', label: 'Female', emoji: '♀️' },
];

// Length options
const lengths = [
  { id: 'short', label: 'Short', range: '3-8 chars' },
  { id: 'medium', label: 'Medium', range: '8-12 chars' },
  { id: 'long', label: 'Long', range: '12-16 chars' },
];

// Word libraries
const wordLibrary: Record<string, string[]> = {
  cool: ['Shadow', 'Phantom', 'Ghost', 'Storm', 'Blaze', 'Frost', 'Venom', 'Raven', 'Titan', 'Apex', 'Sniper', 'Recon', 'Stealth', 'Wolf', 'Hawk', 'Thunder', 'Strike', 'Fury', 'Ace', 'Viper', 'Onyx', 'Steel', 'Iron', 'Blade', 'Hunter'],
  funny: ['Potato', 'Waffle', 'Noodle', 'Pickle', 'Bacon', 'Taco', 'Banana', 'Nugget', 'Pancake', 'Burrito', 'Muffin', 'Donut', 'Cheese', 'Squishy', 'Fluffy', 'Derpy', 'Goofy', 'Chunky', 'Sassy', 'Silly', 'Wobbly', 'Crispy', 'Toasty', 'Yeet', 'Bruh'],
  aesthetic: ['Luna', 'Nova', 'Aurora', 'Velvet', 'Bloom', 'Celestial', 'Starlight', 'Moonbeam', 'Petal', 'Blossom', 'Dreamy', 'Pastel', 'Serenity', 'Misty', 'Angelic', 'Fairy', 'Sparkle', 'Cloud', 'Honey', 'Sugar', 'Pearl', 'Lavender', 'Rose', 'Crystal', 'Opal'],
  dark: ['Void', 'Chaos', 'Reaper', 'Doom', 'Obsidian', 'Abyss', 'Havoc', 'Viper', 'Wraith', 'Specter', 'Shade', 'Grim', 'Mortis', 'Dread', 'Sinister', 'Malice', 'Cursed', 'Wicked', 'Demon', 'Vex', 'Hex', 'Bane', 'Night', 'Crypt', 'Hollow'],
  og: ['King', 'Queen', 'Pro', 'Boss', 'Chief', 'Legend', 'Master', 'Prime', 'Elite', 'Alpha', 'Omega', 'Supreme', 'Royal', 'Noble', 'Savage', 'Beast', 'God', 'Lord', 'Sir', 'Duke', 'Baron', 'Captain', 'Major', 'General', 'Zero'],
  fantasy: ['Dragon', 'Phoenix', 'Wizard', 'Knight', 'Elf', 'Mystic', 'Sorcerer', 'Mage', 'Paladin', 'Rogue', 'Archer', 'Warlock', 'Druid', 'Ranger', 'Griffin', 'Unicorn', 'Orc', 'Goblin', 'Titan', 'Valkyrie', 'Sage', 'Oracle', 'Ember', 'Frost', 'Flame'],
  scifi: ['Cyber', 'Neon', 'Quantum', 'Vector', 'Pixel', 'Glitch', 'Binary', 'Synth', 'Holo', 'Laser', 'Plasma', 'Nova', 'Astro', 'Cosmo', 'Nebula', 'Orbital', 'Matrix', 'Photon', 'Tech', 'Droid', 'Mech', 'Core', 'Flux', 'Surge', 'Volt'],
  pro: ['Clutch', 'Sweat', 'Grind', 'Rush', 'Flick', 'Frag', 'Carry', 'Dominate', 'Execute', 'Tactical', 'Strategic', 'Precision', 'Lethal', 'Deadly', 'Ruthless', 'Unstoppable', 'Unmatched', 'Champion', 'Victor', 'Conqueror', 'Slayer', 'Breaker', 'Crusher', 'Terminator', 'Annihilator'],
  female: ['Luna', 'Rose', 'Violet', 'Crystal', 'Star', 'Angel', 'Pixie', 'Siren', 'Ivy', 'Willow', 'Aurora', 'Bella', 'Cleo', 'Diana', 'Eve', 'Freya', 'Gaia', 'Hera', 'Iris', 'Jade', 'Kira', 'Lily', 'Maya', 'Nyx', 'Quinn'],
  male: ['Max', 'Rex', 'Axel', 'Zack', 'Jake', 'Thor', 'Kane', 'Jax', 'Cole', 'Drake', 'Finn', 'Gray', 'Knox', 'Luke', 'Nash', 'Owen', 'Reid', 'Seth', 'Troy', 'Wade', 'Zane', 'Brock', 'Colt', 'Duke', 'Flint'],
};

const prefixes = ['x', 'xx', 'Mr', 'Dr', 'Sir', 'The', 'Its', 'Im', 'Not', 'Just', 'Only', 'Real', 'Official', 'True', 'Big', 'Lil', 'Young', 'Old'];
const suffixes = ['x', 'xx', 'HD', 'TV', 'YT', 'TTV', 'Gaming', 'Plays', 'Live', 'Official', 'Real', 'Pro', 'God', 'King', 'Queen', 'Boss', 'Lord', 'Btw', 'Irl', 'Szn'];
const numbers = ['0', '1', '7', '11', '13', '23', '42', '69', '77', '88', '99', '100', '101', '007', '123', '321', '420', '666', '777', '999'];
const leets = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7' };

// FAQ data
const faqs = [
  {
    question: "How do I create a unique gamertag?",
    answer: "To create a unique gamertag, combine words that reflect your personality or gaming style. Use our generator to mix different styles (cool, funny, aesthetic), add numbers or special characters, and experiment with different word combinations. Avoid common words and try creative spellings to increase uniqueness."
  },
  {
    question: "What makes a good Xbox gamertag?",
    answer: "A good Xbox gamertag is memorable, easy to pronounce, 15 characters or less, and reflects your gaming personality. Avoid offensive terms, excessive numbers, or hard-to-read combinations. The best gamertags are simple yet distinctive - something other players will remember after a match."
  },
  {
    question: "Can I use special characters in gamertags?",
    answer: "It depends on the platform. Xbox allows spaces and some special characters. PlayStation (PSN) allows underscores and hyphens. Steam is more flexible with special characters. Our generator creates platform-compatible names and shows compatibility indicators for each suggestion."
  },
  {
    question: "What's the character limit for Xbox/PlayStation gamertags?",
    answer: "Xbox gamertags can be up to 15 characters. PlayStation Network (PSN) Online IDs can be up to 16 characters. Steam display names can be up to 32 characters. Discord usernames can be 2-32 characters. Our generator shows the character count for each suggestion."
  },
  {
    question: "How do I check if a gamertag is available?",
    answer: "After generating gamertags with our tool, you'll need to check availability on your specific platform. For Xbox, go to xbox.com/gamertag. For PlayStation, try creating an account or changing your ID in settings. For Steam, search the community. Our tool generates unique combinations to increase your chances of finding an available name."
  },
  {
    question: "What are OG gamertags?",
    answer: "OG (Original Gangster) gamertags are short, clean, one-word or simple names without numbers or special characters - like 'King', 'Ghost', or 'Ace'. They're highly sought after because most were taken years ago. Our OG style generates clean, classic-sounding names that have an original feel."
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

// Helper functions
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function leetSpeak(str: string): string {
  return str.split('').map(c => {
    const lower = c.toLowerCase();
    return Math.random() > 0.7 && leets[lower as keyof typeof leets] ? leets[lower as keyof typeof leets] : c;
  }).join('');
}

export default function GamertagGenerator() {
  const [platform, setPlatform] = useState('all');
  const [style, setStyle] = useState('cool');
  const [gender, setGender] = useState('any');
  const [length, setLength] = useState('medium');
  const [keyword, setKeyword] = useState('');
  const [generatedTags, setGeneratedTags] = useState<GeneratedTag[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate gamertags
  const generateTags = () => {
    const tags: GeneratedTag[] = [];
    const usedNames = new Set<string>();
    
    // Get word pools based on style and gender
    let styleWords = [...wordLibrary[style]];
    if (gender === 'female') {
      styleWords = [...styleWords, ...wordLibrary.female];
    } else if (gender === 'male') {
      styleWords = [...styleWords, ...wordLibrary.male];
    }
    
    // Length constraints
    const minLen = length === 'short' ? 3 : length === 'medium' ? 8 : 12;
    const maxLen = length === 'short' ? 8 : length === 'medium' ? 12 : 16;
    
    // User keyword
    const userWord = keyword.trim() ? capitalize(keyword.trim().replace(/[^a-zA-Z0-9]/g, '')) : '';

    const patterns = [
      // Pattern 1: Word + Number
      () => {
        const word = userWord || getRandomItem(styleWords);
        return word + getRandomItem(numbers);
      },
      // Pattern 2: Word + Word
      () => {
        const w1 = userWord || getRandomItem(styleWords);
        const w2 = getRandomItem(styleWords);
        return w1 + w2;
      },
      // Pattern 3: Prefix + Word
      () => {
        const word = userWord || getRandomItem(styleWords);
        return getRandomItem(prefixes) + word;
      },
      // Pattern 4: Word + Suffix
      () => {
        const word = userWord || getRandomItem(styleWords);
        return word + getRandomItem(suffixes);
      },
      // Pattern 5: xXWordXx
      () => {
        const word = userWord || getRandomItem(styleWords);
        return 'xX' + word + 'Xx';
      },
      // Pattern 6: Word + Number + Word
      () => {
        const w1 = userWord || getRandomItem(styleWords);
        const w2 = getRandomItem(styleWords);
        return w1 + getRandomItem(['_', '']).toString() + w2;
      },
      // Pattern 7: The + Word
      () => {
        const word = userWord || getRandomItem(styleWords);
        return 'The' + word;
      },
      // Pattern 8: Word with Leet
      () => {
        const word = userWord || getRandomItem(styleWords);
        return leetSpeak(word) + getRandomItem(numbers);
      },
      // Pattern 9: Underscore style
      () => {
        const w1 = userWord || getRandomItem(styleWords);
        const w2 = getRandomItem(styleWords);
        return w1 + '_' + w2;
      },
      // Pattern 10: Simple Word (OG style)
      () => {
        return userWord || getRandomItem(styleWords);
      },
    ];

    let attempts = 0;
    while (tags.length < 20 && attempts < 200) {
      attempts++;
      
      const pattern = getRandomItem(patterns);
      let name = pattern();
      
      // Ensure length constraints
      if (name.length < minLen) {
        name = name + getRandomItem(numbers);
      }
      if (name.length > maxLen) {
        name = name.substring(0, maxLen);
      }
      
      // Check uniqueness and length constraints
      const nameLower = name.toLowerCase();
      if (usedNames.has(nameLower)) continue;
      if (name.length < minLen || name.length > maxLen) continue;
      
      usedNames.add(nameLower);
      
      tags.push({
        name,
        length: name.length,
        xboxOk: name.length <= 15 && /^[a-zA-Z0-9_ ]+$/.test(name),
        psnOk: name.length <= 16 && /^[a-zA-Z0-9_-]+$/.test(name),
      });
    }

    setGeneratedTags(tags);
  };

  // Copy to clipboard
  const copyTag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Toggle favorite
  const toggleFavorite = (tag: string) => {
    setFavorites(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #DDD6FE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>AI Gamertag Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🎮</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              AI Gamertag Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate unique, cool, and funny gamertags for Xbox, PlayStation, Steam, and more. 
            Choose your style and get 20 custom gaming names instantly!
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#7C3AED",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#DDD6FE", margin: 0, fontSize: "0.95rem" }}>
                The best gamertags are short, memorable, and easy to pronounce. 
                Avoid using too many numbers or special characters!
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
            border: "1px solid #DDD6FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Customize Your Gamertag
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Platform */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎯 Platform
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: platform === p.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: platform === p.id ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        fontWeight: platform === p.id ? "600" : "400",
                        color: platform === p.id ? "#7C3AED" : "#4B5563",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{p.emoji}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎨 Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: style === s.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: style === s.id ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>{s.emoji}</div>
                      <div style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: style === s.id ? "600" : "400",
                        color: style === s.id ? "#7C3AED" : "#4B5563"
                      }}>
                        {s.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & Length Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {/* Gender */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    👤 Gender
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {genders.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGender(g.id)}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: gender === g.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: gender === g.id ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          fontWeight: gender === g.id ? "600" : "400",
                          color: gender === g.id ? "#7C3AED" : "#4B5563",
                          fontSize: "0.8rem"
                        }}
                      >
                        {g.emoji} {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📏 Length
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {lengths.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLength(l.id)}
                        style={{
                          flex: 1,
                          padding: "10px 6px",
                          borderRadius: "8px",
                          border: length === l.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: length === l.id ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          fontWeight: length === l.id ? "600" : "400",
                          color: length === l.id ? "#7C3AED" : "#4B5563",
                          fontSize: "0.75rem"
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Keyword */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  ✏️ Custom Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., Wolf, Storm, Luna..."
                  maxLength={15}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", marginBottom: 0 }}>
                  Your word will be included in generated names
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateTags}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#7C3AED",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                ✨ Generate 20 Gamertags
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DDD6FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🎮 Generated Names
              </h2>
              {generatedTags.length > 0 && (
                <button
                  onClick={generateTags}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  🔄 Regenerate
                </button>
              )}
            </div>

            <div style={{ padding: "16px", maxHeight: "500px", overflowY: "auto" }}>
              {generatedTags.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎲</div>
                  <p style={{ margin: 0 }}>Choose your style and click Generate!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "8px" }}>
                  {generatedTags.map((tag, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: favorites.includes(tag.name) ? "#FEF3C7" : "#F9FAFB",
                        borderRadius: "8px",
                        border: favorites.includes(tag.name) ? "1px solid #FCD34D" : "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <span style={{ fontWeight: "600", color: "#111827", fontSize: "1rem", fontFamily: "monospace" }}>
                          {tag.name}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#9CA3AF", backgroundColor: "#F3F4F6", padding: "2px 6px", borderRadius: "4px" }}>
                          {tag.length} chars
                        </span>
                        {tag.xboxOk && (
                          <span style={{ fontSize: "0.65rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>
                            Xbox ✓
                          </span>
                        )}
                        {tag.psnOk && (
                          <span style={{ fontSize: "0.65rem", color: "#2563EB", backgroundColor: "#DBEAFE", padding: "2px 6px", borderRadius: "4px" }}>
                            PSN ✓
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => toggleFavorite(tag.name)}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: favorites.includes(tag.name) ? "#FEF3C7" : "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "1rem"
                          }}
                          title="Save to favorites"
                        >
                          {favorites.includes(tag.name) ? "❤️" : "🤍"}
                        </button>
                        <button
                          onClick={() => copyTag(tag.name, idx)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: copiedIndex === idx ? "#059669" : "#7C3AED",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            minWidth: "60px"
                          }}
                        >
                          {copiedIndex === idx ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div style={{ padding: "16px", borderTop: "1px solid #E5E7EB", backgroundColor: "#FFFBEB" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#92400E", marginBottom: "8px", margin: "0 0 8px 0" }}>
                  ❤️ Your Favorites ({favorites.length})
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {favorites.map((fav, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "white",
                        border: "1px solid #FCD34D",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        fontFamily: "monospace"
                      }}
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🎮 How to Choose the Perfect Gamertag
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Your gamertag is your identity in the gaming world. It&apos;s what other players see, remember, 
                  and call you. A great gamertag can make you stand out and become memorable in any gaming community.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Great Gamertags</h3>
                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #DDD6FE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Keep it short:</strong> 8-12 characters is ideal</li>
                    <li><strong>Make it pronounceable:</strong> Easy to say in voice chat</li>
                    <li><strong>Be unique:</strong> Avoid common names like &quot;Pro&quot; or &quot;Gamer&quot;</li>
                    <li><strong>Reflect your style:</strong> Choose a name that fits your personality</li>
                    <li><strong>Avoid numbers overload:</strong> xXGamer12345Xx looks dated</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Platform Character Limits</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🟢</div>
                    <strong>Xbox</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#7C3AED" }}>15 characters</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🔵</div>
                    <strong>PlayStation</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#7C3AED" }}>16 characters</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>💨</div>
                    <strong>Steam</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#7C3AED" }}>32 characters</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>💬</div>
                    <strong>Discord</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#7C3AED" }}>32 characters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Style Guide */}
            <div style={{ backgroundColor: "#7C3AED", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🎨 Style Guide</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>😎 <strong>Cool:</strong> Intimidating names</p>
                <p style={{ margin: "0 0 8px 0" }}>😂 <strong>Funny:</strong> Meme-worthy names</p>
                <p style={{ margin: "0 0 8px 0" }}>✨ <strong>Aesthetic:</strong> Pretty, soft vibes</p>
                <p style={{ margin: "0 0 8px 0" }}>💀 <strong>Dark:</strong> Edgy and mysterious</p>
                <p style={{ margin: 0 }}>👑 <strong>OG:</strong> Clean, classic names</p>
              </div>
            </div>

            {/* Popular Games */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🔥 Popular For</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Fortnite</p>
                <p style={{ margin: "0 0 8px 0" }}>• Call of Duty</p>
                <p style={{ margin: "0 0 8px 0" }}>• Apex Legends</p>
                <p style={{ margin: "0 0 8px 0" }}>• Valorant</p>
                <p style={{ margin: 0 }}>• Roblox</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/gamertag-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE" }}>
          <p style={{ fontSize: "0.75rem", color: "#7C3AED", textAlign: "center", margin: 0 }}>
            🎮 <strong>Note:</strong> Generated names may already be taken on gaming platforms. 
            Always check availability on your specific platform before committing to a gamertag.
          </p>
        </div>
      </div>
    </div>
  );
}
