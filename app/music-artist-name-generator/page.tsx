"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Gender options
const genderOptions = [
  { id: "female", label: "Female", icon: "👩" },
  { id: "male", label: "Male", icon: "👨" },
  { id: "neutral", label: "Neutral / Unisex", icon: "🎭" }
];

// Genre options
const genreOptions = [
  { id: "pop", label: "Pop", icon: "🎤" },
  { id: "hiphop", label: "Hip-Hop / Rap", icon: "🎧" },
  { id: "rock", label: "Rock", icon: "🎸" },
  { id: "electronic", label: "Electronic / DJ", icon: "🎛️" },
  { id: "indie", label: "Indie / Alternative", icon: "🌙" },
  { id: "rnb", label: "R&B / Soul", icon: "💜" },
  { id: "country", label: "Country", icon: "🤠" },
  { id: "kpop", label: "K-Pop Style", icon: "⭐" }
];

// Style options
const styleOptions = [
  { id: "cool", label: "Cool & Modern" },
  { id: "mysterious", label: "Mysterious" },
  { id: "edgy", label: "Edgy & Bold" },
  { id: "elegant", label: "Elegant & Classy" },
  { id: "funny", label: "Funny & Quirky" },
  { id: "oneword", label: "One-Word" },
  { id: "twoword", label: "Two-Word" }
];

// Name parts database
const nameParts = {
  female: {
    first: ["Luna", "Nova", "Aria", "Violet", "Ruby", "Jade", "Crystal", "Stella", "Aurora", "Ivy", "Raven", "Scarlet", "Ember", "Phoenix", "Willow", "Sage", "Celeste", "Dahlia", "Electra", "Venus", "Siren", "Velvet", "Mystique", "Blaze", "Storm", "Diamond", "Pearl", "Opal", "Skye", "Winter"],
    last: ["Rose", "Moon", "Star", "Ray", "Heart", "Sky", "Dawn", "Night", "Dream", "Fire", "Ice", "Rain", "Wave", "Blaze", "Storm", "Frost", "Glow", "Shine", "Spark", "Flow"]
  },
  male: {
    first: ["Axel", "Blaze", "Chase", "Drake", "Eclipse", "Falcon", "Ghost", "Hunter", "Jax", "Knox", "Legend", "Maverick", "Nero", "Onyx", "Phoenix", "Quest", "Ryder", "Shadow", "Titan", "Viper", "Wolf", "Zane", "Ace", "Blade", "Cross", "Duke", "Edge", "Flint", "Griff", "Hawk"],
    last: ["Storm", "Knight", "Fire", "Wolf", "King", "Stone", "Steel", "Hawk", "Blade", "Cross", "Black", "Dark", "Wild", "Night", "Shadow", "Thunder", "Frost", "Blaze", "Rock", "Venom"]
  },
  neutral: {
    first: ["Alex", "Jordan", "Phoenix", "River", "Storm", "Sky", "Ocean", "Sage", "Quinn", "Blake", "Drew", "Emery", "Finley", "Gray", "Haven", "Indie", "Jett", "Kai", "Lane", "Morgan", "Nyx", "Parker", "Reese", "Sage", "Taylor", "Val", "Winter", "Zion", "Echo", "Ember"],
    last: ["Wave", "Rain", "Star", "Light", "Dream", "Soul", "Vibe", "Beat", "Pulse", "Flow", "Edge", "Rise", "Fall", "Dawn", "Dusk", "Haze", "Mist", "Blaze", "Frost", "Glow"]
  }
};

// Genre-specific prefixes/suffixes
const genreModifiers: { [key: string]: { prefixes: string[], suffixes: string[] } } = {
  pop: { prefixes: ["Miss", "Lady", ""], suffixes: ["Pop", "Star", "Belle", "Queen", "Prince"] },
  hiphop: { prefixes: ["Lil", "Young", "Big", "Kid", "MC", "DJ"], suffixes: ["Money", "Cash", "Flex", "Gang", "Savage", "Boss", "King", "Queen"] },
  rock: { prefixes: ["The", ""], suffixes: ["Rock", "Rocker", "Riot", "Rebel", "Rage", "Fury", "Crash", "Smash"] },
  electronic: { prefixes: ["DJ", "Bass", "Neon", "Cyber", "Digital", "Electro"], suffixes: ["Wave", "Beat", "Drop", "Bass", "Pulse", "Synth", "Volt", "Circuit"] },
  indie: { prefixes: ["The", ""], suffixes: ["Moon", "Dream", "Haze", "Mist", "Echo", "Whisper", "Cloud", "Velvet"] },
  rnb: { prefixes: ["", ""], suffixes: ["Soul", "Honey", "Silk", "Velvet", "Smooth", "Sweet", "Love", "Heart"] },
  country: { prefixes: ["", ""], suffixes: ["Creek", "River", "Road", "Ranch", "Ridge", "Valley", "Hill", "Plains"] },
  kpop: { prefixes: ["", ""], suffixes: ["Min", "Yeon", "Ji", "Soo", "Hyun", "Hee", "Rin", "Ae"] }
};

// Funny name parts
const funnyParts = {
  prefixes: ["MC", "DJ", "Sir", "Captain", "Professor", "Doctor", "Count", "Baron", "Agent", "Lord"],
  words: ["Snacktime", "Naptime", "Procrastinator", "Awkward", "Confused", "Sleepy", "Hangry", "Clumsy", "Sarcastic", "Dramatic", "Overthink", "Chill", "Vibe", "Mood", "Chaos", "Random", "Weird", "Strange", "Odd", "Quirky"],
  suffixes: ["Master", "King", "Queen", "Lord", "Boss", "Chief", "Champion", "Wizard", "Ninja", "Guru"]
};

// Famous artist naming patterns
const famousPatterns = [
  { pattern: "Mononym (Single Name)", examples: ["Drake", "Adele", "Beyoncé", "Prince", "Madonna", "Rihanna", "Cher", "Usher"], description: "One memorable name, instantly recognizable" },
  { pattern: "Lil + Word", examples: ["Lil Wayne", "Lil Nas X", "Lil Uzi Vert", "Lil Kim", "Lil Baby", "Lil Pump"], description: "Popular in hip-hop, suggests youth and energy" },
  { pattern: "The + Noun/Adjective", examples: ["The Weeknd", "The Chainsmokers", "The 1975", "The Killers", "The Strokes"], description: "Creates mystery and collective identity" },
  { pattern: "DJ + Word", examples: ["DJ Khaled", "DJ Snake", "DJ Shadow", "DJ Premier", "DJ Jazzy Jeff"], description: "Standard format for DJs and producers" },
  { pattern: "Lady/Lord/King/Queen + Name", examples: ["Lady Gaga", "Lorde", "King Princess", "Queen Latifah", "Freddie Mercury"], description: "Adds royalty and grandeur" },
  { pattern: "Color + Noun", examples: ["Black Sabbath", "Pink Floyd", "Green Day", "White Stripes", "Blue October"], description: "Creates vivid visual imagery" },
  { pattern: "Adjective + Noun", examples: ["Arctic Monkeys", "Smashing Pumpkins", "Violent Femmes", "Modest Mouse"], description: "Unexpected combinations that stick" },
  { pattern: "Word + Number", examples: ["Maroon 5", "Blink-182", "Sum 41", "30 Seconds to Mars", "5 Seconds of Summer"], description: "Numbers make names unique and memorable" },
  { pattern: "Stylized Spelling", examples: ["Kesha (Ke$ha)", "Deadmau5", "Marshmello", "P!nk", "The Weeknd"], description: "Unique spelling creates brand recognition" },
  { pattern: "First Name + Initial", examples: ["Cardi B", "Jessie J", "Mary J. Blige", "Kenny G", "Schoolboy Q"], description: "Personal yet professional feel" }
];

// FAQ data
const faqs = [
  {
    question: "How do I choose a good artist name?",
    answer: "A good artist name should be memorable, easy to spell and pronounce, unique enough to stand out, and reflective of your music style. Consider names that are searchable online, available on social media platforms, and won't be confused with existing artists. Test it by saying it out loud and imagining it on a marquee."
  },
  {
    question: "Should I use my real name or a stage name?",
    answer: "Both can work well. Using your real name feels authentic and personal (like Adele or Ed Sheeran), while a stage name lets you create a distinct persona and can be more memorable (like Lady Gaga or The Weeknd). Consider your privacy preferences and whether your real name is easy to remember and spell."
  },
  {
    question: "How do I check if an artist name is already taken?",
    answer: "Search on Spotify, Apple Music, YouTube, and social media platforms. Check trademark databases in your country. Search Google to see what comes up. Look for domain name availability. If a name is actively used by another musician in your genre, it's best to choose something different."
  },
  {
    question: "Can I change my artist name later?",
    answer: "Yes, but it's challenging. Rebranding requires updating all platforms, potentially losing followers and search rankings, and re-establishing your identity. It's better to choose a name you can grow with. Some artists like Diddy and Snoop Dogg have successfully changed names, but they were already established."
  },
  {
    question: "What makes a name memorable?",
    answer: "Memorable names are typically short (1-3 words), have interesting sounds or rhythms, create vivid imagery or emotions, and are unique without being impossible to spell. Alliteration (Marilyn Manson), unexpected combinations (Arctic Monkeys), or powerful single words (Lorde) all work well."
  },
  {
    question: "Should my artist name reflect my music genre?",
    answer: "It can help, but isn't required. Genre-suggestive names set expectations (DJ Snake sounds electronic, Johnny Cash sounds country). However, many successful artists have names that don't directly indicate their genre, giving them flexibility to evolve their sound over time."
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
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.2s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function MusicArtistNameGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"generator" | "fromname" | "patterns">("generator");
  
  // Generator state (Tab 1)
  const [selectedGender, setSelectedGender] = useState("female");
  const [selectedGenre, setSelectedGenre] = useState("pop");
  const [selectedStyle, setSelectedStyle] = useState("cool");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // From Name state (Tab 2)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stageNames, setStageNames] = useState<{type: string; name: string}[]>([]);

  // Generate artist names
  const generateNames = () => {
    const results: string[] = [];
    const genderParts = nameParts[selectedGender as keyof typeof nameParts];
    const genreMods = genreModifiers[selectedGenre] || genreModifiers.pop;
    
    // Generate based on style
    for (let i = 0; i < 12; i++) {
      let name = "";
      
      if (selectedStyle === "funny") {
        // Funny names
        const prefix = funnyParts.prefixes[Math.floor(Math.random() * funnyParts.prefixes.length)];
        const word = funnyParts.words[Math.floor(Math.random() * funnyParts.words.length)];
        const suffix = funnyParts.suffixes[Math.floor(Math.random() * funnyParts.suffixes.length)];
        
        const patterns = [
          `${prefix} ${word}`,
          `${word} ${suffix}`,
          `The ${word} One`,
          `${prefix} ${word} ${suffix}`,
          word
        ];
        name = patterns[Math.floor(Math.random() * patterns.length)];
      } else if (selectedStyle === "oneword") {
        // One-word names
        const allFirsts = [...genderParts.first];
        name = allFirsts[Math.floor(Math.random() * allFirsts.length)];
      } else if (selectedStyle === "twoword") {
        // Two-word names
        const first = genderParts.first[Math.floor(Math.random() * genderParts.first.length)];
        const last = genderParts.last[Math.floor(Math.random() * genderParts.last.length)];
        name = `${first} ${last}`;
      } else {
        // Other styles - mix genre modifiers
        const usePrefix = Math.random() > 0.5;
        const useSuffix = Math.random() > 0.5;
        
        const first = genderParts.first[Math.floor(Math.random() * genderParts.first.length)];
        const last = genderParts.last[Math.floor(Math.random() * genderParts.last.length)];
        const prefix = genreMods.prefixes[Math.floor(Math.random() * genreMods.prefixes.length)];
        const suffix = genreMods.suffixes[Math.floor(Math.random() * genreMods.suffixes.length)];
        
        if (selectedGenre === "hiphop" && Math.random() > 0.3) {
          // Hip-hop often uses Lil, Young, etc.
          name = `${prefix} ${first}`;
        } else if (selectedGenre === "electronic" && Math.random() > 0.3) {
          // DJ names
          name = `${prefix} ${first}`;
        } else if (usePrefix && prefix) {
          name = `${prefix} ${first}`;
        } else if (useSuffix) {
          name = `${first} ${suffix}`;
        } else {
          name = `${first} ${last}`;
        }
      }
      
      // Apply style modifications
      if (selectedStyle === "mysterious" && Math.random() > 0.5) {
        name = `The ${name}`;
      } else if (selectedStyle === "edgy" && Math.random() > 0.7) {
        name = name.toUpperCase();
      }
      
      if (name && !results.includes(name)) {
        results.push(name);
      }
    }
    
    setGeneratedNames(results.slice(0, 10));
    setCopiedIndex(null);
  };

  // Generate stage names from real name
  const generateFromName = () => {
    if (!firstName.trim() && !lastName.trim()) {
      alert("Please enter your name");
      return;
    }
    
    const first = firstName.trim() || "Artist";
    const last = lastName.trim() || "";
    const firstInitial = first.charAt(0).toUpperCase();
    const lastInitial = last ? last.charAt(0).toUpperCase() : "";
    
    const results: {type: string; name: string}[] = [];
    
    // Mononym (first name only)
    results.push({ type: "Mononym", name: first });
    
    // Initials
    if (last) {
      results.push({ type: "Initials", name: `${firstInitial}. ${last}` });
      results.push({ type: "Initials", name: `${first} ${lastInitial}.` });
      results.push({ type: "Double Initial", name: `${firstInitial}.${lastInitial}.` });
    }
    
    // Stylized
    if (first.length > 3) {
      results.push({ type: "Stylized", name: first.slice(0, -1) + first.slice(-1).repeat(2) });
    }
    results.push({ type: "Stylized", name: first.toLowerCase() });
    
    // Initial + Word combinations
    const coolWords = ["Storm", "Nova", "Blaze", "Wave", "Knight", "Star", "Fire", "Ice", "Gold", "Shadow"];
    const randomWord = coolWords[Math.floor(Math.random() * coolWords.length)];
    results.push({ type: "Initial + Word", name: `${firstInitial}-${randomWord}` });
    results.push({ type: "Initial + Word", name: `${firstInitial}${randomWord}` });
    
    // Nickname variations
    if (first.length > 4) {
      results.push({ type: "Nickname", name: `${first.slice(0, 4)}y` });
    }
    results.push({ type: "Nickname", name: `${first}ie` });
    
    // Reversed
    if (last) {
      results.push({ type: "Reversed", name: `${last} ${first}` });
    }
    const reversedFirst = first.split("").reverse().join("");
    results.push({ type: "Reversed Spelling", name: reversedFirst.charAt(0).toUpperCase() + reversedFirst.slice(1).toLowerCase() });
    
    // With title
    results.push({ type: "With Title", name: `Young ${first}` });
    results.push({ type: "With Title", name: `Lil ${first}` });
    results.push({ type: "With Title", name: `DJ ${first}` });
    
    // First + descriptor
    results.push({ type: "Descriptor", name: `${first} the Great` });
    results.push({ type: "Descriptor", name: `${first} Gold` });
    
    setStageNames(results);
  };

  // Copy name to clipboard
  const copyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Music Artist Name Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🎤</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Music Artist Name Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate unique stage names for musicians, rappers, DJs, and solo artists. Choose your genre and style, or create a custom stage name from your real name. Free and unlimited!
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#EDE9FE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #C4B5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>⭐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>Your Name, Your Brand</p>
              <p style={{ color: "#5B21B6", margin: 0, fontSize: "0.95rem" }}>
                A great artist name is memorable, unique, and reflects your musical identity. 
                Whether you&apos;re starting fresh or rebranding, find the perfect name that fans will remember.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "generator", label: "Name Generator", icon: "🎲" },
            { id: "fromname", label: "From Your Name", icon: "✨" },
            { id: "patterns", label: "Famous Patterns", icon: "🌟" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#EDE9FE" : "white",
                color: activeTab === tab.id ? "#6D28D9" : "#4B5563",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Name Generator */}
        {activeTab === "generator" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎲 Generate Artist Name</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Gender Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Gender / Vibe
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {genderOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedGender(option.id)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: selectedGender === option.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedGender === option.id ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{option.icon}</span>
                        <span style={{ fontSize: "0.9rem", color: selectedGender === option.id ? "#6D28D9" : "#374151" }}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Music Genre
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {genreOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedGenre(option.id)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: selectedGenre === option.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedGenre === option.id ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{option.icon}</span>
                        <span style={{ fontSize: "0.85rem", color: selectedGenre === option.id ? "#6D28D9" : "#374151" }}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Name Style
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {styleOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedStyle(option.id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "20px",
                          border: selectedStyle === option.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedStyle === option.id ? "#EDE9FE" : "white",
                          color: selectedStyle === option.id ? "#6D28D9" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateNames}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7C3AED",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  🎤 Generate Names
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⭐ Your Artist Names</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {generatedNames.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {generatedNames.map((name, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB"
                        }}
                      >
                        <span style={{ 
                          fontSize: "1.05rem",
                          color: "#1F2937",
                          fontWeight: "500"
                        }}>
                          {name}
                        </span>
                        <button
                          onClick={() => copyName(name, index)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: copiedIndex === index ? "#059669" : "#E5E7EB",
                            color: copiedIndex === index ? "white" : "#374151",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {copiedIndex === index ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={generateNames}
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "white",
                        color: "#6B7280",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      🔄 Generate More
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🎤</span>
                    <p style={{ margin: 0 }}>Select your preferences and click Generate to create artist names</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: From Your Name */}
        {activeTab === "fromname" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✨ Create from Your Name</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>
                  Enter your real name and we&apos;ll generate unique stage name variations based on it.
                </p>
                
                {/* First Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g., John, Maria, Alex"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Last Name */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g., Smith, Garcia, Lee"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateFromName}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#2563EB",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  ✨ Generate Stage Names
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎭 Stage Name Ideas</h2>
              </div>
              
              <div style={{ padding: "24px", maxHeight: "500px", overflowY: "auto" }}>
                {stageNames.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {stageNames.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB"
                        }}
                      >
                        <div>
                          <span style={{ 
                            fontSize: "1rem",
                            color: "#1F2937",
                            fontWeight: "500",
                            display: "block"
                          }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{item.type}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.name);
                            alert(`Copied: ${item.name}`);
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#E5E7EB",
                            color: "#374151",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>✨</span>
                    <p style={{ margin: 0 }}>Enter your name to generate personalized stage name ideas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Famous Patterns */}
        {activeTab === "patterns" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌟 Famous Artist Naming Patterns</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <p style={{ color: "#4B5563", marginBottom: "24px", lineHeight: "1.7" }}>
                  Study these proven naming patterns used by successful artists. Understanding these patterns can help you create 
                  a memorable name that fits your style and stands out in the music industry.
                </p>
                
                <div style={{ display: "grid", gap: "16px" }}>
                  {famousPatterns.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <h3 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "1.1rem" }}>
                        {index + 1}. {item.pattern}
                      </h3>
                      <p style={{ color: "#6B7280", margin: "0 0 12px 0", fontSize: "0.9rem" }}>
                        {item.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {item.examples.map((example, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#EDE9FE",
                              color: "#6D28D9",
                              borderRadius: "16px",
                              fontSize: "0.85rem",
                              fontWeight: "500"
                            }}
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🎵 Creating Your Artist Identity</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Your artist name is more than just a label—it&apos;s your brand, your identity, and often the first thing people 
                  remember about you. A great stage name can help you stand out in a crowded industry and create a lasting impression.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Makes a Great Artist Name?</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Memorable:</strong> Easy to remember after hearing it once</li>
                  <li><strong>Unique:</strong> Stands out from other artists</li>
                  <li><strong>Searchable:</strong> Easy to find on Google and streaming platforms</li>
                  <li><strong>Speakable:</strong> Easy to pronounce and spell</li>
                  <li><strong>Timeless:</strong> Won&apos;t feel dated in 10 years</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Before You Decide</h3>
                <p>
                  Before committing to a name, search for it on Spotify, Apple Music, YouTube, Instagram, and Twitter. 
                  Check if the domain is available and search trademark databases. The last thing you want is to build 
                  a following only to discover someone else already owns the name.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Pro Tips */}
            <div style={{ backgroundColor: "#EDE9FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.875rem", color: "#6D28D9", lineHeight: "1.8" }}>
                <li>Test with friends first</li>
                <li>Say it in a sentence: &quot;Now performing... [your name]&quot;</li>
                <li>Check social media handles</li>
                <li>Avoid special characters</li>
                <li>Google it thoroughly</li>
                <li>Sleep on it before deciding</li>
              </ul>
            </div>

            {/* Name Length Stats */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📊 Name Stats</h3>
              <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>🔹 1 word: Most memorable</p>
                <p style={{ margin: "0 0 8px 0" }}>🔹 2 words: Most common</p>
                <p style={{ margin: "0 0 8px 0" }}>🔹 3+ words: Harder to remember</p>
                <p style={{ margin: "0 0 8px 0" }}>🔹 5-8 characters: Ideal length</p>
                <p style={{ margin: 0 }}>🔹 Unique spelling: +50% recall</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/music-artist-name-generator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🎤 <strong>Note:</strong> Always verify that your chosen name isn&apos;t already trademarked or in use by another artist. 
            Search streaming platforms, social media, and trademark databases before making your final decision.
          </p>
        </div>
      </div>
    </div>
  );
}