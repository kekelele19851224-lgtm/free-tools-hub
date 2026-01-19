"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Word Libraries for Name Generation
// ============================================

const prefixes: Record<string, string[]> = {
  cute: ['Little', 'Tiny', 'Sweet', 'Lovely', 'Cozy', 'Happy', 'Sunny', 'Honey', 'Daisy', 'Peachy', 'Berry', 'Maple', 'Fern', 'Pebble', 'Misty'],
  aesthetic: ['Luna', 'Nova', 'Aura', 'Bloom', 'Sage', 'Willow', 'Ivy', 'Ember', 'Celeste', 'Opal', 'Pearl', 'Azure', 'Indigo', 'Coral', 'Jade'],
  vintage: ['Antique', 'Retro', 'Classic', 'Heritage', 'Timeless', 'Golden', 'Rustic', 'Victorian', 'Olde', 'Heirloom', 'Estate', 'Manor', 'Cottage', 'Parlor'],
  modern: ['Urban', 'Metro', 'Sleek', 'Edge', 'Core', 'Minimal', 'Pure', 'Stark', 'Bold', 'Prime', 'Apex', 'Zinc', 'Onyx', 'Steel', 'Slate'],
  quirky: ['Funky', 'Zippy', 'Quirk', 'Jolly', 'Fizzy', 'Wacky', 'Zesty', 'Peppy', 'Snappy', 'Groovy', 'Jazzy', 'Nifty', 'Dandy', 'Giddy', 'Merry'],
  professional: ['Elite', 'Premier', 'Noble', 'Royal', 'Grand', 'Prime', 'Select', 'First', 'Top', 'Best', 'Fine', 'True', 'Quality', 'Prestige', 'Luxe']
};

const suffixes: Record<string, string[]> = {
  general: ['Studio', 'Shop', 'Co', 'Collective', 'House', 'Corner', 'Nest', 'Nook', 'Lane', 'Place', 'Spot', 'Hub', 'Zone', 'Den', 'Lab'],
  craft: ['Crafts', 'Creations', 'Makes', 'Works', 'Goods', 'Designs', 'Arts', 'Wares', 'Things', 'Bits', 'Pieces', 'Treasures', 'Finds', 'Picks'],
  boutique: ['Boutique', 'Atelier', 'Gallery', 'Emporium', 'Market', 'Bazaar', 'Exchange', 'Depot', 'Outlet', 'Store', 'Supply', 'Source']
};

const categoryWords: Record<string, string[]> = {
  handmade: ['Craft', 'Hand', 'Made', 'Artisan', 'Create', 'Stitch', 'Weave', 'Form', 'Shape', 'Build', 'Maker', 'Craft'],
  jewelry: ['Gem', 'Jewel', 'Bead', 'Stone', 'Sparkle', 'Shine', 'Glitter', 'Crystal', 'Silver', 'Gold', 'Ring', 'Charm'],
  clothing: ['Thread', 'Stitch', 'Weave', 'Fabric', 'Style', 'Wear', 'Fashion', 'Cloth', 'Textile', 'Garment', 'Apparel', 'Dress'],
  digital: ['Pixel', 'Print', 'Digital', 'Design', 'Art', 'Graphics', 'Canvas', 'Paper', 'Page', 'File', 'Media', 'Studio'],
  homedecor: ['Home', 'Decor', 'Living', 'Room', 'Space', 'Interior', 'Casa', 'Dwelling', 'Abode', 'Haven', 'Nest', 'Habitat'],
  crochet: ['Yarn', 'Knit', 'Stitch', 'Loop', 'Hook', 'Fiber', 'Thread', 'Wool', 'Cotton', 'Weave', 'Cozy', 'Warm'],
  vintage: ['Retro', 'Vintage', 'Antique', 'Classic', 'Old', 'Estate', 'Thrift', 'Curio', 'Relic', 'Era', 'Past', 'Memory'],
  custom: ['Custom', 'Personal', 'Unique', 'Bespoke', 'Special', 'One', 'Only', 'Your', 'Made', 'Just', 'Tailor', 'Order']
};

const connectors = ['And', 'N', 'Plus', 'With', 'By', ''];

// Categories
const categories = [
  { id: 'handmade', label: 'Handmade Crafts', emoji: '🎨' },
  { id: 'jewelry', label: 'Jewelry', emoji: '💎' },
  { id: 'clothing', label: 'Clothing', emoji: '👗' },
  { id: 'digital', label: 'Digital/Printables', emoji: '🖼️' },
  { id: 'homedecor', label: 'Home Decor', emoji: '🏠' },
  { id: 'crochet', label: 'Crochet/Knitting', emoji: '🧶' },
  { id: 'vintage', label: 'Vintage Items', emoji: '📦' },
  { id: 'custom', label: 'Custom/Personalized', emoji: '🎁' }
];

// Styles
const styles = [
  { id: 'aesthetic', label: 'Aesthetic', emoji: '✨' },
  { id: 'cute', label: 'Cute & Whimsical', emoji: '🌸' },
  { id: 'vintage', label: 'Vintage & Classic', emoji: '🏛️' },
  { id: 'modern', label: 'Modern & Minimal', emoji: '🔲' },
  { id: 'quirky', label: 'Fun & Quirky', emoji: '🎪' },
  { id: 'professional', label: 'Professional', emoji: '💼' }
];

// Generate names function
const generateNames = (category: string, style: string, keyword: string): string[] => {
  const names: Set<string> = new Set();
  const stylePrefix = prefixes[style] || prefixes.aesthetic;
  const catWords = categoryWords[category] || categoryWords.handmade;
  const allSuffixes = [...suffixes.general, ...suffixes.craft, ...suffixes.boutique];
  
  // Helper to clean and validate name
  const cleanName = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9]/g, '');
  };
  
  // Helper to check if name is valid for Etsy
  const isValidLength = (name: string): boolean => {
    const cleaned = cleanName(name);
    return cleaned.length >= 4 && cleaned.length <= 20;
  };

  // Pattern 1: Prefix + CategoryWord
  for (let i = 0; i < 5; i++) {
    const prefix = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    const catWord = catWords[Math.floor(Math.random() * catWords.length)];
    const name = prefix + catWord;
    if (isValidLength(name)) names.add(name);
  }

  // Pattern 2: CategoryWord + Suffix
  for (let i = 0; i < 5; i++) {
    const catWord = catWords[Math.floor(Math.random() * catWords.length)];
    const suffix = allSuffixes[Math.floor(Math.random() * allSuffixes.length)];
    const name = catWord + suffix;
    if (isValidLength(name)) names.add(name);
  }

  // Pattern 3: Prefix + Suffix
  for (let i = 0; i < 5; i++) {
    const prefix = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    const suffix = allSuffixes[Math.floor(Math.random() * allSuffixes.length)];
    const name = prefix + suffix;
    if (isValidLength(name)) names.add(name);
  }

  // Pattern 4: Prefix + CategoryWord + Suffix (might be long)
  for (let i = 0; i < 3; i++) {
    const prefix = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    const catWord = catWords[Math.floor(Math.random() * catWords.length)];
    const name = prefix + catWord;
    if (isValidLength(name)) names.add(name);
  }

  // Pattern 5: Two Prefixes combined
  for (let i = 0; i < 4; i++) {
    const prefix1 = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    const prefix2 = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    if (prefix1 !== prefix2) {
      const name = prefix1 + prefix2;
      if (isValidLength(name)) names.add(name);
    }
  }

  // Pattern 6: CategoryWord + CategoryWord
  for (let i = 0; i < 4; i++) {
    const word1 = catWords[Math.floor(Math.random() * catWords.length)];
    const word2 = catWords[Math.floor(Math.random() * catWords.length)];
    if (word1 !== word2) {
      const name = word1 + word2;
      if (isValidLength(name)) names.add(name);
    }
  }

  // Pattern 7: The + Prefix + CategoryWord
  for (let i = 0; i < 3; i++) {
    const prefix = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
    const catWord = catWords[Math.floor(Math.random() * catWords.length)];
    const name = 'The' + prefix + catWord;
    if (isValidLength(name)) names.add(name);
  }

  // Pattern 8: If keyword provided, include it
  if (keyword && keyword.trim()) {
    const cleanKeyword = keyword.trim().replace(/[^a-zA-Z]/g, '');
    const capitalizedKeyword = cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1).toLowerCase();
    
    // Keyword + Suffix
    for (let i = 0; i < 3; i++) {
      const suffix = allSuffixes[Math.floor(Math.random() * allSuffixes.length)];
      const name = capitalizedKeyword + suffix;
      if (isValidLength(name)) names.add(name);
    }
    
    // Prefix + Keyword
    for (let i = 0; i < 3; i++) {
      const prefix = stylePrefix[Math.floor(Math.random() * stylePrefix.length)];
      const name = prefix + capitalizedKeyword;
      if (isValidLength(name)) names.add(name);
    }

    // Keyword + CategoryWord
    for (let i = 0; i < 2; i++) {
      const catWord = catWords[Math.floor(Math.random() * catWords.length)];
      const name = capitalizedKeyword + catWord;
      if (isValidLength(name)) names.add(name);
    }
  }

  // Convert to array and shuffle
  const result = Array.from(names);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, 24);
};

// FAQ data
const faqs = [
  {
    question: "What is a good name for an Etsy shop?",
    answer: "A good Etsy shop name should be memorable, easy to spell, and reflect your brand or products. It should be between 4-20 characters (Etsy's requirement), unique, and convey the style or type of items you sell. Consider using words that evoke emotion or describe your craft, and avoid numbers or special characters that might confuse customers."
  },
  {
    question: "How to check if an Etsy name is taken?",
    answer: "To check if an Etsy shop name is available: 1) Go to Etsy.com and search for the name, 2) Try to create a new shop with that name - Etsy will tell you if it's taken, 3) Check your Shop Manager > Settings > Info & Appearance. Note that even inactive shops may still have reserved names."
  },
  {
    question: "What is the maximum length of an Etsy shop name?",
    answer: "Etsy shop names must be between 4 and 20 characters long. They can only contain letters and numbers - no spaces, special characters, or punctuation marks are allowed. This is why many shop names combine words without spaces, like 'SweetHoneyDesigns' or 'CozyKnitShop'."
  },
  {
    question: "Can I change my Etsy shop name later?",
    answer: "Yes, you can change your Etsy shop name, but only once. After the initial change, your shop name becomes permanent. This is why it's important to choose carefully from the start. When you change your name, your shop URL also changes, which can affect any existing links or marketing materials."
  },
  {
    question: "What are some aesthetic Etsy shop name ideas?",
    answer: "Aesthetic shop names often include nature-inspired words (Luna, Sage, Willow, Bloom), soft sounds, and evocative imagery. Examples: LunaBlooms, SageAndIvy, WillowCreations, AuraStudio, CelesteCrafts. Our generator's 'Aesthetic' style option specializes in creating these dreamy, visually-pleasing name combinations."
  },
  {
    question: "Should my Etsy shop name include what I sell?",
    answer: "It can help but isn't required. Including product hints (like 'Jewelry', 'Prints', 'Knits') helps customers immediately understand your offerings. However, a more abstract name gives you flexibility to expand your product line later. Consider your long-term plans when deciding."
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

export default function EtsyShopNameGenerator() {
  const [selectedCategory, setSelectedCategory] = useState("handmade");
  const [selectedStyle, setSelectedStyle] = useState("aesthetic");
  const [keyword, setKeyword] = useState("");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generate names
  const handleGenerate = () => {
    const names = generateNames(selectedCategory, selectedStyle, keyword);
    setGeneratedNames(names);
    setHasGenerated(true);
  };

  // Copy name to clipboard
  const copyName = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Toggle favorite
  const toggleFavorite = (name: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
    }
    setFavorites(newFavorites);
  };

  // Get character count and validity
  const getNameInfo = (name: string) => {
    const length = name.length;
    const isValid = length >= 4 && length <= 20;
    return { length, isValid };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF7ED" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FDBA74" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Etsy Shop Name Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏪</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Etsy Shop Name Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate unique, catchy, and memorable names for your Etsy store. Choose your category 
            and style to get personalized suggestions that fit your brand.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#F56400",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Etsy Naming Rules</strong>
              </p>
              <p style={{ color: "#FED7AA", margin: 0, fontSize: "0.95rem" }}>
                Shop names must be 4-20 characters, letters and numbers only. No spaces or special characters allowed. You can only change your shop name once!
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
            border: "1px solid #FDBA74",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#F56400", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Customize Your Shop Name
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Category Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📦 What will you sell?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: selectedCategory === cat.id ? "2px solid #F56400" : "1px solid #E5E7EB",
                        backgroundColor: selectedCategory === cat.id ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{cat.emoji}</span>
                      <span style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: selectedCategory === cat.id ? "600" : "400",
                        color: selectedCategory === cat.id ? "#EA580C" : "#4B5563"
                      }}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Choose your style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: selectedStyle === style.id ? "2px solid #F56400" : "1px solid #E5E7EB",
                        backgroundColor: selectedStyle === style.id ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{style.emoji}</div>
                      <div style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: selectedStyle === style.id ? "600" : "400",
                        color: selectedStyle === style.id ? "#EA580C" : "#4B5563"
                      }}>
                        {style.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword Input */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  ✏️ Include a word (optional)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., Rose, Luna, Bloom..."
                  maxLength={10}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "6px" }}>
                  Letters only, max 10 characters
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#F56400",
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
                ✨ Generate Shop Names
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FDBA74",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#EA580C", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🏪 Generated Names
              </h2>
              {favorites.size > 0 && (
                <span style={{ backgroundColor: "white", color: "#EA580C", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>
                  ❤️ {favorites.size} saved
                </span>
              )}
            </div>

            <div style={{ padding: "24px", maxHeight: "500px", overflowY: "auto" }}>
              {!hasGenerated ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
                  <p style={{ margin: 0 }}>Select your options and click generate to see name ideas!</p>
                </div>
              ) : generatedNames.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <p style={{ margin: 0 }}>No names generated. Try different options!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {generatedNames.map((name, idx) => {
                    const { length, isValid } = getNameInfo(name);
                    const isFavorite = favorites.has(name);
                    const isCopied = copiedName === name;
                    
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: isFavorite ? "#FFF7ED" : "#F9FAFB",
                          borderRadius: "8px",
                          border: isFavorite ? "1px solid #FDBA74" : "1px solid #E5E7EB"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <button
                            onClick={() => toggleFavorite(name)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.1rem",
                              padding: "0"
                            }}
                          >
                            {isFavorite ? "❤️" : "🤍"}
                          </button>
                          <span style={{ fontWeight: "600", color: "#111827", fontSize: "1rem" }}>
                            {name}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            backgroundColor: isValid ? "#D1FAE5" : "#FEE2E2",
                            color: isValid ? "#065F46" : "#991B1B"
                          }}>
                            {length} chars {isValid ? "✓" : "✗"}
                          </span>
                          <button
                            onClick={() => copyName(name)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: isCopied ? "#059669" : "#F56400",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: "500"
                            }}
                          >
                            {isCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.size > 0 && (
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "16px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
            border: "1px solid #FDBA74", 
            padding: "24px",
            marginBottom: "32px"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
              ❤️ Your Saved Names
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {Array.from(favorites).map((name, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    backgroundColor: "#FFF7ED",
                    borderRadius: "8px",
                    border: "1px solid #FDBA74"
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#EA580C" }}>{name}</span>
                  <button
                    onClick={() => copyName(name)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: copiedName === name ? "#059669" : "#F56400",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      cursor: "pointer"
                    }}
                  >
                    {copiedName === name ? "✓" : "Copy"}
                  </button>
                  <button
                    onClick={() => toggleFavorite(name)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      padding: "0"
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDBA74", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🎯 How to Choose the Perfect Etsy Shop Name
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Your Etsy shop name is the first thing customers see and a crucial part of your brand identity. 
                  A great name can make your shop memorable, improve discoverability, and build trust with buyers.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Picking a Great Name</h3>
                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FDBA74"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Keep it short:</strong> Easier to remember and type (aim for 10-15 characters)</li>
                    <li><strong>Make it memorable:</strong> Use creative word combinations or alliteration</li>
                    <li><strong>Reflect your brand:</strong> The name should hint at what you sell or your style</li>
                    <li><strong>Check availability:</strong> Verify the name isn&apos;t already taken on Etsy</li>
                    <li><strong>Think long-term:</strong> Choose a name that can grow with your business</li>
                    <li><strong>Easy to spell:</strong> Avoid unusual spellings that customers might get wrong</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Popular Etsy Categories</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
                    <strong>🖼️ Digital Products</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#EA580C" }}>
                      Printables, templates, digital art
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
                    <strong>💎 Handmade Jewelry</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#EA580C" }}>
                      Earrings, necklaces, bracelets
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
                    <strong>🧶 Crochet & Knitting</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#EA580C" }}>
                      Amigurumi, scarves, blankets
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
                    <strong>🎁 Personalized Gifts</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#EA580C" }}>
                      Custom items, engraved products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Etsy Rules */}
            <div style={{ backgroundColor: "#F56400", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📋 Etsy Name Rules</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ 4-20 characters only</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Letters and numbers only</p>
                <p style={{ margin: "0 0 8px 0" }}>✗ No spaces allowed</p>
                <p style={{ margin: "0 0 8px 0" }}>✗ No special characters</p>
                <p style={{ margin: 0 }}>⚠️ Can only change once!</p>
              </div>
            </div>

            {/* Name Ideas */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Name Inspiration</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• LunaBloomStudio</p>
                <p style={{ margin: "0 0 8px 0" }}>• CozyKnitCorner</p>
                <p style={{ margin: "0 0 8px 0" }}>• PixelArtPrints</p>
                <p style={{ margin: "0 0 8px 0" }}>• SageAndIvyCo</p>
                <p style={{ margin: 0 }}>• TheHappyCrafter</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/etsy-shop-name-generator" currentCategory="Business" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDBA74", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
          <p style={{ fontSize: "0.75rem", color: "#EA580C", textAlign: "center", margin: 0 }}>
            🏪 <strong>Note:</strong> Generated names are suggestions only. Please verify availability on Etsy before finalizing your shop name. 
            We are not affiliated with Etsy, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}